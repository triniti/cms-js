import React from 'react';
import { Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import dismissAlert from '@triniti/cms/actions/dismissAlert';
import getAlerts from '@triniti/cms/selectors/getAlerts';

export default function AlertBar() {
  const dispatch = useDispatch();
  const alerts = useSelector(getAlerts);

  return (
    <div className="alert-wrapper">
      <div className="alert-container">
        {alerts.map((alert) => (
          <Alert key={alert.id} color={alert.type} toggle={() => dispatch(dismissAlert(alert.id))}>
            {alert.message}
          </Alert>
        ))}
      </div>
    </div>
  );
}
