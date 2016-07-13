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
	
		insertHeader (text, alignment) {
			this.doc.setFontSize(12);
			this.doc.text(text, alignment === 'center' ? this.padding / 2 : this.padding, this.padding, alignment);
			this.doc.line(this.padding, this.padding + 7, this.padding - this.padding, this.padding + 7);
		}

		insertFooter (text, alignment, linkText, linkUrl) {
			this.doc.setFontSize(10);
			this.doc.text(text, alignment === 'center' ? this.width / 2 : this.padding, this.height - this.padding, alignment);
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

		insertImage (imageUrl, imageFormat, posX, posY, width, height) {
			const crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

			this.toDataUrl(imageUrl, (base64Img, imgWidth, imgHeight) => {
				const ratio = imgHeight / imgWidth;

				imgWidth = width || imgWidth;
				imgHeight = height || imgWidth * ratio;

				if (posX === 'center') {
					posX = (this.width - imgWidth) / 2;
				}

				this.doc.setPage(crtPageNumber);
				this.doc.addImage(base64Img, imageFormat, posX, posY, imgWidth, imgHeight);
			});
		}
		
		insertText (text, fontSize, posX, posY, alignment, colR, colG, colB) {
			colR = colR || 0;
			colG = colG || 0;
			colB = colB || 0;

			this.doc.setFontSize(fontSize);
			this.doc.setTextColor(colR, colG, colB);
			this.doc.text(text, posX, posY, alignment || '');
		}
		
		addPage (width, height) {
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