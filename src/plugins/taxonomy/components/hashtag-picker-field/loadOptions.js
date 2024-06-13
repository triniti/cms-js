import { getInstance } from '@triniti/app/main.js';

const makeRequest = async (request) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  request
    .clear('request_id')
    .clear('occurred_at')
    .clear('ctx_retries')
    .clear('ctx_causator_ref')
    .clear('ctx_correlator_ref')
    .clear('ctx_user_ref');
  return await pbjx.request(await request.clone());
};

export default async (q, lastOptions, additional) => {
  const request = additional.request;

  // on initial click into field
  if (!q || '#' === q) {
    return {
      options: [],
      hasMore: false,
      additional: {
        request,
      },
    };
  }

  try {
    request.set('prefix', q);
    const response = await makeRequest(request);
    return {
      options: response.get('hashtags', []).map(hashtag => {
        return { value: hashtag, label: `#${hashtag}` };
      }),
      hasMore: response.get('has_more', false),
      additional: {
        request,
      },
    };
  } catch (e) {
    console.error('HashtagPickerField', e, q, lastOptions, additional, request.toObject());
    return {
      options: [],
      hasMore: false,
      additional: {
        request,
      },
    };
  }
};
