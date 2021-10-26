import sinon from 'sinon';
import test from 'tape';

import FormEvent from '@triniti/app/events/FormEvent';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import RedirectId from '@triniti/schemas/triniti/sys/RedirectId';
import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';
import VanityUrlableV1Mixin
from '@triniti/schemas/triniti/sys/mixin/vanity-urlable/VanityUrlableV1Mixin';

import VanityUrlableSubscriber from './VanityUrlableSubscriber';

const subscriber = new VanityUrlableSubscriber();
const fakeRedirect = RedirectV1Mixin.findOne().createMessage().set('_id',
  RedirectId.fromUri('/fake/url'));
const vanityurlable = VanityUrlableV1Mixin.findAll()[0];

test('VanityUrlableSubscriber onInitForm', (t) => {
  const command = vanityurlable.createMessage();
  const nodeRef = NodeRef.fromNode(fakeRedirect);
  command.set('redirect_ref', nodeRef);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:sys:mixin:vanity-urlable.init_form'](formEvent);

  t.true(formEvent.getData().redirectRefs[0] === nodeRef, 'the nodeRef should be in the form data');

  t.end();
});

test('VanityUrlableSubscriber onValidateForm', (t) => {
  const command = vanityurlable.createMessage();
  command.set('redirect_ref', NodeRef.fromNode(fakeRedirect));

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:sys:mixin:vanity-urlable.init_form'](formEvent);
  const data = formEvent.getData();
  data.redirectRefs[0] = 1; // bad nodeRef format
  subscribedEvents['triniti:sys:mixin:vanity-urlable.validate_form'](formEvent);

  t.true(formEvent.addError.called, 'it should call addError');
  t.end();
});

test('VanityUrlableSubscriber onSubmitForm', (t) => {
  const command = vanityurlable.createMessage();
  command.set('redirect_ref', NodeRef.fromNode(fakeRedirect));

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:sys:mixin:vanity-urlable.init_form'](formEvent);
  subscribedEvents['triniti:sys:mixin:vanity-urlable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('redirect_ref').toString();
  const expected = NodeRef.fromNode(fakeRedirect).toString();
  t.equal(actual, expected, 'it should be the same node ref value from the original');

  t.end();
});
