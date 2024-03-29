import React, { lazy, Suspense, useState } from 'react';
import { useField, useFormState } from 'react-final-form';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import { Label } from 'reactstrap';
import { ErrorBoundary, Loading, useFormContext } from 'components';

export const searchRequestFields = {
  'search-teasers-request': lazy(() => import('plugins/curator/components/widget-screen/widget-has-search-request-fields/SearchTeasersRequestFields')),
  'search-galleries-request': lazy(() => import('plugins/curator/components/widget-screen/widget-has-search-request-fields/SearchGalleriesRequestFields')),
  'search-articles-request': lazy(() => import('plugins/curator/components/widget-screen/widget-has-search-request-fields/SearchArticlesRequestFields')),
  'search-videos-request': lazy(() => import('plugins/curator/components/widget-screen/widget-has-search-request-fields/SearchVideosRequestFields')),
};

export default function SearchRequestTypeField(props) {
  const {
    groupClassName = '',
    name = 'search_request_type',
    label = 'Type',
    readOnly = false,
    searchRequestCuries
  } = props;

  const options = searchRequestCuries.map(curie => (
    { label: curie.split(':')[3], value: `pbj:${curie}:1-0-0` } // fix me: is there a better way?
  ));

  const formContext = useFormContext();
  const { form, editMode } = formContext;
  const { values } = useFormState({ subscription: { values: true } });

  const searchRequestSchema = values.search_request ? values.search_request._schema : '';
  const initialType = searchRequestSchema ? searchRequestSchema.split(':')[4] : null;

  const [schema, setSchema] = useState(searchRequestSchema);
  const [type, setType] = useState(initialType);

  const searchRequestTypeField = useField(name);
  const SearchRequestFields = searchRequestFields[type];
  const currentOption = options.find(o => o.value === schema);
  const selectName = name;

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  return (
    <>
      <div className={rootClassName} id={`form-group-${selectName}`}>
        <Label htmlFor={selectName}>{`${label}`}</Label>
        <ReactSelect
          id={selectName}
          name={selectName}
          className="select"
          classNamePrefix="select"
          isDisabled={!editMode || readOnly}
          options={options}
          value={currentOption}
          onChange={(selected) => {
            const selectedValue = selected.value;
            if (!selected || selectedValue !== type) {
              searchRequestTypeField.input.onChange(undefined);
              searchRequestTypeField.input.onBlur();
            }

            setSchema(selectedValue);
            setType(selectedValue.split(':')[4]);
            form.change('search_request._schema', selectedValue);
          }}
        />
      </div>
      {type && (
        <Suspense fallback={<Loading />}>
          <ErrorBoundary>
            <SearchRequestFields />
          </ErrorBoundary>
        </Suspense>
      )}
    </>
  );
}
