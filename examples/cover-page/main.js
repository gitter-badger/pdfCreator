(() => {
    'use strict';

    // Create new PDF document
    const pdfDoc = new PDFCreator(595.28, 841.89, 595.28 * 0.05, 'pt');

    // Add cover page with a footer
    pdfDoc.add('cover', {
        topImgUrl: 'logo1.png',
        title: 'My Facebook Page Likes Campaign',
        subTitle: '1st December 2016 - 3rd February 2017',
        subSubTitle: 'Page likes campaign with target: 15000',
        bottomImgUrl: 'logo2.png',
        footerText: 'Whenever you want to be the footer text',
        footerAlign: 'right'
    });

    // Save the document
    document.getElementById('save').onclick = () => {
        pdfDoc.save('cover-example');
    };
})();
