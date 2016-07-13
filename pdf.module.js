function PDF(width, hight, margin) {
    try {
        this.doc = new jsPDF({unit: 'pt'});
    } catch (error) {
        console.error(error);
    }

    this.docWidth = width;
    this.docHeight = hight;
    this.docMargin = margin;

    // Get available fonts
    //console.log(this.doc.getFontList())
}

PDF.prototype.setFontType = function (type) {
    this.doc.setFontType(type);
};

PDF.prototype.insertHeader = function (text, alignment) {
    this.doc.setFontSize(12);
    this.doc.text(text, (alignment === 'center' ? this.docWidth / 2 : this.docMargin), this.docMargin, alignment);
    this.doc.line(this.docMargin, this.docMargin + 7, this.docWidth - this.docMargin, this.docMargin + 7);
};

PDF.prototype.insertFooter = function (text, alignment, linkText, linkUrl) {
    this.doc.setFontSize(10);
    this.doc.text(text, (alignment === 'center' ? this.docWidth / 2 : this.docMargin), this.docHeight - this.docMargin, alignment);
    this.doc.line(this.docMargin, this.docHeight - this.docMargin - 12, this.docWidth - this.docMargin, this.docHeight - this.docMargin - 12);

    if (linkText && linkUrl) {
        this.doc.setTextColor(34, 167, 240);
        this.doc.textWithLink(linkText, this.docMargin + this.doc.getTextWidth(text) + 2, this.docHeight - this.docMargin, {url: linkUrl});
    }
};

PDF.prototype.toDataUrl = function (url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL, this.width, this.height);
        canvas = null;
    };
    img.src = url;
};

PDF.prototype.insertImage = function (imageUrl, imageFormat, posX, posY, width, height) {
    var crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

    this.toDataUrl(imageUrl, function (base64Img, imgWidth, imgHeight) {
        var ratio = imgHeight / imgWidth;

        imgWidth = width || imgWidth;
        imgHeight = height || imgWidth * ratio;

        if(posX === 'center') {
            posX = (this.docWidth - imgWidth) / 2;
        }

        this.doc.setPage(crtPageNumber);
        this.doc.addImage(base64Img, imageFormat, posX, posY, imgWidth, imgHeight);
    }.bind(this));
};

PDF.prototype.insertText = function (text, fontSize, posX, posY, alignment, colR, colG, colB) {
    colR = colR || 0;
    colG = colG || 0;
    colB = colB || 0;
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(colR, colG, colB);
    this.doc.text(text, posX, posY, alignment || '');
};

PDF.prototype.addPage = function (width, height) {
    this.doc.addPage(width, height);
};

PDF.prototype.getPageInfo = function () {
    return this.doc.internal.getCurrentPageInfo()
};

PDF.prototype.save = function (fileName) {
    this.doc.save(fileName || Date.now());
};