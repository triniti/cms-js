export default () => window.location.pathname.split('/').filter(Boolean).includes('edit');
