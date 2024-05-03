import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { SelectField, TextareaField } from '@triniti/cms/components/index.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field';

export default function EmailNotificationFields(props) {
  const { node } = props;
  const appRef = node.get('app_ref');

  const app = useSelector((state) => {
    return appRef ? getNode(state, appRef) : null;
  });

  const linkToApp = pbjUrl(app, 'view');

  const senders = app.get('sendgrid_senders') ? Object.entries(app.get('sendgrid_senders')).map(
    (item) => ({ label: item[0], value: item[0] }),
  ) : null;

  const lists = app.get('sendgrid_lists') ? Object.entries(app.get('sendgrid_lists')).map(
    (item) => ({ label: item[0], value: item[0] }),
  ) : null;

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ContentRefField name="content_ref" label="Content" readOnly />
          <TextareaField name="body" label="Body" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Email Options</CardHeader>
        <CardBody>
          <PicklistField picklist="email-notification-templates" name="template" label="Template" />
          <PicklistField picklist="email-notification-subjects" name="subject" label="Subject" />

          {senders ? (
            <SelectField name="sender" label="Senders" options={senders} />
          ) : (
              <div className="mb-4">
                No senders found, make sure to add senders on the App itself:&nbsp;
                <a className="txt-info" href={linkToApp}>{app.get('title')}</a>
              </div>
            )}

          {lists ? (
            <SelectField name="lists" label="Lists" options={lists} />
          ) : (
              <div className="mb-4">
                No lists found, make sure to add lists on the App itself:&nbsp;
                <a className="txt-info" href={linkToApp}>{app.get('title')}</a>
              </div>
            )}
        </CardBody>
      </Card>
    </>
  );
}
