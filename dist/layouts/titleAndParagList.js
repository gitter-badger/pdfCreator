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
        var _data$pagesLimit = data.pagesLimit;
        var pagesLimit = _data$pagesLimit === undefined ? Infinity : _data$pagesLimit;

        // Track and update posY, after adding each title/parag

        var posY = padding + 55;

        // Track the added pages, so that we won't add page more than the pagesLimit
        var addedPages = 1;

        // Using some so we can break the iteration when the added pages exceed the pagesLimit
        list.some(function (item, index) {
            var titleHeight = _this.getTextHeight({
                text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
                fontSize: 15,
                type: 'bold',
                posX: padding
            });

            var paragHeight = _this.getTextHeight({
                text: item.parag,
                fontSize: 10,
                type: 'normal',
                posX: padding
            });

            // Check if there is no room for extra text, then create new page
            if (titleHeight + paragHeight > _this.height - _this.padding * 2 - posY) {
                if (addedPages++ === pagesLimit) return true;

                // Add new page
                _this.addPage({
                    width: _this.width,
                    height: _this.height
                });

                // Insert page header
                _this.insertHeader({
                    text: 'Socialbakers Export'
                });

                // Insert page footer
                _this.insertFooter({
                    text: 'Page 4/10',
                    align: 'center'
                });

                posY = padding + 55;
            }

            titleHeight = _this.insertText({
                text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
                fontSize: 15,
                posX: padding,
                posY: posY,
                color: titleColor,
                type: 'bold',
                maxAllowedHeight: _this.height - _this.padding * 2 - posY
            });

            posY += titleHeight;

            paragHeight = _this.insertText({
                text: item.parag,
                fontSize: 10,
                posX: padding,
                posY: posY,
                type: 'normal',
                maxAllowedHeight: _this.height - _this.padding * 2 - posY
            });

            posY += paragHeight + 20;
        });
    });
})();