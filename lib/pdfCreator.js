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
    constructor(width, height, padding, unit) {
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
    static addLayout(name, procedure) {
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
    static getLayoutProcedure(name) {
        return Layouts[name];
    }

    /**
     * Convert hex color to the equivalent rgb version
     * @param  {string} hex - Hex color
     * @return {array|null} - Equivalent rgb color
     * @memberOf PDFCreator
     */
    static hexToRgb(hex) {
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
    setFontType(type) {
        this.doc.setFontType(type);
    }

    /**
     * Set the document font-size
     * @param {number} type - Font size
     * @memberOf PDFCreator.prototype
     */
    setFontSize(size) {
        if (typeof size !== 'number')
            return console.error('Font size should be a number');

        this.doc.setFontSize(size);
    }

    /**
     * Set the document text-color
     * @param {array<number>|string} color - Color as RGB array or hex color
     * @memberOf PDFCreator.prototype
     */
    setTextColor(color) {
        if (Array.isArray(color)) {
            const [r, g, b] = color;
            this.doc.setTextColor(r, g, b);
        } else if (PDFCreator.hexToRgb(color)) {
            const [r, g, b] = PDFCreator.hexToRgb(color);
            this.doc.setTextColor(r, g, b);
        } else {
            console.error('Color should be array on RGB, or HEX color');
        }
    }

    /**
     * Insert text into the document with the given (x, y) coordinates
     * Also it supports multiple options of positioning the text according
     * to the given parameters
     * @param  {string} options.text             - Text to be inserted
     * @param  {number} options.size             - Font size
     * @param  {number} options.type             - Font type
     * @param  {number} options.x                - X position
     * @param  {number} options.y                - Y position
     * @param  {string} options.align            - Text alignment
     * @param  {array|string} options.color      - Text color
     * @param  {number} options.maxAllowedHeight - Max allowed lines-height
     * @return {number}                          - Inserted text height
     * @memberOf PDFCreator.prototype
     */
    insertText({text, size, type, x, y, align = '', color, maxAllowedHeight = Infinity}) {
        if (typeof text !== 'string') {
            return console.error('Text should be a string');
        }

        // If the alignment is center, so we need to set x position as document
        // padding/2, to be centered correctly
        if (align === 'center') {
            x = this.padding / 2;
        }

        // Reqired text adjustments before inserting the text
        size && this.setFontSize(size);
        type && this.setFontType(type);
        color && this.setTextColor(color);

        // Firstly, split text into lines if it exceeded the max line-length
        const splittedText = this.doc.splitTextToSize(
            text,
            this.width - this.padding - (align === 'center' ? x / 2 : x)
        );

        // Calculate full text-height, so in case of exceeding the given maxAllowedHeight
        const fullTextHeight = this.doc.internal.getLineHeight() * splittedText.length;

        // Check if the text height is larger than the max allowed height,
        // then return false, so that we emit that the process didn't complete
        if (fullTextHeight > maxAllowedHeight) {
            return false;
        }

        // Secondly, insert the splitted text into the doc
        this.doc.text(splittedText, x, y, align);

        // Return the added text height, to be used for further calculation
        return fullTextHeight;
    }

    /**
     * Insert line into the document with the given (x1, y1, x2, y2) coordinates
     * @param {number} x1 - Horizonal starting point
     * @param {number} y1 - Vertical starting point
     * @param {number} x2 - Horizonal ending point
     * @param {number} y2 - Vertical ending point
     * @memberOf PDFCreator.prototype
     */
    insertLine(x1, y1, x2, y2) {
        // The default is a stright horizontal line, so if "y2" is missing
        // set "y2" = "y1"
        if (y2 === undefined) {
            y2 = y1;
        }

        this.doc.line(x1, y1, x2, y2);
    }

    /**
     * Insert header into the document
     * @param {string} options.text             - Text to be inserted
     * @param {number} options.size             - Font size
     * @param {number} options.type             - Font type
     * @param {string} options.align            - Text alignment
     * @param {array|string} options.color      - Text color
     * @memberOf PDFCreator.prototype
     */
    insertHeader({text, size, type, align, color}) {
        const textHeight = this.insertText({text, size, type, align, color});
        this.insertLine(this.padding, this.padding + textHeight, this.width - this.padding);
        return textHeight;
    }

    insertFooter({text, align, color = [0, 0, 0], linkText, linkUrl}) {
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

    /**
     * The step before inserting the image into the document, it loads the image then converts it to data url,
     * so we can insert the image into the pdf document
     * @param  {string}  options.url          - Absolute or relative image url
     * @param  {Function} options.callback    - Converting callback function
     * @param  {string}  options.outputFormat - Output image format
     * @param  {Image}   [options.Image       - Image Element constructor
     * @return {Image}                        - Created image instance
     * @memberOf PDFCreator.prototype
     */
    toDataUrl({url, callback, outputFormat, Image = Image}) {
        const img = new Image();

        img.crossOrigin = 'Anonymous';

        img.onload = () => {
            let canvas = document.createElement('CANVAS');
            let ctx = canvas.getContext('2d');
            let dataURL = void 0;

            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL, img.width, img.height);
            canvas = null;
        };

        img.src = url;

        // Mainly for testing
        return img;
    }

    /**
     * Insert an image in the document with taking the image url
     * @param {string} options.imgUrl      - Image url
     * @param {string} [options.imgExt]    - Image extension
     * @param {number|string} options.posX - Left image offset
     * @param {number} options.posY        - Right image offset
     * @param {number} [options.width]     - Optional image width or it takes the actual width
     * @param {number} [options.height]    - Optional image height or it takes the actual height
     * @memberOf PDFCreator.prototype
     */
    insertImage({imgUrl, imgExt, posX, posY, width, height}) {
        const crtPageNumber = this.doc.internal.getCurrentPageInfo().pageNumber;

        this.toDataUrl(imgUrl, (base64Img, imgWidth, imgHeight) => {
            imgWidth = width || imgWidth;
            imgHeight = height || imgHeight;

            if (posX === 'center') {
                posX = (this.width - imgWidth) / 2;
            }

            this.doc.setPage(crtPageNumber); // why I need to call setPage?!!!
            this.doc.addImage(base64Img, imgExt, posX, posY, imgWidth, imgHeight);
        });
    }

    /**
     * Get the height of the given text after splitting it into lines without inseting in
     * into the document, useful to measure the text height before inserting it
     * @param  {string} options.text    - Text to be splitted and measured
     * @param  {number} options.size    - Font size
     * @param  {number} options.posX    - Text left position
     * @param  {string} [options.type]  - Font type
     * @param  {string} [options.align] - Text alignment
     * @return {number}                 - Final text height after splitting
     */
    getTextHeight({text, size, posX, type, align}) {
        this.setFontSize(size);
        type && this.setFontType(type);

        const splittedText = this.doc.splitTextToSize(
            text,
            this.width - this.padding - (align === 'center' ? posX / 2 : posX)
        );

        return this.doc.internal.getLineHeight() * splittedText.length;
    }

    /**
     * Add new page to the current document with the same width/height
     * @memberOf PDFCreator.prototype
     */
    addPage() {
        this.doc.addPage(this.width, this.height);
    }

    /**
     * Get the current page info
     * @return {object} - Page info
     */
    getPageInfo() {
        return this.doc.internal.getCurrentPageInfo();
    }

    add(layout, data) {
        PDFCreator.layouts[layout].call(this, data);
        // try {
        // } catch (error) {
        //     console.error(error.message);
        // }
    }

    /**
     * Save the generated pdf document
     * @param {string} [fileName] - Pdf file name
     * @memberOf PDFCreator.prototype
     */
    save(fileName) {
        this.doc.save(fileName || Date.now());
    }
}

export default PDFCreator;

// Support loading PDFCreator directly in the browser
if (window) window.PDFCreator = PDFCreator;
