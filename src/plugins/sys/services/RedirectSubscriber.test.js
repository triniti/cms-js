import test from 'tape';
import sinon from 'sinon';

import FormEvent from '@triniti/app/events/FormEvent';
import RedirectV1Mixin from '@triniti/schemas/triniti/sys/mixin/redirect/RedirectV1Mixin';

import RedirectSubscriber from './RedirectSubscriber';
import { formNames } from '../constants';

const subscriber = new RedirectSubscriber();

test('RedirectSubscriber onInitForm', (t) => {
  const command = RedirectV1Mixin.findOne().createMessage();

  command.set('title', '/fake/url');
  command.set('redirect_to', '/fake/url/');
  command.set('is_vanity', true);
  command.set('is_permanent', false);

  const formEvent = new FormEvent(command, formNames.REDIRECT);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:sys:mixin:redirect.init_form'](formEvent);

  const data = formEvent.getData();
  t.equal(data.title, '/fake/url', 'it should set the correct title field');
  t.equal(data.redirectTo, '/fake/url/', 'it should set the correct redirectTo field');
  t.equal(data.isVanity, true, 'it should set the correct isVanity field');
  t.equal(data.isPermanent, false, 'it should set the correct isPermanent field');

  t.end();
});

test('RedirectSubscriber onValidateForm[invalid title and valid redirectTo]', (t) => {
  const command = RedirectV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.REDIRECT);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = null;
  data.redirectTo = 'some/valid/url';

  subscribedEvents['triniti:sys:mixin:redirect.validate_form'](formEvent);

  t.equal(formEvent.addError.calledWith('title', 'Request URI is required.'), true, 'it should call addError with correct arguments');

  t.end();
});

test('RedirectSubscriber onValidateForm[valid title and invalid redirectTo]', (t) => {
  const command = RedirectV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.REDIRECT);
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = '/some/nice/url';

  subscribedEvents['triniti:sys:mixin:redirect.validate_form'](formEvent);

  t.equal(formEvent.addError.calledWith('redirectTo', 'Redirect URI is required.'), true, 'it should call addError with correct arguments');

  t.end();
});

test('RedirectSubscriber onSubmitForm', (t) => {
  const command = RedirectV1Mixin.findOne().createMessage();

  command.set('title', '/fake/url');
  command.set('redirect_to', '/fake/url/test');
  command.set('is_vanity', true);
  command.set('is_permanent', true);
  const formEvent = new FormEvent(command, formNames.REDIRECT);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:sys:mixin:redirect.init_form'](formEvent);

  subscribedEvents['triniti:sys:mixin:redirect.validate_form'](formEvent);

  const node = formEvent.getMessage();
  t.equal(node.get('title'), '/fake/url', 'it should set the correct value for the node\'s title');
  t.equal(node.get('redirect_to'), '/fake/url/test', 'it should set the correct value for the node\'s redirectTo');
  t.equal(node.get('is_vanity'), true, 'it should set the correct value for the node\'s isVanity');
  t.equal(node.get('is_permanent'), true, 'it should set the correct value for the node\'s isPermanent');

  t.end();
});
