require('ignore-styles');

require('@babel/register')({
  ignore: [/node_modules\/(?!@gdbots|@triniti|lodash-es)/],
});

require.extensions['.svg'] = () => null;

const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('jsdom-global/register');

enzyme.configure({ adapter: new Adapter() });
