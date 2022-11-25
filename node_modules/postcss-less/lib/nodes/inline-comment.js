/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */

const tokenizer = require('postcss/lib/tokenize');
const Input = require('postcss/lib/input');

module.exports = {
  isInlineComment(token) {
    if (token[0] === 'word' && token[1].slice(0, 2) === '//') {
      const first = token;
      const bits = [];
      let endOffset;
      let remainingInput;

      while (token) {
        if (/\r?\n/.test(token[1])) {
          // If there are quotes, fix tokenizer creating one token from start quote to end quote
          if (/['"].*\r?\n/.test(token[1])) {
            // Add string before newline to inline comment token
            bits.push(token[1].substring(0, token[1].indexOf('\n')));

            // Get remaining input and retokenize
            remainingInput = token[1].substring(token[1].indexOf('\n'));
            const untokenizedRemainingInput = this.input.css
              .valueOf()
              .substring(this.tokenizer.position());
            remainingInput += untokenizedRemainingInput;

            endOffset = token[3] + untokenizedRemainingInput.length - remainingInput.length;
          } else {
            // If the tokenizer went to the next line go back
            this.tokenizer.back(token);
          }
          break;
        }

        bits.push(token[1]);
        // eslint-disable-next-line prefer-destructuring
        endOffset = token[2];
        token = this.tokenizer.nextToken({ ignoreUnclosed: true });
      }

      const newToken = ['comment', bits.join(''), first[2], endOffset];
      this.inlineComment(newToken);

      // Replace tokenizer to retokenize the rest of the string
      // we need replace it after we added new token with inline comment because token position is calculated for old input (#145)
      if (remainingInput) {
        this.input = new Input(remainingInput);
        this.tokenizer = tokenizer(this.input);
      }

      return true;
    } else if (token[1] === '/') {
      // issue #135
      const next = this.tokenizer.nextToken({ ignoreUnclosed: true });

      if (next[0] === 'comment' && /^\/\*/.test(next[1])) {
        next[0] = 'word';
        next[1] = next[1].slice(1);
        token[1] = '//';
        this.tokenizer.back(next);
        return module.exports.isInlineComment.bind(this)(token);
      }
    }

    return false;
  }
};
