import React, { useMemo } from 'react';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

const ArticlePickerFieldWithStatus = (props) => {
  const { statuses, ...otherProps } = props;

  const finalStatuses = statuses;

  const ArticlePickerField = useMemo(() => {
    const initialData = {
      sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
      autocomplete: true
    };

    if (finalStatuses) {
      initialData.statuses = finalStatuses;
    }

    return withRequest(NodePickerField, 'triniti:news:request:search-articles-request', {
      channel: 'picker',
      initialData
    });
  }, [JSON.stringify(finalStatuses)]);

  return <ArticlePickerField {...otherProps} />;
};

export default ArticlePickerFieldWithStatus;
