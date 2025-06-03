# cms-js
A single page app for managing triniti schemas and services.

See the demo [README](./demo/).

## Package Structure

The codebase is organized into two main packages:

### `@triniti/cms`
The core CMS package that contains all the reusable components, utilities, and functionality. This package includes:
- Higher-Order Components (HOCs)
- React Hooks
- Utility functions
- Shared components
- Core business logic

All imports from this package should use the `@triniti/cms` prefix, for example:
```javascript
import { withPbj } from '@triniti/cms/components/with-pbj';
import { formatDate } from '@triniti/cms/utils/date';
```

### `@triniti/app`
The application-specific package that implements the CMS for a specific vendor. This package includes:
- Vendor-specific components
- Custom implementations
- Configuration
- Routes
- Vendor-specific business logic

All imports from this package should use the `@triniti/app` prefix, for example:
```javascript
import { MyCustomComponent } from '@triniti/app/components/my-custom-component';
import { vendorConfig } from '@triniti/app/config';
```

## Component Documentation

### Higher-Order Components (HOCs)

#### `withPbj`
```javascript
withPbj(Component, curie, initialData = {})
```
Wraps a component with PBJ (Protocol Buffer JSON) functionality. This HOC handles loading states, provides PBJ data to the wrapped component, and uses the `useResolver` hook internally for data resolution.

**Parameters:**
- `Component` - The React component to wrap
- `curie` - The PBJ curie identifier
- `initialData` - Optional initial data object (defaults to empty object)

**Returns:** A new component that provides PBJ data through props

**Example:**
```javascript
const MyComponent = ({ pbj }) => (
  <div>{pbj.get('title')}</div>
);

export default withPbj(MyComponent, 'acme:article:node:1');
```

#### `withForm`
```javascript
withForm(Component, config = {})
```
Wraps a component with comprehensive form handling capabilities. This HOC provides form state management, initialization, and restoration capabilities. It integrates with Redux for state management and includes built-in error handling and loading states.

**Parameters:**
- `Component` - The React component to wrap
- `config` - Configuration object with options:
  - `restorable` - Boolean to enable form state restoration
  - `keepDirtyOnReinitialize` - Boolean to maintain dirty state on reinitialization

**Example:**
```javascript
const ArticleForm = ({ form, handleSubmit, formState }) => (
  <form onSubmit={handleSubmit}>
    <input
      {...form.getFieldProps('title')}
      placeholder="Article Title"
    />
    <button type="submit">Save</button>
  </form>
);

export default withForm(ArticleForm, {
  restorable: true,
  keepDirtyOnReinitialize: true
});
```

#### `withBlockModal`
```javascript
withBlockModal(Component)
```
Wraps a component with block modal functionality, providing a standardized interface for editing and managing content blocks within a modal context.

**Location:** `@triniti/cms/blocksmith/components/with-block-modal/index.js`

**Example:**
```javascript
const BlockEditor = ({ block, onSave }) => (
  <div>
    <h2>Edit Block</h2>
    {/* Block editing UI */}
  </div>
);

export default withBlockModal(BlockEditor);
```

#### `withBlockPreview`
```javascript
withBlockPreview(Component)
```
Wraps a component with block preview functionality, enabling real-time preview of content blocks with proper formatting and styling.

**Location:** `@triniti/cms/blocksmith/components/with-block-preview/index.js`

**Example:**
```javascript
const BlockDisplay = ({ block }) => (
  <div className="block-preview">
    <h3>{block.get('title')}</h3>
    <div>{block.get('content')}</div>
  </div>
);

export default withBlockPreview(BlockDisplay);
```

#### `withNodeScreen`
```javascript
withNodeScreen(Screen, config)
```
Wraps a screen component with node-related functionality, providing a standardized interface for viewing and managing node data with built-in CRUD operations.

**Location:** `@triniti/cms/plugins/ncr/components/with-node-screen/index.js`

**Example:**
```javascript
const ArticleScreen = ({ node, onUpdate }) => (
  <div>
    <h1>{node.get('title')}</h1>
    <div>{node.get('content')}</div>
    <button onClick={() => onUpdate(node)}>Update</button>
  </div>
);

export default withNodeScreen(ArticleScreen, {
  nodeType: 'article'
});
```

#### `withRequest`
```javascript
withRequest(Component, curie, config)
```
Wraps a component with request handling capabilities, providing a standardized way to make and manage API requests with built-in loading and error states. This HOC provides the request object that can be used with the `useRequest` hook for actual request handling.

**Parameters:**
- `Component` - The React component to wrap
- `curie` - The PBJ curie identifier for the request
- `config` - Configuration object for request initialization

**Returns:** A new component that provides:
- `request` - The PBJX request object to be used with `useRequest`
- `pbj` - The same request object (for backward compatibility)

**Location:** `@triniti/cms/plugins/pbjx/components/with-request/index.js`

**Example:**
```javascript
const SearchResults = ({ request }) => {
  const { response, pbjxError, run, isRunning } = useRequest(request);

  if (isRunning) return <Loading />;
  if (pbjxError) return <div>Error: {pbjxError}</div>;

  return (
    <div>
      {response.get('nodes').map(node => (
        <div key={node.get('_id')}>{node.get('title')}</div>
      ))}
      <button onClick={run}>Refresh</button>
    </div>
  );
};

export default withRequest(SearchResults, 'acme:search:request:1', {
  channel: 'search',
  initialData: {
    count: 10,
    sort: 'created_at_desc'
  }
});
```

### React Hooks

#### `useResolver`
```javascript
useResolver(curie, initialData)
```
Hook for resolving PBJ data, providing a simple way to fetch and manage PBJ data with built-in loading states and error handling.

**Parameters:**
- `curie` - The PBJ curie identifier
- `initialData` - Optional initial data

**Location:** `@triniti/cms/components/with-pbj/useResolver.js`

**Used by:** `withPbj` HOC

**Example:**
```javascript
const MyComponent = () => {
  const pbj = useResolver('acme:article:node:1', {
    title: 'Default Title'
  });

  if (!pbj) return <Loading />;

  return <div>{pbj.get('title')}</div>;
};
```

#### `useRequest`
```javascript
useRequest(request, runImmediately = true, enricher = noop)
```
Hook for making and managing PBJX requests, providing a standardized way to handle API requests with built-in loading states, error handling, and request lifecycle management.

**Parameters:**
- `request` - The PBJX request object to execute
- `runImmediately` - Boolean to determine if the request should run on mount (defaults to true)
- `enricher` - Optional function to enrich the request before sending (defaults to noop)

**Returns:**
- `response` - The PBJX response object
- `run` - Function to manually trigger the request
- `isRunning` - Boolean indicating if the request is in progress
- `pbjxError` - Any error that occurred during the request
- `pbjxStatus` - Current status of the request (none, pending, fulfilled, failed)

**Location:** `@triniti/cms/plugins/pbjx/components/useRequest.js`

**Example:**
```javascript
const SearchComponent = () => {
  const request = SearchRequest.create()
    .set('q', 'search term')
    .set('count', 10);

  const { response, run, isRunning, pbjxError } = useRequest(request);

  if (isRunning) return <Loading />;
  if (pbjxError) return <div>Error: {pbjxError}</div>;

  return (
    <div>
      {response.get('nodes').map(node => (
        <div key={node.get('_id')}>{node.get('title')}</div>
      ))}
      <button onClick={run}>Refresh</button>
    </div>
  );
};
```

## Global Utilities and Patterns

### File Utilities

#### `getExt`
```javascript
getExt(fileName)
```
Extracts the file extension from a filename.

**Location:** `@triniti/cms/utils/file.js`

**Parameters:**
- `fileName` - A file name including extension

**Returns:** The file extension or undefined if none exists

**Example:**
```javascript
getExt('document.pdf') // returns 'pdf'
getExt('image.jpg') // returns 'jpg'
```

#### `removeExt`
```javascript
removeExt(fileName)
```
Removes the extension from a filename.

**Location:** `@triniti/cms/utils/file.js`

**Parameters:**
- `fileName` - A file name including extension

**Returns:** The filename without extension

**Example:**
```javascript
removeExt('document.pdf') // returns 'document'
```

#### `insertBeforeExt`
```javascript
insertBeforeExt(fileName, str)
```
Inserts a string before the file extension.

**Location:** `@triniti/cms/utils/file.js`

**Parameters:**
- `fileName` - A file name including extension
- `str` - String to insert before the extension

**Returns:** Modified filename with string inserted before extension

**Example:**
```javascript
insertBeforeExt('image.jpg', '-thumb') // returns 'image-thumb.jpg'
```

### Date and Formatting Utilities

#### `formatDate`
```javascript
formatDate(date, format = 'MMM dd, yyyy hh:mm a', dateOnly = false)
```
Formats a date using date-fns.

**Location:** `@triniti/cms/utils/date.js`

**Parameters:**
- `date` - Date object or string to format
- `format` - Format string (defaults to 'MMM dd, yyyy hh:mm a')
- `dateOnly` - Boolean to format only the date portion

**Returns:** Formatted date string

**Example:**
```javascript
formatDate(new Date()) // returns 'Jan 01, 2024 12:00 PM'
formatDate(new Date(), 'yyyy-MM-dd', true) // returns '2024-01-01'
```

#### `formatBytes`
```javascript
formatBytes(bytes)
```
Converts bytes to a human-readable format.

**Location:** `@triniti/cms/utils/format.js`

**Parameters:**
- `bytes` - Number of bytes

**Returns:** Formatted string (e.g., '1.5 MB')

**Example:**
```javascript
formatBytes(1500000) // returns '1 MB'
formatBytes(500) // returns '500 bytes'
```

### Redux Utilities

#### `createReducer`
```javascript
createReducer(initialState, handlers)
```
Creates a Redux reducer with automatic action type handling.

**Location:** `@triniti/cms/utils/redux.js`

**Parameters:**
- `initialState` - Initial state for the reducer
- `handlers` - Object mapping action types to handler functions

**Returns:** Reducer function

**Example:**
```javascript
const reducer = createReducer({ count: 0 }, {
  INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
  DECREMENT: (state) => ({ ...state, count: state.count - 1 })
});
```

### UI Utilities

#### `progressIndicator`
```javascript
progressIndicator.show(title)
progressIndicator.update(title)
progressIndicator.close()
```
Manages loading indicators using SweetAlert2.

**Location:** `@triniti/cms/utils/progress.js`

**Example:**
```javascript
progressIndicator.show('Loading...');
// do something
progressIndicator.close();
```

### URL Utilities

#### `damUrl`
```javascript
damUrl(id)
```
Generates a DAM (Digital Asset Management) URL for an asset.

**Location:** `@triniti/cms/utils/url.js`

**Parameters:**
- `id` - Asset ID

**Returns:** Complete DAM URL

**Example:**
```javascript
damUrl('image-123') // returns 'https://dam.acme.com/image-123'
```

#### `nodeUrl`
```javascript
nodeUrl(nodeRef)
```
Generates a URL for a node.

**Location:** `@triniti/cms/utils/url.js`

**Parameters:**
- `nodeRef` - Node reference

**Returns:** Complete node URL

**Example:**
```javascript
nodeUrl('acme:article:node:123') // returns '/article/123'
```

---

The codebase follows a pattern of using Higher-Order Components (HOCs) for cross-cutting concerns and React hooks for state management and data fetching. The `with*` functions are primarily used for component composition and providing additional functionality, while the `use*` hooks are used for state management and data fetching.

Each of these functions serves a specific purpose in the application's architecture:
- Form handling (`withForm`)
- PBJ data management (`withPbj`, `useResolver`)
- UI components (`withBlockModal`, `withBlockPreview`)
- Feature-specific functionality (`withNodeScreen`, `withRequest`, `withTeaserModal`, `withNotificationModal`)
