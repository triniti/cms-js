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
* style batch-operations-card (matt)
* media resorting and gallery management can use some tlc.
* slotting needs to use select for key with slotting config.
* add headline fragments, slotting, classification and author fields to article
* add alert for dirty form when leaving page (used to be apart of useBlocker?)
* Review sorting on all search screens and pickers.
* Add node labels component
* move Sortable* styles to main sass files.
* review sortable on node picker, interaction is wonky af.  does node picker need this?
* review/simplify node history and reverting.
* ensure lazing loading for tabs which fetch data (notifications, media, history)
* make sure track total results is used on search screens but not pickers
* lock node features?
* get rid of clone-button, add a duplicate node button on node screens that need it (details, not search)
