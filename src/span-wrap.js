
// 
// HTML5 Placeholder Attribute Polyfill (Span)
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me), Joschi Kuphal <joschi@kuphal.net> (http://jkphl.is)
// 

(function(window, document, undefined) {

	// Don't run the polyfill if it isn't needed
	if ('placeholder' in document.createElement('input')) {
		document.placeholderPolyfill = function() { /*  no-op */ };
		document.placeholderPolyfill.active = false;
		return;
	}

	// Fetch NodeLists of the needed element types
	var inputs = document.getElementsByTagName('input');
	var textareas = document.getElementsByTagName('textarea');

	// 
	// Define the exposed polyfill methods for manual calls
	// 
	document.placeholderPolyfill = function(elems) {
		elems = elems ? validElements(elems) : validElements(inputs, textareas);
		each(elems, polyfillElement);
	};

	// Expose whether or not the polyfill is in use (false means native support)
	document.placeholderPolyfill.active = true;

	// Run automatically
	document.placeholderPolyfill();

// -------------------------------------------------------------
	
	// Use mutation events for auto-updating
	if (document.addEventListener) {
		document.addEventListener('DOMAttrModified', document.placeholderPolyfill);
		document.addEventListener('DOMNodeInserted', document.placeholderPolyfill);
	}
	
	// Use onpropertychange for auto-updating
	else if (document.attachEvent && 'onpropertychange' in document) {
		document.attachEvent('onpropertychange', document.placeholderPolyfill);
	}
	
	// No event-based auto-update
	else {
		// pass
	}

// -------------------------------------------------------------

	// Add some basic default styling for placeholders
	firstStylesheet().addRule('.-placeholder', 'color: #888;', 0);

// -------------------------------------------------------------
	
	// 
	// Polyfill a single, specific element
	// 
	function polyfillElement(elem) {
		// If the element is already polyfilled, skip it
		if (elem.__placeholder) {
			return updatePlaceholder();
		}

		// Is there already a value in the field? If so, don't replace it with the placeholder
		var placeholder;
		drawPlaceholder();
		checkPlaceholder();

		// Define the events that cause these functions to be fired
		addEvent(elem, 'keyup', checkPlaceholder);
		addEvent(elem, 'keyDown', checkPlaceholder);
		addEvent(elem, 'blur', checkPlaceholder);
		addEvent(elem, 'focus', hidePlaceholder);
		addEvent(elem, 'click', hidePlaceholder);
		addEvent(placeholder, 'click', hidePlaceholder);
		addEvent(window, 'resize', redrawPlaceholder);

		// Use mutation events for auto-updating
		if (elem.addEventListener) {
			addEvent(elem, 'DOMAttrModified', updatePlaceholder);
		}
		
		// Use onpropertychange for auto-updating
		else if (elem.attachEvent && 'onpropertychange' in elem) {
			addEvent(elem, 'propertychange', updatePlaceholder);
		}
	
		// No event-based auto-update
		else {
			// pass
		}

		function drawPlaceholder() {
			var wrapper = createElement('span', {'style': {'position': 'relative'}});
			placeholder = elem.__placeholder = createElement('span', {
				innerHTML: getPlaceholderFor(elem),
				style: {
					position: 'absolute',
					display: 'none',
					margin: '0',
					padding: '0',
					cursor: 'text'
				}
			});
			wrapper.appendChild(placeholder);
			elem.parentNode.insertBefore(wrapper, elem);
			wrapper.appendChild(elem);
			redrawPlaceholder();
		}

		function redrawPlaceholder() {
			// Update some basic styles to match that of the input
			var zIndex = getStyle(elem, 'zIndex');
			zIndex = (zIndex === 'auto') ? 99999 : zIndex;
			setStyle(placeholder, {
				zIndex: (zIndex || 99999) + 1,
				backgroundColor: 'transparent',
				marginTop: getStyleValue(elem, 'marginTop'),
				marginLeft: getStyleValue(elem, 'marginLeft'),
				paddingTop: getStyleValue(elem, 'paddingTop'),
				paddingLeft: getStyleValue(elem, 'paddingLeft'),
				borderTop: getStyleValue(elem, 'borderTopWidth') + ' solid transparent',
				borderLeft: getStyleValue(elem, 'borderLeftWidth') + ' solid transparent'
			});
		}

		function updatePlaceholder() {
			placeholder.innerHTML = getPlaceholderFor(elem);
			redrawPlaceholder();
		}

		function checkPlaceholder() {
			if (elem.value) {
				hidePlaceholder();
			} else {
				showPlaceholder();
			}
		}

		function showPlaceholder() {
			placeholder.style.display = 'block';
			addClass(placeholder, '-placeholder');
			addClass(elem, '-placeholder-input');
		}

		function hidePlaceholder() {
			placeholder.style.display = 'none';
			removeClass(placeholder, '-placeholder');
			removeClass(elem, '-placeholder-input');
			elem.focus();
		}
	}

// -------------------------------------------------------------
	
	// 
	// Build a list of valid (can have a placeholder) elements from the given parameters
	// 
	function validElements() {
		var result = [ ];

		each(arguments, function(arg) {
			if (typeof arg.length !== 'number') {
				arg = [ arg ];
			}

			result.push.apply(result, filter(arg, isValidElement));
		});

		return result;
	}

	// 
	// Check if a given element supports the placeholder attribute
	// 
	function isValidElement(elem) {
		var tag = (elem.nodeName || '').toLowerCase();
		return (tag === 'textarea' || (tag === 'input' && (elem.type === 'text' || elem.type === 'password')));
	}

// -------------------------------------------------------------
	
	function addEvent(obj, event, func) {
		if (obj.addEventListener) {
			obj.addEventListener(event, func, false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on' + event, func);
		}
	}

	function removeEvent(obj, event, func) {
		if (obj.removeEventListener) {
			obj.removeEventListener(event, func, false);
		} else if (obj.detachEvent) {
			obj.detachEvent('on' + event, func);
		}
	}

// -------------------------------------------------------------

	function each(arr, func) {
		if (arr.forEach) {
			return arr.forEach(func);
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			func.call(null, arr[i], i, arr);
		}
	}

	function filter(arr, func) {
		if (arr.filter) {
			return arr.filter(func);
		}

		var result = [ ];
		for (var i = 0, c = arr.length; i < c; i++) {
			if (func.call(null, arr[i], i, arr)) {
				result.push(arr[i]);
			}
		}

		return result;
	}

// -------------------------------------------------------------

	var regexCache = { };
	function classNameRegex(cn) {
		if (! regexCache[cn]) {
			regexCache[cn] = new RegExp('(^|\\s)+' + cn + '(\\s|$)+', 'g');
		}

		return regexCache[cn];
	}

	function addClass(elem, cn) {
		elem.className += ' ' + cn;
	}

	function removeClass(elem, cn) {
		elem.className = elem.className.replace(classNameRegex(cn), ' ');
	}

// -------------------------------------------------------------

	// Internet Explorer 10 in IE7 mode was giving me the wierest error
	// where e.getAttribute('placeholder') !== e.attributes.placeholder.nodeValue
	function getPlaceholderFor(elem) {
		return elem.getAttribute('placeholder') || (elem.attributes.placeholder && elem.attributes.placeholder.nodeValue);
	}

// -------------------------------------------------------------

	// Get the first stylesheet in the document, or, if there are none, create/inject
	// one and return it.
	function firstStylesheet() {
		var sheet = document.styleSheets && document.styleSheets[0];
		if (! sheet) {
			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');
			style.appendChild(document.createTextNode(''));
			document.head.appendChild(style);
			sheet = style.sheet;
		}
		return sheet;
	}

// -------------------------------------------------------------

	// Used internally in getStyle()
	function getStyleValue(elem, prop) {
		if (elem.currentStyle) {
			return elem.currentStyle[prop];
		} else if (window.getComputedStyle) {
			return document.defaultView.getComputedStyle(elem, null)[prop];
		} else if (prop in elem.style) {
			return elem.style[prop];
		}
		return null;
	}
	
	// Get a style property from an element
	function getStyle(elem, prop) {
		var style;
		if (elem.parentNode == null) {
			elem = document.body.appendChild(elem);
			style = getStyleValue(elem, prop);
			elem = document.body.removeChild(elem);
		} else {
			style = getStyleValue(elem, prop);
		}
		return style;
	}
	
	// Set style properties to an element
	function setStyle(elem, props) {
		for (var i in props) {
			if (props.hasOwnProperty(i)) {
				elem.style[i] = props[i];
			}
		}
	}

// -------------------------------------------------------------
	
	// Create an element
	function createElement(tag, props) {
		var elem = document.createElement(tag);
		for (var i in props) {
			if (props.hasOwnProperty(i)) {
				if (i === 'style') {
					setStyle(elem, props[i]);
				} else if (i === 'innerHTML') {
					elem.innerHTML = props[i];
				} else {
					elem.setAttribute(i, props[i]);
				}
			}
		}
		return elem;
	}

// -------------------------------------------------------------
	
	// Find the offset position of a given element
	function getOffset(elem) {
		return {
			top:
				elem.offsetTop +
				parseFloat(getStyle(elem, 'paddingTop')) +
				parseFloat(getStyle(elem, 'borderTopWidth')),
			left:
				elem.offsetLeft +
				parseFloat(getStyle(elem, 'paddingLeft')) +
				parseFloat(getStyle(elem, 'borderLeftWidth'))
		};
	}

}(window, document));