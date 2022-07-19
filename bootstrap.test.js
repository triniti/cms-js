global.API_ENDPOINT = 'https://api.acme.com';
global.APP_ENV = 'prod';
global.APP_VENDOR = 'acme';
global.DAM_BASE_URL = 'https://dam.acme.com/';
global.IMAGE_BASE_URL = 'https://images.acme.com/';
global.VIDEO_ASSET_BASE_URL = 'https://ovp.acme.com/';

require('ignore-styles');

require('@babel/register')({
  ignore: [/node_modules\/(?!@gdbots|@triniti|lodash-es)/],
});

// require('@triniti/acme-schemas');

require.extensions['.svg'] = () => null;

/*
cancelAnimationFrame = global.requestAnimationFrame = window.cancelAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};
*/
