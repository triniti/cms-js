export default function loadFacebookSDK() {
  if (!document.getElementById('fb-root')) {
    const body = document.body.firstChild;
    const fbRoot = document.createElement('div');
    fbRoot.setAttribute('id', 'fb-root');
    body.parentNode.insertBefore(fbRoot, body);
  }

  (function(d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};
