import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import isEmpty from 'lodash-es/isEmpty.js';
import { useField, useFormContext } from '@triniti/cms/components/index.js';
import defaultLoadOptions from '@triniti/cms/plugins/ncr/components/node-picker-field/loadOptions.js';
import MultiValueLabel from '@triniti/cms/plugins/ncr/components/node-picker-field/MultiValueLabel.js';
import Option from '@triniti/cms/plugins/ncr/components/node-picker-field/Option.js';
import SortableValues from '@triniti/cms/plugins/ncr/components/node-picker-field/SortableValues.js';

const defaultComponents = { MultiValueLabel, Option };
const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

export default function MultiSelectField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    debounceTimeout = 400,
    isClearable = false,
    readOnly = false,
    required = false,
    labelField = 'title',
    showImage = true,
    sortable = false,
    components = defaultComponents,
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, isEqual }, formContext);
  const [q, setQ] = useState(request.get('q'));

  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'select',
    showImage && 'select-with-image',
    sortable && 'select-stacked',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: v })) : [];

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      {sortable && input.value.length && <SortableValues input={input} {...props} editMode={editMode} />}
      <AsyncPaginate
        {...input}
        {...rest}
        id={name}
        name={name}
        className={className}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        closeMenuOnSelect={false}
        controlShouldRenderValue={!sortable}
        isMulti
        inputValue={q}
        onInputChange={(value, action) => {
          if (action.action === 'input-change') {
            request.set('q', value);
            setQ(value);
            return;
          }

          if (action.action === 'menu-close') {
            request.clear('q');
            setQ('');
          }
        }}
        cachedUniqs={[q]}
        hideSelectedOptions={false}
        value={currentOptions}
        debounceTimeout={debounceTimeout}
        showImage={showImage}
        labelField={labelField}
        components={components}
        loadOptions={loadOptions}
        additional={{ page: 1, request }}
        onChange={selected => input.onChange(selected ? selected.map(o => o.value) : undefined)}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
