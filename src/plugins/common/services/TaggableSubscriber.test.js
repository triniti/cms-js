import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import TaggableV1Mixin from '@gdbots/schemas/gdbots/common/mixin/taggable/TaggableV1Mixin';
import TaggableSubscriber from './TaggableSubscriber';

const subscriber = new TaggableSubscriber();
const taggable = TaggableV1Mixin.findAll()[0];

const mappedTags = [
  { key: 'key1', value: 'value1' },
  { key: 'key2', value: 'value2' },
  { key: 'key3', value: 'value3' },
  { key: 'key4', value: 'value4' },
  { key: 'key5', value: 'value5' },
];

test('TaggableSubscriber onInitForm', (t) => {
  const command = taggable.createMessage();

  mappedTags.forEach(({ key, value }) => command.addToMap('tags', key, value));
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:common:mixin:taggable.init_form'](formEvent);

  const data = formEvent.getData();

  data.tags.forEach(({ key, value }) => t.true(typeof key !== 'undefined' && typeof value !== 'undefined', 'it should have the key and value properties'));

  data.tags.forEach(({ value }, index) => {
    const actual = value;
    const expected = mappedTags[index].value;
    t.equal(actual, expected, 'it should have the correct tag value');
  });

  data.tags.forEach(({ key }, index) => {
    const actual = key;
    const expected = mappedTags[index].key;
    t.equal(actual, expected, 'it should have the correct tag key');
  });

  t.end();
});

test('TaggableSubscriber onValidateForm [invalid]', (t) => {
  const command = taggable.createMessage();
  mappedTags.forEach(({ key, value }) => command.addToMap('tags', key, value));

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['gdbots:common:mixin:taggable.init_form'](formEvent);

  const data = formEvent.getData();
  data.tags = [{ key: 'key1', value: undefined }, { key: 'key2', value: 'love' }]; // intentionally contains illegal(undefined) value
  subscribedEvents['gdbots:common:mixin:taggable.validate_form'](formEvent);

  t.true(formEvent.addError.called, 'it should call addError');

  t.end();
});

test('TaggableSubscriber onValidateForm [valid]', (t) => {
  const command = taggable.createMessage();
  mappedTags.forEach(({ key, value }) => command.addToMap('tags', key, value));

  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();
  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['gdbots:common:mixin:taggable.init_form'](formEvent);

  const data = formEvent.getData();
  data.tags = [{ key: 'key1', value: 'hero' }, { key: 'key2', value: 'love' }];
  subscribedEvents['gdbots:common:mixin:taggable.validate_form'](formEvent);

  t.false(formEvent.addError.called, 'it should not call addError');

  t.end();
});

test('TaggableSubscriber onSubmitForm', (t) => {
  const command = taggable.createMessage();
  mappedTags.forEach(({ key, value }) => command.addToMap('tags', key, value));

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:common:mixin:taggable.init_form'](formEvent);
  subscribedEvents['gdbots:common:mixin:taggable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  Object.entries(node.get('tags') || {}).forEach(([key, value], index) => t.true(mappedTags[index].value === value && mappedTags[index].key === key, 'it should be the same node tag value from the original'));

  t.end();
});
