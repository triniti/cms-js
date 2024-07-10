import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase.js';
import { DatePickerField, ErrorBoundary, Loading, TextareaField, TextField } from '@triniti/cms/components/index.js';
import { Badge, Card, CardBody, CardHeader } from 'reactstrap';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field/index.js';
import SendOptionsField from '@triniti/cms/plugins/notify/components/send-options-field/index.js';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`@triniti/cms/plugins/notify/components/notification-screen/${file}Fields.js`));
  return components[label];
};

export default function DetailsTab(props) {
  const { alreadySent, label, node } = props;
  const { node: content } = useNode(node.get('content_ref'));
  const FieldsComponent = resolveComponent(label);
  const contentStatus = content ? content.get('status').getValue() : null;

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          {content && <ContentRefField readOnly />}
          {!alreadySent && <SendOptionsField contentStatus={contentStatus} />}
          {alreadySent && (
            <>
              <DatePickerField name="send_at" label="Send At" />
              {node.has('sent_at') && <DatePickerField name="sent_at" label="Sent At" />}
            </>
          )}
          <TextareaField
            name="body"
            label="Body"
            rows={5}
            description={content ? 'If present this value should take precedence over the body derived from content.' : ''}
            required={!content}
          />
        </CardBody>
      </Card>

      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <FieldsComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
