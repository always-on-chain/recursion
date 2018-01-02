// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {
	var finalString = '';

	var toStringString = function(opening, closing, array) {
		array.forEach(function(element) {
			opening += element;
		})
		return opening + closing;
	}

	if (typeof obj === 'string') {
		var split = obj.split('');
		return toStringString('"', '"', split);
	}
	if (Array.isArray(obj)) {
		var openingBracket = '[';
		var closingBracket = ']';

		if (obj.length === 0) {
			return openingBracket + closingBracket;
		} else if (obj.length === 1) {
			obj.forEach(function(element) {
				if (typeof element === 'number') {
					openingBracket += element;
				} else {
					openingBracket += stringifyJSON(element);
				}
			})
			return openingBracket + closingBracket;
		} else {
			obj.forEach(function(element) {
				if (typeof element === 'number') {
					openingBracket += element + ',';
				} else {
					openingBracket += stringifyJSON(element) + ',';
				}
			})
			var result = openingBracket.substring(0, openingBracket.length - 1) + closingBracket;
			return result;
		}
	} else if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null){
		var opening = '{';
		var closing = '}';
		if (Object.keys(obj).length === 0) {
			return opening + closing;
		} else if (Object.keys(obj).length === 1) {
			for (var key in obj) {
				opening += stringifyJSON(key) + ':';
				opening += stringifyJSON(obj[key]);
			}
			return opening + closing;
		} else {
			for (var key in obj) {
				if (typeof obj[key] === 'function' || typeof obj[key] === 'undefined') {
					return opening + closing;
				} else {
					opening += stringifyJSON(key) + ':';
					opening += stringifyJSON(obj[key]) + ',';
				}
			}
			return opening.substring(0, opening.length - 1) + closing;
		}
	}
	finalString += obj;
	return finalString;
};
