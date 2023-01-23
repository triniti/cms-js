import React, { useEffect } from 'react';
import startCase from 'lodash-es/startCase';
import { useDispatch } from 'react-redux';
import { Loading, withForm } from 'components';
import usePolicy from 'plugins/iam/components/usePolicy';
import pruneNodes from 'plugins/ncr/actions/pruneNodes';
import useNode from 'plugins/ncr/components/useNode';
import useDelegate from 'plugins/ncr/components/with-node-screen/useDelegate';
import useParams from 'plugins/ncr/components/with-node-screen/useParams';
import PropTypes from 'prop-types';
import DetailsTab from 'plugins/dam/components/asset-screen/DetailsTab';
import withNodeScreen from 'plugins/ncr/components/with-node-screen';
import { Form } from 'reactstrap';


export { useDelegate, useParams };

const defaultFormConfig = {
  restorable: true,
  keepDirtyOnReinitialize: true,
};

const UploaderForm = props => {
  const {
    formState,
    handleSubmit,
    editMode,
    node,
    isRefreshing,
    qname,
    nodeRef,
    policy,
    tab,
    urls
  } = props;

  const delegate = useDelegate(props);

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);

  return (
    <>
      {/* {dirty && hasValidationErrors && <FormErrors errors={errors} />} */}
      <Form onSubmit={handleSubmit} autoComplete="off">
        <DetailsTab {...props} />
      </Form>
    </>
  );
}

// export default withForm(UploaderForm);
export default withNodeScreen(UploaderForm, {});
