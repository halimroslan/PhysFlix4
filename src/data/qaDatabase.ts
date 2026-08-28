export interface QAReply {
  id: string;
  authorName: string;
  authorRole: "guru" | "pelajar" | "admin";
  authorAvatar?: string;
  text: string;
  timestamp: string;
  createdAt: number;
  likes: number;
  isVerified?: boolean;
}

export interface QAItem {
  id: string;
  lessonId: string;
  chapterNum: number;
  form: number;
  authorName: string;
  authorRole: "guru" | "pelajar" | "admin";
  authorAvatar?: string;
  question: string;
  category: "Konsep" | "Pengiraan" | "SPM Kertas 2" | "SPM Kertas 1" | "Amali";
  timestamp: string;
  createdAt: number;
  likes: number;
  isLiked?: boolean;
  replies: QAReply[];
}

export const defaultQAItems: Record<string, QAItem[]> = {
  // T4 Bab 1: Pengukuran
  "HifOFbw3gDk": [
    {
      id: "qa-1-1",
      lessonId: "HifOFbw3gDk",
      chapterNum: 1,
      form: 4,
      authorName: "Muhammad Farhan (T4 Bestari)",
      authorRole: "pelajar",
      question: "Cikgu, macam mana nak bezakan kuantiti asas dengan kuantiti terbitan kalau dalam soalan Kertas 1 objektif?",
      category: "Konsep",
      timestamp: "3 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      likes: 8,
      replies: [
        {
          id: "rep-1-1-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Salam Farhan. Cara paling mudah: hafal 7 Kuantiti Asas sahaja (Panjang, Jisim, Masa, Suhu Termodinamik, Arus Elektrik, Keamatan Cahaya, dan Kuantiti Bahan). Selain 7 ini, semuanya adalah Kuantiti Terbitan yang terhasil melalui gabungan pendaraban/pembahagian (contoh: Laju = Jarak/Masa).",
          timestamp: "2 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 2,
          likes: 14,
          isVerified: true
        }
      ]
    },
    {
      id: "qa-1-2",
      lessonId: "HifOFbw3gDk",
      chapterNum: 1,
      form: 4,
      authorName: "Aina Batrisyia",
      authorRole: "pelajar",
      question: "Apakah beza ralat rawak dan ralat bersistem semasa mengambil bacaan menggunakan angkup vernier?",
      category: "Amali",
      timestamp: "1 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      likes: 5,
      replies: [
        {
          id: "rep-1-2-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Ralat bersistem disebabkan oleh alat (contoh: ralat sifar) dan sentiasa konsisten pada setiap bacaan (boleh diatasi dengan menolak ralat sifar). Ralat rawak pula disebabkan oleh pemerhati (contoh: ralat paralaks atau perubahan suhu persekitaran), boleh dikurangkan dengan mengambil bacaan berulang dan mencari nilai purata.",
          timestamp: "18 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 18,
          likes: 9,
          isVerified: true
        }
      ]
    }
  ],

  // T4 Bab 2: Gerakan Linear / Jatuh Bebas
  "2OeHdtXaeyM": [
    {
      id: "qa-2-1",
      lessonId: "2OeHdtXaeyM",
      chapterNum: 2,
      form: 4,
      authorName: "Danish Irfan",
      authorRole: "pelajar",
      question: "Sir, kenapa objek berat dan objek ringan jatuh dengan masa yang sama dalam kebuk vakum, tapi berbeza di udara biasa?",
      category: "Konsep",
      timestamp: "5 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      likes: 12,
      replies: [
        {
          id: "rep-2-1-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Dalam vakum, TIADA rintangan udara. Satu-satunya daya yang bertindak ialah daya graviti, menyebabkan kedua-dua objek mengalami pecutan graviti g yang sama (g = 9.81 m s⁻²), tidak bergantung pada jisim objek (a = F/m = mg/m = g). Di udara biasa, rintangan udara bertindak melawan berat objek dan bergantung kepada bentuk/luas permukaan objek.",
          timestamp: "4 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 4,
          likes: 18,
          isVerified: true
        }
      ]
    },
    {
      id: "qa-2-2",
      lessonId: "2OeHdtXaeyM",
      chapterNum: 2,
      form: 4,
      authorName: "Lim Wei Jie",
      authorRole: "pelajar",
      question: "Semasa objek mencapai halaju terminal, adakah pecutannya bernilai 9.81 m s⁻² atau sifar?",
      category: "SPM Kertas 2",
      timestamp: "1 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
      likes: 7,
      replies: [
        {
          id: "rep-2-2-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Pecutan adalah SIFAR (a = 0 m s⁻²)! Ini kerana daya rintangan udara ke atas telah menjadi sama magnitud dengan berat objek ke bawah (Daya Paduan F_net = 0). Oleh itu objek bergerak dengan halaju malar (halaju terminal).",
          timestamp: "20 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 20,
          likes: 11,
          isVerified: true
        }
      ]
    }
  ],

  // T4 Bab 3: Kegravitian
  "rT_F2b918mY": [
    {
      id: "qa-3-1",
      lessonId: "rT_F2b918mY",
      chapterNum: 3,
      form: 4,
      authorName: "Hariz Zikri",
      authorRole: "pelajar",
      question: "Kenapa satelit geopegun perlu berada tepat di atas satah Khatulistiwa dan tempoh orbitnya 24 jam?",
      category: "SPM Kertas 2",
      timestamp: "6 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
      likes: 15,
      replies: [
        {
          id: "rep-3-1-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Satelit geopegun mesti berputar mengikut arah putaran Bumi dengan tempoh T = 24 jam di satah Khatulistiwa supaya kedudukannya sentiasa pegun relatif terhadap stesen penerima di permukaan Bumi. Ini memudahkan siaran satelit seperti Astro & telekomunikasi tanpa perlu menggerakkan piring penerima.",
          timestamp: "5 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 5,
          likes: 21,
          isVerified: true
        }
      ]
    },
    {
      id: "qa-3-2",
      lessonId: "rT_F2b918mY",
      chapterNum: 3,
      form: 4,
      authorName: "Nurul Izzah",
      authorRole: "pelajar",
      question: "Apakah hubungan antara halaju lepas dengan jisim objek yang hendak dilancarkan?",
      category: "Pengiraan",
      timestamp: "2 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      likes: 6,
      replies: [
        {
          id: "rep-3-2-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Halaju lepas v = √(2GM/R) TIDAK bergantung kepada jisim objek m yang dilancarkan. Ia hanya bergantung kepada jisim planet M dan jejari planet R. Jadi roket 100 tan dan bola tenis 100 gram memerlukan halaju lepas yang sama (~11.2 km/s dari Bumi).",
          timestamp: "1 hari lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 24,
          likes: 16,
          isVerified: true
        }
      ]
    }
  ],

  // T4 Bab 4: Haba
  "14sC2XvFf4Y": [
    {
      id: "qa-4-1",
      lessonId: "14sC2XvFf4Y",
      chapterNum: 4,
      form: 4,
      authorName: "Chong Ming",
      authorRole: "pelajar",
      question: "Semasa ais melebur pada 0°C, haba diserap tetapi suhu tidak naik. Ke manakah haba tersebut pergi?",
      category: "Konsep",
      timestamp: "4 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
      likes: 19,
      replies: [
        {
          id: "rep-4-1-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Haba yang diserap itu ialah Haba Pendam Pelakuran (Q = mL_f). Tenaga haba ini digunakan sepenuhnya untuk melemahkan/memutuskan ikatan pepejal antara molekul ais, meningkatkan tenaga keupayaan molekul tanpa menambah tenaga kinetik purata molekul. Oleh sebab suhu bergantung kepada tenaga kinetik purata, suhu kekal malar pada 0°C.",
          timestamp: "3 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 3,
          likes: 25,
          isVerified: true
        }
      ]
    },
    {
      id: "qa-4-2",
      lessonId: "14sC2XvFf4Y",
      chapterNum: 4,
      form: 4,
      authorName: "Siti Nurhaliza",
      authorRole: "pelajar",
      question: "Dalam pengiraan Hukum Gas (Boyle, Charles, Gay-Lussac), adakah wajib guna unit Kelvin untuk suhu?",
      category: "Pengiraan",
      timestamp: "1 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 25,
      likes: 11,
      replies: [
        {
          id: "rep-4-2-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "WAJIB! Untuk Hukum Charles (V₁/T₁ = V₂/T₂) dan Hukum Gay-Lussac (P₁/T₁ = P₂/T₂), suhu T MESTI dalam unit Kelvin (K = °C + 273). Jangan gunakan °C secara terus kerana formula ini berasaskan skala suhu mutlak!",
          timestamp: "22 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 22,
          likes: 17,
          isVerified: true
        }
      ]
    }
  ],

  // T5 Bab 3: Elektrik
  "l1aYWXec21Q": [
    {
      id: "qa-5-1",
      lessonId: "l1aYWXec21Q",
      chapterNum: 3,
      form: 5,
      authorName: "Amirul Haziq",
      authorRole: "pelajar",
      question: "Cikgu, apakah perbezaan utama antara D.g.e. (Daya Gerak Elektrik) dengan Beza Keupayaan?",
      category: "Konsep",
      timestamp: "7 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 7,
      likes: 14,
      replies: [
        {
          id: "rep-5-1-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "D.g.e. (E) ialah tenaga yang dibekalkan oleh sumber (bateri) untuk menggerakkan satu coulomb cas mengelilingi satu litar lengkap (termasuk merentasi rintangan dalam r). Beza Keupayaan (V) pula ialah kerja yang dilakukan untuk menggerakkan 1 C cas antara dua titik dalam litar luar. Apabila litar terbuka (tiada arus I = 0), bacaan voltmeter merentasi bateri = D.g.e.",
          timestamp: "6 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 6,
          likes: 22,
          isVerified: true
        }
      ]
    },
    {
      id: "qa-5-2",
      lessonId: "l1aYWXec21Q",
      chapterNum: 3,
      form: 5,
      authorName: "Kavitha A/P Raj",
      authorRole: "pelajar",
      question: "Bagaimana cara menentukan rintangan dalam r daripada graf V melawan I?",
      category: "SPM Kertas 2",
      timestamp: "2 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 50,
      likes: 9,
      replies: [
        {
          id: "rep-5-2-1",
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: "Bandingkan persamaan litar V = E - Ir dengan persamaan garis lurus y = mx + c. Daripada graf V melawan I: \n1. Pintasan-y = D.g.e. (E)\n2. Kecerunan graf (m) = -r (magnitud kecerunan graf bersamaan dengan rintangan dalam r).",
          timestamp: "1 hari lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 30,
          likes: 19,
          isVerified: true
        }
      ]
    }
  ]
};

/**
 * Generate generic authentic SPM Q&A discussions for any video lesson that doesn't have custom ones yet
 */
export function getLessonQAItems(lessonId: string, titleBm: string, chapterBm: string, form: number, chapterNum: number): QAItem[] {
  if (defaultQAItems[lessonId] && defaultQAItems[lessonId].length > 0) {
    return defaultQAItems[lessonId];
  }

  // Generate realistic authentic discussions for this topic
  return [
    {
      id: `qa-gen-${lessonId}-1`,
      lessonId,
      chapterNum,
      form,
      authorName: "Muhammad Aqil (Pelajar SPM)",
      authorRole: "pelajar",
      question: `Cikgu, boleh terangkan konsep paling penting yang selalu masuk peperiksaan SPM bagi topik ${titleBm}?`,
      category: "SPM Kertas 2",
      timestamp: "4 jam lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
      likes: 6,
      replies: [
        {
          id: `rep-gen-${lessonId}-1`,
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: `Salam Aqil. Untuk topik ${titleBm}, perkara wajib dikuasai ialah: 1. Definisi dan hukum fizik rasmi (rujuk Kamus TasFiz), 2. Hubungan antara pembolehubah dan graf, 3. Penggantian rumus beserta unit S.I. yang betul. Pastikan semak Tip SPM dalam tab Ringkasan Nota di atas!`,
          timestamp: "3 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 3,
          likes: 12,
          isVerified: true
        }
      ]
    },
    {
      id: `qa-gen-${lessonId}-2`,
      lessonId,
      chapterNum,
      form,
      authorName: "Nur Sabrina",
      authorRole: "pelajar",
      question: `Apakah kesilapan lazim yang calon SPM selalu buat semasa menjawab soalan pengiraan bagi ${chapterBm}?`,
      category: "Pengiraan",
      timestamp: "1 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 28,
      likes: 8,
      replies: [
        {
          id: `rep-gen-${lessonId}-2`,
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: `Kesilapan paling kerap: 1. Lupa tukar unit kepada unit asas S.I. (contohnya g ke kg, minit ke saat, cm ke m), 2. Tidak menulis rumus asal sebelum menggantikan nombor, 3. Jawapan akhir tiada unit atau angka bererti tidak munasabah. Sentiasa semak unit sebelum menekan kalkulator!`,
          timestamp: "18 jam lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 18,
          likes: 15,
          isVerified: true
        }
      ]
    },
    {
      id: `qa-gen-${lessonId}-3`,
      lessonId,
      chapterNum,
      form,
      authorName: "Tan Kah Heng",
      authorRole: "pelajar",
      question: `Bagi soalan struktur Kertas 2 Bahagian B, macam mana nak skor markah penuh untuk soalan penerangan konsep dalam ${titleBm}?`,
      category: "SPM Kertas 2",
      timestamp: "2 hari lepas",
      createdAt: Date.now() - 1000 * 60 * 60 * 52,
      likes: 10,
      replies: [
        {
          id: `rep-gen-${lessonId}-3`,
          authorName: "Sir Halim (Guru Fizik)",
          authorRole: "guru",
          text: `Tulis jawapan dalam bentuk poin nombor berstruktur mengikut peruntukan markah (contoh 4 markah = 4 poin jelas). Nyatakan hukum/prinsip yang terlibat, perubahan kuantiti fizik secara berurutan, dan kesimpulan akhir. Gunakan kata kunci tepat seperti dalam Kamus Fizik PhysFlix.`,
          timestamp: "1 hari lepas",
          createdAt: Date.now() - 1000 * 60 * 60 * 30,
          likes: 16,
          isVerified: true
        }
      ]
    }
  ];
}
