import React from 'react';
import AzureFields from 'plugins/iam/components/app-screen/AzureFields';
import FirebaseFields from 'plugins/iam/components/app-screen/FirebaseFields';

export default function IosAppFields() {
  return (
    <>
      <FirebaseFields />
      <AzureFields />
    </>
  );
}
