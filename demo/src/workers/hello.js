import setWebpackPublicPath from './webpackPublicPath';
import MessageResolver from '../schemas';

setWebpackPublicPath();

async function test(msg) {
  const EchoRequestV1 = await MessageResolver.resolveCurie('gdbots:pbjx:request:echo-request:v1');
  const request = EchoRequestV1.create().set('msg', msg);

  console.log('hello.test.request2obj', request.toObject());
  self.postMessage(request.toObject());
}

self.postMessage('hello worker started');
self.onmessage = function (event) {
  console.log('hello.onmessage', event);
  if (event.data && !event.data.type) {
    test(event.data).catch(console.error);
  }
};

export default self;
