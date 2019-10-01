import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import FlagsetV1Mixin from '@triniti/schemas/triniti/sys/mixin/flagset/FlagsetV1Mixin';
import FlagsetId from '@triniti/schemas/triniti/sys/FlagsetId';

import FlagsetSubscriber from './FlagsetSubscriber';
import { formNames } from '../constants';

const subscriber = new FlagsetSubscriber();

test('FlagsetSubscriber onInitForm', (t) => {
  const command = FlagsetV1Mixin.findOne().createMessage();

  command.set('_id', FlagsetId.fromString('fake-title'));
  command.addToMap('ints', 'key1', 1);
  command.addToMap('ints', 'key2', 2);
  command.addToMap('ints', 'key3', 3);

  command.addToMap('floats', 'key1', 1.056777);
  command.addToMap('floats', 'key2', 2.234);

  command.addToMap('booleans', 'key1', true);
  command.addToMap('booleans', 'key2', false);

  command.addToMap('strings', 'key1', 'key1');
  command.addToMap('strings', 'key2', 'key2');

  command.addToMap('trinaries', 'key1', 0);
  command.addToMap('trinaries', 'key2', 2);
  command.addToMap('trinaries', 'key3', 1);
  command.addToMap('trinaries', 'key4', 1);
  command.addToMap('trinaries', 'key5', 1);

  const formEvent = new FormEvent(command, formNames.FLAGSET);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:sys:mixin:flagset.init_form'](formEvent);

  const data = formEvent.getData();
  t.equal(data.ints.length, 3, 'it should set the correct data count for ints field');
  t.equal(data.floats.length, 2, 'it should set the correct data count for ints field');
  t.equal(data.booleans.length, 2, 'it should set the correct data count for booleans field');
  t.equal(data.strings.length, 2, 'it should set the correct data count for strings field');
  t.equal(data.trinaries.length, 5, 'it should set the correct data count for trinaries field');

  t.end();
});

test('FlagsetSubscriber onValidateForm[invalid title]', (t) => {
  const command = FlagsetV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.FLAGSET);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = null;

  subscribedEvents['triniti:sys:mixin:flagset.validate_form'](formEvent);

  t.equal(formEvent.addError.calledOnce, true, 'it should call addError');

  t.end();
});

test('FlagsetSubscriber onValidateForm[invalid title]', (t) => {
  const command = FlagsetV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.FLAGSET);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = '*********'; // set an invalid title

  subscribedEvents['triniti:sys:mixin:flagset.validate_form'](formEvent);

  t.equal(formEvent.addError.calledOnce, true, 'it should call addError');

  t.end();
});

test('FlagsetSubscriber onSubmitForm', (t) => {
  const command = FlagsetV1Mixin.findOne().createMessage();

  command.set('_id', FlagsetId.fromString('fake-title'));
  command.addToMap('ints', 'key1', 1);
  command.addToMap('ints', 'key2', 2);
  command.addToMap('ints', 'key3', 3);

  command.addToMap('floats', 'key1', 1.056777);
  command.addToMap('floats', 'key2', 2.234);

  command.addToMap('booleans', 'key1', true);
  command.addToMap('booleans', 'key2', false);

  command.addToMap('strings', 'key1', 'key1');
  command.addToMap('strings', 'key2', 'key2');

  command.addToMap('trinaries', 'key1', 0);
  command.addToMap('trinaries', 'key3', 1);
  command.addToMap('trinaries', 'key4', 1);
  command.addToMap('trinaries', 'keyboard', 0);
  const formEvent = new FormEvent(command, formNames.FLAGSET);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:sys:mixin:flagset.init_form'](formEvent);

  subscribedEvents['triniti:sys:mixin:flagset.validate_form'](formEvent);

  const node = formEvent.getMessage();
  t.equal(Object.entries(node.get('ints')).length, 3, 'it should submit the correct node count for ints');
  t.equal(Object.entries(node.get('floats')).length, 2, 'it should submit the correct node count for ints');
  t.equal(Object.entries(node.get('booleans')).length, 2, 'it should submit the correct node count for booleans');
  t.equal(Object.entries(node.get('strings')).length, 2, 'it should submit the correct node count for strings ');
  t.equal(Object.entries(node.get('trinaries')).length, 4, 'it should submit the correct node count for trinaries');

  t.end();
});
