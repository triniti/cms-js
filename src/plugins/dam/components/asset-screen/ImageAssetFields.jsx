import React from 'react';
import classNames from 'classnames';
import { Media } from 'reactstrap';
import { TextField } from 'components';
import damUrl from 'plugins/dam/damUrl';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';
import CommonFields from './CommonFields';

export default function ImageAssetFields(props) {
  const {asset, groupClassName = ''} = props  

  const getDimensions = (value) => {
    return `${value} x ${asset.get('height')}`;
  }

  const rootClassName = classNames(
    groupClassName,
     'form-group',
  );  
  return (
    <div className={rootClassName}>
      <TextField name="width" label="Dimensions" format={getDimensions} readOnly/>
      <Media
         src={damUrl(asset, '1by1', 'xs', null)} // todo: react maginfier
         alt=""
         width="160"
         height="auto"
         object
         className="rounded-2" 
      />
      <CommonFields asset={asset} credit="image-asset-credits"/>
      <PollPickerField name="polls" label="Search and Select a Poll" />
    </div>  
  );
}
