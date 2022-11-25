import dsv from "./dsv";

var tsv = dsv("\t");

export var tsvParse = tsv.parse;
export var tsvParseRows = tsv.parseRows;
export var tsvFormat = tsv.format;
export var tsvFormatRows = tsv.formatRows;
