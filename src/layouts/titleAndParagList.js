/**
 * Title and paragraph list layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('titleAndParagList', function (data) {
		const {doc, width, height, padding} = this,
			{titleColor = [0, 0, 0], list = []} = data;

		list.forEach((item, index) => {
			this.setFontType('bold');

		    this.insertText({
		    	text: item.title,
		    	fontSize: 15,
		    	posX: padding,
		    	posY: padding + 55 * (index + 1), 
		    	color: titleColor
		    });

		    this.setFontType('normal');

		    this.insertText({
		    	text: item.parag,
		    	fontSize: 12,
		    	posX: padding,
		    	posY: padding + 70 + 55 * index
		    });
		});
	});
})();