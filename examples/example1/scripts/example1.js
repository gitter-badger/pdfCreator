"use strict";

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
			}var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, f, f.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		'use strict';

		var _createClass = function () {
			function defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
					var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
				}
			}return function (Constructor, protoProps, staticProps) {
				if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
			};
		}();

		function _defineProperty(obj, key, value) {
			if (key in obj) {
				Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
			} else {
				obj[key] = value;
			}return obj;
		}

		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}

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
	}, {}], 2: [function (require, module, exports) {
		'use strict';

		/**
   * Cover Layout
   */

		;
		(function () {
			'use strict';

			var PDF = require('../class');

			PDF.addLayout('cover', function (data) {
				var doc = this.doc;
				var width = this.width;
				var height = this.height;
				var padding = this.padding;
				var topImg = data.topImg;
				var title = data.title;
				var subTitle = data.subTitle;
				var subSubTitle = data.subSubTitle;
				var lowerImg = data.lowerImg;

				topImg && this.insertImage(topImg, 'PNG', 'center', height / 4, width / 3);
				title && this.insertText(title, 25, width / 2, height / 3 + 125, 'center');
				subTitle && this.insertText(subTitle, 14, width / 2, height / 3 + 160, 'center');
				subSubTitle && this.insertText(subSubTitle, 11, width / 2, height / 3 + 180, 'center');
				lowerImg && this.insertImage(lowerImg, 'PNG', padding + 50, 3 * height / 4, 90);
			});
		})();
	}, { "../class": 1 }], 3: [function (require, module, exports) {
		'use strict';

		/**
   * Full width image layout
   */

		;
		(function () {
			'use strict';

			var PDF = require('../class');

			PDF.addLayout('fullWidthImg', function (data) {
				var doc = this.doc;
				var width = this.width;
				var height = this.height;
				var padding = this.padding;
				var img = data.img;

				this.insertImage(img, 'PNG', padding, height / 3, width - 2 * padding);
			});
		})();
	}, { "../class": 1 }], 4: [function (require, module, exports) {
		'use strict';

		/**
   * Image with list layout
   */

		;
		(function () {
			'use strict';

			var PDF = require('../class');

			PDF.addLayout('imgWithList', function (data) {
				var _this = this;

				var doc = this.doc;
				var width = this.width;
				var height = this.height;
				var padding = this.padding;
				var img = data.img;
				var titleColor = data.titleColor;
				var list = data.list;

				this.insertImage(img, 'PNG', padding, padding + 35, 3 * width / 5);

				list.forEach(function (item, index) {
					_this.setFontType("normal");
					_this.insertText(item.title, 13, 3 * width / 5 + padding + 10, padding + 55 * (index + 1));
					_this.setFontType("bold");
					_this.insertText(item.subTitle, 26, 3 * width / 5 + padding + 10, padding + 80 + 55 * index, '', titleColor[0], titleColor[1], titleColor[2]);
				});
			});
		})();
	}, { "../class": 1 }], 5: [function (require, module, exports) {
		'use strict';

		// Layouts

		require('./layouts/cover');
		require('./layouts/imgWithList');
		require('./layouts/fullWidthImg');

		module.exports = require('./class');
	}, { "./class": 1, "./layouts/cover": 2, "./layouts/fullWidthImg": 3, "./layouts/imgWithList": 4 }], 6: [function (require, module, exports) {
		(function () {
			'use strict';

			var PDF = require('../../dist/pdfcreator'),
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
				list: [{
					title: 'Total Fans',
					subTitle: '232 k'
				}, {
					title: 'Total Change in Fans',
					subTitle: '+ 17,1 k'
				}, {
					title: 'Max Change of Fans on',
					subTitle: '+ 6,8 k'
				}]
			});

			// Insert full width image
			pdfDoc.add('fullWidthImg', {
				img: 'map.jpg'
			});

			window.pdfDoc = pdfDoc;

			document.getElementById('save').onclick = pdfDoc.save.bind(pdfDoc, null);
		})();
	}, { "../../dist/pdfcreator": 5 }] }, {}, [6]);