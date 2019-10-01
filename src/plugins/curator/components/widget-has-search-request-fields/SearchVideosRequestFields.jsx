import PropTypes from 'prop-types';
import React from 'react';
import upperCase from 'lodash/upperCase';
import { Field } from 'redux-form';
import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import NumberField from '@triniti/cms/components/number-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import SearchSortEnum from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';

const sortOptions = humanizeEnums(SearchSortEnum, {
  format: 'map',
  except: [SearchSortEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label: label.replace(/(Asc|Desc)/, '$1ending'),
  value: upperCase(value).replace(/\s/g, '_'),
}));

const SearchVideosRequestFields = ({ readOnly }) => (
  <FormGroup>
    <Label>Search Request</Label>
    <Field name="q" component={TextField} label="Query" placeholder="Enter Query" readOnly={readOnly} />
    <Field name="page" component={NumberField} label="Page" min={1} max={255} readOnly={readOnly} />
    <Field name="count" component={NumberField} label="Count" min={1} max={255} readOnly={readOnly} />
    <Field
      component={PicklistPickerField}
      isEditMode={!readOnly}
      label="Show"
      name="show"
      picklistId="video-shows"
    />
    <Field name="sort" component={SelectField} label="Sort" placeholder="Select Sort" options={sortOptions} disabled={readOnly} />
    <Field
      component={DatePickerField}
      label="Created After"
      name="createdAfter"
      readOnly={readOnly}
      showSetCurrentDateTimeIcon={false}
    />
    <Field
      component={DatePickerField}
      label="Created Before"
      name="createdBefore"
      readOnly={readOnly}
      showSetCurrentDateTimeIcon={false}
    />
    <Field
      component={DatePickerField}
      label="Updated After"
      name="updatedAfter"
      readOnly={readOnly}
      showSetCurrentDateTimeIcon={false}
    />
    <Field
      component={DatePickerField}
      label="Updated Before"
      name="updatedBefore"
      readOnly={readOnly}
      showSetCurrentDateTimeIcon={false}
    />
  </FormGroup>
);

SearchVideosRequestFields.propTypes = {
  readOnly: PropTypes.bool,
};

SearchVideosRequestFields.defaultProps = {
  readOnly: false,
};

export default SearchVideosRequestFields;
