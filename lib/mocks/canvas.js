class Canvas {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
    }

    getContext() {
        return {
            drawImage() {}
        };
    }

    toDataURL() {
        return this.dataUrl;
    }
}

export default Canvas;
