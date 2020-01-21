import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import isValidUrl from '@gdbots/common/isValidUrl';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import TvpgRating from '@triniti/schemas/triniti/ovp/enums/TvpgRating';
import isUndefined from 'lodash/isUndefined';

export default class VideoSubscriber extends EventSubscriber {
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

    [
      'allow_comments',
      'description',
      'duration',
      'expires_at',
      'is_live',
      'is_full_episode',
      'is_promo',
      'launch_text',
      'mezzanine_url',
      'mpm',
      'original_air_date',
      'related_videos_heading',
      'sharing_enabled',
      'show_related_videos',
      'title',
      'youtube_custom_id',
      'youtube_video_id',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.credit = node.has('credit') ? {
      label: node.get('credit'),
      value: node.get('credit'),
    } : undefined;

    data.hasMusic = node.get('has_music', 0);

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
    data.posterImageRef = node.has('poster_image_ref') ? node.get('poster_image_ref').toString() : null;

    data.tvpgRating = node.get('tvpg_rating')
      ? { label: node.get('tvpg_rating').toString(), value: node.get('tvpg_rating').toString() } : null;

    data.captions = Object
      .entries(node.get('caption_urls', []))
      .map((arr) => ({ url: arr[1], language: { label: arr[0], value: arr[0] } }));

    data.relatedVideoRefs = node.has('related_video_refs') ? node.get('related_video_refs') : [];

    if (node.has('live_m3u8_url')) {
      data.liveM3u8Url = node.get('live_m3u8_url');
    }

    data.show = node.has('show') ? {
      label: node.get('show'),
      value: node.get('show'),
    } : undefined;
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    let error = getTextAreaFieldError(data, 'description', node);
    if (error) {
      formEvent.addError('description', error);
    }

    [
      'title',
      'launchText',
      'mpm',
      'mezzanineUrl',
      'youtube_custom_id',
      'youtube_video_id',
    ].forEach((fieldName) => {
      error = getTextFieldError(data, fieldName, node);
      if (error) {
        formEvent.addError(fieldName, error);
      }
    });

    error = getTextFieldError(data, 'liveM3u8Url', node, 'live_m3u8_url');
    if (error) {
      formEvent.addError('liveM3u8Url', error);
    }

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (data.captions) {
      const captionsArrayErrors = [];
      (data.captions || []).forEach((caption, captionIndex) => {
        const captionErrors = {};
        if (caption && !isValidUrl(caption.url)) {
          captionErrors.url = 'Invalid caption url';
          captionsArrayErrors[captionIndex] = captionErrors;
          formEvent.addError('captions', captionsArrayErrors);
        }
      });
    }

    if (get(data, 'show.value')) {
      try {
        node.set('show', data.show.value);
      } catch (e) {
        formEvent.addError('show', e.message);
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

    [
      'description',
      'expires_at',
      'launch_text',
      'mezzanine_url',
      'mpm',
      'original_air_date',
      'related_videos_heading',
      'title',
      'youtube_custom_id',
      'youtube_video_id',
    ].forEach((fieldName) => {
      node.set(fieldName, data[camelCase(fieldName)] || null);
    });

    [ // booleans
      'allow_comments',
      'is_live',
      'is_full_episode',
      'is_promo',
      'sharing_enabled',
      'show_related_videos',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });

    node.set('credit', get(data, 'credit.value', null));
    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);
    node.set('poster_image_ref', data.posterImageRef ? NodeRef.fromString(data.posterImageRef) : null);
    node.set('duration', parseInt(data.duration, 10) || null);
    node.set('has_music', parseInt(data.hasMusic, 10) || 0);
    node.set('tvpg_rating', data.tvpgRating ? TvpgRating.create(data.tvpgRating.label) : null);

    node.clear('caption_urls');
    (data.captions || []).forEach((object) => {
      node.addToMap('caption_urls', object.language.value, object.url);
    });

    node.clear('related_video_refs');
    if (typeof data.relatedVideoRefs !== 'undefined') {
      node.addToList('related_video_refs', data.relatedVideoRefs);
    }

    node.set('show', get(data, 'show.value', null));
    node.set('live_m3u8_url', data.liveM3u8Url || null);
  }

  getSubscribedEvents() {
    return {
      'triniti:ovp:mixin:video.init_form': this.onInitForm,
      'triniti:ovp:mixin:video.validate_form': this.onValidateForm,
      'triniti:ovp:mixin:video.submit_form': this.onSubmitForm,
    };
  }
}
