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
		var imgUrl = data.imgUrl;
		var _data$imgExt = data.imgExt;
		var imgExt = _data$imgExt === undefined ? 'PNG' : _data$imgExt;
		var _data$titleColor = data.titleColor;
		var titleColor = _data$titleColor === undefined ? [0, 0, 0] : _data$titleColor;
		var _data$list = data.list;
		var list = _data$list === undefined ? [] : _data$list;


		this.insertImage({
			imgUrl: imgUrl,
			imgExt: imgExt,
			posX: padding,
			posY: padding + 35,
			width: 3 * width / 5
		});

		list.forEach(function (item, index) {
			_this.insertText({
				text: item.title,
				fontSize: 13,
				posX: 3 * width / 5 + padding + 10,
				posY: padding + 55 * (index + 1),
				type: 'normal'
			});

			_this.insertText({
				text: item.subTitle,
				fontSize: 26,
				posX: 3 * width / 5 + padding + 10,
				posY: padding + 80 + 55 * index,
				color: titleColor,
				type: 'bold'
			});
		});
	});
})();