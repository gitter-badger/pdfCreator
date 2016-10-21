import PDF from './pdfCreator';

describe('pdfCreator', () => {
    describe('method: addLayout', () => {
        beforeEach(() => {
            spyOn(console, 'error').and.callThrough();
        });

        it('should log error if the name is not a string', () => {
            PDF.addLayout(null);
            expect(console.error).toHaveBeenCalledWith('Layout name should be a string');
        });

        it('should log error if the procedure is not a function', () => {
            PDF.addLayout('footer', []);
            expect(console.error).toHaveBeenCalledWith('Layout procedure should be a function');
        });

        it('should log error if the there is layout with the given name', () => {
            PDF.addLayout('footer', () => {});
            PDF.addLayout('footer', () => {});
            expect(console.error)
                .toHaveBeenCalledWith('You can not overwrite layout, this layout "footer" exists');
        });
    })

    describe('method: getLayoutProcedure', () => {
        it('should return the procedure if the layout exists', () => {
            const procedure = () => 'header procedure';
            PDF.addLayout('header', procedure);
            expect(PDF.getLayoutProcedure('header')()).toBe('header procedure');
        });
    });
});
