import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';

export default class PersonTeaserSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values.
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    data.targetRefs = [];
    if (node.has('target_ref')) {
      data.targetRefs.push(node.get('target_ref'));
    }
  }

  /**
   * Binds data from the redux form to the command.
   * This occurs AFTER a form has been submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const node = formEvent.getMessage();
    const { isCreateForm, target } = formEvent.getProps();

    if (node.isFrozen()) {
      return;
    }

    if (isCreateForm && target) {
      node
        .set('target_ref', NodeRef.fromNode(target))
        .set('image_ref', target.get('image_ref'))
        .set('title', target.get('title'));

      if (target.has('description')) {
        node.set('description', target.get('description'));
      } else if (target.has('blocks')) {
        const firstTextBlock = target.get('blocks')
          .find((block) => block.schema() === TextBlockV1Mixin.findOne());
        if (firstTextBlock) {
          node.set(
            'description',
            firstTextBlock.get('text')
              .replace(/(<span.+?>|<a.+?>|<\/?(a|p|ul|ol|span|strong|em|del|u)>)/g, '')
              .replace(/(<br>|<\/li><li>)/g, ' '),
          );
        }
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:person-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:person-teaser.submit_form': this.onSubmitForm,
    };
  }
}
