import React from 'react';
import classNames from 'classnames';

export default function ArchiveAssetFields(props) {
  const {asset, groupClassName = ''} = props  

  const rootClassName = classNames(
    groupClassName,
     'form-group',
  );  
  return (
    <div className={rootClassName}> Archive Asset Fields</div>  
  );
}
