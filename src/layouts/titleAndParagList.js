/**
 * Title and paragraph list layout
 */

;
(function () {
    'use strict';

    const PDF = require('../class');

    PDF.addLayout('titleAndParagList', function (data) {
        const {doc, width, height, padding} = this,
            {titleColor = [0, 0, 0], list = [], lineNumbers} = data;

        // Track and update posY, after adding each title/parag
        let posY = padding + 55;

        list.forEach((item, index) => {
            const titleHeight = this.insertText({
                text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
                fontSize: 15,
                posX: padding,
                posY, 
                color: titleColor,
                type: 'bold'
            });

            posY += titleHeight;

            const paragHeight = this.insertText({
                text: item.parag,
                fontSize: 10,
                posX: padding,
                posY,
                type: 'normal'
            });

            posY += paragHeight + 20;
        });
    });
})();