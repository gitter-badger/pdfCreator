import PDFCreator from '../pdfCreator';
import PDFAtom from './atom';

class TitleAndParag extends PDFAtom {
    /**
     * Create new TitleAndParag atom
     * @param {PDFCreator} options.pdf - PDF creator instance
     * @param {Object} options.title   - Title
     * @param {Object} options.parag   - Paragraph
     * @param {Object} options.margin  - Margin values
     */
    constructor({pdf, title = {}, parag = {}, margin}) {
        super();
        this.pdf = pdf;
        this.title = title;
        this.parag = parag;
        this.margin = Object.assign({top: 0, inner: 0, bottom: 0}, margin);
    }

    /**
     * Get the atom height
     * @return {number} - Atom height
     */
    get height() {
        const titleHeight = this.pdf.getTextHeight({
            text: this.title.text,
            size: this.title.size || 15,
            type: this.title.type || 'bold',
            x: this.title.x || this.pdf.padding
        });

        const paragHeight = this.pdf.getTextHeight({
            text: this.parag.text,
            size: this.parag.size || 10,
            type: this.parag.type || 'normal',
            x: this.parag.x || this.pdf.padding
        });

        return titleHeight + paragHeight + this.marginSum;
    }

    insert(y) {
        y += this.margin.top;

        const titleHeight = this.pdf.insertText({
            text: this.title.text,
            size: this.title.size || 15,
            type: this.title.type || 'bold',
            x: this.title.x || this.pdf.padding,
            y,
            color: this.title.color
        });

        y += titleHeight + this.margin.inner;

        const paragHeight = this.pdf.insertText({
            text: this.parag.text,
            size: this.parag.size || 10,
            type: this.parag.type || 'normal',
            x: this.parag.x || this.pdf.padding,
            y,
            color: this.parag.color
        });

        return titleHeight + paragHeight + this.marginSum;
    }

    get marginSum() {
        return this.margin.top + this.margin.inner + this.margin.bottom;
    }
}

PDFCreator.addAtom('TitleAndParag', TitleAndParag);
