import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon, withPbj } from 'components';
import Swal from 'sweetalert2';
import cloneNode from 'plugins/ncr/actions/cloneNode';
import progressIndicator from 'utils/progressIndicator';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl';
import toast from '@triniti/cms/utils/toast';

const Component = ({ node, pbj: nodeClone }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClone = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Node will be cloned!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Clone!',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    });
  
    if (!result.value) {
      return false;
    }

    await progressIndicator.show('Cloning Node...');
    await dispatch(cloneNode(node, nodeClone));
    await progressIndicator.close();
    await navigate(nodeUrl(nodeClone, 'edit'));
    toast({ title: 'Node Created.' });
  };

  return (
    <Link onClick={handleClone}>
      <Button color="hover">
        <Icon imgSrc="documents" alt="clone" />
      </Button>
    </Link>
  );
}

export default ({ node }) => {
  const ComponentWithPbj = withPbj(Component, node.schema().getCurieMajor());
  return <ComponentWithPbj node={node} />;
}