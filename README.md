Placeholder
===========

Different implementations of HTML5 placeholder polyfills/shims for different use cases


Implementations
---------------

### simple.js

The first one, `simple.js`, is just that, a very simple, value-based placeholder polyfill. To use it, simply include it in your document after any inputs or textareas that might have placeholders. The simple placeholder makes use of mutation events to keep everything up-to-date automatically, so there should be no need to manually make update calls.

```html
<!doctype html>
<html>
<head>
	<title>Placeholder Test</title>
</head>
<body>
	<form>
		<input type="text" placeholder="My Field Placeholder" />
	</form>
	<script src="./simple.js"></script>
</body>
</html>
```

A class is added to inputs that are currently displaying a placeholder so that you can style them yourself, in addition to using the native CSS `::placeholder` selector.

```css
.-placeholder,  /* For the polyfill */
::placeholder,  /* CSS 3 */
::-moz-placeholder,  /* Mozilla */
::-webkit-placeholder {  /* Webkit */
	color: #888;
}
```

##### Caveats

* The simple polyfill changes the value of the input field, so where a natively supported browser will report the value as empty `""`, polyfilled browsers will report the value of an empty field as being the value of the placeholder.
* There is no automatic restyling like in native browsers, so it is suggested that at minimum a color change is added to your own styles to present placeholders as being different from actual values.
