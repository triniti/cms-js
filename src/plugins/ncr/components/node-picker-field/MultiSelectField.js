import React, { useState, useCallback } from 'react';
import ReactSelect from 'react-select';
import { useAsyncPaginate, useComponents } from 'react-select-async-paginate';
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
  
  const [searchValue, setSearchValue] = useState('');
  const componentsMap = useComponents(components);
  
  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'select',
    showImage && 'select-with-image',
    sortable && 'select-stacked',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid'
  );
  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: v })) : [];
  
  const {
    inputValue: asyncInputValue,
    onInputChange: asyncOnInputChange,
    ...asyncPaginateProps
  } = useAsyncPaginate({
    loadOptions,
    debounceTimeout,
    additional: { page: 1, request },
    filterOption: null,
  });

  const handleMenuClose = () => {
    setSearchValue('');
  };
  
  const handleInputChange = useCallback((value, meta) => {
    const { action } = meta;
    let nextValue;

    if (action === 'input-change') {
      setSearchValue(value);
      nextValue = value;
    } else if (action === 'menu-close' || action === 'input-blur') {
      setSearchValue('');
      nextValue = '';
    } else if (action === 'set-value') {
      nextValue = searchValue;
    }

    const valueForAsync = typeof nextValue !== 'undefined' ? nextValue : value;
    return asyncOnInputChange ? asyncOnInputChange(valueForAsync, meta) : valueForAsync;
  }, [searchValue, asyncOnInputChange]);
  
  const handleChange = useCallback((selected) => {
    input.onChange(selected ? selected.map(o => o.value) : undefined);
  }, [input]);
  
  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      {sortable && input.value.length > 0 && <SortableValues input={input} {...props} editMode={editMode} />}
      <ReactSelect
        {...asyncPaginateProps}
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
        hideSelectedOptions={false}
        value={currentOptions}
        showImage={showImage}
        labelField={labelField}
        components={componentsMap}
        inputValue={searchValue || asyncInputValue || ''}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onBlur={(e) => {
          handleMenuClose();
          input.onBlur(e);
        }}
        onFocus={input.onFocus}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
