import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import { Card, CardBody, CardHeader } from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';
import getFileList from '../../selectors/getFileList';
import variants from './variants';

/*const getVariantSrc = (asset, version, updatedVariants) => {
    const updatedVariant = get(updatedVariants, version, null);
    const rand = `?r=${(new Date()).getTime()}`;
    const status = get(updatedVariant, 'status', null);
    if (status === fileUploadStatuses.COMPLETED) {
      return `${updatedVariant.previewUrl}?r=${(new Date()).getTime()}`;
    }
    return `${damUrl(asset, version, 'sm')}${rand}`;
  };*/

export default function VariantsTab({type, asset}) {
 /* const fileList = useSelector(getFileList);

  const updatedVariants = Object.keys(fileList).reduce((accumulator, hashName) => {
    accumulator[fileList[hashName].version] = fileList[hashName];
    return accumulator;
  }, {});*/
  const variantScope = variants[type];
  return (
      <Card>
        <CardHeader>Variants</CardHeader>
        <CardBody indent className="pl-0 pr-0 pt-0 variants-body">
          <p>
            Click an image you would like to replace or drag a new image over it.
          </p>
          <div className="row">
            <div>
              {Object.keys(variantScope).map((version) => {
                const label = variantScope[version];
              //  const fileStatus = get(updatedVariants, '[version].status');
              //  const shouldShowSpinner = updatedVariants[version] && fileStatus !== fileUploadStatuses.COMPLETED;
                return (
                    <div key={version} >
                    <p>{label}</p>
                    {/*<img src={getVariantSrc(asset, version, updatedVariants)} alt={label} />*/}
                    </div>
                );
              })}
            </div>
         </div>
        </CardBody>
      </Card>
    );
  }