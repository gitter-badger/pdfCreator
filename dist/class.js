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
			value: function insertHeader(_ref) {
				var text = _ref.text;
				var align = _ref.align;
				var _ref$color = _ref.color;
				var color = _ref$color === undefined ? [0, 0, 0] : _ref$color;

				this.doc.setFontSize(12);
				this.doc.setTextColor(color[0], color[1], color[2]);
				this.setFontType('normal');
				this.doc.text(text, align === 'center' ? this.padding / 2 : this.padding, this.padding, align);
				this.doc.line(this.padding, this.padding + 7, this.width - this.padding, this.padding + 7);
			}
		}, {
			key: 'insertFooter',
			value: function insertFooter(_ref2) {
				var text = _ref2.text;
				var align = _ref2.align;
				var _ref2$color = _ref2.color;
				var color = _ref2$color === undefined ? [0, 0, 0] : _ref2$color;
				var linkText = _ref2.linkText;
				var linkUrl = _ref2.linkUrl;

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
			value: function insertImage(_ref3) {
				var _this = this;

				var imgUrl = _ref3.imgUrl;
				var imgExt = _ref3.imgExt;
				var posX = _ref3.posX;
				var posY = _ref3.posY;
				var width = _ref3.width;
				var height = _ref3.height;

				var crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

				this.toDataUrl(imgUrl, function (base64Img, imgWidth, imgHeight) {
					var ratio = imgHeight / imgWidth;

					imgWidth = width || imgWidth;
					imgHeight = height || imgWidth * ratio;

					if (posX === 'center') {
						posX = (_this.width - imgWidth) / 2;
					}

					_this.doc.setPage(crtPageNumber);
					_this.doc.addImage(base64Img, imgExt, posX, posY, imgWidth, imgHeight);
				});
			}
		}, {
			key: 'insertText',
			value: function insertText(_ref4) {
				var text = _ref4.text;
				var fontSize = _ref4.fontSize;
				var posX = _ref4.posX;
				var posY = _ref4.posY;
				var align = _ref4.align;
				var _ref4$color = _ref4.color;
				var color = _ref4$color === undefined ? [0, 0, 0] : _ref4$color;

				this.doc.setFontSize(fontSize);
				this.doc.setTextColor(color[0], color[1], color[2]);

				// Split text first into lines if it exceeded the max length
				var splittedText = this.doc.splitTextToSize(text, this.width - this.padding - (align === 'center' ? posX / 2 : posX));
				this.doc.text(splittedText, posX, posY, align || '');

				return this.doc.internal.getLineHeight() * splittedText.length;
			}
		}, {
			key: 'addPage',
			value: function addPage(_ref5) {
				var width = _ref5.width;
				var height = _ref5.height;

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