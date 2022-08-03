import React, { Fragment, useEffect, useRef } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import isEmpty from 'lodash-es/isEmpty';
import fastDeepEqual from 'fast-deep-equal/es6';
import Sortable from 'sortablejs';
import { CreateModalButton, withPbj } from 'components';
import SlotPlaceholder from 'plugins/curator/components/promotion-screen/SlotPlaceholder';
import SlotModal from 'plugins/curator/components/promotion-screen/SlotModal';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b))

// fixme: figure out how the list of slots should group and sort.

export default function SortableSlots(props) {
  const { editMode, form } = props;
  const { move, push } = form.mutators;
  const sortableRef = useRef();

  useEffect(() => {
    if (!editMode) {
      return;
    }

    Sortable.create(sortableRef.current, {
      draggable: '.sortable-field',
      ghostClass: 'slot-group-divider',
      handle: '.sortable-handle',
      onEnd: evt => move('slots', evt.oldDraggableIndex, evt.newDraggableIndex),
    });
  }, [editMode]);

  return (
    <div id="sortable-slots" ref={sortableRef} className="card bg-gray-100 border rounded">
      <FieldArray name="slots" isEqual={isEqual}>
        {({ fields }) => {
          if (!editMode && fields.length === 0) {
            return <input className="form-control" readOnly value="No slots" />;
          }

          return fields.map((fname, index) => {
            const getAdjacentIndex = (name, index = fields.length - 1) => {
              for (let i = fields.length - 1; i >= 0; i--) {
                if (fields.value[i]['name'] === name) {
                  return i + 1;
                }
              }
            };

            const getPreviousSibling = function (elem, selector) {
              let sibling = elem.previousElementSibling;
              if (!selector) return sibling;

              while (sibling) {
                if (sibling.matches(selector)) return sibling;
                sibling = sibling.previousElementSibling;
              }
            };

            const handleDrop = (e) => {
              let target = e.target;
              if (!e.target.classList.contains('sortable-field')) {
                target = e.target.closest('.sortable-field');
              }

              const closestHeader = getPreviousSibling(target, '.slot-group-divider');
              const newValue = { ...fields.value[index] };
              newValue['name'] = closestHeader.children[0].textContent;
              fields.update(index, newValue);
            };

            const handleRemove = () => fields.remove(index);

            const handleUpdate = pbj => {
              fields.update(index, pbj.toObject());
              if (pbj.toObject().name !== fields.value[index - 1]['name']) {
                const newIndex = getAdjacentIndex(pbj.toObject().name, index);
                if (newIndex) {
                  fields.move(index, newIndex);
                } else {
                  fields.move(index, (fields.length));
                }
              }
            };

            return (
              <Fragment key={fname}>
                {index === 0 && (
                  <>
                    <div className="card-header slot-group-divider mb-2">
                      <h4 className="mb-0">
                        {fields.value[index]['name']}
                      </h4>
                    </div>
                    <SlotPlaceholder
                      name={fname}
                      index={index}
                      pbjName="slots"
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onUpdate={handleUpdate}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                    />
                  </>
                )}
                {index > 0 && fields.value[index - 1]['name'] !== fields.value[index]['name'] && (
                  <>
                    <div className="card-header slot-group-divider mt-1 mb-2">
                      <h4 className="mb-0">
                        {fields.value[index]['name']}
                      </h4>
                    </div>
                    <SlotPlaceholder
                      name={fname}
                      index={index}
                      pbjName="slots"
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onUpdate={handleUpdate}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                    />
                  </>
                )}
                {index > 0 && fields.value[index - 1]['name'] === fields.value[index]['name'] && (
                  <SlotPlaceholder
                    name={fname}
                    index={index}
                    pbjName="slots"
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                    isFirst={index === 0}
                    isLast={index === fields.length - 1}
                  />
                )}
                {index === fields.length - 1 && editMode && (
                  <div className="card-footer mt-1">
                    <CreateModalButton
                      className="mb-0"
                      text="Add Slot"
                      icon={'plus-outline'}
                      modal={withPbj(SlotModal, 'triniti:curator::slot')}
                      modalProps={{
                        editMode,
                        curie: 'triniti:curator::slot',
                        onSubmit: (pbj) => {
                          const adjacentIndex = getAdjacentIndex(pbj.get('name'));
                          if (adjacentIndex && adjacentIndex !== (fields.length)) {
                            fields.insert(adjacentIndex, pbj.toObject());
                          } else {
                            push('slots', pbj.toObject());
                          }
                        },
                      }}
                    />
                  </div>
                )}
              </Fragment>
            );
          });
        }}
      </FieldArray>
    </div>
  );
}
