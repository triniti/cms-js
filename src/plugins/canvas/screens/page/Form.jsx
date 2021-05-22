import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { EditorState } from 'draft-js';

import Message from '@gdbots/pbj/Message';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import Blocksmith from '@triniti/cms/plugins/blocksmith/components/blocksmith';
import History from '@triniti/cms/plugins/pbjx/components/history';
import RawContent from '@triniti/cms/components/raw-content';
import CustomCodeFields from '@triniti/cms/plugins/common/components/custom-code-fields';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import PageFields from '@triniti/cms/plugins/canvas/components/page-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';

import schemas from './schemas';

const Form = ({
  node: page, form, formValues, getNodeRequestState, tab, isEditMode, blocksmithState, layouts,
}) => {
  switch (tab) {
    case 'code':
      return schemas.node.hasMixin('triniti:common:mixin:custom-code') && <CustomCodeFields isEditMode={isEditMode} />;
    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && <SeoFields formValues={formValues} isEditMode={isEditMode} />;
    case 'taxonomy':
      return <TaxonomyFields schemas={schemas} isEditMode={isEditMode} />;
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={page}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
          setBlocks={setBlocks}
        />
      );
    case 'raw':
      return <RawContent pbj={page} />;
    default:
      return (
        <div>
          <PageFields
            formName={form}
            page={page}
            isEditMode={isEditMode}
            layouts={layouts}
            schemas={schemas}
          />
          <Blocksmith
            blocksmithState={blocksmithState}
            formName={form}
            isEditMode={isEditMode}
            node={page}
          />
          {
            schemas.node.hasMixin('triniti:common:mixin:advertising')
            && <AdvertisingFields key="ad-fields" isEditMode={isEditMode} />
          }
          {
            schemas.node.hasMixin('gdbots:common:mixin:taggable')
            && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />
          }
        </div>
      );
  }
};

Form.propTypes = {
  blocksmithState: PropTypes.shape({
    editorState: PropTypes.instanceOf(EditorState),
    isDirty: PropTypes.bool.isRequired,
  }),
  form: PropTypes.string,
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool,
  layouts: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  blocksmithState: null,
  form: null,
  formValues: {},
  isEditMode: false,
  layouts: [],
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
