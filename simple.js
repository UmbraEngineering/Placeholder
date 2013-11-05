
// 
// HTML5 Placeholder Attribute Polyfill
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 
// -------------------------------------------------------------
// 
// NOTE:
// This polyfill does not change the styles of placeholder text in polyfilled browsers. It is
// recomended that you add styles similar to the following to your document to insure that users
// can tell what's a placeholder and what's a given value:
// 
//   .-placeholder,  /* For the polyfill */
//   ::placeholder,  /* CSS 3 */
//   ::-moz-placeholder,  /* Mozilla */
//   ::-webkit-placeholder {  /* Webkit */
//       color: #888;
//   }
// 

(function(window, document, undefined) {

	// Don't run the polyfill if it isn't needed
	if ('placeholder' in document.createElement('input')) {return;}

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

	// Run automatically
	document.placeholderPolyfill();

// -------------------------------------------------------------
	
	// 
	// Polyfill a single, specific element
	// 
	function polyfillElement(elem) {
		// If the element is already polyfilled, skip it
		if (elem.__placeholder != null) {return;}

		// Is there already a value in the field? If so, don't replace it with the placeholder
		if (elem.value) {
			showPlaceholder();
		} else {
			elem.__placeholder = false;
		}

		// Define the events that cause these functions to be fired
		addEvent(elem, 'keyup',    checkPlaceholder);
		addEvent(elem, 'keyDown',  checkPlaceholder);
		addEvent(elem, 'blur',     checkPlaceholder);
		addEvent(elem, 'focus',    hidePlaceholder);
		addEvent(elem, 'click',    hidePlaceholder);

		function checkPlaceholder() {
			if (elem.value) {
				hidePlaceholder();
			} else {
				showPlaceholder();
			}
		}

		function showPlaceholder() {
			if (! elem.__placeholder && ! elem.value) {
				elem.__placeholder = true;
				elem.value = elem.getAttribute('placeholder');
				addClass(elem, '-placeholder');
			}
		}

		function hidePlaceholder() {
			if (elem.__placeholder) {
				elem.__placeholder = false;
				elem.value = '';
				removeClass(elem, '-placeholder');
			}
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
		var tag = elem.nodeName.toLowerCase();
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

}(window, document));