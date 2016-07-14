/**
 * Full width image layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('fullWidthImg', function (data) {
		const {doc, width, height, padding} = this,
		 {img} = data;

	    this.insertImage(img, 'PNG', padding, height / 3, width - 2 * padding);
	});
})();