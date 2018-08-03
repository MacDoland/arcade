/***
*	Class management methods
*	Author Nick Watton
*	July 2017
***/

var realClassUtils = {

	/* Set just the specified class to the selected element, overwriting any oter classes */
	setSingleClass: function(id, targetClass) {
		document.getElementById(id).className = targetClass;
	},

	/* Adds the specified class to the selected element */
	addClass: function(id, targetClass) {
		document.getElementById(id).className += ' ' + targetClass;
	},

	/*	Removes the specified class to the selected element.
		Removes multiples */
	removeClass: function(id, targetClass) {
		var regExp = new RegExp('(^|\\s+)' + targetClass + '(\\s+|$)', 'ig');
		document.getElementById(id).className = document.getElementById(id).className.replace(regExp, '');
	},

	/* Checks if the selected element has the specified class */
	hasClass: function(id, targetClass) {
		var regExp = new RegExp('(?:^|\\s)' + targetClass + '(?!\\S)', 'ig');
		return document.getElementById(id).className.match(regExp) === null ? false : true;
	},

	/* Removes the specified class if present, otherwise adds it */
	toggleClass: function(id, targetClass) {
		if(this.hasClass(id, targetClass)){
			this.removeClass(id, targetClass);
		}
		else{
			this.addClass(id, targetClass);
		}
	}
}