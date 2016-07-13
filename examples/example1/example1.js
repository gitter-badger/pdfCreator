(function () {
	'use strict';

	const PDF = require('../../dist/pdfcreator'),
		pdfDoc = new PDF(595.28, 841.89, 595.28 * 0.05, 'pt');

	pdfDoc.add('cover', {
		topImg: 'logo1.png',
		title: 'Souq.com Page Likes Campaign',
		subTitle: '1st December 2015 - 3rd February 2016',
		subSubTitle: 'Page likes campaign with target: 15000',
		lowerImg: 'logo2.png'
	});

	window.pdfDoc = pdfDoc


	document.getElementById('save').onclick = pdfDoc.save.bind(pdfDoc, null);
})();