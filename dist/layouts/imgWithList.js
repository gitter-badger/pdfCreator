'use strict';

/**
 * Image with list layout
 */

;
(function () {
	'use strict';

	var PDF = require('../class');

	PDF.addLayout('imgWithList', function (data) {
		var _this = this;

		var doc = this.doc;
		var width = this.width;
		var height = this.height;
		var padding = this.padding;
		var img = data.img;
		var titleColor = data.titleColor;
		var list = data.list;


		this.insertImage(img, 'PNG', padding, padding + 35, 3 * width / 5);

		list.forEach(function (item, index) {
			_this.setFontType("normal");
			_this.insertText(item.title, 13, 3 * width / 5 + padding + 10, padding + 55 * (index + 1));
			_this.setFontType("bold");
			_this.insertText(item.subTitle, 26, 3 * width / 5 + padding + 10, padding + 80 + 55 * index, '', titleColor[0], titleColor[1], titleColor[2]);
		});
	});
})();