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
						var type = _ref4.type;
						var _ref4$color = _ref4.color;
						var color = _ref4$color === undefined ? [0, 0, 0] : _ref4$color;

						this.doc.setFontSize(fontSize);
						this.doc.setTextColor(color[0], color[1], color[2]);

						// Set the font-type if given
						type && this.setFontType(type);

						// Split text first into lines if it exceeded the max length
						var splittedText = this.doc.splitTextToSize(text, this.width - this.padding - (align === 'center' ? posX / 2 : posX));

						this.doc.text(splittedText, posX, posY, align || '');

						// Return the added text height, to be used for calculation
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
				var topImgUrl = data.topImgUrl;
				var _data$topImgExt = data.topImgExt;
				var topImgExt = _data$topImgExt === undefined ? 'PNG' : _data$topImgExt;
				var title = data.title;
				var subTitle = data.subTitle;
				var subSubTitle = data.subSubTitle;
				var bottomImgUrl = data.bottomImgUrl;
				var _data$bottomImgExt = data.bottomImgExt;
				var bottomImgExt = _data$bottomImgExt === undefined ? 'PNG' : _data$bottomImgExt;

				this.insertImage({
					imgUrl: topImgUrl,
					imgExt: topImgExt,
					posX: 'center',
					posY: height / 4,
					width: width / 3
				});

				this.insertText({
					text: title,
					fontSize: 25,
					posX: width / 2,
					posY: height / 3 + 125,
					align: 'center'
				});

				this.insertText({
					text: subTitle,
					fontSize: 14,
					posX: width / 2,
					posY: height / 3 + 160,
					align: 'center'
				});

				this.insertText({
					text: subSubTitle,
					fontSize: 11,
					posX: width / 2,
					posY: height / 3 + 180,
					align: 'center'
				});

				this.insertImage({
					imgUrl: bottomImgUrl,
					imgExt: bottomImgExt,
					posX: padding + 50,
					posY: 3 * height / 4,
					width: 90
				});
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
				var imgUrl = data.imgUrl;
				var _data$imgExt = data.imgExt;
				var imgExt = _data$imgExt === undefined ? 'PNG' : _data$imgExt;

				this.insertImage({
					imgUrl: imgUrl,
					imgExt: imgExt,
					posX: padding,
					posY: height / 3,
					width: width - 2 * padding
				});
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
				var imgUrl = data.imgUrl;
				var _data$imgExt = data.imgExt;
				var imgExt = _data$imgExt === undefined ? 'PNG' : _data$imgExt;
				var _data$titleColor = data.titleColor;
				var titleColor = _data$titleColor === undefined ? [0, 0, 0] : _data$titleColor;
				var _data$list = data.list;
				var list = _data$list === undefined ? [] : _data$list;

				this.insertImage({
					imgUrl: imgUrl,
					imgExt: imgExt,
					posX: padding,
					posY: padding + 35,
					width: 3 * width / 5
				});

				list.forEach(function (item, index) {
					_this.insertText({
						text: item.title,
						fontSize: 13,
						posX: 3 * width / 5 + padding + 10,
						posY: padding + 55 * (index + 1),
						type: 'normal'
					});

					_this.insertText({
						text: item.subTitle,
						fontSize: 26,
						posX: 3 * width / 5 + padding + 10,
						posY: padding + 80 + 55 * index,
						color: titleColor,
						type: 'bold'
					});
				});
			});
		})();
	}, { "../class": 1 }], 5: [function (require, module, exports) {
		'use strict';

		/**
   * Title and paragraph list layout
   */

		;
		(function () {
			'use strict';

			var PDF = require('../class');

			PDF.addLayout('titleAndParagList', function (data) {
				var _this = this;

				var doc = this.doc;
				var width = this.width;
				var height = this.height;
				var padding = this.padding;
				var _data$titleColor = data.titleColor;
				var titleColor = _data$titleColor === undefined ? [0, 0, 0] : _data$titleColor;
				var _data$list = data.list;
				var list = _data$list === undefined ? [] : _data$list;
				var lineNumbers = data.lineNumbers;

				// Track and update posY, after adding each title/parag

				var posY = padding + 55;

				list.forEach(function (item, index) {

					var titleHeight = _this.insertText({
						text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
						fontSize: 15,
						posX: padding,
						posY: posY,
						color: titleColor,
						type: 'bold'
					});

					posY += titleHeight;

					var paragHeight = _this.insertText({
						text: item.parag,
						fontSize: 10,
						posX: padding,
						posY: posY,
						type: 'normal'
					});

					posY += paragHeight + 20;
				});
			});
		})();
	}, { "../class": 1 }], 6: [function (require, module, exports) {
		'use strict';

		// Layouts

		require('./layouts/cover');
		require('./layouts/imgWithList');
		require('./layouts/fullWidthImg');
		require('./layouts/titleAndParagList');

		module.exports = require('./class');
	}, { "./class": 1, "./layouts/cover": 2, "./layouts/fullWidthImg": 3, "./layouts/imgWithList": 4, "./layouts/titleAndParagList": 5 }], 7: [function (require, module, exports) {
		(function () {
			'use strict';

			var PDF = require('../../dist/pdfcreator'),
			    pdfDoc = new PDF(595.28, 841.89, 595.28 * 0.05, 'pt');

			// Add cover page
			pdfDoc.add('cover', {
				topImgUrl: 'logo1.png',
				title: 'Souq.com Page Likes Campaign',
				subTitle: '1st December 2015 - 3rd February 2016',
				subSubTitle: 'Page likes campaign with target: 15000',
				bottomImgUrl: 'logo2.png'
			});

			// Add new page
			pdfDoc.addPage({
				width: pdfDoc.width,
				height: pdfDoc.height
			});

			// Insert page header
			pdfDoc.insertHeader({
				text: 'Socialbakers Export'
			});

			// Insert page footer
			pdfDoc.insertFooter({
				text: 'Page 2/10',
				align: 'center'
			});

			// Insert image with list
			pdfDoc.add('imgWithList', {
				imgUrl: 'chart1.png',
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
				imgUrl: 'map.jpg'
			});

			// Add new page
			pdfDoc.addPage({
				width: pdfDoc.width,
				height: pdfDoc.height
			});

			// Insert page header
			pdfDoc.insertHeader({
				text: 'Socialbakers Export'
			});

			// Insert page footer
			pdfDoc.insertFooter({
				text: 'Page 3/10',
				align: 'center'
			});

			// Insert image with list
			pdfDoc.add('titleAndParagList', {
				lineNumbers: true,
				titleColor: [247, 175, 48],
				list: [{
					title: 'Growth of Total Fans',
					parag: 'This graph shows the increase or decrease in fans during a selected time range.'
				}, {
					title: 'Distribution of Fans',
					parag: 'Distribution of fans in different countries.'
				}, {
					title: 'Number of Page Posts',
					parag: 'The sum of all posts posted by each Page'
				}, {
					title: 'Distribution of Page Post Types',
					parag: 'This shows the breakdown of the posts according to the post type during a selected time range.'
				}, {
					title: 'Number of Fan Posts',
					parag: 'The number of fan posts a page received during a selected time range.'
				}, {
					title: 'Evolution of Interactions',
					parag: 'The daily sum of interactions from monitored social media profiles.'
				}, {
					title: 'Distribution of Interactions',
					parag: 'The distribution of interactions (likes, comments, shares) during a selected time range.'
				}, {
					title: 'Most Engaging Post Types',
					parag: 'This shows the average interactions per 1000 fans by post type during a selected time range.'
				}, {
					title: 'User Activity',
					parag: 'This  graph  shows  the  total  number  of  all  user  posts  (user  posts,  questions  and  comments)  by  day  of  the  week  and  by  hour  of  the  day during a selected time range.'
				}, {
					title: 'Number of Interactions per 1000 Fans',
					parag: 'Every post has the metric Number of interactions per 1000 fans that identifies how engaging the post is. It is the sum of interactions (likes, comments,  and  shares)  divided  by  the  number  of  fans  a  page  has  on  the  day  of  the  post  and  multiplied  by  1000.  The  daily,  weekly  and monthly values for this metric are then calculated as the sum of this metric for all posts made on a particular day, during a particular week or month.'
				}, {
					title: 'Response Rate for User Questions',
					parag: 'This  graph  shows  the  percentage  and  the  number  of  user  questions  the  monitored  page  responded  to  versus  the  percentage  and  the number of user questions that did not receive a response during the selected time range. A user question is a user post on the company\'s page or a user post mentioning the company\'s page that contains a question mark in one of several possible languages (English, Armenian, Arabic, Japanese, and others). User questions that were either marked as spam, hidden, or deleted by the admin are not included.'
				}, {
					title: 'Number of User Questions',
					parag: 'The total number of received questions during a selected time range.'
				}]
			});

			document.getElementById('save').onclick = pdfDoc.save.bind(pdfDoc, null);
		})();
	}, { "../../dist/pdfcreator": 6 }] }, {}, [7]);