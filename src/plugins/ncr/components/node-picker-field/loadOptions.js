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

  try {
    request.set('q', q);
    request.set('page', additional.page);
    const response = await makeRequest(request);
    return {
      options: response.get('nodes', []).map(node => {
        return { value: node.generateNodeRef().toString(), label: node.get('title') };
      }),
      hasMore: response.get('has_more'),
      additional: {
        page: additional.page + 1,
        request,
      },
    };
  } catch (e) {
    console.error('NodePickerField', e, q, lastOptions, additional, request.toObject());
    return {
      options: [],
      hasMore: false,
      additional: {
        page: additional.page,
        request,
      },
    };
  }
};
