import React from 'react';
import AzureFields from '@triniti/cms/plugins/iam/components/app-screen/AzureFields';
import FirebaseFields from '@triniti/cms/plugins/iam/components/app-screen/FirebaseFields';

export default function IosAppFields() {
  return (
    <>
      <FirebaseFields />
      <AzureFields />
    </>
  );
}
