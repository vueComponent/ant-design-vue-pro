import stripAnsi from 'strip-ansi';
import charRegex from 'char-regex';

export default function stringLength(string, {countAnsiEscapeCodes = false} = {}) {
	if (string === '') {
		return 0;
	}

	if (!countAnsiEscapeCodes) {
		string = stripAnsi(string);
	}

	if (string === '') {
		return 0;
	}

	return string.match(charRegex()).length;
}
