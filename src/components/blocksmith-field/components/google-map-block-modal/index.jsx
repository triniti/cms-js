/* globals GOOGLE_MAPS_API_KEY */
import React, { useState } from 'react';
import { ModalBody } from 'reactstrap';
import { NumberField, SelectField, SwitchField, TextField, TextareaField } from '@triniti/cms/components';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import Preview from '@triniti/cms/components/blocksmith-field/components/google-map-block-modal/Preview';
import debounce from 'lodash-es/debounce';
import GeoPoint from '@gdbots/pbj/well-known/GeoPoint';

const mapTypeOptions = [
  { label: 'roadmap', value: 'roadmap' },
  { label: 'satellite', value: 'satellite' },
];

const debounced = debounce(function(callback){
  return callback();
}, 1000);

function GoogleMapBlockModal(props) {
  const { formState, form } = props;
  const { valid } = formState;
  const { zoom } = formState.values;
  const [ isAutoZoom, setIsAutoZoom ] = useState(!!zoom === false);

  const toggleAutoZoom = () => {
    form.change('zoom', !isAutoZoom ? 0 : 1);
    setIsAutoZoom(!isAutoZoom);
  }

  // Converts address to geographic coordinates using Google Geocoding API
  async function getCoordinatesFromAddress(address) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const { error_message: error, status } = data;
      if (status !== 'OK') {
        console.error('Geocoding failed with error:', status, error);
        return null;
      }

      const { lat, lng } = data.results[0].geometry.location;

      return GeoPoint.fromString(`${lat},${lng}`);
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  }

  const parseLocation = (address) => {
    debounced(() => {
      getCoordinatesFromAddress(address).then((coordinates) => {
        form.change('center', coordinates);
      });
    });
    return address;
  };

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="q" label="Location" placeholder="enter location" parse={parseLocation} required />
        <TextField name="center" style={{display: 'none'}} />
        <SwitchField name="is_auto_zoom" label="Auto Zoom" checked={isAutoZoom} onChange={toggleAutoZoom} />
        {!isAutoZoom && <NumberField name="zoom" label="Zoom" />}
        <SelectField name="maptype" label="Map Type" options={mapTypeOptions} />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
      </ModalBody>
    </div>
  );
}

export default withBlockModal(GoogleMapBlockModal);
