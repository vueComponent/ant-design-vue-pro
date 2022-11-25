module.exports = blocks => `
const attr = require('./core');
${blocks}
module.exports = attr;
`;
