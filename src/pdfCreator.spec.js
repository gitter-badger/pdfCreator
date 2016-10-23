import PDFCreator from './pdfCreator';

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
    })

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
            const pdf = new PDFCreator(500, 800, 10, 'xxx');
            expect(console.error).toHaveBeenCalledWith('The given unit "xxx" is not supported');
            expect(pdf.doc).toBeUndefined();
        });
    });
});
