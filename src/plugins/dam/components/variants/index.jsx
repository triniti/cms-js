import { Card, CardBody, CardHeader, Spinner } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Dropzone from 'react-dropzone';
import get from 'lodash/get';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import variants from '@triniti/cms/plugins/dam/variants';
import delegateFactory from './delegate';
import { fileUploadStatuses } from '../../constants';
import selector from './selector';
import './variants.scss';

const getVariantSrc = (asset, version, updatedVariants) => {
  const updatedVariant = get(updatedVariants, version, null);
  const rand = `?r=${(new Date()).getTime()}`;
  const status = get(updatedVariant, 'status', null);
  if (status === fileUploadStatuses.COMPLETED) {
    return `${updatedVariant.previewUrl}?r=${(new Date()).getTime()}`;
  }
  return `${damUrl(asset, version, 'sm')}${rand}`;
};

const aspectRatioToCssClass = (aspectRatio) => `embed-responsive embed-responsive-${aspectRatio}`;

class Variants extends React.Component {
  static propTypes = {
    asset: PropTypes.instanceOf(Message).isRequired,
    type: PropTypes.string.isRequired,
    delegate: PropTypes.shape({
      handleVariantFileDrop: PropTypes.func.isRequired,
      componentWillUnmount: PropTypes.func.isRequired,
    }).isRequired,
    updatedVariants: PropTypes.shape({}),
  };

  static defaultProps = {
    updatedVariants: {},
  };

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.componentWillUnmount();
  }

  render() {
    const {
      delegate,
      asset,
      type,
      updatedVariants,
    } = this.props;
    const { handleVariantFileDrop } = delegate;
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
                const fileStatus = get(updatedVariants, '[version].status');
                const shouldShowSpinner = updatedVariants[version] && fileStatus !== fileUploadStatuses.COMPLETED;
                return (
                  <fieldset key={version} className="thumbnail">
                    <legend>{label}</legend>
                    <Dropzone
                      onDrop={handleVariantFileDrop(asset, version)}
                      className="dam-drop-zone-component"
                      activeClassName="variant-drop-zone-active"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className={aspectRatioToCssClass(version)}>
                          <input {...getInputProps()} />
                          {shouldShowSpinner ? (
                            <Spinner centered className={`position-absolute text-${fileStatus === fileUploadStatuses.UPLOADED ? 'info' : 'light'}`} />
                          ) : (
                            <img
                              src={getVariantSrc(asset, version, updatedVariants)}
                              alt={label}
                            />
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  selector,
  createDelegateFactory(delegateFactory),
)(Variants);
