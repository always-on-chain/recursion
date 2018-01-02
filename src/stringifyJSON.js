// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
//NEED TO USE RECURSION
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
			return '[]';
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
	} else {
		//Work on Objects
		//Plan to eventually create helper functions to work for both arrays and objects
	}
	finalString += obj;
	return finalString;
};
