import React, { useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { components } from 'react-select';
import { CSS } from '@dnd-kit/utilities';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import isEmpty from 'lodash-es/isEmpty.js';
import { useField, useFormContext } from '@triniti/cms/components/index.js';
import defaultLoadOptions from '@triniti/cms/plugins/ncr/components/node-picker-field/loadOptions.js';
import MultiValueLabel from '@triniti/cms/plugins/ncr/components/node-picker-field/MultiValueLabel.js';
import Option from '@triniti/cms/plugins/ncr/components/node-picker-field/Option.js';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

const SortableMultiValueLabel = (props) => {
  const disabled = typeof props.selectProps?.sortable === undefined ? true : !props.selectProps?.sortable;
  const { attributes, listeners } = useSortable({ id: props.data.value, disabled });
  return (
    <div {...attributes} {...listeners}>
      <MultiValueLabel {...props} className="w-100" />
    </div>
  );
};

const SortableMultiValue = (props) => {
  const { setNodeRef, transform, transition } = useSortable({ id: props.data.value });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <components.MultiValue {...props} className="multi-select-sortable" />
    </div>
  );
};

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
    components = {
      MultiValue: SortableMultiValue,
      MultiValueLabel: SortableMultiValueLabel,
      Option,
    },
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, isEqual }, formContext);
  const [ q, setQ ] = useState(request.get('q'));

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const className = classNames(
    'select',
    showImage && 'select-with-image',
    sortable && 'select-stacked',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: v })) : [];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const items = input.value;
      const oldIndex = items.findIndex((i) => i === active.id);
      const newIndex = items.findIndex((i) => i === over.id);
      input.onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label &&
        <Label htmlFor={name} className="position-relative">
          {label}
          {required && <Badge className="ms-1" color="light" pill>required</Badge>}
          {sortable && <Badge className="ms-1 position-absolute end-0" color="light">sortable</Badge>}
        </Label>}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={currentOptions.map((o) => o.value)}>
          <AsyncPaginate
            {...input}
            {...rest}
            id={name}
            name={name}
            className={className}
            classNamePrefix='select'
            isDisabled={!editMode || readOnly}
            isClearable={isClearable}
            closeMenuOnSelect={true}
            isMulti
            value={currentOptions}
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
            onChange={selected => input.onChange(selected ? selected.map(o => o.value) : undefined)}
            debounceTimeout={debounceTimeout}
            showImage={showImage}
            components={components}
            loadOptions={loadOptions}
            additional={{ page: 1, request }}
            sortable={sortable}
          />
        </SortableContext>
      </DndContext>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
