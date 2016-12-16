import PDFCreator from '../pdfCreator';

PDFCreator.addLayout('cover', (pdf, data) => {
    const { width, height, padding } = pdf;
    const {
        topImgUrl,
        topImgExt = 'PNG',
        title, subTitle,
        subSubTitle,
        bottomImgUrl,
        bottomImgExt = 'PNG',
        footerText,
        footerAlign = 'center'
    } =  data;

    pdf.insertImage({
        url: topImgUrl,
        ext: topImgExt,
        x: 'center',
        y: height / 4,
        width: width / 3
    });

    pdf.insertText({
        text: title,
        size: 25,
        y: height / 3 + 125,
        align: 'center'
    });

    pdf.insertText({
        text: subTitle,
        size: 14,
        y: height / 3 + 160,
        align: 'center'
    });

    pdf.insertText({
        text: subSubTitle,
        size: 11,
        y: height / 3 + 180,
        align: 'center'
    });

    pdf.insertText({
        text: footerText,
        size: 10,
        x: footerAlign === 'center' ? null : width - padding,
        y: height - padding,
        align: footerAlign
    });

    pdf.insertImage({
        url: bottomImgUrl,
        ext: bottomImgExt,
        x: padding + 50,
        y: 3 * height / 4,
        width: 90
    });
});
