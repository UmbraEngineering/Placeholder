Placeholder
===========

Different implementations of HTML5 placeholder polyfills/shims for different use cases


Implementations
---------------

### simple.js

The first one, `simple.js`, is just that, a very simple, value-based placeholder polyfill. To use it, simply include it in your document after any inputs or textareas that might have placeholders. If you are working with dynamic content, you will need to manually call the polyfill after injecting new inputs/textareas to keep it up-to-date.

```javascript
// Create and inject a new input with placeholder
var input = document.createElement('input');
input.setAttribute('placeholder', 'foo');
document.body.appendChild(input);

// Update this input with the polyfill. You could also call this function without
// any arguments to re-check the whole document for new inputs/textareas.
document.placeholderPolyfill(input);
```

