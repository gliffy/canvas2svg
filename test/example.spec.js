describe('canvas2svg exports', function() {

    var examples = Object.keys(C2S_EXAMPLES);
    var C2S_WIDTH = 600;
    var C2S_HEIGHT = 600;
    var imgdata, svgimgdata, diffdata;

    function drawExample (example) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', C2S_WIDTH);
        canvas.setAttribute('height', C2S_HEIGHT);
        document.body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, C2S_WIDTH, C2S_HEIGHT);
        var c2s = new C2S(C2S_WIDTH, C2S_HEIGHT);

        example(ctx);
        example(c2s);

        imgdata = canvas.toDataURL();
        svgimgdata = "data:image/svg+xml;charset=utf-8,"+c2s.getSerializedSvg(true);
    }

    function cleanUp () {
        var canvases = document.querySelectorAll('canvas');
        var i;
        //Node Array doesn't implement array methods :/
        for(i=0; i<canvases.length; i++) {
            canvases[i].parentElement.removeChild(canvases[i]);
        }
    }

    examples.forEach(function(example) {

        describe(example, function() {

            var drawFunction;

            beforeEach(function() {
                drawFunction = C2S_EXAMPLES[example];
            });

            it('to svg (left is canvas right is svg)', function () {
                drawExample(drawFunction);
            });

            //test is async, pass in done
            it('resembles each other', function() {
                // see: https://github.com/Huddle/Resemble.js
                var diff = resemble(imgdata).compareTo(svgimgdata).ignoreAntialiasing().onComplete(function(data){
                    diffdata = data;
                    expect(data.misMatchPercentage).to.be.below(0.30);
                });
            });

            after(function() {
                cleanUp();
                var lis = document.querySelectorAll('li');
                //on server side, don't inject images
                if(lis.length > 0) {
                    //append svg + canvas images
                    var li = lis[lis.length - 2];
                    var image = document.createElement('img');
                    image.setAttribute('src', imgdata);
                    image.setAttribute('style', 'display:inline-block;');

                    var svgimage = document.createElement('img');
                    svgimage.setAttribute('src', svgimgdata);
                    svgimage.setAttribute('style', 'display:inline-block;');
                    li.appendChild(image);
                    li.appendChild(svgimage);

                    // append diff data
                    li = lis[lis.length-1];
                    var diffimage = document.createElement('img');
                    diffimage.setAttribute('src', diffdata.getImageDataUrl());
                    diffimage.setAttribute('style', 'display:inline-block;');
                    li.appendChild(diffimage);
                }
            });

        });

    });
});