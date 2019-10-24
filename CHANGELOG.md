# CHANGELOG


## patch
* Add divider block into blocksmith
* Add fix for cutting and pasting a text block
* add fix for widget redux form fields re-mounting and getting caught in infinite validation loop
* Add Label for to `GalleryFields` for related galleries title
* Add theme pick list to image block
* allow seo meta keywords and hashtags to be selected using comma key
* fix asset variant dropzone spinner
* fix for edit-gallery-screen crashing when node is not available in state yet?. 
* increase width of value field in key-values-field
* issue #6: Modal does not auto-close when selecting a new block
* pre-fill notification modal when opened from article screen
* Redesign history stream so it's simpler (no diff logic) and easier to review and copy from and has paging.
* style (in triniti) the key values field select component
* style (in triniti) the save buttons
* style fragments selector
* style video captions selector
* update `changedDate` and `changedTime` tests to not use `new Date()` because then it may fail if you do it at exactly the right (wrong) time.
* Update regex instagram block modal.
* update site-logo to new triniti logo


## v0.1.1
* issue #2: updated css to have correct color on save btn hover
* issue #4: Set up CMS to handle new type: asset-teaser.
* issue #15: fixed sweetalert call to solve issue deleting nodes
* issue #17: use DAM_BASE_URL and IMAGE_BASE_URL env globals in damUrl.js
* issue #27: updated css to fix slotting dropdown width
* Fixed search bar bug by overriding bootstraps css
* added pagination to document block.
* expose `baseUrls` in `plugins/dam/utils/damUrl.js` so sites can customize the urls.
* fix a few still-broken React Selects.
* fix bug: User can create slugs with two dashes
* fixed bug for document blocks showing all mime-types
* fixed node duplication
* block `updated_date` fixes
* fixed search bar bug by overriding bootstraps css
* fixed sweetalert call to solve issue deleting blocks
* implement pre-push git hooks
* remove deprecated sponsor-picker-field
* update seo meta keywords to be multi-select
* fix error message when renaming channel slug
* fix widget dfp unit path removal bug
* fix asset tags
* allow clearing video rating
* fix widget picker `isEditMode`
* clear getAllChannels response after successful update
* fix input padding


## v0.1.0
* initial version
