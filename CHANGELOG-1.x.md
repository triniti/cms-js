# CHANGELOG


## v1.0.0-beta.13
* Add app env navbar when not in prod for reasons.
* Raven :: set token when subscribing as well, in case user is disconnected this will allow reconnect to happen.
* Raven :: send errors for window onerror or blocksmith.error to raven errors endpoint.
* HashtagPickerField :: Clear input after creation or selection and allow creation while suggestions are loading.
* Fix zoom in gallery images and image picker.


## v1.0.0-beta.12
* Make create modal less jumpy by moving the suspensed modal div to bottom right position absolute.
* Do not unmount taxonomy tab as the field state can get lost if the component is unmounted (user switches tab) before saving.
* Adds lock/unlock features to article screen. Also adds LockableEnricher so locked nodes won't be returned unless user has permission.


## v1.0.0-beta.11
* Raven :: Make minor adjustments to sequence of actions when unmounting in useRaven.js, leaveCollaboration, then unsubscribe.


## v1.0.0-beta.10
* Remove all redux-saga, it's no longer needed.
* Raven :: Add additional check to ensure user leaves collaboration (in case of async heartbeat rejoining them after switching to view mode).
* Raven :: Renamed worker.js to RavenWorker.js.
* Raven :: Added RavenServer.js as a backup option in case the worker is flakey. Set `raven/raven_server_enabled` parameter to false to disable.


## v1.0.0-beta.9
* Add aspect-ratio-field with friendly labels.
* Update lexical packages to 0.17.0.
* Add MezzaninePreviewCard to sidebar on video screen.
* Raven :: alerting user of stale data when in edit mode and automatic reinitializing when in view mode.
* slug-field :: while user is typing allow last character to be / or -, validation will still occur but doesn't prevent typing out a new slug.


## v1.0.0-beta.8
* Add headline-fragments-card and HeadlineFragmentsSubscriber to handle the special headline fragments fields.
* Wrapped try/catch around last resequenceing in gallery images useSequencer.js
* Added new INIT_FORM event processing (pbjx lifecycle) so subscribers can set the initial values used in with-form.


## v1.0.0-beta.7
* slug-field :: ensure slug is lowercase when saved. (also fixed on create-article-modal)
* node-picker-field :: move sortable feature outside of the select.
* Add seo title field with custom warning component for seo recommended length.


## v1.0.0-beta.6
* Blocksmith :: Add keyboard shortcut CMD+K to load link modal.
* Blocksmith :: fix tumblr-post-block-preview not showing its url.
* Don't add `(duplicate)` to the title of duplicated nodes.
* Added gallery image management (add/remove/patch/reorder).


## v1.0.0-beta.5
* Add type submit to create modals submit buttons so users can hit enter to create the node.
* Blocksmith :: don't allow blocks to be inserted within other block level elements.
* Blocksmith :: don't hydrate if delegate.shouldReinitialize is false.
* Blocksmith :: improve scroll position restoring after hydration.


## v1.0.0-beta.4
* Add paste embed code feature for instagram-media-block.
* Hide paste embed code on blocksmith modals when not in editMode.
* Resolve blocksmith block title and icon config automatically by default.
* Add icons to screen header for asset and teaser screen.
* Disable etag validation on updateNode.js action until raven is integrated.
* Gallery screen images tab has add/remove images, still need to finish sorting and patch assets (aka bulk edit).


## v1.0.0-beta.3
* Add paste embed code feature for:
  * imgur-post-block-modal.
  * soundcloud-audio-block-modal.
  * spotify-embed-block-modal.
  * tiktok-embed-block-modal.
  * twitter-tweet-block-modal.
  * vimeo-video-block-modal.


## v1.0.0-beta.2
* Fix casing on InsertBeforeExt to insertBeforeExt.


## v1.0.0-beta.1
* Minor css fixes on blocksmith.
* Remove use of SITE_BASE_URL, just use APP_BASE_URL.
* Use VIDEO_BASE_URL global instead of VIDEO_ASSET_BASE_URL.
* Use full path when importing `getExt.js`.


## v1.0.0-beta.0
* First 1.x beta release without raven, gallery resorting and node history reverting.
