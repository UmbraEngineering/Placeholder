Placeholder
===========

Different implementations of HTML5 placeholder polyfills/shims for different use cases


Implementations
---------------

### simple.js

[download simple.js](https://raw.github.com/UmbraEngineering/Placeholder/master/src/simple.js) | [demo](http://umbraengineering.github.io/Placeholder/demos/simple.html)

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

##### Caveats/Notes

* The simple polyfill changes the value of the input field, so where a natively supported browser will report the value as empty `""`, polyfilled browsers will report the value of an empty field as being the value of the placeholder. You can test if a placeholder is currently being displayed by checking the `input.__placeholder` property, which is a flag representing if the placeholder is active.



### span.js

[download span.js](https://raw.github.com/UmbraEngineering/Placeholder/master/src/span.js) | [demo](http://umbraengineering.github.io/Placeholder/demos/span.html)

The `span.js` polyfill works by positioning a span directly over top of the input field which contains the polyfill text. To use it, simply include it in your document after any inputs or textareas that might have placeholders. The span placeholder makes use of mutation events to keep everything up-to-date automatically, so there should be no need to manually make update calls.

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
	<script src="./span.js"></script>
</body>
</html>
```

A class is added to inputs that are currently displaying a placeholder as well as to the placeholder span itself so that you can style them yourself, in addition to using the native CSS `::placeholder` selector.

```css
/* For the polyfill */
.-placeholder {
	color: #888;
}
.-placeholder-input {
	/*  ...  */
}


::placeholder,  /* CSS 3 */
::-moz-placeholder,  /* Mozilla */
::-webkit-placeholder {  /* Webkit */
	color: #888;
}
```

##### Caveats/Notes

* The main caveat to this implementation is that it creates a new element in the DOM, which, under certain circumstances, could lead to unexpected rendering. That said, it comes with the advantage of never manipulating the field's `value` attribute.



### ie-behavior.js

[download ie-behavior.js](https://raw.github.com/UmbraEngineering/Placeholder/master/src/ie-behavior.js) | [demo](http://umbraengineering.github.io/Placeholder/demos/ie-behavior.html)

The `ie-behavior.js` polyfill is specifically targeted at legacy versions of Internet Explorer, and should be used when these are the only browsers you are worried about polyfilling. It makes use of IE's proprietary CSS behaviors to extend the input and textarea elements.

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
	<script src="./ie-behavior.js"></script>
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

##### Caveats/Notes

* Only works in legacy IE.
* This polyfill changes the value of the input field, so where a natively supported browser will report the value as empty `""`, polyfilled browsers will report the value of an empty field as being the value of the placeholder. You can test if a placeholder is currently being displayed by checking the `input.__placeholder` property, which is a flag representing if the placeholder is active.



### ie-behavior-span.js

[download ie-behavior-span.js](https://raw.github.com/UmbraEngineering/Placeholder/master/src/ie-behavior-span.js) | [demo](http://umbraengineering.github.io/Placeholder/demos/ie-behavior-span.html)

The `ie-behavior-span.js` polyfill is a combination of the ideas behind the `span.js` and `ie-behavior.js` polyfills, using IE's behavior feature to extend inputs and textareas in such a way that they use spans to display placeholders. For more info, basically just read those two sections above.

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
	<script src="./ie-behavior-span.js"></script>
</body>
</html>
```

