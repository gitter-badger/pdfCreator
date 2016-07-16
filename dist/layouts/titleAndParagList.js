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
		var lineNumbers = data.lineNumbers;

		// Track and update posY, after adding each title/parag

		var posY = padding + 55;

		list.forEach(function (item, index) {
			_this.setFontType('bold');

			var titleHeight = _this.insertText({
				text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
				fontSize: 15,
				posX: padding,
				posY: posY,
				color: titleColor
			});

			posY += titleHeight;

			_this.setFontType('normal');

			var paragHeight = _this.insertText({
				text: item.parag,
				fontSize: 10,
				posX: padding,
				posY: posY
			});

			console.log(titleHeight);
			console.log(paragHeight);

			posY += paragHeight + 20;
		});
	});
})();