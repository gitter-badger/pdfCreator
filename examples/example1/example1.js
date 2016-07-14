(function () {
	'use strict';

	const PDF = require('../../dist/pdfcreator'),
		pdfDoc = new PDF(595.28, 841.89, 595.28 * 0.05, 'pt');

	// Add cover page
	pdfDoc.add('cover', {
		topImg: 'logo1.png',
		title: 'Souq.com Page Likes Campaign',
		subTitle: '1st December 2015 - 3rd February 2016',
		subSubTitle: 'Page likes campaign with target: 15000',
		lowerImg: 'logo2.png'
	});

	// Create new page
	pdfDoc.addPage(pdfDoc.width, pdfDoc.height);
    
    // Insert header, and footer
    pdfDoc.insertHeader('Socialbakers Export');
    pdfDoc.insertFooter('Page 2/10', 'center');

    // Insert image with list
    pdfDoc.add('imgWithList', {
    	img: 'chart1.png',
    	titleColor: [247, 175, 48],
    	list: [
    		{
    			title: 'Total Fans',
    			subTitle: '232 k'
    		},
    		{
    			title: 'Total Change in Fans',
    			subTitle: '+ 17,1 k'
    		},
    		{
    			title: 'Max Change of Fans on',
    			subTitle: '+ 6,8 k'
    		}
    	]
    });

    // Insert full width image
    pdfDoc.add('fullWidthImg', {
    	img: 'map.jpg'
    });

	window.pdfDoc = pdfDoc;


	document.getElementById('save').onclick = pdfDoc.save.bind(pdfDoc, null);
})();