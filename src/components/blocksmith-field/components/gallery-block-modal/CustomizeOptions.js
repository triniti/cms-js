import React from 'react';
import humanizeEnums from '@triniti/cms/components/blocksmith-field/utils/humanizeEnums';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import ReactSelect from 'react-select';
import { Label } from 'reactstrap';
import { SwitchField, Icon, TextField } from 'components';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';

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
      <ImagePickerField
        label="Image"
        name="image_ref"
        nodeRef={nodeRef}
        onSelectImage={handleSelectImage}
        selectedImageRef={selectedImageRef}
        aspectRatio={aspectRatio}
        launchText={launchText}
        onUploadedImageComplete={handleUploadedImage}
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
