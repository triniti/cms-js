import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { EditorState } from 'draft-js';

import Message from '@gdbots/pbj/Message';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import Blocksmith from '@triniti/cms/plugins/blocksmith/components/blocksmith';
import History from '@triniti/cms/plugins/pbjx/components/history';
import PersonFields from '@triniti/cms/plugins/people/components/person-fields';
import RawContent from '@triniti/cms/components/raw-content';
import SeoFields from '@triniti/cms/plugins/common/components/seo-fields';
import TaxonomyFields from '@triniti/cms/plugins/taxonomy/components/taxonomy-fields';
import setBlocks from '@triniti/cms/plugins/blocksmith/utils/setBlocks';

import schemas from './schemas';

const Form = ({
  getNodeRequestState, node: person, form, tab, isEditMode, blocksmithState,
}) => {
  switch (tab) {
    case 'details':
      return (
        <>
          <PersonFields
            formName={form}
            person={person}
            isEditMode={isEditMode}
            schemas={schemas}
          />
          {
            schemas.node.hasMixin('triniti:canvas:mixin:has-blocks')
            && (
              <Blocksmith
                blocksmithState={blocksmithState}
                formName={form}
                isEditMode={isEditMode}
                node={person}
              />
            )
          }
        </>
      );
    case 'taxonomy':
      return <TaxonomyFields schemas={schemas} isEditMode={isEditMode} />;
    case 'seo':
      return schemas.node.hasMixin('triniti:common:mixin:seo') && <SeoFields isEditMode={isEditMode} />;
    case 'history':
      return (
        <History
          isEditMode={isEditMode}
          formName={form}
          node={person}
          nodeRequest={getNodeRequestState.request}
          schema={schemas.getNodeHistoryRequest}
          setBlocks={setBlocks}
        />
      );
    case 'raw':
      return <RawContent pbj={person} />;
    default:
      return (
        <div>
          <PersonFields
            formName={form}
            person={person}
            isEditMode={isEditMode}
            schemas={schemas}
          />
          <Blocksmith
            blocksmithState={blocksmithState}
            formName={form}
            isEditMode={isEditMode}
            node={person}
            title="Biography"
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
  getNodeRequestState: PropTypes.shape({
    request: PropTypes.instanceOf(Message).isRequired,
  }).isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  tab: PropTypes.string,
};

Form.defaultProps = {
  blocksmithState: null,
  form: null,
  isEditMode: false,
  tab: '',
};

export default reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Form);
