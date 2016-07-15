/**
 * Cover Layout
 */

;
(function () {
	'use strict';

	const PDF = require('../class');

	PDF.addLayout('cover', function (data) {
		const {doc, width, height, padding} = this,
			{topImgUrl, topImgExt = 'PNG', title, subTitle, subSubTitle, bottomImgUrl, bottomImgExt = 'PNG'} =  data;

		this.insertImage({
			imgUrl: topImgUrl,
			imgExt: topImgExt, 
			posX: 'center',
			posY: height / 4,
			width: width / 3
		});

		this.insertText({
			text: title,
			fontSize: 25,
			posX: width / 2,
			posY: height / 3 + 125,
			align: 'center'
		});

		this.insertText({
			text: subTitle,
			fontSize: 14,
			posX: width / 2,
			posY: height / 3 + 160,
			align: 'center'
		});

		this.insertText({
			text: subSubTitle,
			fontSize: 11,
			posX: width / 2,
			posY: height / 3 + 180,
			align: 'center'
		});

		this.insertImage({
			imgUrl: bottomImgUrl,
			imgExt: bottomImgExt,
			posX: padding + 50,
			posY: 3 * height / 4,
			width:90
		});
	});
})();