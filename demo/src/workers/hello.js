import setWebpackPublicPath from './webpackPublicPath.js';
import MessageResolver from '../schemas.js';

const init = async () => {
  setWebpackPublicPath();

  async function test(msg) {
    const EchoRequestV1 = await MessageResolver.resolveCurie('gdbots:pbjx:request:echo-request:v1');
    const request = EchoRequestV1.create().set('msg', msg);

    console.log('hello.test.request2obj', request.toObject());
    self.postMessage(request.toObject());
  }

  self.postMessage('hello worker started');
  self.onmessage = function (event) {
    console.log('hello.onmessage', event.data);
    if (event.data && !event.data.type) {
      test(JSON.stringify(event.data).substring(0, 250)).catch(console.error);
    }
  };
};

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  init().then().catch(console.error);
}

export default self;
