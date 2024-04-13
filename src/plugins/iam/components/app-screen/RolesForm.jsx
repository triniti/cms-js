import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import isEmpty from 'lodash-es/isEmpty';
import { useDispatch } from 'react-redux';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest';
import { ActionButton, Loading } from '@triniti/cms/components';
import progressIndicator from '@triniti/cms/utils/progressIndicator';
import toast from '@triniti/cms/utils/toast';
import sendAlert from '@triniti/cms/actions/sendAlert';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy';
import grantRolesToApp from '@triniti/cms/plugins/iam/actions/grantRolesToApp';
import revokeRolesFromApp from '@triniti/cms/plugins/iam/actions/revokeRolesFromApp';

function RolesForm(props) {
  const { node, nodeRef, request, refreshNode } = props;
  const { response, pbjxError } = useRequest(request, true);
  const dispatch = useDispatch();
  const policy = usePolicy();
  const [grants, setGrants] = useState({});
  const [revokes, setRevokes] = useState({});

  const handleGrantableChange = (evt) => {
    const roleRef = evt.target.value;
    const newGrants = { ...grants };

    if (newGrants[roleRef]) {
      delete newGrants[roleRef];
    } else {
      newGrants[roleRef] = true;
    }

    setGrants(newGrants);
  };

  const handleRevokeableChange = (evt) => {
    const roleRef = evt.target.value;
    const newRevokes = { ...revokes };

    if (newRevokes[roleRef]) {
      delete newRevokes[roleRef];
    } else {
      newRevokes[roleRef] = true;
    }

    setRevokes(newRevokes);
  };

  const canGrant = policy.isGranted('gdbots:iam:command:grant-roles-to-app') && !isEmpty(grants);
  const canRevoke = policy.isGranted('gdbots:iam:command:revoke-roles-from-app') && !isEmpty(revokes);

  const handleGrant = async () => {
    try {
      await progressIndicator.show(`Granting role(s) to ${node.get('title')}...`);
      await dispatch(grantRolesToApp(nodeRef, Object.keys(grants)));
      await refreshNode();
      await progressIndicator.close();
      toast({ title: 'Roles granted.' });
      setGrants({});
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  const handleRevoke = async () => {
    try {
      await progressIndicator.show(`Revoking role(s) from ${node.get('title')}...`);
      await dispatch(revokeRolesFromApp(nodeRef, Object.keys(revokes)));
      await refreshNode();
      await progressIndicator.close();
      toast({ title: 'Roles revoked.' });
      setRevokes({});
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  return (
    <Card>
      <CardHeader>Roles</CardHeader>
      <CardBody>
        <Row>
          <Col sm="12" md={{ size: 5, offset: 1 }} xl={{ size: 4, offset: 2 }} className="pt-1 pb-3">
            <Card className="border p-0 h-100 rounded mb-2">
              <CardHeader className="rounded-top justify-content-center">
                Assigned
              </CardHeader>
              <CardBody className="text-center pt-3 px-3 pb-2 bg-gray-100 rounded-bottom">
                <ActionButton
                  text="Revoke Roles"
                  onClick={handleRevoke}
                  disabled={!canRevoke}
                  color="warning"
                  className="me-0 mb-3"
                />
                <ListGroup className="border rounded">
                  {node.get('roles', []).map((roleRef) => {
                    const id = roleRef.getId();
                    const domId = `revoke-${id}`;
                    const value = `${roleRef}`;
                    return (
                      <ListGroupItem key={`li-${domId}`} className="list-group-item-roles ps-3">
                        <div key={domId} className="custom-control custom-checkbox w-100 mb-0">
                          <input
                            id={domId}
                            type="checkbox"
                            className="custom-control-input"
                            value={value}
                            checked={revokes[value] || false}
                            onChange={handleRevokeableChange}
                          />
                          <Label className="custom-control-label" htmlFor={domId}>{id}</Label>
                        </div>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          <Col sm="12" md="5" xl="4" className="pt-1 pb-3">
            <Card className="border p-0 h-100 rounded mb-2">
              <CardHeader className="rounded-top justify-content-center">
                Available
              </CardHeader>
              <CardBody className="text-center pt-3 px-3 pb-2 bg-gray-100 rounded-bottom">
                <ActionButton
                  text="Grant Roles"
                  onClick={handleGrant}
                  disabled={!canGrant}
                  color="secondary"
                  className="me-0 mb-3"
                />
                <ListGroup className="border rounded">
                  {(!response || pbjxError) && (
                    <div className="py-3 bg-transparent">
                      <Loading size="md" error={pbjxError}>Loading Roles...</Loading>
                    </div>
                  )}
                  {response && response.get('nodes', []).map((role) => {
                    const roleRef = role.generateNodeRef();
                    if (node.isInSet('roles', roleRef)) {
                      return null;
                    }

                    const id = roleRef.getId();
                    const domId = `grant-${id}`;
                    const value = `${roleRef}`;
                    return (
                      <ListGroupItem key={`li-${domId}`} className="list-group-item-roles ps-3">
                        <div key={domId} className="custom-control custom-checkbox w-100 mb-0">
                          <input
                            id={domId}
                            type="checkbox"
                            className="custom-control-input"
                            value={value}
                            checked={grants[value] || false}
                            onChange={handleGrantableChange}
                          />
                          <Label className="custom-control-label" htmlFor={domId}>{id}</Label>
                        </div>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default withRequest(RolesForm, 'gdbots:iam:request:search-roles-request', {
  channel: 'roles-tab',
});
