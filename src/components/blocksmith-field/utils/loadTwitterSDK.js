/**
 * Loads what is needed (if not already present) to use the Twitter JS SDK
 */
export default () => {
  /* eslint-disable */
  window.twttr = (function(d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

    return t;
  }(document, "script", "twitter-wjs"));
  /* eslint-enable */
};