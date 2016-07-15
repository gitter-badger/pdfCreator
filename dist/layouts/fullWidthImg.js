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
		var imgUrl = data.imgUrl;
		var _data$imgExt = data.imgExt;
		var imgExt = _data$imgExt === undefined ? 'PNG' : _data$imgExt;


		this.insertImage({
			imgUrl: imgUrl,
			imgExt: imgExt,
			posX: padding,
			posY: height / 3,
			width: width - 2 * padding
		});
	});
})();