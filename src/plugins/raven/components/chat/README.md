# Chat

Provides a very simple (ephemeral) real-time chat service.  This would typically be included in the sidebar of a node edit screen.

> If a user reloads their browser, the chat history will be lost.


### Required Props

+ __nodeRef:__  A NodeRef instance or string expected to be a NodeRef.  This determines where to read and write messages.


```jsx harmony
import Chat from '@triniti/cms/plugins/raven/components/chat';

<Chat nodeRef={nodeRef} />
```
