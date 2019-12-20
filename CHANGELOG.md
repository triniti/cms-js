# CHANGELOG


## vN.N.N
* issue #1035: Add Spotify Embed Block
* include status in `MediaLiveChannelCards` Card headers.
* MediaLive tweaks: increase delay waiting for event, add toast message, and add "no videos found" message
* Removed asides from code, divider, heading, iframe, page-breakquote and text blocks.
* Added Youtube Playlist Block

## v0.2.16
* Fix mediaLive reducer bug where endpoints can be duplicated.


## v0.2.15
* Add MediaLive Channel support


## v0.2.14
* Reset `NodePickerfield` to initial state on menu close.


## v0.2.13
* More node picker field adjustments for search text stickyness and buggyness
* Update instagram regex to allow for underscores.


## v0.2.12
* Move `@gdbots/schemas` and `@triniti/schemas` to peerDependencies.
* Use `@gdbots/pbj` v1.0.1 with more forgiving identifier and enum type checks.


## v0.2.11
* issue #126: Fixed instagram media block not allowing hyphens in embed url.
* Can edit ad-widget size while in view mode
* Remove error message when editing/creating slugs
* Re-enable collaboration reducer on `MESSAGE_RECEIVED`.
* Made picker field search query persistent


## v0.2.10
* User can see stale article data


## v0.2.9
* issue #13: batch edit support from gallery media section
* Add `UpdateNodeEnricher.js` which will add all paths (aka fields) that have changed during the `gdbots:ncr:mixin:update-node.enrich` lifecycle event.
* Add `autocomplete: true` to the search nodes request in node picker field.
* Correct `isClearable` behavior for `Select` components.
* Correct `pbjUrl` template for poll and widget pickers.
* Do not replace trailing space with a dash when constructing slugs.
* Fix broken thumbnail on asset uploader.
* Fix node type filtering is not sticky when leaving and re-entering the page.
* Fix structure > teasers if pressing 1 to change order date, the selector/cursor will lose focus.
* When node is selected open icon turns white.


## v0.2.8
* Update `isMulti` prop for `SelectField`


## v0.2.7
* Update `peoplePickerField` to have labels link to person canonical


## v0.2.6
* optimize Gallery Reorder - Batching
* Bug: slug editor curser jumping to end of field issue
* allow pickers to stretch to fit content
* refinements to poll picker for poll grid block modal
* allow clearing widget data source


## v0.2.5
* style nodes in `nodePickerField` that are navigated to via keyboard
* enable deleting nodes from `nodePickerField` with backspace
* fix a bunch of other `nodePickerField` wrinkles
* remove delay on `successFlow` and move up toast fork in `linkAssetsFlow`.


## v0.2.4
* update all node pickers to request 25 per page
* fix `nodePickerField` double scrollbar and overflow issues
* clear `nodePickerField` search string on select


## v0.2.3
* un-style `SelectField` `menuList`
* fix nodePickerField innerProps
* fix image block `updated_date`


## v0.2.2
* fix double scrollbar mojave issue
* fix notification screen crash
* add a check `isThemeable` before calling get/set on `image-block`
* blocks delete on delete key press
* more keyValuesField styling
* Bug: Unable to paste into slug field(URL) and keep formatting.
* Fix picker not scrolling which was actually options being filtered.
* Bug: block modal search bar non functional
* fix blocksmith inline toolbar
* issue #51: Updated regex on instagram block modal to handle /tv and /p urls
* fix node picker field flicker
* fix status filters in search users screen doesn't work


## v0.2.1
* Add label to `GalleryFields` for related galleries title and fix gallery picker sortable bug.


## v0.2.0
* issue #6: Modal does not auto-close when selecting a new block
* issue #18: cannot duplicate nodes
* issue #22: Drop down react-select component for widgets missing in promotions.
* issue #43: Redesign history stream so it's simpler (no diff logic) and easier to review and copy from and has paging.
* issue #51: Update regex instagram block modal.
* Add divider block into blocksmith
* Add fix for cutting and pasting a text block
* Add fix for widget redux form fields re-mounting and getting caught in infinite validation loop
* Add label to `GalleryFields` for related galleries title
* Add theme pick list to image block
* Allow seo meta keywords and hashtags to be selected using comma key
* Fix asset variant dropzone spinner
* Fix for edit-gallery-screen crashing when node is not available in state yet.
* Fix for node picker crashing when node is not found
* Increase width of value field in key-values-field
* Pre-fill notification modal when opened from article screen
* Style (in triniti) the key values field select component
* Style (in triniti) the save buttons
* Style fragments selector
* Style video captions selector
* Update `changedDate` and `changedTime` tests to not use `new Date()` because then it may fail if you do it at exactly the right (wrong) time.
* Update site-logo to new triniti logo


## v0.1.1
* issue #2: updated css to have correct color on save btn hover
* issue #4: Set up CMS to handle new type: asset-teaser.
* issue #15: fixed sweetalert call to solve issue deleting nodes
* issue #17: use DAM_BASE_URL and IMAGE_BASE_URL env globals in damUrl.js
* issue #27: updated css to fix slotting dropdown width
* Fixed search bar bug by overriding bootstraps css
* added pagination to document block.
* expose `baseUrls` in `plugins/dam/utils/damUrl.js` so sites can customize the urls.
* Fix a few still-broken React Selects.
* Fix bug: User can create slugs with two dashes
* Fixed bug for document blocks showing all mime-types
* block `updated_date` fixes
* Fixed search bar bug by overriding bootstraps css
* Fixed sweetalert call to solve issue deleting blocks
* implement pre-push git hooks
* remove deprecated sponsor-picker-field
* Update seo meta keywords to be multi-select
* Fix error message when renaming channel slug
* Fix widget dfp unit path removal bug
* Fix asset tags
* allow clearing video rating
* Fix widget picker `isEditMode`
* clear getAllChannels response after successful update
* Fix input padding


## v0.1.0
* initial version
