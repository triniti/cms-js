import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import PersonSubscriber from './PersonSubscriber';
import { formNames } from '../constants';

const subscriber = new PersonSubscriber();
const {
  PUBLISHED,
  DELETED,
} = NodeStatus;
const assetSchemas = AssetV1Mixin.findAll();
const imageAssetSchema = assetSchemas[4];

const imageNode = imageAssetSchema
  .createMessage()
  .set('title', 'fake-image')
  .set('_id', AssetId.fromString('image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502'))
  .set('mime_type', 'image/jpeg');

test('PersonSubscriber onInitForm', (t) => {
  const person = PersonV1Mixin.findOne().createMessage();

  person.set('title', 'fake-title')
    .set('status', PUBLISHED)
    .set('image_ref', NodeRef.fromNode(imageNode))
    .set('bio', 'some bayou')
    .set('bio_source', 'bachelornation')
    .set('imdb_url', 'https://www.abc.com/a/b/vc')
    .set('twitter_username', 'twitter_test')
    .set('is_celebrity', true);

  const formEvent = new FormEvent(person, formNames.PERSON);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:people:mixin:person.init_form'](formEvent);

  const data = formEvent.getData();
  t.equal(data.title, 'fake-title', 'it should set the correct value for title field');
  t.equal(data.status, PUBLISHED, 'it should set the correct value for status field');
  t.equal(data.imageRef.toString(), 'bachelornation:image-asset:image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502', 'it should set the correct value for image_ref field');
  t.equal(data.bio, 'some bayou', 'it should set the correct value for bio field');
  t.equal(data.bioSource, 'bachelornation', 'it should set the correct value for bioSource field');
  t.equal(data.imdbUrl, 'https://www.abc.com/a/b/vc', 'it should set the correct value for imdbUrl field');
  t.equal(data.twitterUsername, 'twitter_test', 'it should set the correct value for twitterUsername field');
  t.true(data.isCelebrity, 'it should set the correct value for isCelebrity field');

  t.end();
});

test('PersonSubscriber onValidateForm[invalid title]', (t) => {
  const command = PersonV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.PERSON);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:people:mixin:person.validate_form'](formEvent);

  t.true(formEvent.addError.calledOnce, 'it should call addError');

  t.end();
});

test('PersonSubscriber onValidateForm[valid imdb_url]', (t) => {
  const command = PersonV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.PERSON);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = 'test';
  data.imdbUrl = 'https://www.imdb.com/a/001';
  subscribedEvents['triniti:people:mixin:person.validate_form'](formEvent);

  t.true(formEvent.addError.notCalled, 'it should not addError');

  t.end();
});

test('PersonSubscriber onValidateForm[invalid imdb_url]', (t) => {
  const command = PersonV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.PERSON);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = 'test';
  data.imdbUrl = 'http://invalid';
  subscribedEvents['triniti:people:mixin:person.validate_form'](formEvent);

  t.true(formEvent.addError.calledOnce, 'it should call addError');

  t.end();
});

test('PersonSubscriber onValidateForm[valid twitter username]', (t) => {
  const command = PersonV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.PERSON);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = 'test';
  data.twitterUsername = 'example';
  subscribedEvents['triniti:people:mixin:person.validate_form'](formEvent);

  t.true(formEvent.addError.notCalled, 'it should not addError');

  t.end();
});

test('PersonSubscriber onValidateForm[valid twitter username]', (t) => {
  const command = PersonV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.PERSON);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = 'test';
  data.twitterUsername = '@example';
  subscribedEvents['triniti:people:mixin:person.validate_form'](formEvent);

  t.true(formEvent.addError.calledOnce, 'it should call addError');

  t.end();
});

test('PersonSubscriber onSubmitForm', (t) => {
  const person = PersonV1Mixin.findOne().createMessage();

  person
    .set('title', 'fake-title')
    .set('status', DELETED)
    .set('image_ref', NodeRef.fromNode(imageNode))
    .set('bio', 'some bayou')
    .set('bio_source', 'bachelornation')
    .set('imdb_url', 'www.abc.com')
    .set('twitter_username', 'twitter_test')
    .set('is_celebrity', true);

  const formEvent = new FormEvent(person, formNames.PERSON);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:people:mixin:person.init_form'](formEvent);
  subscribedEvents['triniti:people:mixin:person.submit_form'](formEvent);

  const node = formEvent.getMessage();
  t.equal(node.get('title'), 'fake-title', 'it should set the correct title value');
  t.equal(node.get('status'), DELETED, 'it should set the correct status value');
  t.equal(node.get('image_ref').toString(), 'bachelornation:image-asset:image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502', 'it should set the correct image_ref value');
  t.equal(node.get('bio'), 'some bayou', 'it should set the correct value bio value');
  t.equal(node.get('bio_source'), 'bachelornation', 'it should set the correct bio_source value');
  t.equal(node.get('imdb_url'), 'www.abc.com', 'it should set the correct imdb_url value');
  t.equal(node.get('twitter_username'), 'twitter_test', 'it should set the correct twitter_username value');
  t.true(node.get('is_celebrity'), 'it should set the correct is_celebrity value');

  t.end();
});
