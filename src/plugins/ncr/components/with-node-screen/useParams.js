import { useLocation, useParams } from 'react-router-dom';
import kebabCase from 'lodash-es/kebabCase';
import MessageResolver from '@gdbots/pbj/MessageResolver';

export default (props, config) => {
  const { pathname } = useLocation();
  const params = useParams();
  const { vendor = null, defaultTab = 'details', leaveUrl } = config;
  const label = config.label || props.label;

  let tab = defaultTab;
  const id = params.id;
  const parts = (params['*'] || '').split('/').filter(v => v);
  const editMode = parts.includes('edit');
  if (parts.length >= 1) {
    tab = parts[0] !== 'edit' ? parts[0] : defaultTab;
  }

  const baseUri = pathname.split(id)[0] + id;
  tab = kebabCase(tab);
  const theVendor = vendor || MessageResolver.getDefaultVendor();

  return {
    editMode,
    vendor: theVendor,
    label,
    id,
    nodeRef: `${theVendor}:${label}:${id}`,
    qname: `${theVendor}:${label}`,
    tab,
    urls: {
      baseUri,
      tab: to => `${baseUri}/${to}${editMode ? '/edit' : ''}`,
      editMode: `${baseUri}/${tab}/edit`,
      viewMode: `${baseUri}/${tab}`,
      leave: leaveUrl || '/',
    }
  };
};
