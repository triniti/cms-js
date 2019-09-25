import test from 'tape';

import FormEvent from '@triniti/app/events/FormEvent';
import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';

import WidgetSubscriber from './WidgetSubscriber';
import { formNames } from '../constants';

const subscriber = new WidgetSubscriber();

const validFieldValues = [
  { header_text: 'stuff' },
  { partner_text: 'other stuff' },
  { partner_url: 'https://www.what.com' },
  { post_render_code: '<p>hi</p>' },
  { pre_render_code: '<p>hello</p>' },
  { title: 'friendly bear' },
  { view_all_text: 'not so friendly bear' },
  { view_all_url: 'https://www.derp.com' },
  { show_border: true },
  { show_header: false },
];

test('Curator:subscriber:widget:onSubmitForm [valid]', (t) => {
  const command = WidgetV1Mixin.findAll()[0].createMessage();

  validFieldValues.forEach((validFieldValue) => {
    command.set(Object.keys(validFieldValue)[0], Object.values(validFieldValue)[0]);
  });

  const formEvent = new FormEvent(command, formNames.WIDGET);

  const subscribedEvents = subscriber.getSubscribedEvents();
  subscribedEvents['triniti:curator:mixin:widget.init_form'](formEvent);
  subscribedEvents['triniti:curator:mixin:widget.submit_form'](formEvent);

  const node = formEvent.getMessage();
  validFieldValues.forEach((validFieldValue) => {
    const key = Object.keys(validFieldValue)[0];
    const value = Object.values(validFieldValue)[0];
    const actual = node.get(key);
    const expected = value;
    t.equal(actual, expected, `it should set ${key} to ${value}`);
  });

  t.end();
});

const invalidFieldValues = [
  { partnerUrl: '' },
  { viewAllUrl: '' },
];

test('Curator:subscriber:widget:onSubmitForm [invalid]', (t) => {
  const command = WidgetV1Mixin.findAll()[0].createMessage();

  invalidFieldValues.forEach((invalidFieldValue) => {
    const formEvent = new FormEvent(command, formNames.WIDGET);
    formEvent.getData = () => invalidFieldValue;
    const subscribedEvents = subscriber.getSubscribedEvents();
    t.doesNotThrow(() => subscribedEvents['triniti:curator:mixin:widget.submit_form'](formEvent));
  });

  t.end();
});
