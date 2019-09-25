import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import HashtaggableV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/hashtaggable/HashtaggableV1Mixin';

import HashtaggableSubscriber from './HashtaggableSubscriber';

const subscriber = new HashtaggableSubscriber();
const hashtags = ['delicate', 'emotional', 'savage', 'stubborn'];

const hashtaggable = HashtaggableV1Mixin.findAll()[0];

test('HashtaggableSubscriber onInitForm', (t) => {
  const command = hashtaggable.createMessage();
  command.addToSet('hashtags', hashtags);
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:taxonomy:mixin:hashtaggable.init_form'](formEvent);

  const data = formEvent.getData();

  let actual = data.hashtags.length;
  let expected = hashtags.length;
  t.equal(actual, expected, 'it should set the correct count for the hashtags field');

  data.hashtags.forEach(({ label, value }) => t.true(typeof label !== 'undefined' && typeof value !== 'undefined', 'it should have the label and value properties'));

  data.hashtags.forEach((hashtag, index) => {
    actual = hashtag.value;
    expected = hashtags[index];
    t.equal(actual, expected, 'it should have the correct hashtag value');
  });

  data.hashtags.forEach((hashtag, index) => {
    actual = hashtag.label;
    expected = `#${hashtags[index]}`;
    t.equal(actual, expected, 'it should have the correct hashtag label');
  });

  t.end();
});

test('HashtaggableSubscriber onValidateForm[invalid hashtags]', (t) => {
  const command = hashtaggable.createMessage();
  const formEvent = new FormEvent(command);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  // some invalid hashtags
  data.hashtags = [{ label: '#123 --- 324234&&&', value: '123 --- 324234&&&' }, { label: '#test', value: 'test' }];

  subscribedEvents['triniti:taxonomy:mixin:hashtaggable.validate_form'](formEvent);

  t.true(formEvent.addError.called, 'it should call addError');

  t.end();
});

test('HashtaggableSubscriber onSubmitForm', (t) => {
  const command = hashtaggable.createMessage();
  command.addToSet('hashtags', hashtags);
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:taxonomy:mixin:hashtaggable.init_form'](formEvent);
  subscribedEvents['triniti:taxonomy:mixin:hashtaggable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  let actual = node.get('hashtags').length;
  let expected = hashtags.length;
  t.equal(actual, expected, 'it should set the correct count for the node\'s hashtags');

  node.get('hashtags').forEach((hashtag, index) => {
    actual = hashtags[index];
    expected = hashtag;
    t.equal(actual, expected, 'it should be the same node ref value from the original');
  });

  t.end();
});
