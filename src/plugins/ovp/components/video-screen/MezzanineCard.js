import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { UrlField } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import TranscodeableCard from '@triniti/cms/plugins/dam/components/asset-screen/TranscodeableCard.js';
import VideoAssetPickerField from '@triniti/cms/plugins/dam/components/video-asset-picker-field/index.js';

export default function MezzanineCard(props) {
  const { node } = props;
  const { node: asset } = useNode(node.get('mezzanine_ref'));

  return (
    <>
      <Card>
        <CardHeader>Mezzanine</CardHeader>
        <CardBody>
          <VideoAssetPickerField name="mezzanine_ref" label="Mezzanine Asset" />
          <UrlField name="mezzanine_url" label="Mezzanine URL" />
        </CardBody>
      </Card>

      {asset && <TranscodeableCard node={asset} />}
    </>
  );
}
