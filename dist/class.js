'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PDF Class
 */

;
(function () {
	'use strict';

	var PDF = function () {
		function PDF(width, height, padding, unit) {
			_classCallCheck(this, PDF);

			this.width = width;
			this.height = height;
			this.padding = padding;
			this.unit = unit;

			try {
				this.doc = new jsPDF({ unit: this.unit });
			} catch (error) {
				console.error(error);
			}
		}

		_createClass(PDF, [{
			key: 'setFontType',
			value: function setFontType(type) {
				this.doc.setFontType(type);
			}
		}, {
			key: 'insertHeader',
			value: function insertHeader(text, alignment) {
				this.doc.setFontSize(12);
				this.doc.text(text, alignment === 'center' ? this.padding / 2 : this.padding, this.padding, alignment);
				this.doc.line(this.padding, this.padding + 7, this.width - this.padding, this.padding + 7);
			}
		}, {
			key: 'insertFooter',
			value: function insertFooter(text, alignment, linkText, linkUrl) {
				this.doc.setFontSize(10);
				this.doc.text(text, alignment === 'center' ? this.width / 2 : this.padding, this.height - this.padding, alignment);
				this.doc.line(this.padding, this.height - this.padding - 12, this.width - this.padding, this.height - this.padding - 12);

				if (linkText && linkUrl) {
					this.doc.setTextColor(34, 167, 240);
					this.doc.textWithLink(linkText, this.padding + this.doc.getTextWidth(text) + 2, this.height - this.padding, { url: linkUrl });
				}
			}
		}, {
			key: 'toDataUrl',
			value: function toDataUrl(url, callback, outputFormat) {
				var img = new Image();

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
		}, {
			key: 'insertImage',
			value: function insertImage(imageUrl, imageFormat, posX, posY, width, height) {
				var _this = this;

				var crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

				this.toDataUrl(imageUrl, function (base64Img, imgWidth, imgHeight) {
					var ratio = imgHeight / imgWidth;

					imgWidth = width || imgWidth;
					imgHeight = height || imgWidth * ratio;

					if (posX === 'center') {
						posX = (_this.width - imgWidth) / 2;
					}

					_this.doc.setPage(crtPageNumber);
					_this.doc.addImage(base64Img, imageFormat, posX, posY, imgWidth, imgHeight);
				});
			}
		}, {
			key: 'insertText',
			value: function insertText(text, fontSize, posX, posY, alignment, colR, colG, colB) {
				colR = colR || 0;
				colG = colG || 0;
				colB = colB || 0;

				this.doc.setFontSize(fontSize);
				this.doc.setTextColor(colR, colG, colB);
				this.doc.text(text, posX, posY, alignment || '');
			}
		}, {
			key: 'addPage',
			value: function addPage(width, height) {
				this.doc.addPage(width, height);
			}
		}, {
			key: 'getPageInfo',
			value: function getPageInfo() {
				return this.doc.internal.getCurrentPageInfo();
			}
		}, {
			key: 'add',
			value: function add(layout, data) {
				try {
					PDF.layouts[layout].call(this, data);
				} catch (error) {
					console.error(error.message);
				}
			}
		}, {
			key: 'save',
			value: function save(fileName) {
				this.doc.save(fileName || Date.now());
			}
		}]);

		return PDF;
	}();

	PDF.addLayout = function (name, func) {
		if (PDF.layouts) {
			PDF.layouts[name] = func;
		} else {
			PDF.layouts = _defineProperty({}, name, func);
		}
	};

	module.exports = PDF;
})();