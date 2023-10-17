import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import isEmpty from 'lodash-es/isEmpty';
import fastDeepEqual from 'fast-deep-equal/es6';
import { CreateModalButton, SortableList, withPbj } from 'components';
import SlotModal from 'plugins/curator/components/promotion-screen/SlotModal';
import SlotPlaceholder from 'plugins/curator/components/promotion-screen/SlotPlaceholder';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b))

const SortableSlots = (props) => {
  const { editMode, form } = props;
  const { push } = form.mutators;
  const onChange = (slots) => form.change('slots', slots);

  return (
    <div id="sortable-slots">
      <FieldArray name="slots" isEqual={isEqual}>
        {({ fields }) => {
          const handleUpdate = index => pbj => fields.update(index, pbj.toObject());

          return (
            <SortableList
              items={fields.value}
              onChange={onChange}
              renderItem={({item, index}) => (
                <SortableList.Item id={item.name}>  
                  <SlotPlaceholder
                    name={`slots[${index}]`}
                    index={item.name}
                    pbjName="slots"
                    fieldName="slots"
                    onRemove={() => fields.remove(index)}
                    onUpdate={handleUpdate(index)}
                    componentDragHandle={<SortableList.DragHandle />}
                    />
                </SortableList.Item>
              )}
              />
            );
        }}
      </FieldArray>
      {editMode && (
        <div className="mt-1">
          <CreateModalButton
            className="mb-0"
            text="Add Slot"
            icon={'plus-outline'}
            modal={withPbj(SlotModal, 'triniti:curator::slot')}
            modalProps={{
              editMode,
              curie: 'triniti:curator::slot',
              onSubmit: (pbj) => push('slots', pbj.toObject()),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SortableSlots;