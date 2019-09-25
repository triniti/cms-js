# history

This component renders the event stream for a given stream id.

### Required Props

+ streamId - An instance of `StreamId`.
+ schema - An instance of `Schema` to use to create requests.  Must be a schema using mixin `gdbots:pbjx:mixin:get-events-request`.

```
import History './history';

<History
  streamId={id}
  schema={schemas.getUserHistoryRequest}
/>
```


### Component Layout
The event stream should be rendered as a list of cards or lists with details.

The child component that is called will get?
`event-stream` component?

+ events - An array of Message instances from `requestState.response.get('events')`
+ getUser - a function to get a user.  `(nodeRef) => Node` 
+ onNextPage
+ onPrevPage
+ onRefresh
+ hasMore?  this is from the response.  depends on direction.


### Delegate
+ handleFetch - Creates the request (if not already) and dispatches the pbj.
+ handleRefresh - When a user hits the refresh button it will make a new fresh request.
+ handlePaging? (using since and forward true/false)
 

## Selector
+ Use the pbjx `getRequest` selector to get the current request.
