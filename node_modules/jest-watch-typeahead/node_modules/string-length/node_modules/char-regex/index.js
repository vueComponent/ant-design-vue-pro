// Based on https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/.internal/unicodeSize.js

export default function charRegex() {
	// Unicode character classes
	const astralRange = '\\ud800-\\udfff';
	const comboMarksRange = '\\u0300-\\u036f';
	const comboHalfMarksRange = '\\ufe20-\\ufe2f';
	const comboSymbolsRange = '\\u20d0-\\u20ff';
	const comboMarksExtendedRange = '\\u1ab0-\\u1aff';
	const comboMarksSupplementRange = '\\u1dc0-\\u1dff';
	const comboRange = comboMarksRange + comboHalfMarksRange + comboSymbolsRange + comboMarksExtendedRange + comboMarksSupplementRange;
	const varRange = '\\ufe0e\\ufe0f';

	// Telugu characters
	const teluguVowels = '\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c14\\u0c60-\\u0c61';
	const teluguVowelsDiacritic = '\\u0c3e-\\u0c44\\u0c46-\\u0c48\\u0c4a-\\u0c4c\\u0c62-\\u0c63';
	const teluguConsonants = '\\u0c15-\\u0c28\\u0c2a-\\u0c39';
	const teluguConsonantsRare = '\\u0c58-\\u0c5a';
	const teluguModifiers = '\\u0c01-\\u0c03\\u0c4d\\u0c55\\u0c56';
	const teluguNumerals = '\\u0c66-\\u0c6f\\u0c78-\\u0c7e';
	const teluguSingle = `[${teluguVowels}(?:${teluguConsonants}(?!\\u0c4d))${teluguNumerals}${teluguConsonantsRare}]`;
	const teluguDouble = `[${teluguConsonants}${teluguConsonantsRare}][${teluguVowelsDiacritic}]|[${teluguConsonants}${teluguConsonantsRare}][${teluguModifiers}`;
	const teluguTriple = `[${teluguConsonants}]\\u0c4d[${teluguConsonants}]`;
	const telugu = `(?:${teluguTriple}|${teluguDouble}|${teluguSingle})`;

	// Unicode capture groups
	const astral = `[${astralRange}]`;
	const combo = `[${comboRange}]`;
	const fitz = '\\ud83c[\\udffb-\\udfff]';
	const modifier = `(?:${combo}|${fitz})`;
	const nonAstral = `[^${astralRange}]`;
	const regional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
	const surrogatePair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
	const zeroWidthJoiner = '\\u200d';
	const blackFlag = '(?:\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40(?:\\udc65|\\udc73|\\udc77)\\udb40(?:\\udc6e|\\udc63|\\udc6c)\\udb40(?:\\udc67|\\udc74|\\udc73)\\udb40\\udc7f)';

	// Unicode regexes
	const optModifier = `${modifier}?`;
	const optVar = `[${varRange}]?`;
	const optJoin = `(?:${zeroWidthJoiner}(?:${[nonAstral, regional, surrogatePair].join('|')})${optVar + optModifier})*`;
	const seq = optVar + optModifier + optJoin;
	const nonAstralCombo = `${nonAstral}${combo}?`;
	const symbol = `(?:${[blackFlag, nonAstralCombo, combo, regional, surrogatePair, astral].join('|')})`;

	// Match string symbols (https://mathiasbynens.be/notes/javascript-unicode)
	return new RegExp(`${fitz}(?=${fitz})|${telugu}|${symbol + seq}`, 'g');
}
