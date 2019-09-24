// fixme: use triniti acme schemas once we move to separate repo
/* eslint-disable no-global-assign, no-undef */
API_ENDPOINT = 'http://localhost';
APP_ENV = 'test';

require('ignore-styles');

require('@babel/register')({
  ignore: [/node_modules\/(?!@gdbots|@bachelornation|@triniti|lodash-es)/],
});

require('@bachelornation/schemas');

require.extensions['.svg'] = () => null;

const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('jsdom-global/register');

enzyme.configure({ adapter: new Adapter() });
