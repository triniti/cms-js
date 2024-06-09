import React from 'react';
import startCase from 'lodash-es/startCase.js';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus.js';
import { EnumField } from '@triniti/cms/components/index.js';
import Option from '@triniti/cms/plugins/notify/components/notification-send-status-field/Option.js';
import SingleValue from '@triniti/cms/plugins/notify/components/notification-send-status-field/SingleValue.js';

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
