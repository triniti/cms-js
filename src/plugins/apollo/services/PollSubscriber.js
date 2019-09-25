import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import isValidUrl from '@gdbots/common/isValidUrl';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PollAnswerV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll-answer/PollAnswerV1Mixin';
import UuidIdentifier from '@gdbots/pbj/well-known/UuidIdentifier';

export default class PollSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
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

    ['title', 'allow_multiple_responses', 'question', 'question_url'].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;

    data.answers = node.get('answers', []).map((answer) => ({
      _id: answer.get('_id').toString(),
      initialVotes: answer.get('initial_votes'),
      title: answer.get('title'),
      url: answer.get('url'),
    }));
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    ['title', 'question'].forEach((fieldName) => {
      if (!data[fieldName]) {
        formEvent.addError(fieldName, `${fieldName} is required`);
      } else {
        try {
          node.set(fieldName, data[fieldName]);
        } catch (e) {
          formEvent.addError(fieldName, e.message);
        }
      }
    });

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (!formEvent.getProps().isCreateForm) {
      node.set('allow_multiple_responses', data.allowMultipleResponses);

      if (data.questionUrl) {
        try {
          node.set('question_url', data.questionUrl);
        } catch (e) {
          formEvent.addError('questionUrl', 'invalid question url');
        }
      }

      if (data.answers && data.answers.length > 0) {
        const answerErrors = [];

        data.answers.forEach((answerData, index) => {
          const error = {};

          if (answerData) {
            if (!answerData.title) {
              error.title = `answer #${index + 1} is required`;
            }

            if (
              answerData.initialVotes
              && (
                Number.isNaN(parseInt(answerData.initialVotes, 10))
                || answerData.initialVotes < 0
              )
            ) {
              error.initialVotes = `initial votes for answer #${index + 1} must be a non-negative integer`;
            }

            if (answerData.url && !isValidUrl(answerData.url)) {
              error.url = `invalid url provided for answer #${index + 1}`;
            }
          }

          if (!isEmpty(error)) {
            answerErrors[index] = error;
          }
        });

        if (answerErrors.length > 0) {
          formEvent.addError('answers', answerErrors);
        }
      }
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
    const data = formEvent.getData();
    const node = formEvent.getMessage();
    const answerSchema = PollAnswerV1Mixin.findOne();

    if (node.isFrozen()) {
      return;
    }

    [
      'title',
      'allow_multiple_responses',
      'question',
      'question_url',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, !isUndefined(value) ? value : null);
    });

    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);

    node.clear('answers');
    if (data.answers) {
      const answers = data.answers.map((answerData) => {
        const answerNode = answerSchema.createMessage();
        const { _id, initialVotes, title, url } = answerData;

        const id = isString(_id) ? UuidIdentifier.fromString(_id) : _id;
        answerNode
          .set('_id', id)
          .set('initial_votes', initialVotes ? parseInt(initialVotes, 10) : null)
          .set('title', title || null)
          .set('url', url || null);

        return answerNode;
      });

      node.addToList('answers', answers || []);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:apollo:mixin:poll.init_form': this.onInitForm,
      'triniti:apollo:mixin:poll.validate_form': this.onValidateForm,
      'triniti:apollo:mixin:poll.submit_form': this.onSubmitForm,
    };
  }
}
