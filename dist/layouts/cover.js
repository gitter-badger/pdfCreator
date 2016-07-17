'use strict';

/**
 * Cover Layout
 */

;
(function () {
    'use strict';

    var PDF = require('../class');

    PDF.addLayout('cover', function (data) {
        var doc = this.doc;
        var width = this.width;
        var height = this.height;
        var padding = this.padding;
        var topImgUrl = data.topImgUrl;
        var _data$topImgExt = data.topImgExt;
        var topImgExt = _data$topImgExt === undefined ? 'PNG' : _data$topImgExt;
        var title = data.title;
        var subTitle = data.subTitle;
        var subSubTitle = data.subSubTitle;
        var bottomImgUrl = data.bottomImgUrl;
        var _data$bottomImgExt = data.bottomImgExt;
        var bottomImgExt = _data$bottomImgExt === undefined ? 'PNG' : _data$bottomImgExt;


        this.insertImage({
            imgUrl: topImgUrl,
            imgExt: topImgExt,
            posX: 'center',
            posY: height / 4,
            width: width / 3
        });

        this.insertText({
            text: title,
            fontSize: 25,
            posX: width / 2,
            posY: height / 3 + 125,
            align: 'center'
        });

        this.insertText({
            text: subTitle,
            fontSize: 14,
            posX: width / 2,
            posY: height / 3 + 160,
            align: 'center'
        });

        this.insertText({
            text: subSubTitle,
            fontSize: 11,
            posX: width / 2,
            posY: height / 3 + 180,
            align: 'center'
        });

        this.insertImage({
            imgUrl: bottomImgUrl,
            imgExt: bottomImgExt,
            posX: padding + 50,
            posY: 3 * height / 4,
            width: 90
        });
    });
})();