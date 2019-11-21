import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import SluggableV1Mixin from '@gdbots/schemas/gdbots/ncr/mixin/sluggable/SluggableV1Mixin';

import SluggableSubscriber from './SluggableSubscriber';

const fakeFormName = 'Create';
const sluggableForms = {
  [fakeFormName]: true,
};
const subscriber = new SluggableSubscriber(sluggableForms);
const slug = 'nice-article-slug';

const sluggable = SluggableV1Mixin.findAll()[0];
const createMockStore = (formObj) => ({ getState: () => formObj, dispatch: () => {} });

test('SluggableSubscriber onInitForm', (t) => {
  const command = sluggable.createMessage();

  command.set('slug', slug);
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:ncr:mixin:sluggable.init_form'](formEvent);

  const data = formEvent.getData();

  const actual = data.slug;
  const expected = slug;
  t.equal(actual, expected, 'it should set the slug for the slug field');

  t.end();
});

test('SluggableSubscriber @@redux-form/BLUR [valid form]', (t) => {
  const meta = {
    field: 'title',
    form: fakeFormName,
  };
  const payload = 'some-nice-title';
  const mockedStore = createMockStore();

  const mockFilterActionEvent = () => ({ getAction: () => ({ meta, payload }),
    getRedux: () => mockedStore });

  mockedStore.dispatch = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['@@redux-form/BLUR'](mockFilterActionEvent());

  t.true(mockedStore.dispatch.called, 'it should dispatch an action');

  t.end();
});

test('SluggableSubscriber @@redux-form/BLUR [invalid form - empty payload]', (t) => {
  const meta = {
    field: 'title',
    form: fakeFormName,
  };
  const payload = ''; // set an empty payload
  const mockedStore = createMockStore();

  const mockFilterActionEvent = () => ({ getAction: () => ({ meta, payload }),
    getRedux: () => mockedStore });

  mockedStore.dispatch = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['@@redux-form/BLUR'](mockFilterActionEvent());

  t.false(mockedStore.dispatch.called, 'it should not dispatch an action');

  t.end();
});

test('SluggableSubscriber @@redux-form/BLUR [invalid form - no title field]', (t) => {
  const meta = {
    field: 'name',
    form: fakeFormName,
  };
  const payload = 'some-nice-title';
  const mockedStore = createMockStore();

  const mockFilterActionEvent = () => ({ getAction: () => ({ meta, payload }),
    getRedux: () => mockedStore });

  mockedStore.dispatch = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['@@redux-form/BLUR'](mockFilterActionEvent());

  t.false(mockedStore.dispatch.called, 'it should not dispatch an action');

  t.end();
});

test('SluggableSubscriber onSubmitForm', (t) => {
  const command = sluggable.createMessage();

  command.set('slug', slug);
  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['gdbots:ncr:mixin:sluggable.init_form'](formEvent);
  subscribedEvents['gdbots:ncr:mixin:sluggable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  const actual = node.get('slug');
  const expected = slug;
  t.equal(actual, expected, 'it should set the node\'s slug');

  t.end();
});
