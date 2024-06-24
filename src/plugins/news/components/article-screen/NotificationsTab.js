import React, { lazy, Suspense } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  DatePickerField,
  ErrorBoundary,
  Loading,
  SwitchField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';

const NotificationsCard = lazy(() => import('@triniti/cms/plugins/notify/components/notifications-card/index.js'));

export default function NotificationsTab(props) {
  const { node, nodeRef, tab } = props;
  const schema = node.schema();

  return (
    <>
      {tab === 'notifications' && schema.hasMixin('triniti:notify:mixin:has-notifications') && (
        <Suspense fallback={<Loading />}>
          <ErrorBoundary>
            <NotificationsCard contentRef={nodeRef} {...props} />
          </ErrorBoundary>
        </Suspense>
      )}

      <Card>
        <CardHeader>Apple News</CardHeader>
        <CardBody>
          <SwitchField name="apple_news_enabled" label="Apple News Enabled" />
          <TextField name="apple_news_revision" label="Apple News Revision" />
          <TextField name="apple_news_id" label="Apple News ID" />
          <UrlField name="apple_news_share_url" label="Apple News Share URL" />
          <DatePickerField name="apple_news_updated_at" label="Apple News Updated At" readOnly />
        </CardBody>
      </Card>
    </>
  );
}
