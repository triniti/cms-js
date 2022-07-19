// @link https://webpack.js.org/guides/public-path/
__webpack_public_path__ = self.CLIENT_PUBLIC_PATH || '/';
export default () => {
  // intentionally made a function to call so webpack tree shaking
  // doesn't eliminate it, this only seems to be an issue
  // with workers, not the the usual bundling
  console.log('worker public path', __webpack_public_path__);
};
