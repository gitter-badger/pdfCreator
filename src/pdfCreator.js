import jsPDF from 'jspdf';

/**
 * pdfCreator.js
 *
 * MIT License
 * Copyright (c) 2016 Muhammad Aref
 *
 * It is a library to create rich PDF reports in the browser or in a node server
 * using many default layouts, and also the library supports add custom layouts.
 */

/**
 * Page layout, it can be only the default layouts, or any other custom layouts
 * @type {object}
 */
const Layouts = {};

/**
 * Supported measuring units
 * @type {array}
 */
const SUPPORTED_UNITS = ['pt', 'mm', 'cm', 'in', 'px', 'pc', 'em', 'ex'];

/**
 * Full hex color version regex
 * @type {RegExp}
 */
const FULL_HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * Shorthand hex color regex
 * @type {RegExp}
 */
const SHORTHAND_HEX_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

class PDFCreator {
    /**
     * PDF document
     * @param {number} width   - Page width
     * @param {number} height  - Page height
     * @param {number} padding - Page padding
     * @param {number} unit    - Default measuring unit
     */
    constructor (width, height, padding, unit) {
        if (isNaN(Number(width)) || isNaN(Number(height))) {
            return console.error('The document dimensions should be numbers');
        }

        if (isNaN(Number(padding))) {
            return console.error('The document padding should be number');
        }

        if (!SUPPORTED_UNITS.includes(unit)) {
            return console.error(`The given unit "${unit}" is not supported`);
        }

        this.width = width;
        this.height = height;
        this.padding = padding;
        this.unit = unit;
        this.doc = new jsPDF({unit: this.unit});
    }

    /**
     * Add layout to the list of layouts, this method allow is also used to add
     * custom layouts
     * @param {string} name        - Layout name, should be unique
     * @param {function} procedure - Layout procedure
     * @memberOf PDFCreator
     */
    static addLayout (name, procedure) {
        if (typeof name !== 'string')
            return console.error('Layout name should be a string');

        if (typeof procedure !== 'function')
            return console.error('Layout procedure should be a function');

        if (Layouts[name])
            return console.error(`You can not overwrite layout, this layout "${name}" exists`);

        Layouts[name] = procedure;
    }

    /**
     * Get layout procedure (default layout, or custom)
     * @param  {string}   - Layout name
     * @return {function} - Layout procedure
     * @memberOf PDFCreator
     */
    static getLayoutProcedure (name) {
        return Layouts[name];
    }

    /**
     * Convert hex color to the equivalent rgb version
     * @param  {string} hex - Hex color
     * @return {array|null} - Equivalent rgb color
     * @memberOf PDFCreator
     */
    static hexToRgb (hex) {
        // Replace the shorthand hex with the full version
        // #ff0 >> #ffff00
        hex = hex.replace(SHORTHAND_HEX_REGEX, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = FULL_HEX_REGEX.exec(hex);

        return result
            ? result.slice(1).map(num => parseInt(num, 16))
            : null;
    }

    /**
     * Set the document font-type
     * @param {string} type - Font type
     * @memberOf PDFCreator.prototype
     */
    setFontType (type) {
        this.doc.setFontType(type);
    }

    /**
     * Set the document font-size
     * @param {number} type - Font size
     * @memberOf PDFCreator.prototype
     */
    setFontSize (size) {
        if (typeof size !== 'number')
            return console.error('Font size should be a number');

        this.doc.setFontSize(size);
    }

    setTextColor (color) {
        const [r, g, b] = color.split(',');
        this.doc.setTextColor(r, g, b);
    }

    /**
     * Insert header in the current active document page
     * @param  {object} options - Header options and text value
     * @memberOf PDFCreator.prototype
     */
    insertHeader (options) {
        const {text, align, color = '0, 0, 0', fontSize = 12} = options;

        this.setFontSize(fontSize);
        this.setTextColor(color);
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
            let canvas = document.createElement('CANVAS'),
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

    insertText ({text, fontSize, posX, posY, align, type, color = [0, 0, 0], maxAllowedHeight = Infinity}) {
        this.doc.setFontSize(fontSize);
        this.doc.setTextColor(color[0], color[1], color[2]);

        // Set the font-type if provided
        type && this.setFontType(type);

        // Firstly, split text into lines if it exceeded the max length
        const splittedText = this.doc.splitTextToSize(text,
                this.width - this.padding - (align === 'center' ? posX / 2 : posX)),
            fullTextHeight = this.doc.internal.getLineHeight() * splittedText.length;

        // Check if the text height is larger than the max allowed height,
        // then return false, so that we emit that the process didn't complete
        if (fullTextHeight > maxAllowedHeight) {
            return false;
        }

        // Secondly, insert the splitted text to the doc
        this.doc.text(splittedText, posX, posY, align || '');

        // Return the added text height, to be used for calculation
        return fullTextHeight;
    }

    getTextHeight ({text, fontSize, posX, type, align}) {
        this.setFontSize(fontSize);
        type && this.setFontType(type);

        const splittedText = this.doc.splitTextToSize(text,
                this.width - this.padding - (align === 'center' ? posX / 2 : posX));

        return this.doc.internal.getLineHeight() * splittedText.length;
    }

    addPage ({width, height}) {
        this.doc.addPage(width, height);
    }

    getPageInfo () {
        return this.doc.internal.getCurrentPageInfo();
    }

    add (layout, data) {
        PDFCreator.layouts[layout].call(this, data);
        // try {
        // } catch (error) {
        //     console.error(error.message);
        // }
    }

    save (fileName) {
        this.doc.save(fileName || Date.now());
    }
}

export default PDFCreator;

// Support loading PDFCreator directly in the browser
if (window) window.PDFCreator = PDFCreator;
