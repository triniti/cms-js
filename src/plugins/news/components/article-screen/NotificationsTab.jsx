import React from 'react';
import { Card, CardBody, Label, ListGroupItem } from 'reactstrap';
import { CheckboxField, TextField } from 'components';
import formatDate from '@triniti/cms/utils/formatDate';
import HasNotificationsCard from 'plugins/notify/components/has-notifications-card';

export default function NotificationsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      {schema.hasMixin('triniti:notify:mixin:has-notifications') && (
        <HasNotificationsCard contentRef={nodeRef} {...props} />
      )}
      <Card>
        <CardBody>
          <CheckboxField name="apple_news_enabled" label="Apple News Enabled" inline={true} />
          <CheckboxField name="twitter_publish_enabled" label="Twitter Publish Enabled" inline={true}  />
          <TextField name="apple_news_revision" label="Apple News Revision" />
          <TextField name="apple_news_id" label="Apple News ID" />
          <TextField name="apple_news_share_url" label="Apple News Share URL" />
          {
            node.has('apple_news_updated_at') && (
              <>
                <Label>Apple News Updated At</Label>
                <ListGroupItem className="mb-4 pt-2 pb-2 border-0 pl-0">
                  {formatDate(node.get('apple_news_updated_at'))}
                </ListGroupItem>
              </>
            )
          }
        </CardBody>
      </Card>
    </>
  );
}
