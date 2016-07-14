/**
 * Image with list layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('imgWithList', function (data) {
		const {doc, width, height, padding} = this,
		 {img, titleColor, list} = data;

	    this.insertImage(img, 'PNG', padding, padding + 35, 3 * width / 5);

	    list.forEach((item, index) => {
	    	this.setFontType("normal");
		    this.insertText(item.title, 13, 3 * width / 5 + padding + 10, padding + 55 * (index + 1));
		    this.setFontType("bold");
		    this.insertText(item.subTitle, 26, 3 * width / 5 + padding + 10, padding + 80 + 55 * index, '', 
		    	titleColor[0], titleColor[1], titleColor[2]);
	    });
	});
})();