import React from 'react';
import classNames from 'classnames';
import CommonFields from './CommonFields';

export default function ArchiveAssetFields(props) {
  const {asset, groupClassName = ''} = props  

  const rootClassName = classNames(
    groupClassName,
     'form-group',
  );  
  return (
    <div className={rootClassName}>
      <CommonFields asset={asset} credit="archive-asset-credits" />
    </div>  
  );
}
