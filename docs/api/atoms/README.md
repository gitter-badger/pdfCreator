Atoms
---

The `atoms` are small and reusable units, that can easily be used for creating new layouts or even used for the built-in layouts as we will see in the examples

All the `atoms` should have the following main skeleton, but the implementation will be totally different from one to another


### Main Atom Skeleton
```js
import PDFCreator from '../pdfCreator';
import PDFAtom from './atom';

// The atom should extends `PDFAtom` class
class MyAtom extends PDFAtom {
    // The constructor gets the required data, and it should get the current
    // PDFCreator instance (i.e. `pdf`)
    constructor({pdf, ...}) {
        super();
        this.pdf = pdf;
        ...
    }

    // This getter is required
    // It's used to correctly place the elements in the document
    get height() {
        // the calculation of the atom height depends on its structure
    }

    // This method is required
    // It gets the y position of where the atom will be placed
    insert(y) {
        // It should return the inserted atom height, so we can correctly place
        // the next elements
    }

    // Anyother custom methods
    customMethod() {
        ...
    }
}

```

### Register an Atom
```js
PDFCreator.addAtom('MyAtom', MyAtom);
```

### Use an Atom
```js
pdfDoc.create('TitleAndParag', {
    pdf: pdfDoc,
    ...,
    ...
});
```

### Built-in Atoms

- [TitleAndParag](titleAndParag.md)
