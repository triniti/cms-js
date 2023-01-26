import React from 'react';
import { Badge, Button, CardText } from 'reactstrap';
import { useField } from 'react-final-form';
import { CreateModalButton, Icon, useFormContext, withPbj } from 'components';
import schemaToCurie from 'utils/schemaToCurie';
import useNode from 'plugins/ncr/components/useNode';
import SlotModal from 'plugins/curator/components/promotion-screen/SlotModal';

export default function SlotPlaceholder(props) {
  const { editMode } = useFormContext();
  const { index, onDrop, onRemove, onUpdate, name: fieldName } = props;
  const { input } = useField(fieldName);

  const slotValues = input.value;
  const { name, rendering, _schema, widget_ref } = slotValues;
  const curie = schemaToCurie(_schema);
  const key = `${name}-${rendering}-${widget_ref.split('-').pop()}`;

  if (typeof slotValues === 'object' && !slotValues._schema) {
    input.value['_schema'] = 'pbj:triniti:curator::slot:1-0-0';
  }

  const { node } = useNode(widget_ref, false);
  const widgetType = node.schema().getCurie().getMessage();

  const rowClassnames = editMode
    ? 'sortable-field sortable-handle d-flex flex-nowrap align-items-center mt-1 mx-2 mx-sm-4'
    : 'sortable-field d-flex flex-nowrap align-items-center mt-1 mx-2 mx-sm-4'

  return (
    <div
      key={key}
      data-id={key}
      data-index={index}
      className={rowClassnames}
      id={`btn-sort-${index}`}
      onDrop={e => onDrop(e)}
    >
      <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
        <Icon imgSrc="insert" size="lg" className="text-black-50" />
      </div>
      <div className="d-flex px-2">
        <CardText className="ms-1 mb-1">
          {`${node.get('title')} :: ${name} (${rendering}) `}
          <Badge color="light" pill>{widgetType}</Badge>
        </CardText>
      </div>
      <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
        <CreateModalButton
          text=""
          color="hover"
          className="me-0 mb-0 rounded-circle"
          icon={editMode ? 'pencil' : 'eye'}
          modal={withPbj(SlotModal, curie, input.value)}
          modalProps={{
            editMode,
            curie,
            onSubmit: onUpdate,
            widgetRef: widget_ref
          }}
        />
        {editMode && (
          <Button color="hover" className="mb-0 rounded-circle" onClick={onRemove}>
            <Icon imgSrc="trash" alt="Remove" />
          </Button>
        )}
      </div>
    </div>
  );
}