let hidden;
let visibilityChange;

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

let handleVisibilityChange = () => {};

export default {
  init: (onBecameVisible) => {
    handleVisibilityChange = () => {
      if (!document[hidden]) {
        onBecameVisible();
      }
    };

    document.addEventListener(visibilityChange, handleVisibilityChange);
  },
  cleanup: () => {
    document.removeEventListener(visibilityChange, handleVisibilityChange);
  }
}
