import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';
import { Field } from 'redux-form';

import DatePickerField from '@triniti/cms/components/date-picker-field';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import SelectField from '@triniti/cms/components/select-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  RouterLink,
} from '@triniti/admin-ui-plugin/components';

import { formConfigs } from '../../constants';

const NotificationFields = ({ app, content, isEditMode, node, showDatePicker }) => {
  const sendStatus = node.get('send_status');
  const { SEND_NOW, SCHEDULE_SEND, SEND_ON_PUBLISH } = formConfigs.SEND_OPTIONS;
  const sendOptions = [
    { label: startCase(SEND_NOW.replace('-', ' ')), value: SEND_NOW },
    { label: startCase(SCHEDULE_SEND.replace('-', ' ')), value: SCHEDULE_SEND },
    { label: startCase(SEND_ON_PUBLISH.replace('-', ' ')), value: SEND_ON_PUBLISH },
  ];

  if (!node.has('content_ref') || content.get('status') === NodeStatus.PUBLISHED) {
    sendOptions[2].isDisabled = true;
  } else {
    sendOptions[0].isDisabled = true;
  }

  return (
    <>
      <Card key="custom">
        <CardHeader>Basic Info</CardHeader>
        <CardBody>
          <FormGroup>
            <Label>App</Label>
            <InputGroup>
              <Input readOnly value={app.get('title')} />
            </InputGroup>
          </FormGroup>
          {content && (
          <FormGroup>
            <Label>Content</Label>
            <InputGroup>
              <Input readOnly value={content.get('title')} />
              <InputGroupAddon addonType="append" style={{ borderTop: '1px solid #e9e9e9' }}>
                <Button
                  color="link-bg"
                  tag={RouterLink}
                  target="_blank"
                  to={pbjUrl(content, 'cms')}
                >
                  Open content
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
          )}
          <Field
            component={TextareaField}
            label="Body"
            name="body"
            readOnly={!isEditMode}
            rows={2}
          />
        </CardBody>
      </Card>
      {sendStatus !== NotificationSendStatus.SENT
        && sendStatus !== NotificationSendStatus.FAILED
        && sendStatus !== NotificationSendStatus.CANCELED
        && (
          <Card key="send-options">
            <CardHeader>Send Options</CardHeader>
            <CardBody>
              <Field
                component={SelectField}
                disabled={!isEditMode}
                label="Send Options"
                name="sendOption"
                options={sendOptions}
                placeholder="...choose delivery"
              />
              {showDatePicker && (
              <Field
                component={DatePickerField}
                name="sendAt"
                readOnly={!isEditMode}
              />
              )}
            </CardBody>
          </Card>
        )}
    </>
  );
};

NotificationFields.propTypes = {
  app: PropTypes.instanceOf(Message).isRequired,
  content: PropTypes.instanceOf(Message),
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  showDatePicker: PropTypes.bool,
};

NotificationFields.defaultProps = {
  content: null,
  isEditMode: false,
  showDatePicker: false,
};

export default NotificationFields;
