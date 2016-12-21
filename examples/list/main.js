(() => {
    'use strict';

    // Create new PDF document
    const pdfDoc = new PDFCreator(595.28, 841.89, 595.28 * 0.05, 'pt');

    const listItems = data.titleAndParagList.map(item => {
        return pdfDoc.create('TitleAndParag', {
            pdf: pdfDoc,
            title: {
                text: item.title,
                size: 15,
                color: '#ff0000'
            },
            parag: {
                text: item.parag,
                color: '#000'
            },
            margin: {
                inner: 4,
                bottom: 10
            }
        });
    });

    // Add list
    pdfDoc.add('list', {
        listItems
    });

    // Save the document
    document.getElementById('save').onclick = () => {
        pdfDoc.save('list-example');
    };

    document.querySelector('iframe').src = pdfDoc.doc.output('dataurlstring');
})();
