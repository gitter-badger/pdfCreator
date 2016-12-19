(() => {
    'use strict';

    // Create new PDF document
    const pdfDoc = new PDFCreator(595.28, 841.89, 595.28 * 0.05, 'pt');

    // Add cover page with a footer
    pdfDoc.add('cover', {
        topImgUrl: 'logo1.png',
        title: 'This is my awesome BIG title',
        subTitle: '1st December 2016 - 3rd February 2017',
        subSubTitle: 'Here there is another place for more details',
        bottomImgUrl: 'logo2.png',
        footerText: 'Whenever you want to be the footer text',
        footerAlign: 'right'
    });

    // Save the document
    document.getElementById('save').onclick = () => {
        pdfDoc.save('cover-example');
    };
})();
