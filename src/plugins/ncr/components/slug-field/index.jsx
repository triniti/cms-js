import React, { lazy } from 'react';
import classNames from "classnames";
import { Badge, InputGroup, Label } from 'reactstrap';
import { CreateModalButton, Loading } from '@triniti/cms/components';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy';
import useNode from '@triniti/cms/plugins/ncr/components/useNode';

const RenameForm = lazy(() => import('@triniti/cms/plugins/ncr/components/slug-field/RenameForm'));

export default function SlugField(props) {
  const { groupClassName = '', label = 'Slug', nodeRef, withDatedSlug = false } = props;
  const policy = usePolicy();
  const { node, refreshNode, pbjxError } = useNode(nodeRef, false);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return <Loading inline size="md" error={error} />;
  }

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const qname = node.schema().getQName();
  const canRename = policy.isGranted(`${qname}:rename`);

  return (
    <div className={rootClassName} id="form-group-slug">
      {label && <Label htmlFor="slug">{label}<Badge className="ms-1" color="light" pill>required</Badge></Label>}
      <InputGroup>
        <input
          id="slug"
          name="slug"
          value={node.get('slug')}
          className="form-control"
          readOnly
          required
        />
        {canRename && (
          <CreateModalButton
            text="Rename"
            modal={RenameForm}
            modalProps={{
              nodeRef: nodeRef,
              pbj: node,
              onRenamed: refreshNode,
              withDatedSlug: withDatedSlug
            }}
          />
        )}
      </InputGroup>
    </div>
  );
}
