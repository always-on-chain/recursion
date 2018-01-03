// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
	if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
		var toString = '';
		toString += obj;
		return toString;
	}

	if (typeof obj === 'string') {
		return '"' + obj + '"';
	}

	if (Array.isArray(obj)) {
		var opening = '[';
		var closing = ']';
		if (obj.length >= 1) {
			obj.forEach(function(element) {
				opening += stringifyJSON(element) + ',';
			})
			return opening.substring(0, opening.length - 1) + closing;
		}
		return opening + closing;
	} 
	
	if (typeof obj === 'object') {
		var opening = '{';
		var closing = '}';
		if (Object.keys(obj).length >= 1) {
			for (var key in obj) {
				if (typeof obj[key] === 'function' || typeof obj[key] === 'undefined') {
					return opening + closing;
				} 
				else {
					opening += stringifyJSON(key) + ':' + stringifyJSON(obj[key]) + ',';
				}
			}
			return opening.substring(0, opening.length - 1) + closing;
		}
		return opening + closing;
	}
};