/**
 * Title and paragraph list layout
 */

;
(function () {
    'use strict';

    const PDF = require('../class');

    PDF.addLayout('titleAndParagList', function (data) {
        const {doc, width, height, padding} = this,
            {titleColor = [0, 0, 0], list = [], lineNumbers, pagesLimit = Infinity} = data;

        // Track and update posY, after adding each title/parag
        let posY = padding + 55;

        // Track the added pages, so that we won't add page more than the pagesLimit
        let addedPages = 1;

        // Using some so we can break the iteration when the added pages exceed the pagesLimit
        list.some((item, index) => {
            let titleHeight = this.getTextHeight({
                text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
                fontSize: 15,
                type: 'bold',
                posX: padding
            });

            let paragHeight = this.getTextHeight({
                text: item.parag,
                fontSize: 10,
                type: 'normal',
                posX: padding
            });

            // Check if there is no room for extra text, then create new page
            if (titleHeight + paragHeight > this.height - this.padding * 2 - posY) {
                if (addedPages++ === pagesLimit) return true;

                // Add new page
                this.addPage({
                    width: this.width, 
                    height: this.height
                });
                
                // Insert page header
                this.insertHeader({
                    text:'Socialbakers Export'
                });

                // Insert page footer
                this.insertFooter({
                    text: 'Page 4/10',
                    align: 'center'
                });

                posY = padding + 55;
            }
       
            titleHeight = this.insertText({
                text: (lineNumbers ? index + 1 + '. ' : '') + item.title,
                fontSize: 15,
                posX: padding,
                posY, 
                color: titleColor,
                type: 'bold',
                maxAllowedHeight: this.height - this.padding * 2 - posY
            });

            posY += titleHeight;

            paragHeight = this.insertText({
                text: item.parag,
                fontSize: 10,
                posX: padding,
                posY,
                type: 'normal',
                maxAllowedHeight: this.height - this.padding * 2 - posY
            });       

            posY += paragHeight + 20;
        });
    });
})();