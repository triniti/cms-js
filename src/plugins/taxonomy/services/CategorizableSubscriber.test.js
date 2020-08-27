import test from 'tape';

import FormEvent from '@triniti/app/events/FormEvent';
import Category from '@triniti/schemas/triniti/taxonomy/mixin/category/CategoryV1Mixin';
import CategorizableV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/categorizable/CategorizableV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import CategorizableSubscriber from './CategorizableSubscriber';

const subscriber = new CategorizableSubscriber();
const category1 = Category.findOne().createMessage().set('title', 'category1');
const category2 = Category.findOne().createMessage().set('title', 'category2');
const category3 = Category.findOne().createMessage().set('title', 'category3');
const categories = [category1, category2, category3];
const categorizable = CategorizableV1Mixin.findAll()[0];

test('CategorizableSubscriber onInitForm', (t) => {
  const command = categorizable.createMessage();

  const categoryRefs = categories.map((category) => NodeRef.fromNode(category));
  command.addToSet('category_refs', categoryRefs);

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:taxonomy:mixin:categorizable.init_form'](formEvent);

  const data = formEvent.getData();

  const actual = data.categoryRefs.length;
  const expected = categories.length;
  t.equal(actual, expected, 'it should set the correct count for the categories field');

  for (let i = 0; i < data.categoryRefs.length; i += 1) {
    t.true(data.categoryRefs[i] === categoryRefs[i], 'the nodeRef should be in the form data');
  }

  t.end();
});

test('CategorizableSubscriber onSubmitForm', (t) => {
  const command = categorizable.createMessage();
  command.addToSet('category_refs', categories.map((category) => NodeRef.fromNode(category)));

  const formEvent = new FormEvent(command);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:taxonomy:mixin:categorizable.init_form'](formEvent);
  subscribedEvents['triniti:taxonomy:mixin:categorizable.submit_form'](formEvent);

  const node = formEvent.getMessage();

  let actual = node.get('category_refs').length;
  let expected = categories.length;
  t.equal(actual, expected, 'it should set the correct count for the node\'s category_refs');

  node.get('category_refs').forEach((categoryRef, index) => {
    actual = categoryRef.toString();
    expected = NodeRef.fromNode(categories[index]).toString();
    t.equal(actual, expected, 'it should be the same node ref value from the original');
  });

  t.end();
});
