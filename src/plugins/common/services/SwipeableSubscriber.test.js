import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import SwipeableV1Mixin from '@triniti/schemas/triniti/common/mixin/swipeable/SwipeableV1Mixin';
import SwipeableSubscriber from './SwipeableSubscriber';

const subscriber = new SwipeableSubscriber();
const swipeable = SwipeableV1Mixin.findAll()[0];
const mockedSwipeValue = 'NSFW';

test('SwipeableSubscriber onInitForm', (t) => {
  const command = swipeable.createMessage();
  command.set('swipe', mockedSwipeValue);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:common:mixin:swipeable.init_form'](formEvent);

  const data = formEvent.getData();

  const actual = data.swipe;
  const expected = { label: mockedSwipeValue, value: mockedSwipeValue };
  t.deepEqual(actual, expected, 'it should have the correct data swipe value');

  t.end();
});

test('SwipeableSubscriber onValidateForm', (t) => {
  const command = swipeable.createMessage();
  command.set('swipe', mockedSwipeValue);

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:common:mixin:swipeable.init_form'](formEvent);

  const data = formEvent.getData();
  data.swipe = { label: 'invalid swipe', value: 12222 }; // intentionally enter a number
  subscribedEvents['triniti:common:mixin:swipeable.validate_form'](formEvent);

  t.true(formEvent.addError.called, 'it should call addError');

  t.end();
});

test('SwipeableSubscriber onSubmitForm', (t) => {
  const command = swipeable.createMessage();
  command.set('swipe', mockedSwipeValue);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:common:mixin:swipeable.init_form'](formEvent);
  subscribedEvents['triniti:common:mixin:swipeable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('swipe');
  const expected = mockedSwipeValue;
  t.equal(actual, expected, 'it should have the correct node swipe value');

  t.end();
});
