import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import ThemeableV1Mixin from '@triniti/schemas/triniti/common/mixin/themeable/ThemeableV1Mixin';
import ThemeableSubscriber from './ThemeableSubscriber';

const subscriber = new ThemeableSubscriber();
const themeable = ThemeableV1Mixin.findAll()[0];
const mockedThemeValue = 'darkight';

test('ThemeableSubscriber onInitForm', (t) => {
  const command = themeable.createMessage();
  command.set('theme', mockedThemeValue);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:common:mixin:themeable.init_form'](formEvent);

  const data = formEvent.getData();

  const actual = data.theme;
  const expected = { label: mockedThemeValue, value: mockedThemeValue };
  t.deepEqual(actual, expected, 'it should have the correct data theme value');

  t.end();
});

test('ThemeableSubscriber onValidateForm [invalid type]', (t) => {
  const command = themeable.createMessage();
  command.set('theme', mockedThemeValue);

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:common:mixin:themeable.init_form'](formEvent);

  const data = formEvent.getData();
  data.theme = { label: 'invalid swipe', value: 'asd@#!$#asdf' }; // intentionally enter an invalid swipe
  subscribedEvents['triniti:common:mixin:themeable.validate_form'](formEvent);

  t.true(formEvent.addError.called, 'it should call addError');

  t.end();
});

test('ThemeableSubscriber onValidateForm [valid type]', (t) => {
  const command = themeable.createMessage();
  command.set('theme', mockedThemeValue);

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:common:mixin:themeable.init_form'](formEvent);

  const data = formEvent.getData();
  data.theme = 'magic'; // update theme as if in the form
  subscribedEvents['triniti:common:mixin:themeable.validate_form'](formEvent);

  t.false(formEvent.addError.called, 'it should not call addError');

  t.end();
});

test('ThemeableSubscriber onSubmitForm', (t) => {
  const command = themeable.createMessage();
  command.set('theme', mockedThemeValue);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:common:mixin:themeable.init_form'](formEvent);
  subscribedEvents['triniti:common:mixin:themeable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('theme');
  const expected = mockedThemeValue;
  t.equal(actual, expected, 'it should have the correct node theme value');

  t.end();
});
