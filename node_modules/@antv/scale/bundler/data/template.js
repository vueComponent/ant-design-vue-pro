module.exports = blocks => `
const scale = require('./core');
${blocks}
module.exports = scale;
`;
