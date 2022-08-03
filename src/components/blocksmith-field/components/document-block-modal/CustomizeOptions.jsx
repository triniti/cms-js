import React from 'react';
import { Label } from 'reactstrap';
import ReactSelect from 'react-select';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { SwitchField, TextField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';

const aspectRatios = [
  { label: 'auto', value: 'auto' },
  { label: '1 by 1', value: '1by1' },
  { label: '2 by 3', value: '2by3' },
  { label: '3 by 2', value: '3by2' },
  { label: '3 by 4', value: '3by4' },
  { label: '4 by 3', value: '4by3' },
  { label: '4 by 5', value: '4by5' },
  { label: '5 by 4', value: '5by4' },
  { label: '5 by 6', value: '5by6' },
  { label: '6 by 5', value: '6by5' },
  { label: '9 by 16', value: '9by16' },
  { label: '16 by 9', value: '16by9' },
];

export default function CustomizeOptions(props) {
  const {
    aside,
    setAside,
    aspectRatio,
    setAspectRatio,
    launchText,
    setLaunchText,
    selectedDocumentNode,
    selectedDocumentRef,
    selectedImageRef,
    setImageRef
  } = props;

  const nodeRef = selectedDocumentRef ?
    selectedDocumentRef.toString() : NodeRef.fromNode(selectedDocumentNode).toString();
  const currentOption = aspectRatio ? aspectRatios.find(o => `${o.value}` === aspectRatio.value) : null;

  return (
    <div className="container-lg p-5">
      <ImagePickerField
        label="Image"
        nodeRef={nodeRef}
        onSelectImage={setImageRef}
        selectedImageRef={selectedImageRef}
      />
      <div className="form-group">
        <Label>Aspect Ratio</Label>
        <ReactSelect
          name="aspect_ratio"
          className="select"
          classNamePrefix="select"
          isMulti={false}
          options={aspectRatios}
          value={currentOption}
          defaultValue={aspectRatios[0]}
          isSelected={!!aspectRatio}
          aspectRatio={aspectRatio}
          onChange={selected => setAspectRatio(selected ? AspectRatio.create(selected.value) : null)}
        />
      </div>
      <TextField
        name="launch_text"
        label="Launch Text"
        value={launchText}
        onChange={(e) => setLaunchText(e.target.value)}
      />
      <SwitchField
        name="aside"
        label="Aside"
        checked={aside}
        onChange={(e) => setAside(e.target.checked)}
      />
    </div>
  );
}
