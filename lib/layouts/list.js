import PDFCreator from '../pdfCreator';

PDFCreator.addLayout('list', (pdf, data) => {
    const { width, height, padding } = pdf;
    const {
        listTitle = {},
        listDesc = {},
        listItems = [],
        lineNumbers,
        pagesLimit = Infinity
    } = data;

    // Track and update posY, after adding each list item
    let posY = padding; // FIXME: add an option to start from the current position

    // Track the added pages, so that we won't add more pages than the pagesLimit
    let addedPages = 1;

    // Using some so we can break the iteration when the added pages exceed the pagesLimit
    listItems.some((item) => {
        const itemHeight = item.height;

        // Check if there is no more room, then create a new page
        if (itemHeight > height - padding * 2 - posY) {
            if (addedPages++ === pagesLimit) return true;

            // Add new page
            pdf.addPage();

            posY = padding;
        }

        posY += item.insert(posY);
    });
});
