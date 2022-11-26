module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    'no-param-reassign': ['error', {
      props: false,
    }],
  },
};
