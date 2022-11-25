module.exports = blocks => `
const adjust = require('./core');
${blocks}
module.exports = adjust;
`;
