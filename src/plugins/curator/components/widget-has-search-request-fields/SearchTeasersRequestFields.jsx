import slottingConfig from 'config/slottingConfig'; // eslint-disable-line import/no-unresolved
import { Field, FieldArray } from 'redux-form';
import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import NumberField from '@triniti/cms/components/number-field';
import PropTypes from 'prop-types';
import React from 'react';
import SearchSortEnum from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort';
import SelectField from '@triniti/cms/components/select-field';
import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import TextField from '@triniti/cms/components/text-field';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';
import upperCase from 'lodash/upperCase';

const sortOptions = humanizeEnums(SearchSortEnum, {
  format: 'map',
  except: [SearchSortEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label: label.replace(/(Asc|Desc)/, '$1ending'),
  value: upperCase(value).replace(/\s/g, '_'),
}));

const typeOptions = TeaserV1Mixin.findAll().map((type) => ({
  label: type.getCurie().getMessage().replace(/(-|teaser)/g, ' '),
  value: type.getCurie().getMessage(),
}));

const SearchTeasersRequestFields = ({ readOnly }) => (
  <FormGroup>
    <Label>Search Request</Label>
    <Field name="q" component={TextField} label="Query" placeholder="Enter Query" readOnly={readOnly} />
    <Field name="page" component={NumberField} label="Page" min={1} max={255} readOnly={readOnly} />
    <Field name="count" component={NumberField} label="Count" min={1} max={255} readOnly={readOnly} />
    <Field name="slottingKey" component={SelectField} label="Slotting Key" placeholder="Select Slotting Key" options={slottingConfig} disabled={readOnly} />
    <Field
      component={SelectField}
      label="Sort"
      name="sort"
      options={sortOptions}
      placeholder="Select Sort"
      disabled={readOnly}
    />
    <Field
      closeOnSelect={false}
      component={SelectField}
      label="types"
      multi
      name="types"
      options={typeOptions}
      placeholder="Select Types"
      readOnly={readOnly}
    />
    <FieldArray
      closeOnSelect
      component={TimelinePickerField}
      isEditMode={!readOnly}
      label="Timeline"
      isMulti={false}
      name="timelineRefs"
    />
    <FieldArray
      closeOnSelect
      component={GalleryPickerField}
      isEditMode={!readOnly}
      label="Gallery"
      isMulti={false}
      name="galleryRefs"
    />
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

SearchTeasersRequestFields.propTypes = {
  readOnly: PropTypes.bool,
};

SearchTeasersRequestFields.defaultProps = {
  readOnly: false,
};

export default SearchTeasersRequestFields;
