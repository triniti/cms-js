import HttpTransportFailed from '@gdbots/pbjx/exceptions/HttpTransportFailed';
import RequestHandlingFailed from '@gdbots/pbjx/exceptions/RequestHandlingFailed';
// import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';

export default (exception) => {
  if (!exception.constructor) {
    return exception.message || exception;
  }

  //let code = Code.UNKNOWN.getValue();
  //let name = '';
  let message = exception.message || 'A server error occurred';

  if (exception instanceof HttpTransportFailed) {
    const envelope = exception.getEnvelope();
    //code = envelope.get('code', 2);
    //name = envelope.get('error_name');
    message = envelope.get('error_message');
  } else if (exception instanceof RequestHandlingFailed) {
    const response = exception.getResponse();
    //name = response.get('error_name');
    //code = response.get('error_code', 2);
    message = response.get('error_message');
  }

  if (message.indexOf('HttpTransport failed to handle') === 0) {
    message = message.split('.')[1].trim();
  }

  // todo: can use Code enum to make a really concise error if desired.
  return message;
};
