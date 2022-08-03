import setWebpackPublicPath from './webpackPublicPath';
import MessageResolver from '../schemas';
import isString from 'lodash-es/isString';

setWebpackPublicPath();

async function test(msg) {
  const EchoRequestV1 = await MessageResolver.resolveCurie('gdbots:pbjx:request:echo-request:v1');
  const request = EchoRequestV1.create().set('msg', msg);

  console.log('raven.test.request2obj', request.toObject());
  self.postMessage(request.toObject());
}

self.postMessage('raven worker started');
self.onmessage = function (event) {
  console.log('raven.onmessage', event, isString(event));
  if (event.data && !event.data.type) {
    test(event.data).catch(console.error);
  }
};

export default self;
