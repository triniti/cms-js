import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import React from 'react';
import { connect } from 'react-redux';
import { Field, FormSection } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';
import SelectField from '@triniti/cms/components/select-field';
import WidgetSearchRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget-search-request/WidgetSearchRequestV1Mixin';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import selector from './selector';
import './styles.scss';

const allWidgetSearchSchemas = WidgetSearchRequestV1Mixin.findAll() || [];

const typeOptions = allWidgetSearchSchemas.map((schema) => ({
  label: schema.getCurie().getMessage()
    .replace('search-', '')
    .replace(`-${schema.getCurie().getCategory()}`, ''),
  value: schema.getCurie().getMessage(),
}));

const getComponent = memoize((nodeName) => createLazyComponent(import(`./Search${nodeName}RequestFields`)));

const WidgetHasSearchRequestFields = ({ isEditMode, searchRequestType }) => {
  const nodeName = !searchRequestType ? null : startCase(searchRequestType.replace('search-', '').replace('-request', ''));
  const Component = nodeName ? getComponent(nodeName) : null;
  return (
    <>
      <Card>
        <CardHeader>Options</CardHeader>
        <CardBody indent>
          <div className="pb-1 d-md-inline-flex">
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Pagination"
              name="showPagination"
            />
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item CTA Text"
              name="showItemCtaText"
            />
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item Date"
              name="showItemDate"
            />
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item Duration"
              name="showItemDuration"
            />
          </div>
          <div className="pb-1 d-md-inline-flex">
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item Excerpt"
              name="showItemExcerpt"
            />
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item Icon"
              name="showItemIcon"
            />
            <Field
              className="widget-option-checkbox"
              component={CheckboxField}
              disabled={!isEditMode}
              label="Show Item Media Count"
              name="showItemMediaCount"
            />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Search Request</CardHeader>
        <CardBody indent>
          <Field
            component={SelectField}
            disabled={!isEditMode}
            isClearable
            name="searchRequestType"
            options={typeOptions}
            placeholder="Select Data Source"
          />
          {Component
          && (
          <FormSection
            component={Component}
            name={`search${nodeName}Request`}
            readOnly={!isEditMode}
          />
          )}
        </CardBody>
      </Card>
    </>
  );
};

WidgetHasSearchRequestFields.propTypes = {
  isEditMode: PropTypes.bool,
  searchRequestType: PropTypes.oneOf(
    allWidgetSearchSchemas.map((schema) => schema.getCurie().getMessage()),
  ),
};

WidgetHasSearchRequestFields.defaultProps = {
  isEditMode: false,
  searchRequestType: null,
};

export default connect(selector)(WidgetHasSearchRequestFields);
