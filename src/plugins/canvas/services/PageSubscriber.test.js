import test from 'tape';

import FormEvent from '@triniti/app/events/FormEvent';
import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';

import PageSubscriber from './PageSubscriber';
import { formNames } from '../constants';

const layouts = [
  {
    label: 'Content Only (no NAV, header or footer)',
    value: 'content-only',
  },
];

const subscriber = new PageSubscriber(layouts);

test('PageSubscriber onInitForm', (t) => {
  const command = PageV1Mixin.findOne().createMessage();

  command.set('title', 'fake-title');
  command.set('layout', 'content-only');

  const formEvent = new FormEvent(command, formNames.PAGE);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:canvas:mixin:page.init_form'](formEvent);

  const data = formEvent.getData();
  t.equal(data.title, 'fake-title', 'it should set the correct value for title field');
  t.equal(data.layout.value, layouts[0].value, 'it should set the correct value for layout field');

  t.end();
});

test('PageSubscriber onSubmitForm', (t) => {
  const command = PageV1Mixin.findOne().createMessage();

  command.set('title', 'fake-title');
  command.set('layout', 'content-only');

  const formEvent = new FormEvent(command, formNames.PERSON);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:canvas:mixin:page.init_form'](formEvent);

  subscribedEvents['triniti:canvas:mixin:page.submit_form'](formEvent);

  const node = formEvent.getMessage();
  t.equal(node.get('title'), 'fake-title', 'it should set the correct title value');
  t.equal(node.get('layout'), layouts[0].value, 'it should set the correct layout value');

  t.end();
});
