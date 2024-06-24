import React from 'react';
import { Col, Row } from 'reactstrap';
import slottingKeys from '@triniti/app/config/slottingKeys.js';
import { DatePickerField, NumberField, SelectField, TextField } from '@triniti/cms/components/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort.js';

export default function SearchTeasersRequestFields() {
  const teaserCuries = useCuries('triniti:curator:mixin:teaser:v1');
  if (!teaserCuries) {
    return null;
  }

  const typeOptions = teaserCuries.map(type => ({
    label: type.split(':').pop(),
    value: type.split(':').pop(),
  }));

  return (
    <>
      <TextField name="search_request.q" label="Query" />
      <Row>
        <Col xs={4}>
          <NumberField name="search_request.page" label="Page" />
        </Col>
        <Col xs={4}>
          <NumberField name="search_request.count" label="Count" />
        </Col>
      </Row>

      <SelectField name="search_request.slotting_key" label="Slotting Key" options={slottingKeys} />
      <SortField name="search_request.sort" enumClass={SearchTeasersSort} />
      <SelectField name="search_request.types" label="Types" options={typeOptions} isMulti />
      <TimelinePickerField name="search_request.timeline_ref" label="Timeline" />
      <GalleryPickerField name="search_request.gallery_ref" label="Gallery" />

      <Row>
        <Col xs={4}>
          <DatePickerField name="search_request.created_before" label="Created Before" />
        </Col>
        <Col xs={4}>
          <DatePickerField name="search_request.created_after" label="Created After" />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <DatePickerField name="search_request.updated_before" label="Updated Before" />
        </Col>
        <Col xs={4}>
          <DatePickerField name="search_request.updated_after" label="Updated After" />
        </Col>
      </Row>
    </>
  );
}
