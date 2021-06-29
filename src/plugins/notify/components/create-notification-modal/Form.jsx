import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { sortBy } from 'lodash-es';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from '@triniti/cms/components/select-field';
import startCase from 'lodash/startCase';
import TextareaField from '@triniti/cms/components/textarea-field';
import { formConfigs } from '../../constants';

const contentTypes = Object.values(formConfigs.CONTENT_TYPE).map((value) => (
  { label: startCase(value), value }
));

const Form = ({ contentChangeable, type, apps, appRef }) => (
  <Card>
    <CardBody indent>
      <Field
        component={SelectField}
        label="App"
        name="appRef"
        options={sortBy(
          apps.map((app) => ({ label: app.get('title'), value: NodeRef.fromNode(app).toString() })),
          (app) => app.label.toLowerCase(),
        )}
      />
      <Field
        component={SelectField}
        isDisabled={!contentChangeable}
        label="Content Type"
        name="type"
        options={contentTypes}
      />
      {type && (() => {
        // if (NodeRef.fromString(appRef.value).getLabel() === 'twitter-app') {
        //   return <p>{type.label} content is not supported yet.</p>;
        // }
        switch (type.value) {
          case formConfigs.CONTENT_TYPE.GENERAL_MESSAGE:
            return (
              <Field
                component={TextareaField}
                label="Customize Alert Text"
                name="body"
                rows={2}
              />
            );
          case formConfigs.CONTENT_TYPE.ARTICLE:
            return (
              <FieldArray
                component={ArticlePickerField}
                isEditMode={contentChangeable}
                isMulti={false}
                name="contentRefs"
              />
            );
          default:
            return <p>{type.label} content is not supported yet.</p>;
        }
      })()}
    </CardBody>
  </Card>
);

Form.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  contentChangeable: PropTypes.bool,
  type: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  appRef: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
};

Form.defaultProps = {
  apps: [],
  contentChangeable: true,
  type: null,
  appRef: null,
};

export default reduxForm()(Form);
