// 
// HTML5 Placeholder Attribute Polyfill (IE Behavior)
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 

(function(window, document, undefined) {

	// Don't run the polyfill if it isn't needed
	if ('placeholder' in document.createElement('input')) {
		document.placeholderPolyfill = function() { /*  no-op */ };
		document.placeholderPolyfill.active = false;
		return;
	}

	// This method is called by the behavior expression to do the actual polyfilling
	document.placeholderPolyfill = function(elem) {
		return polyfillElement(elem);
	};

	// Expose whether or not the polyfill is in use (false means native support)
	document.placeholderPolyfill.active = true;

	// Add the needed CSS
	var css = firstStylesheet();
	css.addRule('.-placeholder', 'color: #888;', 0);
	css.addRule('input', 'behavior: expression(document.placeholderPolyfill(this))', 0);
	css.addRule('textarea', 'behavior: expression(document.placeholderPolyfill(this))', 0);
	css.addRule('input', '-ms-behavior: expression(document.placeholderPolyfill(this))', 0);
	css.addRule('textarea', '-ms-behavior: expression(document.placeholderPolyfill(this))', 0);

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
		addEvent(elem, 'propertychange', updatePlaceholder);
		addEvent(placeholder, 'click', hidePlaceholder);
		addEvent(window, 'resize', redrawPlaceholder);

		function drawPlaceholder() {
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

			elem.parentNode.appendChild(placeholder);

			redrawPlaceholder();
		}

		function redrawPlaceholder() {
			// Update some basic styles to match that of the input
			var zIndex = getStyle(elem, 'zIndex');
			zIndex = (zIndex === 'auto') ? 99999 : zIndex;
			setStyle(placeholder, {
				zIndex: (zIndex || 99999) + 1,
				backgroundColor: 'transparent'
			});

			// Fix an old IE bug
			if (elem.offsetParent && getStyle(elem.offsetParent, 'position') === 'static') {
				elem.offsetParent.style.position = 'relative';
			}

			// Reposition the span to make sure it stays in place
			var offset = getOffset(elem);
			setStyle(placeholder, {
				top: offset.top + 'px',
				left: offset.left + 'px'
			});
		}

		function updatePlaceholder() {
			placeholder.innerHTML = getPlaceholderFor(elem);
			redrawPlaceholder();
		}

		function checkPlaceholder(event) {
			if (elem.value) {
				hidePlaceholder(event, event.type === 'blur');
			} else {
				showPlaceholder();
			}
		}

		function showPlaceholder() {
			placeholder.style.display = 'block';
			addClass(placeholder, '-placeholder');
			addClass(elem, '-placeholder-input');
		}

		function hidePlaceholder(event, suppressFocus) {
			placeholder.style.display = 'none';
			removeClass(placeholder, '-placeholder');
			removeClass(elem, '-placeholder-input');
			if (! suppressFocus) {
				elem.focus();
			}
		}
	}

// -------------------------------------------------------------

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
