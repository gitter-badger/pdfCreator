TitleAndParag Atom
---

### Class API
```js
pdfDoc.create('TitleAndParag', [options]);
```
##### `options`:

 - `pdf` PDFCreator (required) - Current PDFCreator instance
 - `title` Object (required) - Item title
  - `text` String (optional) - Title text
  - `size` Integer (optional) - Title font size *(default `15`)*
  - `type` String (optional) - Title font type *(default `bold`)*
  - `color` String (optional) - Title color *(default is the last added color -_-`)*
  - `x` Integer (optional) - Title "x" position *(default document `padding`)*
 - `parag` Object (required) - Item paragraph
  - `text` String (optional) - Paragraph text
  - `size` Integer (optional) - Paragraph font size *(default `10`)*
  - `type` String (optional) - Paragraph font type *(default `bold`)*
  - `color` String (optional) - Title color *(default is the last added color -_-)*
  - `x` Integer (optional) - Paragraph "x" position *(default document `padding`)*
 - `margin` Object (optional) - Item inner and outer spacing
  - `top` Integer (optional) - Top space before the title *(default `0`)*
  - `inner` Integer (optional) - Space between atom title and paragraph *(default `0`)*
  - `bottom` Integer (optional) - Bottom space after the paragraph *(default `0`)*

### Usage Example
```js
const data = [
    {
        title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        parag: 'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo.'
    }
];

const listItems = data.titleAndParagList.map(item => {
    return pdfDoc.create('TitleAndParag', {
        pdf: pdfDoc,
        title: {
            text: item.title,
            color: '#ff0000'
        },
        parag: {
            text: item.parag,
            color: '#000'
        },
        margin: {
            inner: 4,
            bottom: 10
        }
    });
});

let posY = pdfDoc.padding;

listItems.forEach((item) => {
    posY += item.insert(posY);
});
```
