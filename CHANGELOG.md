# CHANGELOG


## v0.13.6
* Display subtitled m3u8 on transcodeable-card
* Assume `updateNodeFlow` will work due to new server changes.


## v0.13.5
* Adjust SEO Description Character Counter To Turn Yellow At 140 Characters and Red at 160.
* Add `expires_at` field to eme-form-block.
* Allow Instagram blocks to ingest Reels.


## v0.13.4
* Adding `alt_text` field to image asset forms.
* Add eme-form-block to Blocksmith.
* cms crash to white screen after paste
* Use `@triniti/schemas` v1.1.15


## v0.13.3
* Youtube Block: Choosing start time throws error
* Clear image for Audio & Article block not functioning on Safari.
* Uploading assets is throwing an error for some users


## v0.13.2
* Prevent "node failed to load" alert from firing after leaving node screen


## v0.13.1
* CMS Node Screen must display errors if node fails to load
* Change Copy/Pasting of text blocks to not copy state of block just text inside it.
* cms is saving incorrect image dimensions.
* Add `window.onerror` to blocksmith error boundaries for error logstream
* Unable to upload non-image assets on dev/test


## v0.13.0
* Active Edits Enhancements
* Add ignore button back to stale data popup when in view mode
* Implement error logging to logstream for raven and blocksmith errors
* Set center field on Google Map Block using Geocoding API.
* facebook embed code considered invalid for facebook post block
* add more detail to social block placeholders.
* Add `title` prop to image asset picker modal and image asset picker field.
* Set red error message when article title length is at 75 characters or greater.
* Allow autoplay on video block to be checked when image is selected.


## v0.12.0
* Reconnect raven on every `@triniti/raven/PUBLISH_MESSAGE_REQUESTED`.
* Update raven mqtt to disable reconnect until transformWsUrl supports promises.
* Use toast alerts for stale data when collaborating


## v0.11.0
* Do not update active edits screen unless user clicks "refresh" button.
* cms will crash after session/raven disconnect and users accept new disconnect Alert
* Instagram embed preview not rendering.
* Gallery Launch Text not reflecting with red background.
* Set user node title using first and last name fields in the UserSubscriber to avoid an inconsistency.


## v0.10.3
* Blocksmith crash when text block contains only carriage return


## v0.10.2
* Raven can get caught in an alert loop.


## v0.10.1
* Uninitialized blocksmith crash.
* Issues pasting for twitter blocks.


## v0.10.0
* Blocksmith error reporting & recovery.


## v0.9.4
* Remove Link to Google.com from Poster Image In Gallery Block Creator
* Display error notification when CMS web socket loses connection.


## v0.9.3
* issue #256: Fix promotion slots drag and drop sorting.
* issue #258: Add Expires At Field to Article Screen.
* Add related teaser fields when the node has the `triniti:curator:mixin:has-related-teasers` mixin.
* Add display title field to image uploader.


## v0.9.2
* Fix bug where Blocksmith can get into an invalid state, preventing saving.


## v0.9.1
* Adding support for `recommendations_enabled` field.
* Use `@triniti/schemas` v1.1.12


## v0.9.0
* Add way to get from image picker to image asset page.
* Adding support for article labels.


## v0.8.0
* Support for reverting history.


## v0.7.1
* Convert unsupported block types to `<p>` tags to preserve line breaks when pasting HTML content into blocksmith.


## v0.7.0
* Cursor goes to top of content blocks or top of last block when using keyboard arrows to move to the end of the content blocks.
* Fix formatting of `jwplayer_synced_at`.
* issue #232: add custom `blockRenderMap` to avoid creation of unsupported block types when pasting content into blocksmith.
* Update promotion-details-fields to include `slots` schema field.
* Use `@gdbots/schemas` v1.6.6
* Use `@triniti/schemas` v1.1.11


## v0.6.3
* Preventing uploader from moving scroll position around on small screens and allowing dynamic height of uploader if viewing area is tiny.
* Fixing cursor issues with going to line that doesn't exist. Adding support to move cursor to end of last text block.


## v0.6.2
* Add custom code tab to timeline screen.


## v0.6.1
* Fix the setting of `credit_url` and `cta_url` in AssetSubscriber, GallerySubscriber and TeaserSubscriber.


## v0.6.0
* Setting default mime type because browser can be unreliable.
* Copy image_ref from target on all teaser-has-target creation.
* Set asset-teaser image_ref to target's node ref when target is an image-asset.
* Add gallery credit_url field.
* Add playlist widget autoplay field.


## v0.5.1
* Use `@triniti/admin-ui-plugin` v1.0.2
* fix small bug for: Cursor goes to top of content blocks or top of last block when using keyboard arrows to move to the end of the content blocks


## v0.5.0
* Spotify embed code not visible when user clicks update
* Remove blocksmith focus plugin and related code
* Cursor goes to top of content blocks or top of last block when using keyboard arrows to move to the end of the content blocks
* Image Block modal first cancel button does not cancel
* Sometimes Blocks are converting to text blocks after publish.
* Some Text Blocks are causing asset blocks to convert to text blocks due to <figure></figure> in html
* Fix bug where expanded block image previews are draggable in view mode
* Loading small images by default for anything that displays a dam asset through component.
* Fixing actual quality sizes available.
* Iframe block doesn't properly show height/width when set, add scrolling checkbox
* Use `@gdbots/schemas` v1.6.5
* Use `@triniti/schemas` 1.1.8


## v0.4.4
* Pressing enter after you edit a slug saves a stale version.


## v0.4.3
* Twitter block not accepting certain embed codes/links
* User Cannot press enter when creating nodes after entering title, without tabbing over to auto generated slug first.


## v0.4.2
* Slug changes are overwritten when pressing enter in create node modals.


## v0.4.1
* Creating a node by pressing enter double dates slugs.


## v0.4.0
* Rearrange badge/download button order
* Email Notification General Message doesn't function
* Add winking face emoji
* Editing a slug during creation modal will result in a blank slug when hitting ENTER
* Add More Fields On Designated Screens (display_title, credit_url, cta_text, cta_url, etc.)
* Uploading a new pdf to a content block does not auto select or show up
* Unselected images from Batch Edit once User clicks update.
* Removing key value pair shows entire field being removed in history.
* Adjust Notification Send Options To Exclude 'Send Now' On Unpublished Content
* Add YouTube and JW Player video fields
* Add `aspect_ratio` ui for gallery and document blocks
* Use `@triniti/schemas` v1.1.6
* Create `VideoAssetPickerField` and use for video `mezzanine_ref`.
* Hashtags picker field fluid height
* Bump `auth0-lock` from 11.20.3 to 11.21.0


## v0.3.4
* When adding text to a text block, hovering your mouse to another block and back causes text to disappear.


## v0.3.3
* Fix for entering space or enter into youtube playlist block textarea.


## v0.3.2
* Add Spotify URI to text area of spotify embed block to make it more clear which content type is being used.
* Spotify Embed Block requires pasting of embeds twice.
* YouTube Playlist block: If user manually types anything into input field for EMBED CODE, URL, OR ID the CMS will crash
* Text Editor toolbar does not appear after selecting option, leaving tab, and returning


## v0.3.1
* Add support for livestream static label
* Fix unit test error due to unresolved config file.
* Fix `WidgetHasSearchRequestSubscriber` `timeline_ref` handling.


## v0.3.0
* Make `UserPickerField` and use for `author_ref`
* Issue: Add Imgur Post Block
* issue: Add Spotify Embed Block
* include status in `MediaLiveChannelCards` Card headers.
* Added tabs for dashboard (News and Active)
* MediaLive tweaks: increase delay waiting for event, add toast message, and add "no videos found" message
* Removed asides from code, divider, heading, iframe, page-breakquote and text blocks.
* Added Youtube Playlist Block
* Added TikTok embed block
* Use `@triniti/schemas` v1.1.5
* Added Pinterest pin embed block
* MediaLive UI Enhancements
* Add Slotting On Teasers Screen
* Add checkbox to enable or disable SmartNews.
* Remove livestream screen breadcrumbs
* Fixed broken artist embed in Spotify Embed Block


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
