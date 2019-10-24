import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray, reduxForm } from 'redux-form';
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

const Form = ({ contentChangeable, type, apps }) => (
  <Card>
    <CardBody indent>
      <Field
        component={SelectField}
        label="App"
        name="appRef"
        options={apps.map(
          (app) => ({ label: app.get('title'), value: NodeRef.fromNode(app).toString() }),
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
};

Form.defaultProps = {
  apps: [],
  contentChangeable: true,
  type: null,
};

export default reduxForm()(Form);
