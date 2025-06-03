# CHANGELOG

## v1.1.3
* Documentation for all `with*` HOCs and `use*` hooks
* create-article-modal :: Updated TextField to SeoTextField.


## v1.1.2
* Update lexical packages to 0.29.0.
* blocksmith :: restore highlight/mark feature as lexical bug has been resolved https://github.com/facebook/lexical/issues/4641
* asset-picker-modal :: Adding support for selecting image from gallery (without having to manually do it from the already available picker in the search tab which is already available).
* gallery-screen :: Use the original (o) uncropped image in SortableImage.


## v1.1.1
* Fix sizing on sweetalert toastage.


## v1.1.0
* Raven :: Adding edit button back into collaborations list.
* key-values-field :: Adding `newValue` support.
* timeline-screen :: Add code tab.
* Update lexical packages to 0.24.0.
* Update @dnd-kit packages latest.


## v1.0.7
* Blocksmith :: Add insert text and block to bottom of block preview.
* Blocksmith :: Add human friendly aspect ratio to document, gallery and image block preview.


## v1.0.6
* key-values-field :: allow key to start with a number.
* Blocksmith :: article-block-preview, add link_text to table.
* poll-screen :: fixing default value on answers in StatsCard.
* upgrade to date-fns 4.1.x
* Update lexical packages to 0.18.0.


## v1.0.5
* node-status-card :: When going from schedule to publish make sure to reset the publish date to now.
* sortables style improvements.


## v1.0.4
* When creating a new teaser that has a target, copy over description and image_ref as well.
* Wrap poll stats card answer text.
* Remove gallery_seq from rendering in search assets screen, not really needed any more.
* Remove need for drag overlay in sortables.


## v1.0.3
* dam :: uploader-modal, lowercase extension in file name when getting upload urls so the server side resolution of file name to type works.


## v1.0.2
* Blocksmith :: Default blocks with aspect_ratio to auto
* Blocksmith :: Sanitize after paste did in fact need to be subscribed at a higher priority to run.


## v1.0.1
* When creating a new teaser that has a target, default sync_with_target to true.
* Blocksmith :: Sanitize pasted content so copy pasta from MS Office products doesn't result in extra empty paragraphs.


## v1.0.0
* Blocksmith :: Enable select (just click the block) so you can copy/cut/paste them.
* person-picker-field :: show image in the select.
* gallery-screen :: images tab, make the link to image asset edit mode.


## v1.0.0-beta.13
* Add app env navbar when not in prod for reasons.
* Raven :: set token when subscribing as well, in case user is disconnected this will allow reconnect to happen.
* Raven :: send errors for window onerror or blocksmith.error to raven errors endpoint (body is now base64 encoded).
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