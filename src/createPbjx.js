import { serviceIds } from '@gdbots/pbjx/constants.js';
import ContainerAwareServiceLocator from '@gdbots/pbjx/ContainerAwareServiceLocator.js';
import HttpTransport from '@gdbots/pbjx/transports/HttpTransport.js';
import InMemoryTransport from '@gdbots/pbjx/transports/InMemoryTransport.js';
import Pbjx from '@gdbots/pbjx/Pbjx.js';

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
    .setParameter(serviceIds.EVENT_BUS_TRANSPORT, 'in_memory')
    .setParameter(serviceIds.REQUEST_BUS_TRANSPORT, 'http')
    .set(serviceIds.LOCATOR, locator)
    .set(serviceIds.TRANSPORT_HTTP, new HttpTransport(locator, endpoint))
    .set(serviceIds.TRANSPORT_IN_MEMORY, new InMemoryTransport(locator))
    .set(serviceIds.PBJX, pbjx)
    .set(serviceIds.DISPATCHER, app.getDispatcher());

  return pbjx;
};
