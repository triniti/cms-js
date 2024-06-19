import React from 'react';
import humanizeEnums from '@triniti/cms/blocksmith/utils/humanizeEnums.js';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import ReactSelect from 'react-select';
import { Label } from 'reactstrap';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio.js';

const aspectRatioOptions = humanizeEnums(AspectRatio, {
  format: 'map',
  shouldStartCase: false,
  except: [
    AspectRatio.CUSTOM,
    AspectRatio.UNKNOWN,
  ],
});

const CustomizeOptions = ({
  aside,
  aspectRatio,
  launchText,
  setLaunchText,
  onChangeStartAtPoster: handleChangeStartAtPoster,
  onSelectImage: handleSelectImage,
  setAspectRatio,
  selectedGallery,
  selectedImageRef = null,
  startsAtPoster,
  title,
  setTitle,
  setAside,
}) => {
  const nodeRef = `${NodeRef.fromNode(selectedGallery)}`;

  const handleUploadedImage = (nodes) => {
    if (!nodes.length) {
      return;
    }

    handleSelectImage(NodeRef.fromNode(nodes[0]));
  }

  return (
    <div className="container-lg p-5">
      <AssetPickerField
        label="Image"
        name="image_ref"
        nodeRef={nodeRef}
        onSelectAsset={handleSelectImage}
        selectedAssetRef={selectedImageRef}
        aspectRatio={aspectRatio}
        launchText={launchText}
        onUploadedAssetComplete={handleUploadedImage}
      />
      <Label>Aspect Ratio</Label>
      <ReactSelect
        name="aspect_ratio"
        className="select"
        classNamePrefix="select"
        isMulti={false}
        options={aspectRatioOptions}
        value={aspectRatio ? aspectRatioOptions.find(o => o.value === aspectRatio.value) : null}
        defaultValue={aspectRatioOptions[0]}
        isSelected={!!aspectRatio}
        onChange={selected => { setAspectRatio(selected ? AspectRatio.create(selected.value) : null)}}
      />
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
        tooltip="Is only indirectly related to the main content."
        />
      <SwitchField
        name="start_at_poster"
        label="Start At Poster Image"
        checked={startsAtPoster}
        onChange={handleChangeStartAtPoster}
        />
      <TextField
        name="title"
        label="Custom Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}

export default CustomizeOptions;
