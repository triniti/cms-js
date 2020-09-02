/* globals APP_VENDOR */
import UuidIdentifier from '@gdbots/pbj/well-known/UuidIdentifier';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getKeyValuesFieldErrors from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import isCollaborating from '@triniti/cms/plugins/raven/selectors/isCollaborating';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import { arrayPush, arrayRemoveAll, change, getFormMeta, getFormValues } from 'redux-form';

import formValues from '../utils/formValues';
import { formNames, formRules } from '../constants';

export default class ArticleSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onAppleNewsArticleSynced = this.onAppleNewsArticleSynced.bind(this);
    this.onArticleSlottingRemoved = this.onArticleSlottingRemoved.bind(this);
    this.onArticleUpdated = this.onArticleUpdated.bind(this);
    this.onClearSubmitErrors = this.onClearSubmitErrors.bind(this);
    this.onInitForm = this.onInitForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
  }

  onClearSubmitErrors(event) {
    const store = event.getRedux();
    const { form } = store.getState();
    formValues.set(form[formNames.ARTICLE]);
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

    // eslint-disable-next-line no-underscore-dangle
    data._id = node.get('_id');
    data.classification = node.has('classification') ? {
      label: node.get('classification'),
      value: node.get('classification'),
    } : null;
    data.swipe = node.has('swipe') ? { label: node.get('swipe'), value: node.get('swipe') } : null;
    data.theme = node.has('theme') ? { label: node.get('theme'), value: node.get('theme') } : null;
    data.relatedArticleRefs = node.has('related_article_refs') ? node.get('related_article_refs') : [];
    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
    data.slotting = !node.has('slotting') ? null : Object.entries(node.get('slotting')).map(([name, value]) => ({
      key: {
        label: name,
        value: name,
      },
      value,
    }));

    data.authorRefs = node.has('author_ref') ? [node.get('author_ref')] : [];

    [
      'allow_comments',
      'amp_enabled',
      'apple_news_enabled',
      'apple_news_id',
      'apple_news_revision',
      'apple_news_share_url',
      'is_homepage_news',
      'related_articles_heading',
      'show_related_articles',
      'smartnews_enabled',
      'title',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const data = formEvent.getData();
    const { title } = data;
    const { TITLE_LENGTH_LIMIT } = formRules;
    if (title && title.length > TITLE_LENGTH_LIMIT - 15) {
      formEvent.addWarning('title', `recommendation: keep title less than ${TITLE_LENGTH_LIMIT} characters to avoid title extending too long in search results. (${title.length}/${TITLE_LENGTH_LIMIT})`);
    }
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!data.title) {
      formEvent.addError('title', 'title is required');
    }

    [
      'apple_news_revision',
      'apple_news_share_url',
      'title',
    ].forEach((field) => {
      const fieldName = camelCase(field);
      const value = get(data, fieldName);

      if (value) {
        try {
          node.set(field, value);
        } catch (e) {
          formEvent.addError(fieldName, e.message);
        }
      }
    });

    if (get(data, 'appleNewsId')) {
      try {
        const value = get(data, 'appleNewsId');
        const identifier = isString(value) ? UuidIdentifier.fromString(value) : value;
        node.set('apple_news_id', identifier);
      } catch (e) {
        formEvent.addError('appleNewsId', e.message);
      }
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
      }
    }

    if (data.authorRefs) {
      try {
        node.set('author_ref', data.authorRefs[0]);
      } catch (e) {
        formEvent.addError('authorRefs', e.message);
      }
    }

    const redux = formEvent.getRedux();
    if (redux) {
      const meta = getFormMeta(formEvent.getName())(redux.getState());
      if ((meta.slotting || []).some((slot) => get(slot, 'key.touched') || get(slot, 'value.touched'))) {
        const { errors, hasError } = getKeyValuesFieldErrors(data, 'slotting', node);
        if (hasError) {
          formEvent.addError('slotting', errors);
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

    if (node.isFrozen()) {
      return;
    }

    [
      'allow_comments',
      'amp_enabled',
      'apple_news_enabled',
      'is_homepage_news',
      'related_articles_heading',
      'show_related_articles',
      'smartnews_enabled',
      'title',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });

    [
      'apple_news_revision',
      'apple_news_share_url',
    ].forEach((fieldName) => {
      const value = get(data, camelCase(fieldName), null) || null;
      if (node.has(fieldName) || value !== null) {
        node.set(fieldName, value);
      }
    });

    if (node.has('apple_news_id') || get(data, 'appleNewsId')) {
      const value = get(data, 'appleNewsId');
      try {
        const identifier = isString(value) ? UuidIdentifier.fromString(value) : value;
        node.set('apple_news_id', identifier);
      } catch (e) {
        node.clear('apple_news_id');
      }
    }

    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);

    node.clear('slotting');
    (data.slotting || []).forEach(({ key, value }) => {
      if (key && key.label && value) {
        node.addToMap('slotting', key.label, +value);
      }
    });

    [
      'classification',
    ].forEach((fieldName) => {
      node.set(fieldName, get(data, `${camelCase(fieldName)}.value`) || null);
    });

    node.clear('related_article_refs');
    if (typeof data.relatedArticleRefs !== 'undefined') {
      node.addToList('related_article_refs', data.relatedArticleRefs);
    }

    node.clear('author_ref');
    if (data.authorRefs && data.authorRefs.length) {
      node.set('author_ref', data.authorRefs[0]);
    }
  }

  /**
   * When an event using triniti:news:mixin:apple-news-article-synced
   * occurs we want to automatically update the form the user is looking
   * as IF they are currently collaborating on that node.
   *
   * This ensures when the user saves the article it will have the most
   * up to date apple news revision, id, etc.
   *
   * @param {FilterActionEvent} event
   */
  onAppleNewsArticleSynced(event) {
    const { pbj } = event.getAction();
    if (!pbj.has('node_ref')) {
      return;
    }

    const nodeRef = pbj.get('node_ref');
    const store = event.getRedux();
    const state = store.getState();

    if (!isCollaborating(state, nodeRef)) {
      return;
    }

    // they are collaborating BUT this screen, this browser tab
    // must also match what they're looking at
    if (window.location.pathname.indexOf(nodeRef.getId()) === -1) {
      return;
    }

    if (pbj.get('apple_news_operation') === 'delete') {
      store.dispatch(change(formNames.ARTICLE, 'appleNewsEnabled', false));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsId', ''));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsRevision', ''));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsShareUrl', ''));
    } else {
      store.dispatch(change(formNames.ARTICLE, 'appleNewsEnabled', true));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsId', `${pbj.get('apple_news_id')}`));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsRevision', pbj.get('apple_news_revision')));
      store.dispatch(change(formNames.ARTICLE, 'appleNewsShareUrl', pbj.get('apple_news_share_url')));
    }

    // fixme: want to change the fields above but don't want to leave the form dirty
    // this is a dangerous process and requires more deep thought since redux form
    // can behave in strange ways when this type of thing is done.
    /*
    const initialValues = getFormInitialValues(formNames.ARTICLE)(state);
    initialValues.appleNewsId = `${pbj.get('apple_news_id')}`;
    initialValues.appleNewsRevision = pbj.get('apple_news_revision');
    initialValues.appleNewsShareUrl = pbj.get('apple_news_share_url');
    store.dispatch(initialize(formNames.ARTICLE, initialValues, true));
    store.dispatch(untouch(
      formNames.ARTICLE, ['appleNewsId', 'appleNewsRevision', 'appleNewsShareUrl']
    ));
    */
  }

  /**
   * When an event using triniti:news:mixin:article-slotting-removed
   * occurs we want to automatically update the form the user is looking
   * as IF they are currently collaborating on that node.
   *
   * @param {FilterActionEvent} event
   */
  onArticleSlottingRemoved(event) {
    const { pbj } = event.getAction();
    if (!pbj.has('node_ref')) {
      return;
    }

    if (!pbj.has('slotting_keys')) {
      return;
    }

    const nodeRef = pbj.get('node_ref');
    const store = event.getRedux();
    const state = store.getState();

    if (!isCollaborating(state, nodeRef)) {
      return;
    }

    // they are collaborating BUT this screen, this browser tab
    // must also match what they're looking at
    if (window.location.pathname.indexOf(nodeRef.getId()) === -1) {
      return;
    }

    const data = getFormValues(formNames.ARTICLE)(state);
    if (!data.slotting) {
      return;
    }

    store.dispatch(arrayRemoveAll(formNames.ARTICLE, 'slotting'));

    data.slotting.forEach((field) => {
      if (!pbj.isInSet('slotting_keys', field.key.value)) {
        store.dispatch(arrayPush(formNames.ARTICLE, 'slotting', field));
      }
    });
  }

  /**
   * When an event using triniti:news:mixin:article-updated occurs we want to check and see if that
   * article is currently in pbjx state. If it is, we need to clear it out or a request will not be
   * made when that article's page is loaded and the user will see stale data and probably die.
   *
   * If the user is on that article's page they will get the stale data popup so this only applies
   * if they are elsewhere.
   *
   * TODO: sort out a more generic approach that does this for all nodes
   *
   * @param {FilterActionEvent} event
   */
  onArticleUpdated(event) {
    const store = event.getRedux();
    const state = store.getState();
    const getArticleRequestSchema = resolveSchema(ArticleV1Mixin, 'request', 'get-article-request');
    const requestState = getRequest(state, getArticleRequestSchema.getCurie());
    if (requestState.response) {
      const article = requestState.response.get('node');
      if (
        // there is an article in pbjx state
        article
        // the article that was updated is the article in state
        && event.getAction().pbj.get('node_ref').equals(NodeRef.fromNode(article))
        // we are not on that article's page
        && window.location.pathname.indexOf(article.get('_id').toString()) === -1
      ) {
        store.dispatch(clearResponse(getArticleRequestSchema.getCurie()));
      }
    }
  }

  getSubscribedEvents() {
    return {
      '@@redux-form/CLEAR_SUBMIT_ERRORS': this.onClearSubmitErrors,
      'triniti:news:mixin:article.init_form': this.onInitForm,
      'triniti:news:mixin:article.submit_form': this.onSubmitForm,
      'triniti:news:mixin:article.validate_form': this.onValidateForm,
      'triniti:news:mixin:article.warn_form': this.onWarnForm,
      [`${APP_VENDOR}:news:event:apple-news-article-synced`]: this.onAppleNewsArticleSynced,
      [`${APP_VENDOR}:news:event:article-slotting-removed`]: this.onArticleSlottingRemoved,
      [`${APP_VENDOR}:news:event:article-updated`]: this.onArticleUpdated,
    };
  }
}
