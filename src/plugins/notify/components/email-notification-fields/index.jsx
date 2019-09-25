import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import Message from '@gdbots/pbj/Message';
import NotificationFields from '@triniti/cms/plugins/notify/components/notification-fields';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import SelectField from '@triniti/cms/components/select-field';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  RouterLink,
  Row,
} from '@triniti/admin-ui-plugin/components';

const EmailNotificationFields = (props) => {
  const { isEditMode, app } = props;
  const linkToApp = pbjUrl(app, 'cms');

  return (
    <>
      <NotificationFields {...props} />
      <Card>
        <CardHeader>Email Options</CardHeader>
        <CardBody>
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="Template"
            name="template"
            picklistId="email-notification-templates"
          />
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="Subject"
            name="subject"
            picklistId="email-notification-subjects"
          />
          <Label for="sender">Sender</Label>
          <Row>
            <Col>
              {
                app.get('sendgrid_senders') ? (
                  <Field
                    component={SelectField}
                    disabled={!isEditMode}
                    name="sender"
                    options={Object.entries(app.get('sendgrid_senders')).map(
                      (item) => ({ label: item[0], value: item[0] }),
                    )}
                    placeholder="Enter sender email address"
                  />
                ) : (
                  <div className="d-inline-flex mb-4">
                    No senders found, make sure to add senders on the App itself:&nbsp;
                    <RouterLink to={linkToApp} target="_blank">
                      {app.get('title')}
                    </RouterLink>
                  </div>
                )
              }
            </Col>
          </Row>
          <Label for="lists">Lists</Label>
          <Row>
            <Col>
              {
                app.get('sendgrid_lists') ? (
                  <Field
                    component={SelectField}
                    disabled={!isEditMode}
                    multi
                    name="lists"
                    options={Object.entries(app.get('sendgrid_lists')).map(
                      (item) => ({ label: item[0], value: item[0] }),
                    )}
                    placeholder="Select lists"
                  />
                ) : (
                  <div className="d-inline-flex mb-4">
                    No lists found, make sure to add lists on the App itself:&nbsp;
                    <RouterLink to={linkToApp} target="_blank">
                      {app.get('title')}
                    </RouterLink>
                  </div>
                )
              }
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

EmailNotificationFields.propTypes = {
  app: PropTypes.instanceOf(Message).isRequired,
  content: PropTypes.instanceOf(Message),
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  showDatePicker: PropTypes.bool,
};

EmailNotificationFields.defaultProps = {
  content: null,
  isEditMode: false,
  showDatePicker: false,
};

export default EmailNotificationFields;
