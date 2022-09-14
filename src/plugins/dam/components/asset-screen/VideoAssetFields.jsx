import React from 'react';
import artifactUrl from 'plugins/ovp/artifactUrl';
import ReactPlayer from 'react-player';
import classNames from 'classnames';
import CommonFields from './CommonFields';


export default function VideoAssetFields(props) {
  const {asset, groupClassName = ''} = props  

  const rootClassName = classNames(
    groupClassName,
     'form-group',
  );  
  return (
    <div className={rootClassName}>
     <ReactPlayer url={artifactUrl(asset, 'video')} width="100%" height="auto" controls />
     <CommonFields asset={asset} credit="video-asset-credits" />
    </div>
  );
}
