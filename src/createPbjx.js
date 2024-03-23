import { serviceIds } from '@gdbots/pbjx/constants';
import ContainerAwareServiceLocator from '@gdbots/pbjx/ContainerAwareServiceLocator';
import HttpTransport from '@gdbots/pbjx/transports/HttpTransport';
import Pbjx from '@gdbots/pbjx/Pbjx';

/**
 * @param {App} app
 *
 * @returns {Pbjx}
 */
export default async (app) => {
  const locator = new ContainerAwareServiceLocator(app);
  const pbjx = new Pbjx(locator);
  const endpoint = app.getParameter('pbjx_endpoint');

  app
    .setParameter(serviceIds.TRANSPORT_HTTP_ENDPOINT, endpoint)
    .setParameter(serviceIds.COMMAND_BUS_TRANSPORT, 'http')
//    .setParameter(serviceIds.EVENT_BUS_TRANSPORT, 'in_memory') // This is causing issues with Raven publishing events
    .setParameter(serviceIds.REQUEST_BUS_TRANSPORT, 'http')
    .set(serviceIds.LOCATOR, locator)
    .set(serviceIds.TRANSPORT_HTTP, new HttpTransport(locator, endpoint))
    .set(serviceIds.PBJX, pbjx)
    .set(serviceIds.DISPATCHER, app.getDispatcher());

  return pbjx;
};
