/**
 * Image with list layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('imgWithList', function (data) {
		const {doc, width, height, padding} = this,
			{imgUrl, imgExt = 'PNG', titleColor = [0, 0, 0], list = []} = data;

	    this.insertImage({
	    	imgUrl,
	    	imgExt,
	    	posX: padding, 
	    	posY: padding + 35, 
	    	width: 3 * width / 5
	    });

	    list.forEach((item, index) => {
	    	this.setFontType('normal');

		    this.insertText({
		    	text: item.title,
		    	fontSize: 13,
		    	posX: 3 * width / 5 + padding + 10,
		    	posY: padding + 55 * (index + 1)
		    });

		    this.setFontType('bold');

		    this.insertText({
		    	text: item.subTitle,
		    	fontSize: 26,
		    	posX: 3 * width / 5 + padding + 10,
		    	posY: padding + 80 + 55 * index,
		    	color: titleColor
		    });
	    });
	});
})();