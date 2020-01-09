import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import startCase from 'lodash/startCase';
import { getFormMeta } from 'redux-form';

import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getDatePickerFieldError from '@triniti/cms/components/date-picker-field/getDatePickerFieldError';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';
import SearchVideosRequestV1Mixin from '@triniti/schemas/triniti/ovp/mixin/search-videos-request/SearchVideosRequestV1Mixin';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import WidgetSearchRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget-search-request/WidgetSearchRequestV1Mixin';

const allWidgetSearchSchemas = WidgetSearchRequestV1Mixin.findAll() || [];
const labels = {};
allWidgetSearchSchemas.forEach((schema) => {
  const message = schema.getCurie().getMessage();
  labels[message] = message.replace('search-', '').replace(`-${schema.getCurie().getCategory()}`, '');
});

const timeFields = ['created_after', 'created_before', 'updated_after', 'updated_before'];

export default class WidgetHasSearchRequestSubscriber extends EventSubscriber {
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
      'show_item_cta_text',
      'show_item_date',
      'show_item_duration',
      'show_item_excerpt',
      'show_item_icon',
      'show_item_media_count',
      'show_pagination',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    if (node.has('search_request')) {
      const searchRequest = node.get('search_request');
      const searchRequestType = searchRequest.schema().getCurie().getMessage();

      data.searchRequestType = {
        label: labels[searchRequestType],
        value: searchRequestType,
      };

      data[camelCase(searchRequestType)] = {
        count: searchRequest.get('count'),
        page: searchRequest.get('page'),
        q: searchRequest.get('q'),
        show: {
          label: searchRequest.get('show'),
          value: searchRequest.get('show'),
        },
        slottingKey: {
          label: searchRequest.get('slotting_key'),
          value: searchRequest.get('slotting_key'),
        },
        sort: {
          label: startCase(searchRequest.get('sort')).replace(/(Asc|Desc)/, '$1ending'),
          value: searchRequest.get('sort').getName(),
        },
      };

      timeFields.forEach((field) => {
        data[camelCase(searchRequestType)][camelCase(field)] = node.get('search_request').get(field);
      });

      if (searchRequestType === SearchTeasersRequestV1Mixin.findOne().getCurie().getMessage()) {
        data[camelCase(searchRequestType)].types = (searchRequest.get('types') || []).map((type) => ({
          label: type.replace('-teaser', '').replace(/-/g, ' '),
          value: type,
        }));

        if (searchRequest.has('timeline_ref')) {
          data[camelCase(searchRequestType)].timelineRefs = [searchRequest.get('timeline_ref')];
        }

        if (searchRequest.has('gallery_ref')) {
          data[camelCase(searchRequestType)].galleryRefs = [searchRequest.get('gallery_ref')];
        }
      }
    }
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();

    const searchRequestType = get(data, 'searchRequestType.value'); // eg 'search-articles-request'
    const searchRequestData = get(data, `${camelCase(searchRequestType)}`);
    if (searchRequestType && searchRequestData) {
      const searchRequest = allWidgetSearchSchemas
        .find((schema) => schema.getCurie().getMessage() === searchRequestType).createMessage();

      if (get(searchRequestData, 'timelineRefs[0]')) {
        try {
          searchRequest.set('timeline_ref', searchRequestData.timelineRefs[0]);
        } catch (e) {
          formEvent.addError(`${camelCase(searchRequestType)}`, {
            timelineRefs: e.message,
          });
        }
      }

      if (get(searchRequestData, 'galleryRefs[0]')) {
        try {
          searchRequest.set('gallery_ref', searchRequestData.galleryRefs[0]);
        } catch (e) {
          formEvent.addError(`${camelCase(searchRequestType)}`, {
            galleryRefs: e.message,
          });
        }
      }

      if (get(searchRequestData, 'slottingKey.value')) {
        try {
          searchRequest.set('slotting_key', get(searchRequestData, 'slottingKey.value'));
        } catch (e) {
          formEvent.addError(`${camelCase(searchRequestType)}`, {
            slottingKey: e.message,
          });
        }
      }

      if (get(searchRequestData, 'show.value')) {
        try {
          searchRequest.set('show', get(searchRequestData, 'show.value'));
        } catch (e) {
          formEvent.addError(`${camelCase(searchRequestType)}`, {
            show: e.message,
          });
        }
      }

      const searchRequestError = {};
      const redux = formEvent.getRedux();
      if (redux) {
        const fieldsMeta = getFormMeta(formEvent.getName())(redux.getState());
        timeFields.forEach((field) => {
          if (get(fieldsMeta, `${camelCase(searchRequestType)}.${camelCase(field)}.touched`)) {
            const error = getDatePickerFieldError(
              searchRequestData,
              camelCase(field),
              searchRequest,
            );
            if (error) {
              searchRequestError[camelCase(field)] = error;
            }
          }
        });
      }

      if (Object.keys(searchRequestError).length) {
        formEvent.addError(camelCase(searchRequestType), searchRequestError);
        return;
      }

      if (
        searchRequestData.createdBefore
        && searchRequestData.createdAfter
        && searchRequestData.createdBefore < searchRequestData.createdAfter
      ) {
        searchRequestError.createdBefore = 'created before must be after created after';
        searchRequestError.createdAfter = 'created after must be before created before';
      }

      if (
        searchRequestData.updatedBefore
        && searchRequestData.updatedAfter
        && searchRequestData.updatedBefore < searchRequestData.updatedAfter
      ) {
        searchRequestError.updatedBefore = 'updated before must be after updated after';
        searchRequestError.updatedAfter = 'updated after must be before updated before';
      }

      if (Object.keys(searchRequestError).length) {
        formEvent.addError(camelCase(searchRequestType), searchRequestError);
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
      'show_item_cta_text',
      'show_item_date',
      'show_item_duration',
      'show_item_excerpt',
      'show_item_icon',
      'show_item_media_count',
      'show_pagination',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });

    node.clear('search_request');
    const searchRequestType = get(data, 'searchRequestType.value'); // eg 'search-articles-request'
    if (searchRequestType) {
      const searchRequestData = data[camelCase(searchRequestType)] || {};
      const searchRequest = allWidgetSearchSchemas
        .find((schema) => schema.getCurie().getMessage() === searchRequestType).createMessage();

      searchRequest.set('page', +searchRequestData.page || null);
      searchRequest.set('count', +searchRequestData.count || null);
      searchRequest.set('q', searchRequestData.q || null);

      timeFields.forEach((field) => {
        searchRequest.set(field, searchRequestData[camelCase(field)] || null);
      });

      switch (searchRequestType) {
        case SearchArticlesRequestV1Mixin.findOne().getCurie().getMessage():
          if (get(searchRequestData, 'sort.value')) {
            searchRequest.set('sort', SearchArticlesSort[get(searchRequestData, 'sort.value')]);
          }
          if (get(searchRequestData, 'slottingKey.value')) {
            searchRequest.set('slotting_key', get(searchRequestData, 'slottingKey.value'));
          }
          break;

        case SearchGalleriesRequestV1Mixin.findOne().getCurie().getMessage():
          if (get(searchRequestData, 'sort.value')) {
            searchRequest.set('sort', SearchGalleriesSort[get(searchRequestData, 'sort.value')]);
          }
          break;

        case SearchTeasersRequestV1Mixin.findOne().getCurie().getMessage():
          if (get(searchRequestData, 'timelineRefs[0]')) {
            searchRequest.set('timeline_ref', searchRequestData.timelineRefs[0]);
          }

          if (get(searchRequestData, 'types.length')) {
            searchRequest.addToSet('types', searchRequestData.types.map((type) => type.value));
          }

          if (get(searchRequestData, 'galleryRefs[0]')) {
            searchRequest.set('gallery_ref', searchRequestData.galleryRefs[0]);
          }

          if (get(searchRequestData, 'sort.value')) {
            searchRequest.set('sort', SearchTeasersSort[get(searchRequestData, 'sort.value')]);
          }
          break;

        case SearchVideosRequestV1Mixin.findOne().getCurie().getMessage():
          if (get(searchRequestData, 'sort.value')) {
            searchRequest.set('sort', SearchVideosSort[get(searchRequestData, 'sort.value')]);
          }
          if (get(searchRequestData, 'show.value')) {
            searchRequest.set('show', get(searchRequestData, 'show.value'));
          }
          break;

        default:
          break;
      }

      node.set('search_request', searchRequest);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:widget-has-search-request.init_form': this.onInitForm,
      'triniti:curator:mixin:widget-has-search-request.validate_form': this.onValidateForm,
      'triniti:curator:mixin:widget-has-search-request.submit_form': this.onSubmitForm,
    };
  }
}
