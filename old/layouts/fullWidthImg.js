/**
 * Full width image layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('fullWidthImg', function (data) {
		const {doc, width, height, padding} = this,
			{imgUrl, imgExt = 'PNG'} = data;

		this.insertImage({
	    	imgUrl,
	    	imgExt,
	    	posX: padding, 
	    	posY: height / 3, 
	    	width: width - 2 * padding
	    });
	});
})();