import React from 'react';
import AzureFields from '@triniti/cms/plugins/iam/components/app-screen/AzureFields.js';
import FirebaseFields from '@triniti/cms/plugins/iam/components/app-screen/FirebaseFields.js';

export default function AndroidAppFields() {
  return (
    <>
      <FirebaseFields />
      <AzureFields />
    </>
  );
}
