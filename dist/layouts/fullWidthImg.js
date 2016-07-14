'use strict';

/**
 * Full width image layout
 */

;
(function () {
	'use strict';

	var PDF = require('../class');

	PDF.addLayout('fullWidthImg', function (data) {
		var doc = this.doc;
		var width = this.width;
		var height = this.height;
		var padding = this.padding;
		var img = data.img;


		this.insertImage(img, 'PNG', padding, height / 3, width - 2 * padding);
	});
})();