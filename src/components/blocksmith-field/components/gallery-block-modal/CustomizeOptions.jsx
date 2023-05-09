import React from 'react';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';
import humanizeEnums from 'components/blocksmith-field/utils/humanizeEnums';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import UncontrolledTooltip from 'components/uncontrolled-tooltip';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import ReactSelect from 'react-select';
import { Label } from 'reactstrap';
import { SwitchField, Icon, TextField } from 'components';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

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
  hasUpdatedDate,
  launchText,
  setLaunchText,
  onChangeStartAtPoster: handleChangeStartAtPoster,
  onSelectImage: handleSelectImage,
  setUpdatedDate,
  setAspectRatio,
  selectedGallery,
  selectedImageRef = null,
  startsAtPoster,
  title,
  setTitle,
  updatedDate,
  setHasUpdatedDate,
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
        name="hasUpdatedDate"
        label="Is Update"
        checked={hasUpdatedDate}
        onChange={(e) => setHasUpdatedDate(e.target.checked)}
        />
      <div className="form-group d-flex align-items-center mb-0">
        <SwitchField
          name="aside"
          label="Aside"
          checked={aside}
          onChange={(e) => setAside(e.target.checked)}
          style={{display: 'flex', justifyContent: 'space-between'}}
          />
        <Icon imgSrc="info-outline" id="aside-tooltip" className="ms-1 align-self-start" />
        <UncontrolledTooltip target="aside-tooltip" placement="right">Is only indirectly related to the main content.</UncontrolledTooltip>
      </div>
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
      {hasUpdatedDate
      && (
        <DateTimePicker
          onChangeDate={date => setUpdatedDate(changedDate(date).updatedDate)}
          onChangeTime={({ target: { value: time } }) => setUpdatedDate(changedTime(time).updatedDate)}
          updatedDate={updatedDate}
        />
      )}
    </div>
  );
}

export default CustomizeOptions;