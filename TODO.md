# TODO

> some notes so we don't forget, no explicit plans yet.  v2 is alpha stage.

* Remove all use of moment.
* simplify blocksmith modals and previews even further.
  * eliminate embedding of external sdks (twitter, facebook, etc.)
  * improve the parsing from social embeds and/or just provide the fields
  * move blocksmith to its own top level dir or into plugins/canvas/blocksmith
  * big question is to we have to move away from draftjs, since it's no longer maintained.
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
* dam plugin cleanup, significant improvement needed.
* do we need a duration field (assets with duration?)
* add unlink option to dam asset screen LinkedNodesCard?
* send purge cache command when asset variant is replaced.
* add presets to date picker field so user can have drop down of "+1 year, +5 year, etc."
* with-form handleRestore from sessionstorage when dirty?
* create batch edit (aka patch assets) option from search assets (in batch operation)
* add thumbnail to more search screens (like people)?
* add icon to teaser screen header?
* for consistency should be name all "media" tabs to "assets"?
