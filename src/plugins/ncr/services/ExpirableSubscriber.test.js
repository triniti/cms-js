import test from 'tape';
import moment from 'moment';

import FormEvent from '@triniti/app/events/FormEvent';
import ExpirableV1Mixin from '@gdbots/schemas/gdbots/ncr/mixin/expirable/ExpirableV1Mixin';

import ExpirableSubscriber from './ExpirableSubscriber';

const subscriber = new ExpirableSubscriber();
const expirable = ExpirableV1Mixin.findAll()[0];

test('ExpirableSubscriber onInitForm', (t) => {
  const command = expirable.createMessage();

  const expiryDate = moment().add(5, 'days'); // set an expiration date 5 days from now

  command.set('expires_at', expiryDate.toDate());

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:ncr:mixin:expirable.init_form'](formEvent);

  const data = formEvent.getData();

  let actual = moment(data.expiresAt).format('YYYY-MM-DD');
  let expected = expiryDate.format('YYYY-MM-DD');
  t.equal(actual, expected, 'it should set the correct value of date');

  actual = moment(data.expiresAt).format('hh:mm a');
  expected = expiryDate.format('hh:mm a');
  t.equal(actual, expected, 'it should set the correct value of time');

  t.end();
});

test('ExpirableSubscriber onSubmitForm', (t) => {
  const command = expirable.createMessage();
  const expiryDate = moment().add(7, 'days'); // set an expiration date 7 days from now

  command.set('expires_at', expiryDate.toDate());
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:ncr:mixin:expirable.init_form'](formEvent);
  subscribedEvents['gdbots:ncr:mixin:expirable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('expires_at').getTime();
  const expected = expiryDate.toDate().getTime();
  t.equal(actual, expected, 'it should set the node\'s expires_at property value');

  t.end();
});
