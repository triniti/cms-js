import swal from 'sweetalert2';
import noop from 'lodash/noop';
import { call, put } from 'redux-saga/effects';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode';
import FieldRule from '@gdbots/pbj/enums/FieldRule';
import PromotionV1Mixin from '@triniti/schemas/triniti/curator/mixin/promotion/PromotionV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPromotionsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-promotions-request/SearchPromotionsRequestV1Mixin';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import SearchWidgetsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-widgets-request/SearchWidgetsRequestV1Mixin';
import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';

// fixme: this flow is highly unusual and should be refactored.
// ncr should not know of the existence of the higher level plugins
const ignoredFieldNames = [
  '_id',
  '_schema',
  'created_at',
  'creator_ref',
  'etag',
  'last_event_ref',
  'published_at',
  'status',
  'tags',
  'updated_at',
  'updater_ref',
];

function* clone({ history, node }) {
  let createSchema;
  let clonedNode;
  let nodeSchema;
  let schemas = {};
  if (node.schema().hasMixin('triniti:curator:mixin:promotion')) {
    createSchema = resolveSchema(PromotionV1Mixin, 'command', 'create-promotion');
    clonedNode = PromotionV1Mixin.findOne().createMessage();
    schemas = {
      node: PromotionV1Mixin.findOne(),
      nodeCreated: resolveSchema(PromotionV1Mixin, 'event', 'promotion-created'),
      getNodeRequest: resolveSchema(PromotionV1Mixin, 'request', 'get-promotion-request'),
      searchNodes: SearchPromotionsRequestV1Mixin.findOne(),
    };
  } else if (node.schema().hasMixin('triniti:curator:mixin:widget')) {
    createSchema = resolveSchema(WidgetV1Mixin, 'command', 'create-widget');
    const message = node.schema().getCurie().getMessage();
    nodeSchema = WidgetV1Mixin.findAll().find((mixin) => mixin.getCurie().getMessage() === message);
    clonedNode = nodeSchema.createMessage();
    schemas = {
      node: nodeSchema,
      nodeCreated: resolveSchema(WidgetV1Mixin, 'event', 'widget-created'),
      getNodeRequest: resolveSchema(WidgetV1Mixin, 'request', 'get-widget-request'),
      searchNodes: SearchWidgetsRequestV1Mixin.findOne(),
    };
  } else if (node.schema().hasMixin('triniti:curator:mixin:teaser')) {
    createSchema = resolveSchema(TeaserV1Mixin, 'command', 'create-teaser');
    const message = node.schema().getCurie().getMessage();
    nodeSchema = TeaserV1Mixin.findAll().find((mixin) => mixin.getCurie().getMessage() === message);
    clonedNode = nodeSchema.createMessage();
    schemas = {
      node: nodeSchema,
      nodeCreated: resolveSchema(TeaserV1Mixin, 'event', 'teaser-created'),
      getNodeRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-request'),
      searchNodes: SearchTeasersRequestV1Mixin.findOne(),
    };
  } else {
    return;
  }
  let fieldName;
  node.schema().fields.forEach((field) => {
    fieldName = field.getName();
    if (node.get(fieldName) && !ignoredFieldNames.includes(fieldName)) {
      switch (field.getRule()) {
        case FieldRule.A_SINGLE_VALUE:
          clonedNode.set(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_SET:
          clonedNode.addToSet(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_LIST:
          clonedNode.addToList(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_MAP:
          Object.entries(node.get(fieldName)).forEach(([key, value]) => {
            clonedNode.addToMap(fieldName, key, value);
          });
          break;
        default:
          break;
      }
    }
  });

  if (clonedNode.schema().className.indexOf('CodeWidget') !== -1) {
    clonedNode.set('show_header', false);
  }

  const message = createSchema.createMessage().set('node', clonedNode);
  yield put(createNode(message, noop, noop, history, { schemas }));
}

export default function* (action) {
  const result = yield swal.fire({
    allowOutsideClick: false,
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonText: 'Clone!',
    showCancelButton: true,
    text: 'Item will be cloned!',
    title: 'Are you sure?',
    type: 'warning',
    reverseButtons: true,
  });

  if (result.value) {
    yield call(clone, action);
  }
}
