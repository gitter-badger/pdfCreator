/**
 * PDF Class
 */

;
(function () {
    'use strict';

    class PDF {
        constructor (width, height, padding, unit) {
            this.width = width;
            this.height = height;
            this.padding = padding;
            this.unit = unit;

            try {
                this.doc = new jsPDF({unit: this.unit});
            } catch (error) {
                console.error(error);
            }
        }

        setFontType (type) {
            this.doc.setFontType(type);
        }
    
        insertHeader ({text, align, color = [0, 0, 0]}) {
            this.doc.setFontSize(12);
            this.doc.setTextColor(color[0], color[1], color[2]);
            this.setFontType('normal');
            this.doc.text(text, align === 'center' ? this.padding / 2 : this.padding, this.padding, align);
            this.doc.line(this.padding, this.padding + 7, this.width - this.padding, this.padding + 7);
        }

        insertFooter ({text, align, color = [0, 0, 0], linkText, linkUrl}) {
            this.doc.setFontSize(10);
            this.setFontType('normal');
            this.doc.setTextColor(color[0], color[1], color[2]);
            this.doc.text(text, align === 'center' ? this.width / 2 : this.padding, this.height - this.padding, align);
            this.doc.line(this.padding, this.height - this.padding - 12, this.width - this.padding, this.height - this.padding - 12);

            if (linkText && linkUrl) {
                this.doc.setTextColor(34, 167, 240);
                this.doc.textWithLink(linkText, this.padding + this.doc.getTextWidth(text) + 2, this.height - this.padding, { url: linkUrl });
            }
        }

        toDataUrl (url, callback, outputFormat) {
            const img = new Image();

            img.crossOrigin = 'Anonymous';

            img.onload = function () {
                var canvas = document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'),
                    dataURL = void 0;

                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL, img.width, img.height);
                canvas = null;
            };

            img.src = url;
        }

        insertImage ({imgUrl, imgExt, posX, posY, width, height}) {
            const crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

            this.toDataUrl(imgUrl, (base64Img, imgWidth, imgHeight) => {
                const ratio = imgHeight / imgWidth;

                imgWidth = width || imgWidth;
                imgHeight = height || imgWidth * ratio;

                if (posX === 'center') {
                    posX = (this.width - imgWidth) / 2;
                }

                this.doc.setPage(crtPageNumber);
                this.doc.addImage(base64Img, imgExt, posX, posY, imgWidth, imgHeight);
            });
        }
        
        insertText ({text, fontSize, posX, posY, align, type, color = [0, 0, 0]}) {
            this.doc.setFontSize(fontSize);
            this.doc.setTextColor(color[0], color[1], color[2]);

            // Set the font-type if given
            type && this.setFontType(type);

            // Split text first into lines if it exceeded the max length
            const splittedText = this.doc.splitTextToSize(text, 
                this.width - this.padding - (align === 'center' ? posX / 2 : posX));

            this.doc.text(splittedText, posX, posY, align || '');

            // Return the added text height, to be used for calculation
            return this.doc.internal.getLineHeight() * splittedText.length;
        }
        
        addPage ({width, height}) {
            this.doc.addPage(width, height);
        }
        
        getPageInfo () {
            return this.doc.internal.getCurrentPageInfo();
        }
        
        add (layout, data) {
            try {
                PDF.layouts[layout].call(this, data);
            } catch (error) {
                console.error(error.message);
            }
        }
        
        save(fileName) {
            this.doc.save(fileName || Date.now());
        }
    }

    PDF.addLayout = (name, func) => {
        if (PDF.layouts) {
            PDF.layouts[name] = func;
        } else {
            PDF.layouts = {
                [name]: func
            };
        }
    };

    module.exports = PDF;
})();