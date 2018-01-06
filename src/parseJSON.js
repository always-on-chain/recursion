// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
// Use a recursive descent parser.
var parseJSON = function(json) {
	var counter = function(array, item) {
		var count = 0;
		array.forEach(function(char, index) {
			if (char === item) {
				count++;
			}
		})
		return count;
	}

	var string = function(char) {
		var str = '';
		str += char;
		return str;
	}

	var parseElements = function(elementValue) {
		var value = '';
		var splitValue = elementValue.split('');
		splitValue.forEach(function(char) {
			if (char !== '[' && char !== ']' && char !== ' ' && char !== '"') {
				value += string(char);
			}
		});
		return value;
	}
	var array = function(json) {
		var arr = [];
		if (json.length > 2) {
			var split = json.split('');
			var count = counter(split, ',');
			var elements = json.split(',');
			if (count > 0) {
				elements.forEach(function(elementValue) {
					var value = determineValue(parseElements(elementValue));
					arr.push(value);
				})
			}
		}
		return arr;
	}

	var object = function(json) {
		if (!key && !value && !currentIndex) {
			var currentIndex = 0;
			var key = '';
			var value = '';
		}
		var obj = {};
		var splitText = json.split('');
		var amountOfPairs = counter(splitText, ':');

		var toStringKey = function() {
			while (json[currentIndex] !== '"') {
				key += string(json[currentIndex]);
				currentIndex++;
			}
		}
		var toStringValue = function() {
			while (json[currentIndex] !== '"') {
				value += string(json[currentIndex]);
				currentIndex++;
			}
		}
		var toStringBinary = function() {
			while (json[currentIndex] !== ',' && json[currentIndex] !== '}' && json[currentIndex] !== ' ') {
				value += string(json[currentIndex]);
				currentIndex++;
			}
		}
		var resetKeyAndValue = function() {
			key = '';
			value = '';
		}
		var additionalKey = function() {
			if (json[currentIndex] === '"') {
				obj[key] = determineValue(value);
				resetKeyAndValue();
				currentIndex++;
				toStringKey();
				currentIndex = currentIndex + 3;
			} 
		}
		var additionalValue = function() {
			if (json[currentIndex] === '"') {
				currentIndex++;
				toStringValue();
				currentIndex++; 
			} else {
				toStringBinary();
				currentIndex = currentIndex + 2;
			}
		}

		if (json.length > 2) {
			if (json[currentIndex] === '{') {
				currentIndex++;
			}
			//Start of key string
			if (json[currentIndex] === '"') {
				currentIndex++;
				toStringKey();
				currentIndex = currentIndex + 3;
			}
			//Start of string value OR binary value
			if (json[currentIndex] === '"') {
				currentIndex++;
				toStringValue();
				if (amountOfPairs === 1) {
					obj[key] = determineValue(value);
					return obj;
				} else {
					//Skip to next key
					currentIndex = currentIndex + 3;
				}
			} else {
				toStringBinary();
				//Skip to next key
				currentIndex = currentIndex + 2;
			}
			console.log(json[currentIndex])
			for (var i = 1; i < amountOfPairs; i++) {
				additionalKey();
				additionalValue();
			}
			if (json[currentIndex] === '}' || json[currentIndex] === undefined) {
				obj[key] = determineValue(value.trim());
			}
		}
		return obj;
	}

	var determineValue = function(value) {
		if (value === '') {
			return '';
		}
		if (value === 'null') {
			return null;
		}
		if (value === 'false') {
			return false;
		}
		if (value === 'true') {
			return true;
		}
		if (typeof Number(value) === 'number' && !isNaN(Number(value))) {
			return Number(value);
		}
		return value;
	}

	if (json.includes('[')) {
		return array(json);
	}
	if (json.includes('{')) {
		return object(json);
	}
};
