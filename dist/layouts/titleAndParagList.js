'use strict';

/**
 * Title and paragraph list layout
 */

;
(function () {
	'use strict';

	var PDF = require('../class');

	PDF.addLayout('titleAndParagList', function (data) {
		var _this = this;

		var doc = this.doc;
		var width = this.width;
		var height = this.height;
		var padding = this.padding;
		var _data$titleColor = data.titleColor;
		var titleColor = _data$titleColor === undefined ? [0, 0, 0] : _data$titleColor;
		var _data$list = data.list;
		var list = _data$list === undefined ? [] : _data$list;


		list.forEach(function (item, index) {
			_this.setFontType('bold');

			_this.insertText({
				text: item.title,
				fontSize: 15,
				posX: padding,
				posY: padding + 55 * (index + 1),
				color: titleColor
			});

			_this.setFontType('normal');

			_this.insertText({
				text: item.parag,
				fontSize: 12,
				posX: padding,
				posY: padding + 70 + 55 * index
			});
		});
	});
})();