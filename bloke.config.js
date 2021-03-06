const path = require('path');

module.exports = {
  domain: 'blog.davidkk.com',
  root   : path.join(__dirname, './'),
  src    : './posts',
  output : './blog',
  ignore : [/node_modules/],
  theme  : {
    use    : 'bloke-theme-sharp',
    config : {
    },
  },
};
