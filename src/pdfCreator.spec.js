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
        it('should return the procedure if the layout exists', () => {
            const procedure = () => 'header procedure';
            PDFCreator.addLayout('header', procedure);
            expect(PDFCreator.getLayoutProcedure('header')()).toBe('header procedure');
        });
    });
});
