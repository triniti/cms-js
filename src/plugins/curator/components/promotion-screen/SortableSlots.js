import React from 'react';
import { CreateModalButton, SortableListField, withPbj } from '@triniti/cms/components/index.js';
import SlotModal from '@triniti/cms/plugins/curator/components/promotion-screen/SlotModal.js';
import SlotPlaceholder from '@triniti/cms/plugins/curator/components/promotion-screen/SlotPlaceholder.js';


const SortableSlots = (props) => {
  const { editMode, form } = props;
  const { push } = form.mutators;

  return (
    <SortableListField
      name="slots"
      components={{
        Placeholder: SlotPlaceholder
      }}
      keyField="name"
      renderedNoItems={
        <input className="form-control" readOnly value="No slots." />
      }
      renderedAddItem={
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
      }
    />
  );
}

export default SortableSlots;