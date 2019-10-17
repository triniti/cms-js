global.API_ENDPOINT = 'https://api.acme.com';
global.APP_ENV = 'prod';
global.APP_VENDOR = 'acme';
global.DAM_BASE_URL='https://dam.acme.com/';
global.IMAGE_BASE_URL='https://images.acme.com/';

require('ignore-styles');

require('@babel/register')({
  ignore: [/node_modules\/(?!@gdbots|@triniti|lodash-es)/],
});

require('@triniti/acme-schemas');

require.extensions['.svg'] = () => null;

const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('jsdom-global/register');

enzyme.configure({ adapter: new Adapter() });
