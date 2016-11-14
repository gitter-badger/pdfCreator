import PDFCreator from '../lib/pdfCreator';

describe('pdfCreator', () => {
    describe('method: addLayout', () => {
        beforeEach(() => {
            spyOn(console, 'error').and.callThrough();
        });

        it('should log error if the name is not a string', () => {
            PDFCreator.addLayout(null);
            expect(console.error).toHaveBeenCalledWith('Layout name should be a string');
        });

        it('should log error if the procedure is not a function', () => {
            PDFCreator.addLayout('footer', []);
            expect(console.error).toHaveBeenCalledWith('Layout procedure should be a function');
        });

        it('should log error if the there is layout with the given name', () => {
            PDFCreator.addLayout('footer', () => {});
            PDFCreator.addLayout('footer', () => {});
            expect(console.error)
                .toHaveBeenCalledWith('You can not overwrite layout, this layout "footer" exists');
        });
    });

    describe('method: getLayoutProcedure', () => {
        it('should return procedure if the layout exists', () => {
            const procedure = () => 'header procedure';
            PDFCreator.addLayout('header', procedure);
            expect(PDFCreator.getLayoutProcedure('header')()).toBe('header procedure');
        });

        it('should return undefined if the layout not exists', () => {
            expect(PDFCreator.getLayoutProcedure('my_header')).toBeUndefined();
        });
    });

    describe('method: hexToRgb', () => {
        it('should return null if the given hex is not valid', () => {
            const invalidHex = 'name';
            expect(PDFCreator.hexToRgb(invalidHex)).toBe(null);
        });

        it('should return the correct equivalent rgb version', () => {
            const hex1 = '#ff0';
            const hex2 = '#ffff00';
            const hex3 = '#000';
            const hex4 = '#fff';
            const hex5 = '#def';
            const hex6 = '#dfd';
            const hex7 = '#8a1b4e';

            expect(PDFCreator.hexToRgb(hex1)).toEqual([255, 255, 0]);
            expect(PDFCreator.hexToRgb(hex2)).toEqual([255, 255, 0]);
            expect(PDFCreator.hexToRgb(hex3)).toEqual([0, 0, 0]);
            expect(PDFCreator.hexToRgb(hex4)).toEqual([255, 255, 255]);
            expect(PDFCreator.hexToRgb(hex5)).toEqual([221, 238, 255]);
            expect(PDFCreator.hexToRgb(hex6)).toEqual([221, 255, 221]);
            expect(PDFCreator.hexToRgb(hex7)).toEqual([138, 27, 78]);
        });
    });

    describe('creating instance', () => {
        beforeEach(() => {
            spyOn(console, 'error').and.callThrough();
        });

        it('should create and return PDFCreator instance', () => {
            const pdf = new PDFCreator(500, 800, 10, 'pt');
            expect(pdf instanceof PDFCreator).toBe(true);
        });

        it('should log error if the document dimensions are not numbers', () => {
            const pdf = new PDFCreator('width', 800, 10, 'pt');
            expect(console.error).toHaveBeenCalledWith('The document dimensions should be numbers');
            expect(pdf.doc).toBeUndefined();
        });

        it('should log error if the document padding is not number', () => {
            const pdf = new PDFCreator(500, 800, 'padding', 'pt');
            expect(console.error).toHaveBeenCalledWith('The document padding should be number');
            expect(pdf.doc).toBeUndefined();
        });

        it('should log error if the given unit is not supported', () => {
            const pdf = new PDFCreator(500, 800, 10, 'wow');
            expect(console.error).toHaveBeenCalledWith('The given unit "wow" is not supported');
            expect(pdf.doc).toBeUndefined();
        });
    });

    describe('setting font properties', () => {
        let pdf;
        let doc;

        beforeEach(() => {
            pdf = new PDFCreator(500, 800, 10, 'pt');
            doc = pdf.doc;
        });

        describe('method: setFontSize', () => {
            beforeEach(() => {
                spyOn(console, 'error').and.callThrough();
                spyOn(doc, 'setFontSize').and.callThrough();
            });

            it('should log error if the font-size is not number', () => {
                pdf.setFontSize('small');
                expect(console.error).toHaveBeenCalledWith('Font size should be a number');
            });

            it('should set the doc font-size correctly', () => {
                pdf.setFontSize(12);
                expect(doc.setFontSize).toHaveBeenCalledWith(12);
            });
        });

        describe('method: setFontType', () => {
            beforeEach(() => {
                spyOn(doc, 'setFontType').and.callThrough();
            });

            it('should set the doc font-type correctly', () => {
                pdf.setFontType('normal');
                expect(doc.setFontType).toHaveBeenCalledWith('normal');
            });
        });

        describe('method: setTextColor', () => {
            beforeEach(() => {
                spyOn(console, 'error').and.callThrough();
                spyOn(doc, 'setTextColor').and.callThrough();
            });

            it('should set the doc text-color correctly if it sent as RGB', () => {
                pdf.setTextColor([0, 255, 255]);
                expect(doc.setTextColor).toHaveBeenCalledWith(0, 255, 255);
            });

            it('should set the doc text-color correctly if it sent as HEX', () => {
                pdf.setTextColor('#fff');
                expect(doc.setTextColor).toHaveBeenCalledWith(255, 255, 255);
            });

            it('should log error if the text-color is neither RGB nor HEX', () => {
                pdf.setTextColor('red');
                expect(console.error).toHaveBeenCalledWith('Color should be array on RGB, or HEX color');
            });
        });

        describe('method: insertText', () => {
            beforeEach(() => {
                spyOn(doc, 'text').and.callThrough();
                spyOn(console, 'error').and.callThrough();
                spyOn(pdf, 'setFontSize').and.callThrough();
                spyOn(pdf, 'setFontType').and.callThrough();
                spyOn(pdf, 'setTextColor').and.callThrough();
            });

            it('should log error if the text is not string', () => {
                pdf.insertText({
                    text: 2555
                });
                expect(console.error).toHaveBeenCalledWith('Text sould be a string');
            });

            it('should set reqired text adjustments before inserting the text', () => {
                pdf.insertText({
                    text: 'my test text',
                    size: 16,
                    color: '#ff0000',
                    type: 'bold'
                });
                expect(pdf.setFontSize).toHaveBeenCalledWith(16);
                expect(pdf.setFontType).toHaveBeenCalledWith('bold');
                expect(pdf.setTextColor).toHaveBeenCalledWith(255, 0, 0);
            });
        });
    });
});
