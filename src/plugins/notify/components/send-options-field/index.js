import React, { useEffect } from 'react';
import { DatePickerField, SwitchField, useFormContext } from '@triniti/cms/components/index.js';
import { useFormState, Field } from 'react-final-form';

export default function SendOptionsField(props) {
  const { contentStatus } = props;
  const { form } = useFormContext();
  const { values } = useFormState({ subscription: { values: true } });
  const canSendOnPublish = contentStatus && contentStatus !== 'published';
  const sendOnPublish = values.send_on_publish;
  const contentType = values.content_ref ? values.content_ref.split(':')[1] : '';

  useEffect(() => {
    if (sendOnPublish) {
      form.change('send_at', undefined);
    }
  }, [sendOnPublish]);

  return (
    <>
      {canSendOnPublish && (
        <SwitchField name="send_on_publish" label={`Send when ${contentType} is published`} />
      )}
      {(!canSendOnPublish || !sendOnPublish) && (
        <DatePickerField name="send_at" label="Send At" />
      )}
      {canSendOnPublish && sendOnPublish && (
        <Field name="send_at" type="hidden" component="input" />
      )}
    </>
  );
}
