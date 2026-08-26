import { dskpMappings } from './dskpData';

export interface VideoLesson {
  id: string;
  driveId: string;
  youtubeId?: string;
  isPendingUpload?: boolean;
  thumbnailUrl?: string;
  week: string;
  weekNum: number;
  titleBm: string;
  titleDlp: string;
  form: number;
  chapterNum: number;
  chapterBm: string;
  chapterDlp: string;
  duration: string;
  thumbnailBg: string;
  learningPointsBm: string[];
  learningPointsDlp: string[];
  keyConceptsBm: string[];
  keyConceptsDlp: string[];
  resources: {
    titleBm: string;
    titleDlp: string;
    type: "pdf" | "docx" | "pptx";
    size: string;
    url: string;
  }[];
  tavisPositions?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
  }[];
}

export const rawForm4Videos = [
  {
    "driveId": "HifOFbw3gDk",
    "youtubeId": "HifOFbw3gDk",
    "week": "T4 M1",
    "weekNum": 1,
    "titleBm": "1.1 Kuantiti Fizik",
    "titleDlp": "1.1 Physical Quantities",
    "form": 4,
    "chapterNum": 1,
    "chapterBm": "Pengukuran",
    "chapterDlp": "Measurement",
    "duration": "51:03",
    "keyConceptsBm": [
      "Kuantiti Terbitan",
      "Kuantiti Skalar",
      "Kuantiti Vektor",
      "Kuantiti Asas",
      "Unit SI"
    ],
    "keyConceptsDlp": [
      "Derived Quantities",
      "Scalar Quantities",
      "Vector Quantities",
      "Base Quantities",
      "SI Units"
    ],
    "thumbnailUrl": "/thumbnails/HifOFbw3gDk.webp"
  },
  {
    "driveId": "MrRD2TOnp54",
    "youtubeId": "MrRD2TOnp54",
    "week": "T4 M2",
    "weekNum": 2,
    "titleBm": "1.2a Penyiasatan Saintifik",
    "titleDlp": "1.2a Scientific Investigation",
    "form": 4,
    "chapterNum": 1,
    "chapterBm": "Pengukuran",
    "chapterDlp": "Measurement",
    "duration": "23:17",
    "keyConceptsBm": [
      "Analisis Graf",
      "Unit SI",
      "Bentuk Piawai",
      "Kepersisan",
      "Kejituan"
    ],
    "keyConceptsDlp": [
      "Graph Analysis",
      "SI Units",
      "Standard Form",
      "Precision",
      "Accuracy"
    ],
    "thumbnailUrl": "/thumbnails/MrRD2TOnp54.webp"
  },
  {
    "driveId": "90mxEb59yZI",
    "youtubeId": "90mxEb59yZI",
    "week": "T4 M3",
    "weekNum": 3,
    "titleBm": "1.2b Penyiasatan Saintifik",
    "titleDlp": "1.2b Scientific Investigation Part 2",
    "form": 4,
    "chapterNum": 1,
    "chapterBm": "Pengukuran",
    "chapterDlp": "Measurement",
    "duration": "59:25",
    "keyConceptsBm": [
      "Analisis Graf",
      "Unit SI",
      "Bentuk Piawai",
      "Kepersisan",
      "Kejituan"
    ],
    "keyConceptsDlp": [
      "Graph Analysis",
      "SI Units",
      "Standard Form",
      "Precision",
      "Accuracy"
    ],
    "thumbnailUrl": "/thumbnails/90mxEb59yZI.webp"
  },
  {
    "driveId": "2OeHdtXaeyM",
    "youtubeId": "2OeHdtXaeyM",
    "week": "T4 M5",
    "weekNum": 5,
    "titleBm": "2.2 Graf Gerakan Linear",
    "titleDlp": "2.2 Linear Motion Graphs",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "59:53",
    "keyConceptsBm": [
      "Gerakan linear",
      "Analisis Graf",
      "Sesaran",
      "Pecutan",
      "Halaju"
    ],
    "keyConceptsDlp": [
      "Linear Motion",
      "Graph Analysis",
      "Displacement",
      "Acceleration",
      "Velocity"
    ],
    "thumbnailUrl": "/thumbnails/2OeHdtXaeyM.webp"
  },
  {
    "driveId": "l1aYWXec21Q",
    "youtubeId": "l1aYWXec21Q",
    "week": "T4 M6",
    "weekNum": 6,
    "titleBm": "2.3 Gerakan Jatuh Bebas",
    "titleDlp": "2.3 Free Fall Motion",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "58:34",
    "keyConceptsBm": [
      "Pecutan Graviti",
      "Jatuh bebas",
      "Pecutan",
      "Persamaan Gerakan Linear",
      "Masa Impak"
    ],
    "keyConceptsDlp": [
      "Gravitational Acceleration",
      "Free Fall",
      "Acceleration",
      "Linear Motion Equations",
      "Impact Time"
    ],
    "thumbnailUrl": "/thumbnails/l1aYWXec21Q.webp"
  },
  {
    "driveId": "uQwyU34HH28",
    "youtubeId": "uQwyU34HH28",
    "week": "T4 M7",
    "weekNum": 7,
    "titleBm": "2.4 Inersia",
    "titleDlp": "2.4 Inertia",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "54:04",
    "keyConceptsBm": [
      "Inersia",
      "Hukum Gerakan Newton Pertama",
      "Jisim",
      "Kesan Inersia"
    ],
    "keyConceptsDlp": [
      "Inertia",
      "Newton First Law of Motion",
      "Mass",
      "Effects of Inertia"
    ],
    "thumbnailUrl": "/thumbnails/uQwyU34HH28.webp"
  },
  {
    "driveId": "gqbZ3grngvg",
    "youtubeId": "gqbZ3grngvg",
    "week": "T4 M8",
    "weekNum": 8,
    "titleBm": "2.5 Momentum",
    "titleDlp": "2.5 Momentum",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "51:48",
    "keyConceptsBm": [
      "Prinsip Keabadian Momentum",
      "Momentum",
      "Pelanggaran Kenyal",
      "Pelanggaran Tak Kenyal",
      "Letupan"
    ],
    "keyConceptsDlp": [
      "Principle of Conservation of Momentum",
      "Momentum",
      "Elastic Collision",
      "Inelastic Collision",
      "Explosion"
    ],
    "thumbnailUrl": "/thumbnails/gqbZ3grngvg.webp"
  },
  {
    "driveId": "QZtocJnhel4",
    "youtubeId": "QZtocJnhel4",
    "week": "T4 M9",
    "weekNum": 9,
    "titleBm": "2.6 Daya",
    "titleDlp": "2.6 Force",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "57:22",
    "keyConceptsBm": [
      "Hukum Gerakan Newton Kedua",
      "Daya F = ma",
      "Kadar Perubahan Momentum",
      "Pecutan"
    ],
    "keyConceptsDlp": [
      "Newton Second Law of Motion",
      "Force F = ma",
      "Rate of Change of Momentum",
      "Acceleration"
    ],
    "thumbnailUrl": "/thumbnails/QZtocJnhel4.webp"
  },
  {
    "driveId": "m90zg3HyU_8",
    "youtubeId": "m90zg3HyU_8",
    "week": "T4 M10",
    "weekNum": 10,
    "titleBm": "2.7 Daya Impuls & 2.8 Berat",
    "titleDlp": "2.7 Impulsive Force & 2.8 Weight",
    "form": 4,
    "chapterNum": 2,
    "chapterBm": "Daya dan Gerakan I",
    "chapterDlp": "Force and Motion I",
    "duration": "55:28",
    "keyConceptsBm": [
      "Daya impuls",
      "Impuls",
      "Berat W = mg",
      "Masa Impak",
      "Keselamatan Kenderaan"
    ],
    "keyConceptsDlp": [
      "Impulsive Force",
      "Impulse",
      "Weight W = mg",
      "Impact Time",
      "Vehicle Safety"
    ],
    "thumbnailUrl": "/thumbnails/m90zg3HyU_8.webp"
  },
  {
    "driveId": "hsjQe4dnpl0",
    "youtubeId": "hsjQe4dnpl0",
    "week": "T4 M11",
    "weekNum": 11,
    "titleBm": "3.1a Hukum Kegravitian Semesta Newton",
    "titleDlp": "3.1a Newton's Universal Law of Gravitation",
    "form": 4,
    "chapterNum": 3,
    "chapterBm": "Kegravitian",
    "chapterDlp": "Gravitation",
    "duration": "52:42",
    "keyConceptsBm": [
      "Hukum Kegravitian Semesta Newton",
      "Daya Tarikan Graviti",
      "Pemalar Kegravitian G",
      "Pecutan Graviti g"
    ],
    "keyConceptsDlp": [
      "Newton's Universal Law of Gravitation",
      "Gravitational Force",
      "Gravitational Constant G",
      "Gravitational Acceleration g"
    ],
    "thumbnailUrl": "/thumbnails/hsjQe4dnpl0.webp"
  },
  {
    "driveId": "x-wilmj9cxE",
    "youtubeId": "x-wilmj9cxE",
    "week": "T4 M12",
    "weekNum": 12,
    "titleBm": "3.1b Hukum Kegravitian Semesta Newton",
    "titleDlp": "3.1b Newton's Universal Law of Gravitation Part 2",
    "form": 4,
    "chapterNum": 3,
    "chapterBm": "Kegravitian",
    "chapterDlp": "Gravitation",
    "duration": "59:39",
    "keyConceptsBm": [
      "Hukum Kegravitian Semesta Newton",
      "Pecutan Graviti",
      "Jisim Bumi",
      "Jisim Matahari"
    ],
    "keyConceptsDlp": [
      "Newton's Universal Law of Gravitation",
      "Gravitational Acceleration",
      "Mass of Earth",
      "Mass of Sun"
    ],
    "thumbnailUrl": "/thumbnails/x-wilmj9cxE.webp"
  },
  {
    "driveId": "i4WgQ_Azegc",
    "youtubeId": "i4WgQ_Azegc",
    "week": "T4 M12",
    "weekNum": 12.5,
    "titleBm": "3.1c Daya Memusat & Gerakan Membulat",
    "titleDlp": "3.1c Centripetal Force & Circular Motion",
    "form": 4,
    "chapterNum": 3,
    "chapterBm": "Kegravitian",
    "chapterDlp": "Gravitation",
    "duration": "58:06",
    "keyConceptsBm": [
      "Daya Memusat F = mv2/r",
      "Pecutan Memusat",
      "Gerakan Membulat",
      "Orbit Satelit"
    ],
    "keyConceptsDlp": [
      "Centripetal Force F = mv2/r",
      "Centripetal Acceleration",
      "Circular Motion",
      "Satellite Orbit"
    ],
    "thumbnailUrl": "/thumbnails/i4WgQ_Azegc.webp"
  },
  {
    "driveId": "snbt6GpD0C4",
    "youtubeId": "snbt6GpD0C4",
    "week": "T4 M13",
    "weekNum": 13,
    "titleBm": "3.2 Hukum Kepler",
    "titleDlp": "3.2 Kepler's Laws",
    "form": 4,
    "chapterNum": 3,
    "chapterBm": "Kegravitian",
    "chapterDlp": "Gravitation",
    "duration": "57:02",
    "keyConceptsBm": [
      "Hukum Kepler I",
      "Hukum Kepler II",
      "Hukum Kepler III T2 \u221d r3",
      "Orbit Elips",
      "Tempoh Orbit"
    ],
    "keyConceptsDlp": [
      "Kepler's First Law",
      "Kepler's Second Law",
      "Kepler's Third Law T2 \u221d r3",
      "Elliptical Orbit",
      "Orbital Period"
    ],
    "thumbnailUrl": "/thumbnails/snbt6GpD0C4.webp"
  },
  {
    "driveId": "09jX9qGHwSQ",
    "youtubeId": "09jX9qGHwSQ",
    "week": "T4 M14",
    "weekNum": 14,
    "titleBm": "3.3a Satelit Buatan Manusia",
    "titleDlp": "3.3a Man-made Satellites",
    "form": 4,
    "chapterNum": 3,
    "chapterBm": "Kegravitian",
    "chapterDlp": "Gravitation",
    "duration": "56:55",
    "keyConceptsBm": [
      "Satelit Geopegun",
      "Satelit Bukan Geopegun",
      "Laju Linear Satelit",
      "Halaju Lepas v"
    ],
    "keyConceptsDlp": [
      "Geostationary Satellite",
      "Non-geostationary Satellite",
      "Linear Speed of Satellite",
      "Escape Velocity v"
    ],
    "thumbnailUrl": "/thumbnails/09jX9qGHwSQ.webp"
  },
  {
    "driveId": "XzSTapojxMU",
    "youtubeId": "XzSTapojxMU",
    "week": "T4 M16",
    "weekNum": 16,
    "titleBm": "4.1 Keseimbangan Terma",
    "titleDlp": "4.1 Thermal Equilibrium",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "56:57",
    "keyConceptsBm": [
      "Keseimbangan Terma",
      "Suhu",
      "Haba",
      "Penentukuran Termometer"
    ],
    "keyConceptsDlp": [
      "Thermal Equilibrium",
      "Temperature",
      "Heat",
      "Thermometer Calibration"
    ],
    "thumbnailUrl": "/thumbnails/XzSTapojxMU.webp"
  },
  {
    "driveId": "GK4PZO-9hos",
    "youtubeId": "GK4PZO-9hos",
    "week": "T4 M17",
    "weekNum": 17,
    "titleBm": "4.2a Muatan Haba Tentu",
    "titleDlp": "4.2a Specific Heat Capacity",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "58:43",
    "keyConceptsBm": [
      "Muatan Haba C",
      "Muatan Haba Tentu c = Q/m\u0394\u03b8",
      "Aplikasi Muatan Haba Tentu",
      "Bayu Laut & Bayu Darat"
    ],
    "keyConceptsDlp": [
      "Heat Capacity C",
      "Specific Heat Capacity c = Q/m\u0394\u03b8",
      "Applications of Specific Heat Capacity",
      "Sea Breeze & Land Breeze"
    ],
    "thumbnailUrl": "/thumbnails/GK4PZO-9hos.webp"
  },
  {
    "driveId": "BSKVOMr_NWU",
    "youtubeId": "BSKVOMr_NWU",
    "week": "T4 M18",
    "weekNum": 18,
    "titleBm": "4.2b Muatan Haba Tentu",
    "titleDlp": "4.2b Specific Heat Capacity Part 2",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "57:34",
    "keyConceptsBm": [
      "Penyelesaian Masalah Q = mc\u0394\u03b8",
      "Pemanas Elektrik Pt = mc\u0394\u03b8",
      "Pencampuran Bahan"
    ],
    "keyConceptsDlp": [
      "Problem Solving Q = mc\u0394\u03b8",
      "Electrical Heater Pt = mc\u0394\u03b8",
      "Mixture of Substances"
    ],
    "thumbnailUrl": "/thumbnails/BSKVOMr_NWU.webp"
  },
  {
    "driveId": "nLaJH-EH3Ko",
    "youtubeId": "nLaJH-EH3Ko",
    "week": "T4 M19",
    "weekNum": 19,
    "titleBm": "4.3a Haba Pendam Tentu",
    "titleDlp": "4.3a Specific Latent Heat",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "56:29",
    "keyConceptsBm": [
      "Haba Pendam Tentu Pelakuran lf",
      "Haba Pendam Tentu Pengewapan lv",
      "Lengkung Pemanasan & Penyejukan",
      "Rumus Q = ml"
    ],
    "keyConceptsDlp": [
      "Specific Latent Heat of Fusion lf",
      "Specific Latent Heat of Vaporisation lv",
      "Heating & Cooling Curves",
      "Formula Q = ml"
    ],
    "thumbnailUrl": "/thumbnails/nLaJH-EH3Ko.webp"
  },
  {
    "driveId": "BqZIb-bVYk0",
    "youtubeId": "BqZIb-bVYk0",
    "week": "T4 M20",
    "weekNum": 20,
    "titleBm": "4.3b Haba Pendam Tentu",
    "titleDlp": "4.3b Specific Latent Heat Applications",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "58:37",
    "keyConceptsBm": [
      "Aplikasi Haba Pendam Tentu",
      "Penyelesaian Masalah Pt = ml",
      "Perubahan Fasa Jirim"
    ],
    "keyConceptsDlp": [
      "Applications of Specific Latent Heat",
      "Problem Solving Pt = ml",
      "Phase Change of Matter"
    ],
    "thumbnailUrl": "/thumbnails/BqZIb-bVYk0.webp"
  },
  {
    "driveId": "Lrq-a0624Y8",
    "youtubeId": "Lrq-a0624Y8",
    "week": "T4 M21",
    "weekNum": 21,
    "titleBm": "4.4 Hukum-hukum Gas",
    "titleDlp": "4.4 Gas Laws",
    "form": 4,
    "chapterNum": 4,
    "chapterBm": "Haba",
    "chapterDlp": "Heat",
    "duration": "1:01:20",
    "keyConceptsBm": [
      "Hukum Boyle P1V1 = P2V2",
      "Hukum Charles V1/T1 = V2/T2",
      "Hukum Gay-Lussac P1/T1 = P2/T2",
      "Suhu Mutlak Kelvin"
    ],
    "keyConceptsDlp": [
      "Boyle's Law P1V1 = P2V2",
      "Charles's Law V1/T1 = V2/T2",
      "Gay-Lussac's Law P1/T1 = P2/T2",
      "Absolute Temperature Kelvin"
    ],
    "thumbnailUrl": "/thumbnails/Lrq-a0624Y8.webp"
  },
  {
    "driveId": "FoOtEc3jlts",
    "youtubeId": "FoOtEc3jlts",
    "week": "T4 M22",
    "weekNum": 22,
    "titleBm": "5.1 Asas Gelombang",
    "titleDlp": "5.1 Fundamentals of Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "58:28",
    "keyConceptsBm": [
      "Gelombang Melintang",
      "Gelombang Membujur",
      "Amplitud A",
      "Frekuensi f",
      "Panjang Gelombang \u03bb",
      "Laju Gelombang v = f\u03bb"
    ],
    "keyConceptsDlp": [
      "Transverse Waves",
      "Longitudinal Waves",
      "Amplitude A",
      "Frequency f",
      "Wavelength \u03bb",
      "Wave Speed v = f\u03bb"
    ],
    "thumbnailUrl": "/thumbnails/FoOtEc3jlts.webp"
  },
  {
    "driveId": "LwJhb5ey-q8",
    "youtubeId": "LwJhb5ey-q8",
    "week": "T4 M23",
    "weekNum": 23,
    "titleBm": "5.2 Pelembapan & Resonans",
    "titleDlp": "5.2 Damping & Resonance",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "57:25",
    "keyConceptsBm": [
      "Pelembapan Luaran & Dalaman",
      "Frekuensi Asli",
      "Resonans",
      "Ayunan Barton"
    ],
    "keyConceptsDlp": [
      "External & Internal Damping",
      "Natural Frequency",
      "Resonance",
      "Barton's Pendulum"
    ],
    "thumbnailUrl": "/thumbnails/LwJhb5ey-q8.webp"
  },
  {
    "driveId": "Y7yT4-9R6do",
    "youtubeId": "Y7yT4-9R6do",
    "week": "T4 M24",
    "weekNum": 24,
    "titleBm": "5.3 Pantulan Gelombang",
    "titleDlp": "5.3 Reflection of Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "56:59",
    "keyConceptsBm": [
      "Hukum Pantulan",
      "Muka Gelombang Satah & Melengkung",
      "Ciri Pantulan (\u03bb, f, v kekal sama)"
    ],
    "keyConceptsDlp": [
      "Law of Reflection",
      "Plane & Curved Wavefronts",
      "Characteristics of Reflection (\u03bb, f, v remain unchanged)"
    ],
    "thumbnailUrl": "/thumbnails/Y7yT4-9R6do.webp"
  },
  {
    "driveId": "GIbs4ZhEPVY",
    "youtubeId": "GIbs4ZhEPVY",
    "week": "T4 M25",
    "weekNum": 25,
    "titleBm": "5.4 Pembiasan Gelombang",
    "titleDlp": "5.4 Refraction of Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "58:24",
    "keyConceptsBm": [
      "Pembiasan Gelombang Air",
      "Kawasan Dalam & Kawasan Cetek",
      "Perubahan \u03bb dan v (f tetap)",
      "Tanjung dan Teluk"
    ],
    "keyConceptsDlp": [
      "Refraction of Water Waves",
      "Deep & Shallow Regions",
      "Changes in \u03bb and v (f constant)",
      "Headlands and Bays"
    ],
    "thumbnailUrl": "/thumbnails/GIbs4ZhEPVY.webp"
  },
  {
    "driveId": "jbBMpSkhVbE",
    "youtubeId": "jbBMpSkhVbE",
    "week": "T4 M26",
    "weekNum": 26,
    "titleBm": "5.5 Pembelauan Gelombang",
    "titleDlp": "5.5 Diffraction of Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "57:05",
    "keyConceptsBm": [
      "Kesan Pembelauan",
      "Saiz Celah vs Panjang Gelombang",
      "Pembelauan Bunyi & Cahaya"
    ],
    "keyConceptsDlp": [
      "Diffraction Effect",
      "Slit Size vs Wavelength",
      "Diffraction of Sound & Light"
    ],
    "thumbnailUrl": "/thumbnails/jbBMpSkhVbE.webp"
  },
  {
    "driveId": "hgnSRVa-lcY",
    "youtubeId": "hgnSRVa-lcY",
    "week": "T4 M27",
    "weekNum": 27,
    "titleBm": "5.6a Interferens Gelombang",
    "titleDlp": "5.6a Interference of Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "55:53",
    "keyConceptsBm": [
      "Prinsip Superposisi",
      "Sumber Koheren",
      "Interferens Membina (Antinod)",
      "Interferens Membinasa (Nod)"
    ],
    "keyConceptsDlp": [
      "Principle of Superposition",
      "Coherent Sources",
      "Constructive Interference (Antinode)",
      "Destructive Interference (Node)"
    ],
    "thumbnailUrl": "/thumbnails/hgnSRVa-lcY.webp"
  },
  {
    "driveId": "oyweI4GDIsM",
    "youtubeId": "oyweI4GDIsM",
    "week": "T4 M28",
    "weekNum": 28,
    "titleBm": "5.6b Interferens Gelombang",
    "titleDlp": "5.6b Interference of Waves Part 2",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "57:04",
    "keyConceptsBm": [
      "Formula \u03bb = ax/D",
      "Interferens Cahaya Dwisela Young",
      "Interferens Gelombang Bunyi"
    ],
    "keyConceptsDlp": [
      "Formula \u03bb = ax/D",
      "Young Two-slit Light Interference",
      "Sound Wave Interference"
    ],
    "thumbnailUrl": "/thumbnails/oyweI4GDIsM.webp"
  },
  {
    "driveId": "4v3ygAyaP68",
    "youtubeId": "4v3ygAyaP68",
    "week": "T4 M29",
    "weekNum": 29,
    "titleBm": "5.7 Gelombang EM",
    "titleDlp": "5.7 Electromagnetic Waves",
    "form": 4,
    "chapterNum": 5,
    "chapterBm": "Gelombang",
    "chapterDlp": "Waves",
    "duration": "58:33",
    "keyConceptsBm": [
      "Spektrum Elektromagnet",
      "Gelombang Radio hingga Sinar Gama",
      "Aplikasi Gelombang EM"
    ],
    "keyConceptsDlp": [
      "Electromagnetic Spectrum",
      "Radio Waves to Gamma Rays",
      "Applications of EM Waves"
    ],
    "thumbnailUrl": "/thumbnails/4v3ygAyaP68.webp"
  },
  {
    "driveId": "3Wy8-kNGrcc",
    "youtubeId": "3Wy8-kNGrcc",
    "week": "T4 M30",
    "weekNum": 30,
    "titleBm": "6.1 Pembiasan Cahaya",
    "titleDlp": "6.1 Refraction of Light",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "58:17",
    "keyConceptsBm": [
      "Hukum Snell n1 sin \u03b81 = n2 sin \u03b82",
      "Indeks Pembiasan n = c/v",
      "Dalam Nyata H & Dalam Ketara h (n = H/h)"
    ],
    "keyConceptsDlp": [
      "Snell's Law n1 sin \u03b81 = n2 sin \u03b82",
      "Refractive Index n = c/v",
      "Real Depth H & Apparent Depth h (n = H/h)"
    ],
    "thumbnailUrl": "/thumbnails/3Wy8-kNGrcc.webp"
  },
  {
    "driveId": "bViYGWMIHoI",
    "youtubeId": "bViYGWMIHoI",
    "week": "T4 M31",
    "weekNum": 31,
    "titleBm": "6.2 Pantulan Dalam Penuh",
    "titleDlp": "6.2 Total Internal Reflection",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "56:54",
    "keyConceptsBm": [
      "Sudut Genting c",
      "Rumus n = 1/sin c",
      "Logamaya",
      "Gentian Optik",
      "Prisma Periskop"
    ],
    "keyConceptsDlp": [
      "Critical Angle c",
      "Formula n = 1/sin c",
      "Mirage",
      "Optical Fibre",
      "Prism Periscope"
    ],
    "thumbnailUrl": "/thumbnails/bViYGWMIHoI.webp"
  },
  {
    "driveId": "9sJ9a5rToVs",
    "youtubeId": "9sJ9a5rToVs",
    "week": "T4 M32",
    "weekNum": 32,
    "titleBm": "6.3 Pembentukan Imej oleh Kanta",
    "titleDlp": "6.3 Image Formation by Lenses",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "46:59",
    "keyConceptsBm": [
      "Kanta Cembung & Cekung",
      "Rajah Sinar Kanta",
      "Ciri Imej (Sahih/Maya, Songsang/Tegak, Besar/Kecil)",
      "Pembesaran Linear m = v/u"
    ],
    "keyConceptsDlp": [
      "Convex & Concave Lenses",
      "Ray Diagrams of Lenses",
      "Image Characteristics (Real/Virtual, Inverted/Upright, Magnified/Diminished)",
      "Linear Magnification m = v/u"
    ],
    "thumbnailUrl": "/thumbnails/9sJ9a5rToVs.webp"
  },
  {
    "driveId": "BRgIHlXbr_k",
    "youtubeId": "BRgIHlXbr_k",
    "week": "T4 M33",
    "weekNum": 33,
    "titleBm": "6.4 Pembentukan Imej oleh Kanta",
    "titleDlp": "6.4 Lens Formula & Magnification",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "57:15",
    "keyConceptsBm": [
      "Formula Kanta 1/f = 1/u + 1/v",
      "Konvensyen Tanda (+/-)",
      "Penyelesaian Masalah Kanta"
    ],
    "keyConceptsDlp": [
      "Thin Lens Formula 1/f = 1/u + 1/v",
      "Sign Convention (+/-)",
      "Lens Problem Solving"
    ],
    "thumbnailUrl": "/thumbnails/BRgIHlXbr_k.webp"
  },
  {
    "driveId": "yuY1N9zgEEc",
    "youtubeId": "yuY1N9zgEEc",
    "week": "T4 M34",
    "weekNum": 34,
    "titleBm": "6.5 Peralatan Optik",
    "titleDlp": "6.5 Optical Instruments",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "55:43",
    "keyConceptsBm": [
      "Kanta Pembesar",
      "Mikroskop Majmuk",
      "Teleskop Astronomi",
      "Pelarasan Normal"
    ],
    "keyConceptsDlp": [
      "Magnifying Glass",
      "Compound Microscope",
      "Astronomical Telescope",
      "Normal Adjustment"
    ],
    "thumbnailUrl": "/thumbnails/yuY1N9zgEEc.webp"
  },
  {
    "driveId": "AceZCzCckqc",
    "youtubeId": "AceZCzCckqc",
    "week": "T4 M36",
    "weekNum": 36,
    "titleBm": "6.6a Pembentukan Imej Oleh Cermin Sfera",
    "titleDlp": "6.6a Image Formation by Spherical Mirrors",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "57:10",
    "keyConceptsBm": [
      "Cermin Cekung",
      "Cermin Cembung",
      "Titik Fokus F & Pusat Kelengkungan C",
      "Rajah Sinar Cermin Sfera"
    ],
    "keyConceptsDlp": [
      "Concave Mirror",
      "Convex Mirror",
      "Focal Point F & Centre of Curvature C",
      "Ray Diagrams of Spherical Mirrors"
    ],
    "thumbnailUrl": "/thumbnails/AceZCzCckqc.webp"
  },
  {
    "driveId": "8Ci_wF-Pvps",
    "youtubeId": "8Ci_wF-Pvps",
    "week": "T4 M36",
    "weekNum": 36.5,
    "titleBm": "6.6b Pembentukan Imej Oleh Cermin Sfera",
    "titleDlp": "6.6b Image Formation by Spherical Mirrors Part 2",
    "form": 4,
    "chapterNum": 6,
    "chapterBm": "Cahaya dan Optik",
    "chapterDlp": "Light and Optics",
    "duration": "58:19",
    "keyConceptsBm": [
      "Aplikasi Cermin Cekung & Cembung",
      "Formula Cermin 1/f = 1/u + 1/v",
      "Cermin Keselamatan Jalan & Pergigian"
    ],
    "keyConceptsDlp": [
      "Applications of Concave & Convex Mirrors",
      "Mirror Formula 1/f = 1/u + 1/v",
      "Road Safety & Dental Mirrors"
    ],
    "thumbnailUrl": "/thumbnails/8Ci_wF-Pvps.webp"
  }
];

export const rawForm5Videos = [
  {
    "driveId": "t5_m1_1_1",
    "week": "T5 M1",
    "weekNum": 1,
    "titleBm": "1.1 Daya Paduan",
    "titleDlp": "1.1 Resultant Force",
    "form": 5,
    "chapterNum": 1,
    "chapterBm": "Daya dan Gerakan II",
    "chapterDlp": "Force and Motion II",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Daya Paduan",
      "Pecutan",
      "Halaju",
      "Laju",
      "Daya"
    ],
    "keyConceptsDlp": [
      "Resultant Force",
      "Acceleration",
      "Velocity",
      "Speed",
      "Force"
    ]
  },
  {
    "driveId": "t5_m2_1_3",
    "week": "T5 M2",
    "weekNum": 2,
    "titleBm": "1.3 Keseimbangan Daya",
    "titleDlp": "1.3 Forces in Equilibrium",
    "form": 5,
    "chapterNum": 1,
    "chapterBm": "Daya dan Gerakan II",
    "chapterDlp": "Force and Motion II",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Keseimbangan Daya",
      "Segi Tiga Daya",
      "Daya",
      "Unit SI",
      "Bentuk Piawai"
    ],
    "keyConceptsDlp": [
      "Forces in Equilibrium",
      "Triangle of Forces",
      "Force",
      "SI Units",
      "Standard Form"
    ]
  },
  {
    "driveId": "t5_m4_1_4",
    "week": "T5 M4",
    "weekNum": 4,
    "titleBm": "1.4 Kekenyalan",
    "titleDlp": "1.4 Elasticity",
    "form": 5,
    "chapterNum": 1,
    "chapterBm": "Daya dan Gerakan II",
    "chapterDlp": "Force and Motion II",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Pemanjangan spring",
      "Kekenyalan",
      "Hukum Hooke",
      "Daya",
      "Tenaga Keupayaan Kenyal"
    ],
    "keyConceptsDlp": [
      "Spring Extension",
      "Elasticity",
      "Hooke's Law",
      "Force",
      "Elastic Potential Energy"
    ]
  },
  {
    "driveId": "t5_m6_2_2",
    "week": "T5 M6",
    "weekNum": 6,
    "titleBm": "2.2 Tekanan Atmosfera",
    "titleDlp": "2.2 Atmospheric Pressure",
    "form": 5,
    "chapterNum": 2,
    "chapterBm": "Tekanan",
    "chapterDlp": "Pressure",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Tekanan atmosfera",
      "Barometer Fortin",
      "Barometer Aneroid",
      "Ketinggian Altitud"
    ],
    "keyConceptsDlp": [
      "Atmospheric Pressure",
      "Fortin Barometer",
      "Aneroid Barometer",
      "Altitude Height"
    ]
  },
  {
    "driveId": "t5_m7_2_3",
    "week": "T5 M7",
    "weekNum": 7,
    "titleBm": "2.3 Tekanan Gas & 2.4 Prinsip Pascal",
    "titleDlp": "2.3 Gas Pressure & 2.4 Pascal's Principle",
    "form": 5,
    "chapterNum": 2,
    "chapterBm": "Tekanan",
    "chapterDlp": "Pressure",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Prinsip Pascal",
      "Manometer",
      "Tekanan Gas",
      "Sistem Hidraulik"
    ],
    "keyConceptsDlp": [
      "Pascal's Principle",
      "Manometer",
      "Gas Pressure",
      "Hydraulic System"
    ]
  },
  {
    "driveId": "t5_m8_2_5",
    "week": "T5 M8",
    "weekNum": 8,
    "titleBm": "2.5 Prinsip Archimedes",
    "titleDlp": "2.5 Archimedes' Principle",
    "form": 5,
    "chapterNum": 2,
    "chapterBm": "Tekanan",
    "chapterDlp": "Pressure",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Tekanan Cecair P = h\u03c1g",
      "Prinsip Archimedes",
      "Daya Apungan",
      "Hidrometer",
      "Kapal Selam"
    ],
    "keyConceptsDlp": [
      "Liquid Pressure P = h\u03c1g",
      "Archimedes' Principle",
      "Buoyant Force",
      "Hydrometer",
      "Submarine"
    ]
  },
  {
    "driveId": "t5_m9_2_6",
    "week": "T5 M9",
    "weekNum": 9,
    "titleBm": "2.6 Prinsip Bernoulli",
    "titleDlp": "2.6 Bernoulli's Principle",
    "form": 5,
    "chapterNum": 2,
    "chapterBm": "Tekanan",
    "chapterDlp": "Pressure",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Prinsip Bernoulli",
      "Daya Angkat",
      "Aerofoil",
      "Tiub Venturi",
      "Penunu Bunsen"
    ],
    "keyConceptsDlp": [
      "Bernoulli's Principle",
      "Lift Force",
      "Aerofoil",
      "Venturi Tube",
      "Bunsen Burner"
    ]
  },
  {
    "driveId": "t5_m10_3_1",
    "week": "T5 M10",
    "weekNum": 10,
    "titleBm": "3.1 Arus & Beza Keupayaan",
    "titleDlp": "3.1 Current & Potential Difference",
    "form": 5,
    "chapterNum": 3,
    "chapterBm": "Elektrik",
    "chapterDlp": "Electricity",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Medan Elektrik",
      "Arus Elektrik I = Q/t",
      "Beza Keupayaan V = W/Q",
      "Cas Elektrik"
    ],
    "keyConceptsDlp": [
      "Electric Field",
      "Electric Current I = Q/t",
      "Potential Difference V = W/Q",
      "Electric Charge"
    ]
  },
  {
    "driveId": "t5_m11_3_2a",
    "week": "T5 M11",
    "weekNum": 11,
    "titleBm": "3.2a Rintangan",
    "titleDlp": "3.2a Resistance",
    "form": 5,
    "chapterNum": 3,
    "chapterBm": "Elektrik",
    "chapterDlp": "Electricity",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Hukum Ohm V = IR",
      "Konduktor Ohm & Bukan Ohm",
      "Rintangan R",
      "Graf V-I"
    ],
    "keyConceptsDlp": [
      "Ohm's Law V = IR",
      "Ohmic & Non-Ohmic Conductors",
      "Resistance R",
      "V-I Graph"
    ]
  },
  {
    "driveId": "t5_m12_3_2b",
    "week": "T5 M12",
    "weekNum": 12,
    "titleBm": "3.2b Rintangan",
    "titleDlp": "3.2b Resistance in Circuits",
    "form": 5,
    "chapterNum": 3,
    "chapterBm": "Elektrik",
    "chapterDlp": "Electricity",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Litar Bersiri & Selari",
      "Kerintangan Dawai R = \u03c1l/A",
      "Superkonduktor",
      "Suhu Genting"
    ],
    "keyConceptsDlp": [
      "Series & Parallel Circuits",
      "Resistivity of Wire R = \u03c1l/A",
      "Superconductors",
      "Critical Temperature"
    ]
  },
  {
    "driveId": "t5_m13_3_3",
    "week": "T5 M13",
    "weekNum": 13,
    "titleBm": "3.3 DGE & Rintangan Dalam",
    "titleDlp": "3.3 EMF & Internal Resistance",
    "form": 5,
    "chapterNum": 3,
    "chapterBm": "Elektrik",
    "chapterDlp": "Electricity",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Daya Gerak Elektrik \u03b5",
      "Rintangan Dalam r",
      "Formula \u03b5 = V + Ir",
      "Graf V melawan I"
    ],
    "keyConceptsDlp": [
      "Electromotive Force \u03b5",
      "Internal Resistance r",
      "Formula \u03b5 = V + Ir",
      "V against I Graph"
    ]
  },
  {
    "driveId": "t5_m14_3_4",
    "week": "T5 M14",
    "weekNum": 14,
    "titleBm": "3.4 Tenaga & Kuasa Elektrik",
    "titleDlp": "3.4 Electrical Energy & Power",
    "form": 5,
    "chapterNum": 3,
    "chapterBm": "Elektrik",
    "chapterDlp": "Electricity",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Tenaga Elektrik E = VIt",
      "Kuasa Elektrik P = VI",
      "Kecekapan Tenaga",
      "Pengiraan Kos Elektrik"
    ],
    "keyConceptsDlp": [
      "Electrical Energy E = VIt",
      "Electrical Power P = VI",
      "Energy Efficiency",
      "Electricity Cost Calculation"
    ]
  },
  {
    "driveId": "t5_m15_4_1a",
    "week": "T5 M15",
    "weekNum": 15,
    "titleBm": "4.1a Fleming Kiri",
    "titleDlp": "4.1a Fleming's Left Hand Rule",
    "form": 5,
    "chapterNum": 4,
    "chapterBm": "Keelektromagnetan",
    "chapterDlp": "Electromagnetism",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Medan Magnet Paduan",
      "Medan Lastik",
      "Petua Tangan Kiri Fleming",
      "Daya ke atas Konduktor"
    ],
    "keyConceptsDlp": [
      "Catapult Field",
      "Resultant Magnetic Field",
      "Fleming's Left-Hand Rule",
      "Force on Conductor"
    ]
  },
  {
    "driveId": "t5_m16_4_1b",
    "week": "T5 M16",
    "weekNum": 16,
    "titleBm": "4.1b Fleming Kiri",
    "titleDlp": "4.1b Fleming's Left Hand Applications",
    "form": 5,
    "chapterNum": 4,
    "chapterBm": "Keelektromagnetan",
    "chapterDlp": "Electromagnetism",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Motor Arus Terus (A.T.)",
      "Gegelung Pembawa Arus",
      "Komutator",
      "Faktor Kelajuan Motor"
    ],
    "keyConceptsDlp": [
      "Direct Current Motor (D.C.)",
      "Current-Carrying Coil",
      "Commutator",
      "Factors Affecting Motor Speed"
    ]
  },
  {
    "driveId": "t5_m17_4_2",
    "week": "T5 M17",
    "weekNum": 17,
    "titleBm": "4.2 Induksi Elektromagnet",
    "titleDlp": "4.2 Electromagnetic Induction",
    "form": 5,
    "chapterNum": 4,
    "chapterBm": "Keelektromagnetan",
    "chapterDlp": "Electromagnetism",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Aruhan Elektromagnet",
      "Hukum Faraday",
      "Hukum Lenz",
      "Petua Tangan Kanan Fleming",
      "Penjana A.T. & A.U."
    ],
    "keyConceptsDlp": [
      "Electromagnetic Induction",
      "Faraday's Law",
      "Lenz's Law",
      "Fleming's Right-Hand Rule",
      "D.C. & A.C. Generators"
    ]
  },
  {
    "driveId": "t5_m18_4_3a",
    "week": "T5 M18",
    "weekNum": 18,
    "titleBm": "4.3a Transformer",
    "titleDlp": "4.3a Transformer",
    "form": 5,
    "chapterNum": 4,
    "chapterBm": "Keelektromagnetan",
    "chapterDlp": "Electromagnetism",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Transformer Injak Naik",
      "Transformer Injak Turun",
      "Rumus Vp/Vs = Np/Ns",
      "Teras Besi Lembut Berlamina"
    ],
    "keyConceptsDlp": [
      "Step-Up Transformer",
      "Step-Down Transformer",
      "Formula Vp/Vs = Np/Ns",
      "Laminated Soft Iron Core"
    ]
  },
  {
    "driveId": "t5_m19_4_3b",
    "week": "T5 M19",
    "weekNum": 19,
    "titleBm": "4.3b Transformer",
    "titleDlp": "4.3b Transformer Efficiency",
    "form": 5,
    "chapterNum": 4,
    "chapterBm": "Keelektromagnetan",
    "chapterDlp": "Electromagnetism",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Kecekapan Transformer \u03b7 = (IsVs / IpVp) \u00d7 100%",
      "Kehilangan Tenaga (Histerisis, Arus Pusar, Rintangan Gegelung)"
    ],
    "keyConceptsDlp": [
      "Transformer Efficiency \u03b7 = (IsVs / IpVp) \u00d7 100%",
      "Energy Loss (Hysteresis, Eddy Currents, Coil Resistance)"
    ]
  },
  {
    "driveId": "t5_m20_5_1",
    "week": "T5 M20",
    "weekNum": 20,
    "titleBm": "5.1 Elektron",
    "titleDlp": "5.1 Electrons & Thermionic Emission",
    "form": 5,
    "chapterNum": 5,
    "chapterBm": "Elektronik",
    "chapterDlp": "Electronics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Pancaran Termion",
      "Sinar Katod",
      "Tiub Sinar Katod (OSK)",
      "Tenaga Kinetik Elektron eV = 1/2 mv2"
    ],
    "keyConceptsDlp": [
      "Thermionic Emission",
      "Cathode Rays",
      "Cathode Ray Oscilloscope (CRO)",
      "Electron Kinetic Energy eV = 1/2 mv2"
    ]
  },
  {
    "driveId": "t5_m21_5_2",
    "week": "T5 M21",
    "weekNum": 21,
    "titleBm": "5.2 Diod Semikonduktor",
    "titleDlp": "5.2 Semiconductor Diode",
    "form": 5,
    "chapterNum": 5,
    "chapterBm": "Elektronik",
    "chapterDlp": "Electronics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Semikonduktor Jenis-p & Jenis-n",
      "Diod Semikonduktor",
      "Pincang Depan & Pincang Songsang",
      "Rektifikasi Gelombang Penuh & Separuh"
    ],
    "keyConceptsDlp": [
      "p-type & n-type Semiconductors",
      "Semiconductor Diode",
      "Forward & Reverse Bias",
      "Full-wave & Half-wave Rectification"
    ]
  },
  {
    "driveId": "t5_m22_5_3",
    "week": "T5 M22",
    "weekNum": 22,
    "titleBm": "5.3 Transistor",
    "titleDlp": "5.3 Transistor",
    "form": 5,
    "chapterNum": 5,
    "chapterBm": "Elektronik",
    "chapterDlp": "Electronics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Transistor npn & pnp",
      "Transistor Sebagai Amplifier Arus",
      "Transistor Sebagai Suis Automatik",
      "Perintang Peka Cahaya (LDR) & Termistor"
    ],
    "keyConceptsDlp": [
      "npn & pnp Transistors",
      "Transistor as Current Amplifier",
      "Transistor as Automatic Switch",
      "Light Dependent Resistor (LDR) & Thermistor"
    ]
  },
  {
    "driveId": "t5_m23_6_1a",
    "week": "T5 M23",
    "weekNum": 23,
    "titleBm": "6.1a Reputan Radioaktif",
    "titleDlp": "6.1a Radioactive Decay",
    "form": 5,
    "chapterNum": 6,
    "chapterBm": "Fizik Nuklear",
    "chapterDlp": "Nuclear Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Reputan Alfa (\u03b1)",
      "Reputan Beta (\u03b2)",
      "Reputan Gama (\u03b3)",
      "Persamaan Sinaran Nuklear"
    ],
    "keyConceptsDlp": [
      "Alpha Decay (\u03b1)",
      "Beta Decay (\u03b2)",
      "Gamma Decay (\u03b3)",
      "Nuclear Radiation Equations"
    ]
  },
  {
    "driveId": "t5_m24_6_1b",
    "week": "T5 M24",
    "weekNum": 24,
    "titleBm": "6.1b Reputan Radioaktif & Separuh Hayat",
    "titleDlp": "6.1b Half-life & Decay Curve",
    "form": 5,
    "chapterNum": 6,
    "chapterBm": "Fizik Nuklear",
    "chapterDlp": "Nuclear Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Separuh Hayat T1/2",
      "Lengkung Reputan Radioaktif",
      "Aktiviti Radioaktif",
      "Pengiraan Bilangan Hayat N = No(1/2)^n"
    ],
    "keyConceptsDlp": [
      "Half-life T1/2",
      "Radioactive Decay Curve",
      "Radioactivity",
      "Calculation of Half-life N = No(1/2)^n"
    ]
  },
  {
    "driveId": "t5_m25_6_2a",
    "week": "T5 M25",
    "weekNum": 25,
    "titleBm": "6.2a Tenaga Nuklear",
    "titleDlp": "6.2a Nuclear Energy",
    "form": 5,
    "chapterNum": 6,
    "chapterBm": "Fizik Nuklear",
    "chapterDlp": "Nuclear Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Pembelahan Nukleus",
      "Tindak Balas Berantai",
      "Cacat Jisim m",
      "Persamaan Einstein E = mc2"
    ],
    "keyConceptsDlp": [
      "Nuclear Fission",
      "Chain Reaction",
      "Mass Defect m",
      "Einstein Equation E = mc2"
    ]
  },
  {
    "driveId": "t5_m26_6_2b",
    "week": "T5 M26",
    "weekNum": 26,
    "titleBm": "6.2b Tenaga Nuklear & Pelakuran",
    "titleDlp": "6.2b Nuclear Fusion & Reactor",
    "form": 5,
    "chapterNum": 6,
    "chapterBm": "Fizik Nuklear",
    "chapterDlp": "Nuclear Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Pelakuran Nukleus",
      "Reaktor Nuklear",
      "Rod Kawalan & Moderator",
      "Penjanaan Tenaga Elektrik Nuklear"
    ],
    "keyConceptsDlp": [
      "Nuclear Fusion",
      "Nuclear Reactor",
      "Control Rods & Moderator",
      "Nuclear Electrical Power Generation"
    ]
  },
  {
    "driveId": "t5_m27_7_1a",
    "week": "T5 M27",
    "weekNum": 27,
    "titleBm": "7.1a Teori Kuantum Cahaya",
    "titleDlp": "7.1a Quantum Theory of Light",
    "form": 5,
    "chapterNum": 7,
    "chapterBm": "Fizik Kuantum",
    "chapterDlp": "Quantum Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Jasad Hitam",
      "Kuantum Tenaga",
      "Pemalar Planck h",
      "Tenaga Foton E = hf = hc/\u03bb"
    ],
    "keyConceptsDlp": [
      "Black Body",
      "Quantum of Energy",
      "Planck Constant h",
      "Photon Energy E = hf = hc/\u03bb"
    ]
  },
  {
    "driveId": "t5_m28_7_1b",
    "week": "T5 M28",
    "weekNum": 28,
    "titleBm": "7.1b Teori Kuantum Cahaya",
    "titleDlp": "7.1b Duality of Light & Wave-Particle",
    "form": 5,
    "chapterNum": 7,
    "chapterBm": "Fizik Kuantum",
    "chapterDlp": "Quantum Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Sifat Kedualan Gelombang-Zarah",
      "Hipotesis de Broglie \u03bb = h/p",
      "Mikroskop Elektron"
    ],
    "keyConceptsDlp": [
      "Wave-Particle Duality",
      "de Broglie Hypothesis \u03bb = h/p",
      "Electron Microscope"
    ]
  },
  {
    "driveId": "t5_m29_7_2",
    "week": "T5 M29",
    "weekNum": 29,
    "titleBm": "7.2 Kesan Fotoelektrik",
    "titleDlp": "7.2 Photoelectric Effect",
    "form": 5,
    "chapterNum": 7,
    "chapterBm": "Fizik Kuantum",
    "chapterDlp": "Quantum Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Kesan Fotoelektrik",
      "Frekuensi Ambang fo",
      "Voltan Sekatan Vs",
      "Graf Frekuensi vs Tenaga Kinetik"
    ],
    "keyConceptsDlp": [
      "Photoelectric Effect",
      "Threshold Frequency fo",
      "Stopping Potential Vs",
      "Frequency vs Kinetic Energy Graph"
    ]
  },
  {
    "driveId": "t5_m30_7_3a",
    "week": "T5 M30",
    "weekNum": 30,
    "titleBm": "7.3a Fotoelektrik Einstein",
    "titleDlp": "7.3a Einstein's Photoelectric Equation",
    "form": 5,
    "chapterNum": 7,
    "chapterBm": "Fizik Kuantum",
    "chapterDlp": "Quantum Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Persamaan Fotoelektrik Einstein hf = W + Kmax",
      "Fungsi Kerja W = hfo",
      "Tenaga Kinetik Maksimum Kmax = 1/2 mv2"
    ],
    "keyConceptsDlp": [
      "Einstein Photoelectric Equation hf = W + Kmax",
      "Work Function W = hfo",
      "Maximum Kinetic Energy Kmax = 1/2 mv2"
    ]
  },
  {
    "driveId": "t5_m31_7_3b",
    "week": "T5 M31",
    "weekNum": 31,
    "titleBm": "7.3b Fotoelektrik Einstein & Aplikasi",
    "titleDlp": "7.3b Photoelectric Applications",
    "form": 5,
    "chapterNum": 7,
    "chapterBm": "Fizik Kuantum",
    "chapterDlp": "Quantum Physics",
    "duration": "Akan Datang",
    "isPendingUpload": true,
    "keyConceptsBm": [
      "Sel Fotoelektrik",
      "Pengesan Cahaya & Pintu Automatik",
      "Panel Suria ISS",
      "Aplikasi Silibus SPM"
    ],
    "keyConceptsDlp": [
      "Photoelectric Cell",
      "Light Sensor & Automatic Door",
      "ISS Solar Panels",
      "SPM Syllabus Applications"
    ]
  }
];

const generateLearningPointsBm = (title: string, concepts: string[], form: number) => {
  const points = [
    `Memahami Standard Kandungan DSKP bagi topik ${title}`,
  ];
  
  const match = title.match(/^(\d+\.\d+)/);
  if (match) {
    const key = `F${form}_${match[1]}`;
    const sp = dskpMappings[key];
    if (sp && sp.length > 0) {
      // Add standard pembelajaran points from DSKP
      sp.forEach(p => points.push(p));
      return points; // Return early if DSKP matches
    }
  }

  // Fallback for non-DSKP chapters
  if (concepts.length > 0) {
    points.push(`Menganalisis konsep ${concepts[0]} secara terperinci untuk Kertas 1 & 2`);
  } else {
    points.push(`Menganalisis prinsip asas fizik dan pengaplikasiannya`);
  }
  
  if (concepts.length > 1) {
    points.push(`Menguasai teknik penyelesaian masalah SPM melibatkan ${concepts[1]}`);
  } else {
    points.push(`Melatih teknik menjawab soalan KBAT mengikut format pemarkahan SPM`);
  }

  return points;
};

const generateLearningPointsDlp = (title: string, concepts: string[]) => {
  const points = [
    `Understand the DSKP Content Standard for topic ${title}`,
  ];
  
  if (concepts.length > 0) {
    points.push(`Analyze the concept of ${concepts[0]} in detail for Paper 1 & 2`);
  } else {
    points.push(`Analyze fundamental physics principles and their applications`);
  }
  
  if (concepts.length > 1) {
    points.push(`Master SPM problem-solving techniques involving ${concepts[1]}`);
  } else {
    points.push(`Practice answering HOTS questions according to SPM marking scheme`);
  }

  return points;
};

const getRawId = (obfuscated: string) => {
  try {
    if (typeof atob !== 'undefined') return atob(obfuscated).split('').reverse().join('');
    if (typeof Buffer !== 'undefined') return Buffer.from(obfuscated, 'base64').toString('utf8').split('').reverse().join('');
    return obfuscated;
  } catch (e) {
    return obfuscated;
  }
};

export const form4VideoLessons: VideoLesson[] = rawForm4Videos.map((v, index) => {
  const learningBm = generateLearningPointsBm(v.titleBm, v.keyConceptsBm, 4);
  const learningDlp = generateLearningPointsDlp(v.titleDlp, v.keyConceptsDlp);
  
  return {
    ...v,
    id: v.driveId,
    thumbnailUrl: (v as any).thumbnailUrl || `/thumbnails/${v.driveId}.webp`,
    thumbnailBg: index % 5 === 0 ? "from-purple-900 via-indigo-950 to-slate-900" :
                 index % 5 === 1 ? "from-blue-950 via-slate-900 to-indigo-950" :
                 index % 5 === 2 ? "from-red-950 via-slate-900 to-amber-950" :
                 index % 5 === 3 ? "from-emerald-950 via-teal-900 to-slate-900" :
                                   "from-slate-900 via-purple-950 to-blue-950",
    learningPointsBm: learningBm,
    learningPointsDlp: learningDlp,
    resources: [
      {
        titleBm: `Nota Ringkas - ${v.titleBm}.pdf`,
        titleDlp: `Summary Notes - ${v.titleDlp}.pdf`,
        type: "pdf",
        size: "1.2 MB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      },
      {
        titleBm: `Latihan Pengukuhan SPM - ${v.chapterBm}.docx`,
        titleDlp: `SPM Practice Worksheet - ${v.chapterDlp}.docx`,
        type: "docx",
        size: "850 KB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      },
      {
        titleBm: `Slaid Pembentangan ${v.chapterBm}.pptx`,
        titleDlp: `Presentation Deck ${v.chapterDlp}.pptx`,
        type: "pptx",
        size: "3.4 MB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      }
    ]
  };
});

export const form5VideoLessons: VideoLesson[] = rawForm5Videos.map((v, index) => {
  const learningBm = generateLearningPointsBm(v.titleBm, v.keyConceptsBm, 5);
  const learningDlp = generateLearningPointsDlp(v.titleDlp, v.keyConceptsDlp);

  return {
    ...v,
    id: v.driveId,
    thumbnailBg: index % 5 === 0 ? "from-amber-950 via-red-950 to-slate-900" :
                 index % 5 === 1 ? "from-teal-950 via-emerald-900 to-slate-900" :
                 index % 5 === 2 ? "from-indigo-950 via-purple-900 to-slate-900" :
                 index % 5 === 3 ? "from-blue-950 via-slate-900 to-cyan-950" :
                                   "from-slate-900 via-rose-950 to-purple-950",
    learningPointsBm: learningBm,
    learningPointsDlp: learningDlp,
    resources: [
      {
        titleBm: `Nota Ringkas T5 - ${v.titleBm}.pdf`,
        titleDlp: `F5 Summary Notes - ${v.titleDlp}.pdf`,
        type: "pdf",
        size: "1.4 MB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      },
      {
        titleBm: `Latihan Pengukuhan T5 - ${v.chapterBm}.docx`,
        titleDlp: `F5 SPM Practice Worksheet - ${v.chapterDlp}.docx`,
        type: "docx",
        size: "920 KB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      },
      {
        titleBm: `Slaid Pembentangan T5 ${v.chapterBm}.pptx`,
        titleDlp: `F5 Presentation Deck ${v.chapterDlp}.pptx`,
        type: "pptx",
        size: "3.8 MB",
        url: `https://drive.google.com/file/d/${getRawId(v.driveId)}/view`
      }
    ]
  };
});

export const allVideoLessons: VideoLesson[] = [...form4VideoLessons, ...form5VideoLessons];
