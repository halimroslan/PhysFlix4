const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('/tmp/output.html', 'utf8');
const $ = cheerio.load(htmlContent);

const outputImagesDir = path.join(__dirname, '../public/quiz-images');
if (!fs.existsSync(outputImagesDir)) {
  fs.mkdirSync(outputImagesDir, { recursive: true });
}

let currentChapter = "";
let currentSK = "";
let questions = [];
let currentQuestion = null;

let isParsingAnswers = false;

$('p').each((index, element) => {
  const text = $(element).text().trim();
  const html = $(element).html();
  
  if (!text && !$(element).find('img').length) return; // Skip empty paragraphs

  // Switch to answer parsing mode if we hit the answer section
  if (text.includes("Soalan 1 — [") && text.includes("JAWAPAN:")) {
    isParsingAnswers = true;
  }

  if (!isParsingAnswers) {
    // Check if it's a chapter header e.g. [Tingkatan 4 • BAB 1: PENGUKURAN]
    if (text.startsWith('[Tingkatan') && text.includes('BAB')) {
      currentChapter = text.split(']')[0] + ']';
      
      const skMatch = text.match(/SK\s*(.*)/);
      if (skMatch && !text.includes('Soalan')) {
        currentSK = skMatch[1].trim();
      }
      return; 
    }

    // Check if it's an SK header e.g. SK 1.1 (if it wasn't caught above)
    const skMatch = text.match(/SK\s*(.*)/);
    if (skMatch && !text.includes('Soalan')) {
      currentSK = skMatch[1].trim();
      return;
    }

    // Check if it's a new question
    if (text.startsWith('Soalan ') && text.includes('[')) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      const qNumMatch = text.match(/Soalan (\d+)/);
      const qNum = qNumMatch ? qNumMatch[1] : null;
      
      currentQuestion = {
        id: `q${qNum}`,
        number: parseInt(qNum, 10),
        chapter: currentChapter,
        sk: currentSK,
        source: text.substring(text.indexOf('[')),
        text: text.replace(/^Soalan \d+ \[[^\]]+\]\s*/, ''),
        images: [],
        options: [],
        answer: null,
        ulasan: null
      };
      
      // If there's an image in this same paragraph
      $(element).find('img').each((i, img) => {
        const src = $(img).attr('src');
        if (src && src.startsWith('data:image/')) {
          saveImage(src, currentQuestion.id, i, currentQuestion);
        }
      });
      return;
    }

    if (currentQuestion) {
      // Check if it's an option
      if (/^[A-D]\s+/.test(text)) {
        const optionText = text.substring(text.indexOf(' ')).trim();
        if (optionText) {
          currentQuestion.options.push(optionText);
        }
        
        // Also check if there's an image for the option
        $(element).find('img').each((i, img) => {
          const src = $(img).attr('src');
          if (src && src.startsWith('data:image/')) {
            saveImage(src, currentQuestion.id + '_opt' + currentQuestion.options.length, i, currentQuestion);
          }
        });
        return;
      }

      // Just text/images belonging to the current question
      if (!/^[A-D]\s+/.test(text) && text.length > 0) {
        // sometimes options are in the same line without a space, wait, it's fine.
        currentQuestion.text += '\n' + text;
      }
      
      $(element).find('img').each((i, img) => {
        const src = $(img).attr('src');
        if (src && src.startsWith('data:image/')) {
          saveImage(src, currentQuestion.id + '_extra', i, currentQuestion);
        }
      });
    }
  } else {
    // Parsing answers
    if (text.startsWith('Soalan ') && text.includes('JAWAPAN:')) {
      const qNumMatch = text.match(/Soalan (\d+)/);
      const qNum = qNumMatch ? qNumMatch[1] : null;
      
      const answerMatch = text.match(/JAWAPAN:\s*([A-D])/);
      const answer = answerMatch ? answerMatch[1] : null;
      
      let ulasan = "";
      const nextElement = $(element).next();
      if (nextElement && nextElement.text().includes('Ulasan:')) {
         ulasan = nextElement.text().replace(/.*Ulasan:\s*/, '').trim();
      }

      if (qNum && answer) {
        const targetQ = questions.find(q => q.id === `q${qNum}`);
        if (targetQ) {
          // Map A, B, C, D to the actual option text if it exists
          const optionIndex = answer.charCodeAt(0) - 65; // 'A' is 65
          if (optionIndex >= 0 && optionIndex < targetQ.options.length) {
            targetQ.answer = targetQ.options[optionIndex];
          } else {
            targetQ.answer = answer; // fallback
          }
          targetQ.ulasan = ulasan;
        }
      }
    } else if (text.startsWith('Ulasan:')) {
       // Handled in nextElement above, but just in case
       const qNumMatch = $(element).prev().text().match(/Soalan (\d+)/);
       if (qNumMatch) {
         const qNum = qNumMatch[1];
         const targetQ = questions.find(q => q.id === `q${qNum}`);
         if (targetQ && !targetQ.ulasan) {
             targetQ.ulasan = text.replace('Ulasan:', '').trim();
         }
       }
    }
  }
});

// Push the last question
if (currentQuestion && !questions.includes(currentQuestion)) {
  questions.push(currentQuestion);
}

function saveImage(src, prefix, idx, qObj) {
  const matches = src.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
  if (!matches) return;
  const ext = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');
  const filename = `${prefix}_${idx}.${ext}`;
  fs.writeFileSync(path.join(outputImagesDir, filename), buffer);
  qObj.images.push(`/quiz-images/${filename}`);
}

// Clean up text
questions.forEach(q => {
  q.text = q.text.replace(/\[Tingkatan.*?\]/g, '').trim();
});

// Group by SK
const quizDataBySK = {};
questions.forEach(q => {
  if (!quizDataBySK[q.sk]) {
    quizDataBySK[q.sk] = [];
  }
  quizDataBySK[q.sk].push(q);
});

fs.writeFileSync(path.join(__dirname, '../src/data/quizData.json'), JSON.stringify(quizDataBySK, null, 2));
console.log('Successfully generated quiz data with ' + questions.length + ' questions.');
