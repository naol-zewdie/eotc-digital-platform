import {
  EthiopianCalendarDate,
  LiturgicalFeastDefinition,
  EventType,
} from '@eotc/contracts';

export const ETHIOPIAN_MONTHS = [
  { id: 1, am: 'መስከረም', gez: 'መስከረም', en: 'Meskerem', days: 30 },
  { id: 2, am: 'ጥቅምት', gez: 'ጥቅምት', en: 'Tikimt', days: 30 },
  { id: 3, am: 'ኅዳር', gez: 'ኀዳር', en: 'Hidar', days: 30 },
  { id: 4, am: 'ታኅሣሥ', gez: 'ታኅሣሥ', en: 'Tahsas', days: 30 },
  { id: 5, am: 'ጥር', gez: 'ጥር', en: 'Tir', days: 30 },
  { id: 6, am: 'የካቲት', gez: 'የካቲት', en: 'Yakatit', days: 30 },
  { id: 7, am: 'መጋቢት', gez: 'መጋቢት', en: 'Megabit', days: 30 },
  { id: 8, am: 'ሚያዝያ', gez: 'ሚያዝያ', en: 'Miazia', days: 30 },
  { id: 9, am: 'ግንቦት', gez: 'ግንቦት', en: 'Ginbot', days: 30 },
  { id: 10, am: 'ሰኔ', gez: 'ሰኔ', en: 'Sene', days: 30 },
  { id: 11, am: 'ሐምሌ', gez: 'ሐምሌ', en: 'Hamle', days: 30 },
  { id: 12, am: 'ነሐሴ', gez: 'ነሐሴ', en: 'Nehase', days: 30 },
  { id: 13, am: 'ጳጉሜን', gez: 'ጳጒሜን', en: 'Pagume', days: 5 },
];

export const ETHIOPIAN_DAYS_OF_WEEK = [
  { id: 0, am: 'እሑድ', en: 'Sunday' },
  { id: 1, am: 'ሰኞ', en: 'Monday' },
  { id: 2, am: 'ማክሰኞ', en: 'Tuesday' },
  { id: 3, am: 'ረቡዕ', en: 'Wednesday' },
  { id: 4, am: 'ሐሙስ', en: 'Thursday' },
  { id: 5, am: 'ዓርብ', en: 'Friday' },
  { id: 6, am: 'ቅዳሜ', en: 'Saturday' },
];

export const CANONICAL_FEASTS: LiturgicalFeastDefinition[] = [
  {
    id: 'feast-enkutatash',
    nameAm: 'ርእሰ ዐውደ ዓመት (እንቁጣጣሽ) - ቅዱስ ዮሐንስ መጥምቅ',
    nameGez: 'ርእሰ ዐውደ ዓመት ዘቅዱስ ዮሐንስ መጥምቅ',
    nameEn: 'Ethiopian New Year (Enkutatash) & St. John the Baptist',
    ethiopianMonth: 1,
    ethiopianDay: 1,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'የአዲሱ ዓመት መጀመሪያ፤ የዘመነ ማርቆስ/ሉቃስ/ዮሐንስ/ማቴዎስ መለወጫ እና የቅዱስ ዮሐንስ መጥምቅ በዓል።',
    significanceEn: 'Head of the new ecclesiastical year and commemoration of St. John the Forerunner.',
  },
  {
    id: 'feast-meskel',
    nameAm: 'ደመራና በዓለ መስቀል (የክቡር መስቀል መገለጥ)',
    nameGez: 'በዓለ መስቀል ክብረ ቅዱሳን',
    nameEn: 'Finding of the True Cross (Meskel & Demera)',
    ethiopianMonth: 1,
    ethiopianDay: 17,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'ንግሥት ዕሌኒ የጌታችንን መስቀል በእጣን ጢስ ምሪት የቆፈረችበትና የታየበት ታላቅ የኢትዮጵያ በዓል።',
    significanceEn: 'Empress Helena discovering the Life-Giving Cross through divine smoke direction in Jerusalem.',
  },
  {
    id: 'feast-lideta',
    nameAm: 'ልደታ ለማርያም (የእመቤታችን የቅድስት ድንግል ማርያም ልደት)',
    nameGez: 'ልደታ ለእግዝእትነ ማርያም',
    nameEn: 'Nativity of the Blessed Virgin Mary (Lideta)',
    ethiopianMonth: 9,
    ethiopianDay: 1,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'ከኢያቄምና ከሐና የተወለደችበት የንጽሕይተ ንጹሐን የእመቤታችን ልደት።',
    significanceEn: 'The sacred nativity of the Theotokos from righteous Joachim and Anna in Nazareth.',
  },
  {
    id: 'feast-genna',
    nameAm: 'በዓለ ልደት (ገና - የጌታችን የመድኃኔዓለም ልደት)',
    nameGez: 'ልደተ እግዚእነ ኢየሱስ ክርስቶስ',
    nameEn: 'Nativity of Christ (Ethiopian Christmas / Genna)',
    ethiopianMonth: 4,
    ethiopianDay: 29,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'አምላካችን በቤተልሔም በግርግም የተወለደበት የዓለም ድኅነት የተበሰረበት ታላቅ በዓል (በዘመነ ዮሐንስ ታኅሣሥ 28 ይከበራል)።',
    significanceEn: 'The Incarnation and holy Nativity of our Lord and Savior Jesus Christ in Bethlehem.',
  },
  {
    id: 'feast-timkat',
    nameAm: 'በዓለ ጥምቀት (የጌታችን በፈለገ ዮርዳኖስ መጠመቅ)',
    nameGez: 'ጥምቀተ እግዚእነ በፈለገ ዮርዳኖስ',
    nameEn: 'Theophany / Epiphany (Timkat)',
    ethiopianMonth: 5,
    ethiopianDay: 11,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'ጌታችን በመጥምቁ ዮሐንስ እጅ በዮርዳኖስ ወንዝ የተጠመቀበትና ምሥጢረ ሥላሴ የተገለጠበት ዓለም አቀፍ የኢትዮጵያ በዓል።',
    significanceEn: 'The Baptism of the Lord Jesus Christ in the River Jordan and holy revelation of the Holy Trinity.',
  },
  {
    id: 'feast-kana',
    nameAm: 'ቃና ዘገሊላ (የጌታችን የመጀመሪያው ተአምር)',
    nameGez: 'ተአምረ ቃና ዘገሊላ',
    nameEn: 'Miracle of Cana of Galilee',
    ethiopianMonth: 5,
    ethiopianDay: 12,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'ጌታችን ውኃውን ወደ ወይን ጠጅ የለወጠበት የመጀመሪያው ተአምር መታሰቢያ።',
    significanceEn: 'Commemoration of the first public miracle where our Lord turned water into wine at Cana.',
  },
  {
    id: 'feast-debre-tabor',
    nameAm: 'ደብረ ታቦር (ቡሄ - የጌታችን መገለጥ በደብረ ታቦር)',
    nameGez: 'ደብረ ታቦር ክብረ መለኮት',
    nameEn: 'Transfiguration of the Lord (Debre Tabor / Buhe)',
    ethiopianMonth: 12,
    ethiopianDay: 13,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'ጌታችን በታቦር ተራራ መለኮታዊ ክብሩን ለሐዋርያት የገለጠበት በዓል፤ ችቦ የሚበራበትና ሕፃናት የሚዘምሩበት።',
    significanceEn: 'The divine Transfiguration on Mount Tabor revealing the uncreated light of Christ to His apostles.',
  },
  {
    id: 'feast-filseta',
    nameAm: 'ዕርገተ ሥጋሃ ለማርያም (ፍልሰታ - የእመቤታችን ዕርገት)',
    nameGez: 'ዕርገተ ሥጋሃ ለእግዝእትነ ማርያም',
    nameEn: 'Assumption of the Blessed Virgin Mary (Filseta)',
    ethiopianMonth: 12,
    ethiopianDay: 16,
    isMovable: false,
    type: EventType.LITURGICAL_FEAST,
    significanceAm: 'የ16 ቀናት ጾመ ፍልሰታ ፍጻሜ፤ ቅድስት ድንግል ማርያም በክብር ወደ ሰማይ ያረገችበት በዓል።',
    significanceEn: 'Culmination of the 16-day Fast of the Assumption and bodily ascension of the Virgin Mary into heaven.',
  },
  {
    id: 'feast-tewahdo-fast-filseta',
    nameAm: 'ጾመ ፍልሰታ (መጀመሪያ)',
    nameGez: 'ጾመ ፍልሰታ',
    nameEn: 'Fast of the Assumption of the Theotokos (Commencement)',
    ethiopianMonth: 12,
    ethiopianDay: 1,
    isMovable: false,
    type: EventType.FAST_BEGIN,
    fastRelated: true,
    significanceAm: 'በሁሉም ምእመናን የሚጾም የ16 ቀናት የእመቤታችን የፍልሰታ ጾም መጀመሪያ።',
    significanceEn: 'Annual 16-day canonical fast observing contemplation and hymnody to the Holy Theotokos.',
  },
  {
    id: 'feast-tewahdo-fast-tsege',
    nameAm: 'ጾመ ጽጌ (መጀመሪያ)',
    nameGez: 'ጾመ ጽጌ',
    nameEn: 'Fast of Tsige (The Flower / Flight into Egypt)',
    ethiopianMonth: 1,
    ethiopianDay: 26,
    isMovable: false,
    type: EventType.FAST_BEGIN,
    fastRelated: true,
    significanceAm: 'የእመቤታችንና የልጇ የስደታቸው መታሰቢያ የሆነው የ40 ቀናት የጽጌ ጾምና ማኅሌት።',
    significanceEn: 'Monastic and devout fasting season recalling the Flight of the Holy Family into Egypt.',
  },
];

export const MONTHLY_COMMEMORATIONS = [
  { day: 7, nameAm: 'ቅድስት ሥላሴ (Holy Trinity)', nameGez: 'ቅድስት ሥላሴ', nameEn: 'Holy Trinity' },
  { day: 12, nameAm: 'ቅዱስ ሚካኤል (Archangel Michael)', nameGez: 'ቅዱስ ሚካኤል ሊቀ መላእክት', nameEn: 'Archangel Michael' },
  { day: 19, nameAm: 'ቅዱስ ገብርኤል (Archangel Gabriel)', nameGez: 'ቅዱስ ገብርኤል አብሳሪ', nameEn: 'Archangel Gabriel' },
  { day: 21, nameAm: 'እመቤታችን ቅድስት ድንግል ማርያም (Saint Mary)', nameGez: 'እግዝእትነ ማርያም ወላዲተ አምላክ', nameEn: 'Our Lady Saint Mary' },
  { day: 23, nameAm: 'ቅዱስ ጊዮርጊስ (Saint George)', nameGez: 'ቅዱስ ጊዮርጊስ ሰማዕት', nameEn: 'Saint George Megalomartyr' },
  { day: 27, nameAm: 'መድኃኔዓለም (Savior of the World)', nameGez: 'መድኃኔዓለም ኢየሱስ ክርስቶስ', nameEn: 'Medhanealem (Savior of the World)' },
  { day: 29, nameAm: 'በዓለ ወልድ (Incarnation of God the Son)', nameGez: 'በዓለ እግዚእነ ወልድ', nameEn: 'Bale Wold (The Incarnation)' },
];

/**
 * Convert Gregorian date to Ethiopian calendar date
 * Based on historical JDN (Julian Day Number) algorithm
 */
export function gregorianToEthiopian(date: Date = new Date()): EthiopianCalendarDate {
  const gYear = date.getUTCFullYear();
  const gMonth = date.getUTCMonth() + 1;
  const gDay = date.getUTCDate();
  const dayOfWeek = date.getUTCDay();

  // Convert Gregorian date to Julian Day Number (JDN)
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  const jdn =
    gDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Ethiopian Calendar Epoch in Julian Day Number: 1723856 (August 29, 8 CE Julian = Meskerem 1, 1 EE)
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  
  const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  const monthDef = ETHIOPIAN_MONTHS[ethMonth - 1] || ETHIOPIAN_MONTHS[0];
  const dayDef = ETHIOPIAN_DAYS_OF_WEEK[dayOfWeek] || ETHIOPIAN_DAYS_OF_WEEK[0];

  const evangelists = [
    { am: 'ዘመነ ዮሐንስ (John)', en: 'John' },
    { am: 'ዘመነ ማቴዎስ (Matthew)', en: 'Matthew' },
    { am: 'ዘመነ ማርቆስ (Mark)', en: 'Mark' },
    { am: 'ዘመነ ሉቃስ (Luke - Leap Year)', en: 'Luke' },
  ];
  const evangelist = evangelists[ethYear % 4];

  return {
    year: ethYear,
    month: ethMonth,
    monthNameAm: monthDef.am,
    monthNameGez: monthDef.gez,
    monthNameEn: monthDef.en,
    day: ethDay,
    dayOfWeek: dayOfWeek,
    dayNameAm: dayDef.am,
    dayNameEn: dayDef.en,
    seasonAm: evangelist.am,
    seasonEn: evangelist.en,
  };
}

/**
 * Format Ethiopian Date to human readable string
 */
export function formatEthiopianDate(eth: EthiopianCalendarDate, locale: 'am' | 'gez' | 'en' = 'am'): string {
  if (locale === 'en') {
    return `${eth.monthNameEn} ${eth.day}, ${eth.year} E.C. (${eth.dayNameEn})`;
  }
  return `${eth.monthNameAm} ${eth.day} ቀን ${eth.year} ዓ.ም. (${eth.dayNameAm})`;
}
