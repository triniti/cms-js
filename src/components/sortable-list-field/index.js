import React from 'react';
import isEmpty from 'lodash-es/isEmpty.js';
import fastDeepEqual from 'fast-deep-equal/es6';
import useFormContext from '@triniti/cms/components/useFormContext.js';
import { FieldArray } from 'react-final-form-arrays';
import SortableList from '@triniti/cms/components/sortable-list/index.js';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

export default function SortableListField(props) {
  const {
    name,
    components,
    keyField = 'name',
    renderedNoItems,
    renderedAddItem,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode, form } = formContext;
  const onChange = (values) => form.change(name, values);

  return (
    <div id={`sortable-${name}`}>
      <FieldArray name={name} isEqual={isEqual}>
        {({ fields }) => {
          if (!editMode && fields.length === 0) {
            return renderedNoItems;
          }

          const handleUpdate = index => pbj => fields.update(index, pbj.toObject());

          return (
            <SortableList
              keyField={keyField}
              items={fields.value}
              onChange={onChange}
              renderItem={({item, index}) => (
                <SortableList.Item id={item[keyField]} editMode={editMode}>
                  <components.Placeholder
                    name={`${name}[${index}]`}
                    pbjName={name}
                    fieldName={name}
                    onRemove={() => fields.remove(index)}
                    onUpdate={handleUpdate(index)}
                    componentDragHandle={<SortableList.DragHandle />}
                  />
                </SortableList.Item>
              )}
              {...rest}
              />
            );
        }}
      </FieldArray>
      {editMode && (renderedAddItem)}
    </div>
  );
}
