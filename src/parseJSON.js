// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
// Use a recursive descent parser.
var parseJSON = function(json) {
	var originalJSON = json;

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

	var array = function(json) {
		var arr = [];
		var currentIndex = 0;
		var element = '';
		var splitText = json.split('');
		var stringedValue = false;
		var amountOfElements = counter(splitText, ',');
		var element;
		var lengthOfElement;

		var toStringString = function() {
			currentIndex++;
			while (json[currentIndex] !== '"') {
				if (json[currentIndex] === '\\') {
					currentIndex++;
				} 
				element += string(json[currentIndex]);
				currentIndex++;
			}
			return element;
		}

		var toStringBinary = function() {
			while (json[currentIndex] !== ',' && json[currentIndex] !== ']') {
				element += string(json[currentIndex]);
				currentIndex++;
			}
			return element;
		}

		var nestedValue = function(type, lastBracket) {
			json = json.slice(currentIndex, json.lastIndexOf(lastBracket) + 1);
			return type(json);
		}

		var stringAdditionalElements = function() {
			currentIndex++;
			if (json[currentIndex] === ' ') {
				currentIndex++
			}
			if (json[currentIndex].charCodeAt() >= 97 && json[currentIndex].charCodeAt() <= 122) {
				arr.push(determineValue(toStringBinary()));
			}
			if (json[currentIndex] === '"') {
				arr.push(toStringString());
			}
			if (json[currentIndex] === '{') {
				element = nestedValue(object, '}')
				arr.push(element);
			}
			if (json[currentIndex] === '-') {
				var negNum = '';
				while (json[currentIndex] !== ',' && json[currentIndex] !== ']') {
					negNum += json[currentIndex];
					currentIndex++;
				}
				arr.push(determineValue(negNum));
			}
			if ((typeof Number(json[currentIndex]) === 'number' && !isNaN(Number(json[currentIndex])))) {
				var num = '';
				while (json[currentIndex] !== ',' && json[currentIndex] !== ']') {
					num += json[currentIndex];
					currentIndex++;
				}
				arr.push(determineValue(num));
			}
			element = '';
		}
		
		if (json.length > 2) {
			if (json[currentIndex] === '[') {
				currentIndex++;
				if (json[currentIndex] === '"') {
					arr.push(toStringString());
					element = '';
					currentIndex++;
				}
				if (json[currentIndex].charCodeAt() >= 97 && json[currentIndex].charCodeAt() <= 122) {
					arr.push(determineValue(toStringBinary()));
					element = '';
				}
				if (typeof Number(json[currentIndex]) === 'number' && !isNaN(Number(json[currentIndex]))) {
					arr.push(determineValue(json[currentIndex]));
					currentIndex++;
				}
				if (json[currentIndex] === '{') {
					element = nestedValue(object, '}');
					arr.push(element);
					lengthOfElement = JSON.stringify(element).length;
					currentIndex = currentIndex + (lengthOfElement - 1);
				}
				if (json[currentIndex] === '[') {
					element = nestedValue(array, ']');
					arr.push(element);
					lengthOfElement = JSON.stringify(element).length;
					currentIndex = currentIndex + (lengthOfElement - 1);
				}
				if (json[currentIndex] === ',') {
					for (var i = 0; i < amountOfElements; i++) {
						stringAdditionalElements();
					}
				}
			}

		}
		return arr;
	}

	var object = function(json) {
		var obj = {};
		var currentIndex = 0;
		var key = '';
		var value = '';
		var splitText = json.split('');
		var amountOfPairs = counter(splitText, ':');
		var lengthOfValue;
		var stringedValue = false;

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
			if (json[currentIndex] === '"' && stringedValue) {
				resetKeyAndValue();
				currentIndex++;
				toStringKey();
				currentIndex = currentIndex + 3;
			} 
		}
		var additionalValue = function() {
			if (json[currentIndex] === '"' && stringedValue) {
				currentIndex++;
				toStringValue();
				currentIndex++; 
			} 
			if (json[currentIndex] === '{') {
				value = nestedValue(object, '}');
				json = originalJSON;
				currentIndex = currentIndex + JSON.stringify(value).length + 2;
			}
			if (json[currentIndex] === '[') {
				value = nestedValue(array, '[');
				json = originalJSON;
				currentIndex = currentIndex + JSON.stringify(value).length + 2;
			}
			if (json[currentIndex].charCodeAt() >= 97 && json[currentIndex].charCodeAt() <= 122 && stringedValue) {
				toStringBinary();
				currentIndex = currentIndex + 2;
			}
			obj[key] = determineValue(value);
		}
		var nestedValue = function(type, lastBracket) {
			stringedValue = true;
			json = json.slice(currentIndex, json.lastIndexOf(lastBracket) + 1);
			return type(json);
		}
		
		if (json.length > 2) {
			if (json[currentIndex] === '{') {
				currentIndex = currentIndex + 2;
				toStringKey();
				currentIndex++
			}
			if (json[currentIndex] === ':') {
				currentIndex++;
				if (json[currentIndex] === ' ') {
					currentIndex++;
				}
				if (json[currentIndex] === '{') {
					value = nestedValue(object, '}');
					obj[key] = value;
					if (counter(originalJSON.split(''), ',') > 1) {
						json = originalJSON;
						currentIndex = currentIndex + JSON.stringify(value).length + 1;
					} else {
						return obj;
					}
				} 
				if (json[currentIndex] === '[') {
					value = nestedValue(array, ']')
					obj[key] = value;
					if (counter(originalJSON.split(''), ',') > 1) {
						json = originalJSON;
						currentIndex = currentIndex + JSON.stringify(value).length + 1;
					} else {
						return obj;
					}
				} 
				//String string values
				if (json[currentIndex] === '"' && !stringedValue) {
					stringedValue = true;
					currentIndex++;
					toStringValue();
					obj[key] = determineValue(value);
					if (amountOfPairs === 1) {
						obj[key] = determineValue(value);
						return obj;
					} else {
						currentIndex = currentIndex + 3;
					}
				}
				//String binary values
				if (json[currentIndex].charCodeAt() >= 97 && json[currentIndex].charCodeAt() <= 122 && !stringedValue) {
					stringedValue = true;
					toStringBinary();
					obj[key] = determineValue(value);
					currentIndex = currentIndex + 2;
				}

				for (var i = 1; i < amountOfPairs; i++) {
					additionalKey();
					additionalValue();
				}

				if (json[currentIndex] === '}' || json[currentIndex] === undefined) {
					obj[key] = determineValue(value.trim());
				}
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

	if (json[0] === '[') {
		return array(json);
	}
	if (json[0] === '{') {
		return object(json);
	}
};
