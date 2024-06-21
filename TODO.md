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
* simplify batch editing and remove from screens where it's not needed.
* media resorting and gallery management can use some tlc.
* slotting needs to use select for key with slotting config.
* add alert for dirty form when leaving page (used to be apart of useBlocker?)
* Review sorting on all search screens and pickers.
* add headline fragments, classification and author fields to article
* Add node labels component
* move Sortable* styles to main sass files.
* review sortable on node picker, interaction is wonky af.  does node picker need this?
* review/simplify node history and reverting.

