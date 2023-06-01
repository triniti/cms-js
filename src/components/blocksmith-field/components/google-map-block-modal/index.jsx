import React from 'react';
import { ModalBody } from 'reactstrap';
import { NumberField, SelectField, SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

const mapTypeOptions = [
  { label: 'roadmap', value: 'roadmap' },
  { label: 'satellite', value: 'satellite' },
];

function GoogleMapBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="q" label="Location" placeholder="enter location" />
        <SwitchField name="is_auto_zoom" label="Auto Zoom" />
        <NumberField name="zoom" label="Zoom" />
        <SelectField name="maptype" label="Map Type" options={mapTypeOptions} />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(GoogleMapBlockModal);
