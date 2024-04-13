import React from 'react';
import startCase from 'lodash-es/startCase';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import { EnumField } from '@triniti/cms/components';
import Option from '@triniti/cms/plugins/notify/components/notification-send-status-field/Option';
import SingleValue from '@triniti/cms/plugins/notify/components/notification-send-status-field/SingleValue';

const filter = option => option.value !== 'unknown';
const format = label => startCase(label.toLowerCase());

const components = { Option, SingleValue };

export default function NotificationSendStatusField(props) {
  return <EnumField
    enumClass={NotificationSendStatus}
    filter={filter}
    format={format}
    name="send_status"
    placeholder="Select Status:"
    components={components}
    {...props}
  />;
}
