/* eslint no-param-reassign: off */

module.exports = {
  interpolation(token) {
    const tokens = [token, this.tokenizer.nextToken()];
    const validTypes = ['word', '}'];

    // look for @{ but not @[word]{
    if (tokens[0][1].length > 1 || tokens[1][0] !== '{') {
      this.tokenizer.back(tokens[1]);
      return false;
    }

    token = this.tokenizer.nextToken();
    while (token && validTypes.includes(token[0])) {
      tokens.push(token);
      token = this.tokenizer.nextToken();
    }

    const words = tokens.map((tokn) => tokn[1]);
    const [first] = tokens;
    const last = tokens.pop();
    const newToken = ['word', words.join(''), first[2], last[2]];

    this.tokenizer.back(token);
    this.tokenizer.back(newToken);

    return true;
  }
};
