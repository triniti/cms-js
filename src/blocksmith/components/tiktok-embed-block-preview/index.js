import React, { useEffect, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { Media } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

// ref https://developers.tiktok.com/doc/embed-videos/
const fetchOembed = async (id) => {
  const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${id}`;
  try {
    const response = await fetch(url);
    const embed = await response.json();
    if (embed && embed.thumbnail_url) {
      return embed;
    }

    throw new Error(await response.text());
  } catch (e) {
    console.error('TiktokEmbedBlockPreview.fetchOembed', url, e);
    return e;
  }
};

function TiktokEmbedBlockPreview(props) {
  const { block } = props;
  const [oembed, setOembed] = useState(null);
  const id = block.get('tiktok_id');
  const url = `https://www.tiktok.com/embed/v2/${id}`;

  useEffect(() => {
    fetchOembed(id).then(result => {
      setOembed(result);
    }).catch(noop);
  }, [id]);

  return (
    <>
      {!oembed && (
        <p><a href={url} target="_blank" rel="noreferrer noopener">{url}</a></p>
      )}
      {oembed && (
        <p className="text-center">
          <a href={url} className="hover-box-shadow d-inline-block rounded-2" target="_blank" rel="noreferrer noopener">
            <Media src={oembed.thumbnail_url} className="rounded-2" alt="" width="250" height="auto" object />
          </a>
        </p>
      )}
    </>
  );
}

export default withBlockPreview(TiktokEmbedBlockPreview);
