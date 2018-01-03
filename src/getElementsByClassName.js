// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
// You should use document.body, element.childNodes, and element.classList
var getElementsByClassName = function(className, element, elements) {
	if (!element) {
		var element = document.body;
		var elements = [element];
	}

	element.childNodes.forEach(function(node) {
		if (node.classList && node.classList.contains(className)) {
			elements.push(node);
			if (node.childNodes.length >= 1) {
				getElementsByClassName(className, node, elements)
			}
		//Save processing time by eliminating nodes with mocha IDs	
		} else if (node.childNodes.length >= 1 && node.id !== 'mocha') {
			getElementsByClassName(className, node, elements)
		}
	})
	
	return elements;
}; 

