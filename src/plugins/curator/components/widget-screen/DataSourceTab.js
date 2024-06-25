import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { ErrorBoundary, Loading, SelectField, SwitchField } from '@triniti/cms/components/index.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import startCase from 'lodash-es/startCase.js';

// sort the curies by message, e.g. consider these curies:
// triniti:curator:request:search-teasers-request
// triniti:news:request:search-articles-request
const sort = (a, b) => {
  const aa = a.split(':').pop();
  const bb = b.split(':').pop();
  return (aa > bb) - (aa < bb);
};

const components = {};
const resolveComponent = (id) => {
  if (components[id]) {
    return components[id];
  }

  const parts = id.split(':');
  parts.pop();
  const message = parts.pop();
  const file = startCase(message).replace(/\s/g, '');
  components[id] = lazy(() => import(`@triniti/cms/plugins/curator/components/widget-screen/${file}Fields.js`));
  return components[id];
};

export default function DataSourceTab(props) {
  const { formState } = props;
  const datasource = formState.values?.search_request?._schema;
  const curies = useCuries('triniti:curator:mixin:widget-search-request:v1');
  const [options, setOptions] = useState();

  useEffect(() => {
    if (!curies) {
      return;
    }

    setOptions(curies
      .filter(str => str.startsWith('triniti'))
      .sort(sort)
      .map(curie => {
        return {
          label: curie.split(':').pop().replace('search-', '').replace('-request', ''),
          value: `pbj:${curie}:1-0-0`,
        };
      })
    );
  }, [curies]);

  if (!options) {
    return null;
  }

  const FieldsComponent = datasource && resolveComponent(datasource);

  return (
    <>
      <Card>
        <CardHeader>Data Source</CardHeader>
        <CardBody>
          <SelectField
            name="search_request._schema"
            label="Content Type"
            options={options}
            isClearable={false}
            required
          />
          {datasource && (
            <Suspense fallback={<Loading />}>
              <ErrorBoundary>
                <FieldsComponent {...props} />
              </ErrorBoundary>
            </Suspense>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Display Options</CardHeader>
        <CardBody>
          <Row>
            <Col sm={6} xl={4}>
              <SwitchField name="show_pagination" label="Show Pagination" />
              <SwitchField name="show_item_cta_text" label="Show Item Call To Action" />
              <SwitchField name="show_item_date" label="Show Item Date" />
              <SwitchField name="show_item_duration" label="Show Item Duration" />
            </Col>
            <Col sm={6} xl={4}>
              <SwitchField name="show_item_excerpt" label="Show Item Excerpt" />
              <SwitchField name="show_item_icon" label="Show Item Icon" />
              <SwitchField name="show_item_media_count" label="Show Item Media Count" />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
