
export enum Modifiers {
    LENGTH = "length",
    UNSIGNED = "unsigned",
    ZEROFILL = "zerofill",
    AUTO_INCREMENT = "auto_increment",
    PRECISION = "precision",
    SCALE = "scale", 
    CHARSET = "charset",
    COLLATE = "collate",
    VALUES = "values" ,  
}

export enum MySQLCharset {
  Utf8mb4 = 'utf8mb4',
  Utf8mb3 = 'utf8mb3',
  Latin1 = 'latin1',
  Ascii = 'ascii',
  Binary = 'binary',
  Ucs2 = 'ucs2',
  Utf16 = 'utf16',
  Utf32 = 'utf32',
  Big5 = 'big5',
  Gb2312 = 'gb2312',
  Gbk = 'gbk',
  Sjis = 'sjis',
  Euckr = 'euckr',
}

export enum MySQLCollation {
  Utf8mb4GeneralCi = 'utf8mb4_general_ci',
  Utf8mb4UnicodeCi = 'utf8mb4_unicode_ci',
  Utf8mb4Bin = 'utf8mb4_bin',
  Utf8mb40900AiCi = 'utf8mb4_0900_ai_ci',
  Latin1SwedishCi = 'latin1_swedish_ci',
  Latin1GeneralCi = 'latin1_general_ci',
  AsciiGeneralCi = 'ascii_general_ci',
  Binary = 'binary',
}


export enum PostgreSQLCharset {
  Utf8 = 'UTF8',
  Latin1 = 'LATIN1',
  Latin9 = 'LATIN9',
  Win1250 = 'WIN1250',
  Win1252 = 'WIN1252',
  SqlAscii = 'SQL_ASCII',
  EUCJp = 'EUC_JP',
  EUCKr = 'EUC_KR',
  MULEInternal = 'MULE_INTERNAL',
  SJIS = 'SJIS',
}

export enum PostgreSQLCollation {
  EnUsUtf8 = 'en_US.UTF-8',
  C = 'C',
  Posix = 'POSIX',
  DeDe = 'de_DE.UTF-8',
  FrFr = 'fr_FR.UTF-8',
  JaJp = 'ja_JP.UTF-8',
  CustomICU = 'und-x-icu', // ICU-based collation example
}


export enum SQLiteCharset {
  Utf8 = 'UTF-8',
  Utf16le = 'UTF-16le',
  Utf16be = 'UTF-16be',
}

export enum SQLiteCollation {
  Binary = 'BINARY',
  NoCase = 'NOCASE',
  RTrim = 'RTRIM',
}