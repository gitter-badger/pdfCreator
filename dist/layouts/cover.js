'use strict';

/**
 * Cover Layout
 */

;
(function () {
	'use strict';

	var PDF = require('../class');

	PDF.addLayout('cover', function (data) {
		var doc = this.doc;
		var width = this.width;
		var height = this.height;
		var padding = this.padding;
		var topImg = data.topImg;
		var title = data.title;
		var subTitle = data.subTitle;
		var subSubTitle = data.subSubTitle;
		var lowerImg = data.lowerImg;


		topImg && this.insertImage(topImg, 'PNG', 'center', height / 4, width / 3);
		title && this.insertText(title, 25, width / 2, height / 3 + 125, 'center');
		subTitle && this.insertText(subTitle, 14, width / 2, height / 3 + 160, 'center');
		subSubTitle && this.insertText(subSubTitle, 11, width / 2, height / 3 + 180, 'center');
		lowerImg && this.insertImage(lowerImg, 'PNG', padding + 50, 3 * height / 4, 90);
	});
})();