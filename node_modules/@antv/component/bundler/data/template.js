module.exports = blocks => `
const component = require('./core');
${blocks}
module.exports = component;
`;
