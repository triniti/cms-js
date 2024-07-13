# TODO

> some notes so we don't forget, no explicit plans yet.  v2 is alpha stage.

* simplify raven and collaboration.  more can be done here, need to think more on this.
  * starting works and worker path resolution is not working atm.
* media resorting and gallery management can use some tlc.
* add headline fragments components, this is a wonky one, might be partially site specific.
* add alert for dirty form when leaving page (used to be apart of useBlocker?)
* Review sorting on all search screens and pickers.
* Add node labels component
* review sortable on node picker, interaction is wonky af.  does node picker need this? (redo this so the sorting is done outside of the picker, i absolute hate the way it is rn)
* review/simplify node history and reverting.
* ensure lazing loading for tabs which fetch data (notifications, media, history)
* make sure track total results is used on search screens but not pickers
* lock node features?
* add word count indicator to story tab on article
* add title length warning on article "title"
* add save and publish and save and close buttons on article-screen (delegate already handles it, just need the save button drop down)
* add "create article" into navbar?
* do we need a duration field (assets with duration?)
* add unlink option to dam asset screen LinkedNodesCard?
* send purge cache command when asset variant is replaced.
* add presets to date picker field so user can have drop down of "+1 year, +5 year, etc."
* with-form handleRestore from sessionstorage when dirty?
* add thumbnail to more search screens (like people)?
* add icon to teaser screen header?
* dynamically determine duration of uploaded video or audio (like image dimensions)
* matt, drop downs/pickers go behind modal scrollable (e.g. create article teaser)
* make sure all scrollTo or scroll into view stuff works in major browsers
* fix ui jank when loading some modals (useMemo fixes a lot of this, ref blocksmith)
* add derefs to useNode (might need for ovp livestreams card if we add that to video screen)
* fix bug in blocksmith/utils/blocksToEditor.js that isn't recognizing "<mark>"
