import test from 'tape';

import FormEvent from '@triniti/app/events/FormEvent';
import SponsorV1Mixin from '@triniti/schemas/triniti/boost/mixin/sponsor/SponsorV1Mixin';
import SponsorableV1Mixin from '@triniti/schemas/triniti/boost/mixin/sponsorable/SponsorableV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import SponsorableSubscriber from './SponsorableSubscriber';

const subscriber = new SponsorableSubscriber();
const fakesponsor = SponsorV1Mixin.findOne().createMessage().set('title', 'fake-sponsor');
const sponsor = SponsorableV1Mixin.findAll()[0];

test('SponsorableSubscriber onInitForm', (t) => {
  const command = sponsor.createMessage();
  const nodeRef = NodeRef.fromNode(fakesponsor);
  command.set('sponsor_ref', nodeRef);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:boost:mixin:sponsorable.init_form'](formEvent);

  t.true(formEvent.getData().sponsorRefs[0] === nodeRef, 'the nodeRef should be in the form data');

  t.end();
});

test('SponsorableSubscriber onSubmitForm', (t) => {
  const command = sponsor.createMessage();
  command.set('sponsor_ref', NodeRef.fromNode(fakesponsor));

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:boost:mixin:sponsorable.init_form'](formEvent);
  subscribedEvents['triniti:boost:mixin:sponsorable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('sponsor_ref').toString();
  const expected = NodeRef.fromNode(fakesponsor).toString();
  t.equal(actual, expected, 'it should be the same node ref value from the original');

  t.end();
});
