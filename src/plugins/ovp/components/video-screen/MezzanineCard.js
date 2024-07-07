import React from 'react';
import {
  UrlField
} from '@triniti/cms/components/index.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import VideoPickerField from '@triniti/cms/plugins/dam/components/video-picker-field/index.js';

export default function MezzanineCard(props) {
  const { nodeRef, node } = props;
  const { node: asset } = useNode(node.get('mezzanine_ref'));

  return (
    <>
      <Card>
        <CardHeader>Mezzanine</CardHeader>
        <CardBody>
          <VideoPickerField name="mezzanine_ref" label="Mezzanine" />
          <UrlField name="mezzanine_url" label="Mezzanine URL" />
        </CardBody>
      </Card>
    </>
  );
}
