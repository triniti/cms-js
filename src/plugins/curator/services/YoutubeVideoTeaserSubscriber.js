import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class YoutubeVideoTeaserSubscriber extends EventSubscriber {
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

    data.youtubeVideoId = node.get('youtube_video_id');
    data.youtubeCustomId = node.get('youtube_custom_id');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    let error = getTextFieldError(data, 'youtubeCustomId', node);
    if (error) {
      formEvent.addError('youtubeCustomId', error);
    }

    if (!data.youtubeVideoId) {
      formEvent.addError('youtubeVideoId', 'Video ID is required.');
    } else {
      error = getTextFieldError(data, 'youtubeVideoId', node);
      if (error) {
        formEvent.addError('youtubeVideoId', error);
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

    if (node.isFrozen()) {
      return;
    }

    node.set('youtube_video_id', data.youtubeVideoId);
    if (data.youtubeCustomId) {
      node.set('youtube_custom_id', data.youtubeCustomId);
    } else {
      node.clear('youtube_custom_id');
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:youtube-video-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:youtube-video-teaser.validate_form': this.onValidateForm,
      'triniti:curator:mixin:youtube-video-teaser.submit_form': this.onSubmitForm,
    };
  }
}
