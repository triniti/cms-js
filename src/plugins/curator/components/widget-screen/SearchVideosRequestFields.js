import React from 'react';
import { DatePickerField, NumberField, TextField, withPbj } from '@triniti/cms/components/index.js';
import { Col, Row } from 'reactstrap';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';

function SearchVideosRequestFields(props) {
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
            enumClass={SearchVideosSort}
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

export default withPbj(SearchVideosRequestFields, 'triniti:ovp:request:search-videos-request:v1');
