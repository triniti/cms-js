import React from 'react';
import { DatePickerField, NumberField, SelectField, TextField, withPbj } from '@triniti/cms/components/index.js';
import { Col, Row } from 'reactstrap';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import slottingKeys from '@triniti/app/config/slottingKeys.js';

function SearchArticlesRequestFields(props) {
  const { pbj } = props;

  return (
    <>
      <TextField
        nestedPbj={pbj}
        pbjName="q"
        name="search_request.q"
        label="Query" />

      <Row>
        <Col sm={6} xl={6}>
          <ChannelPickerField
            nestedPbj={pbj}
            pbjName="channel_ref"
            name="search_request.channel_ref"
            label="Channel"
          />
        </Col>
        <Col sm={6} xl={6}>
          <CategoryPickerField
            nestedPbj={pbj}
            pbjName="category_refs"
            name="search_request.category_refs"
            label="Categories"
            isMulti
          />
        </Col>
        <Col sm={6} xl={6}>
          <PersonPickerField
            nestedPbj={pbj}
            pbjName="person_refs"
            name="search_request.person_refs"
            label="People"
            isMulti
          />
        </Col>
        <Col sm={6} xl={6}>
          <SelectField
            nestedPbj={pbj}
            pbjName="slotting_key"
            name="search_request.slotting_key"
            label="Slotting Key"
            options={slottingKeys}
          />
        </Col>
      </Row>

      <Row>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="created_after"
            name="search_request.created_after"
            label="Created After"
          />
        </Col>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="created_before"
            name="search_request.created_before"
            label="Created Before"
          />
        </Col>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="updated_after"
            name="search_request.updated_after"
            label="Updated After"
          />
        </Col>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="updated_before"
            name="search_request.updated_before"
            label="Updated Before"
          />
        </Col>
      </Row>

      <Row>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="published_after"
            name="search_request.published_after"
            label="Published After"
          />
        </Col>
        <Col sm={6} xl={6}>
          <DatePickerField
            nestedPbj={pbj}
            pbjName="published_before"
            name="search_request.published_before"
            label="Published Before"
          />
        </Col>
        <Col sm={6} xl={6}>
          <SortField
            enumClass={SearchArticlesSort}
            nestedPbj={pbj}
            pbjName="sort"
            name="search_request.sort"
          />
        </Col>
        <Col sm={6} xl={6}>
          <NumberField
            nestedPbj={pbj}
            pbjName="count"
            name="search_request.count"
            label="Count"
          />
        </Col>
      </Row>
    </>
  );
}

export default withPbj(SearchArticlesRequestFields, 'triniti:news:request:search-articles-request:v1');
