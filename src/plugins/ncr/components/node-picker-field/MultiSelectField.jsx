import React, { useState } from 'react';
import { components } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6';
import isEmpty from 'lodash-es/isEmpty';
import { useField, useFormContext } from 'components';
import defaultLoadOptions from 'plugins/ncr/components/node-picker-field/loadOptions';
import MultiValueLabel from 'plugins/ncr/components/node-picker-field/MultiValueLabel';
import Option from 'plugins/ncr/components/node-picker-field/Option';
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

import './MultiSelectField.scss';

const defaultComponents = { MultiValueLabel, Option };
const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} className="multi-select-sortable" />;
});

const SortableMultiValueLabel = sortableHandle((props) => <MultiValueLabel {...props} />);

const SortableSelect = SortableContainer(AsyncPaginate);

function MultiSelectSort(props) {
  const { setSelectedPollRefs } = props;
  const [selected, setSelected] = React.useState([]);

  const onChange = (selectedOptions) => setSelected(selectedOptions);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    setSelected(newValue);
    setSelectedPollRefs(newValue.map((i) => i.value));
  };

  return (
    <SortableSelect
      {...props}
      useDragHandle
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      
      // react-select props:
      isMulti
      value={selected}
      onChange={onChange}
      components={{
        MultiValue: SortableMultiValue,
        MultiValueLabel: SortableMultiValueLabel
      }}
      closeMenuOnSelect={false}
    />
  );
}

export default function MultiSelectField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    debounceTimeout = 400,
    closeMenuOnSelect = false,
    isClearable = false,
    readOnly = false,
    required = false,
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

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const className = classNames(
    'select',
    showImage && 'select-with-image',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: v })) : null;
  const Select = sortable ? MultiSelectSort : AsyncPaginate;

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <Select
        {...input}
        {...rest}
        id={name}
        name={name}
        className={className}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        closeMenuOnSelect={closeMenuOnSelect}
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
