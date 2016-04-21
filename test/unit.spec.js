describe('canvas2svg', function() {

    describe('it can be created', function(){

        it("with options", function() {
            var ctx = new C2S({width:100, height:200, enableMirroring:true});
            expect(ctx instanceof C2S).to.equal(true);
            expect(ctx.width).to.equal(100);
            expect(ctx.height).to.equal(200);
            expect(ctx.enableMirroring).to.equal(true);

            var ctx2 = new C2S(300,400);
            expect(ctx2 instanceof C2S).to.equal(true);
            expect(ctx2.width).to.equal(300);
            expect(ctx2.height).to.equal(400);
            expect(ctx2.enableMirroring).to.equal(false);
        });

        it("with no options and have defaults", function() {
            var ctx = new C2S();
            expect(ctx instanceof C2S).to.equal(true);
            expect(ctx.width).to.equal(500);
            expect(ctx.height).to.equal(500);
            expect(ctx.enableMirroring).to.equal(false);
        });

        it("even if it's called as a function", function() {
            //notice the lack of new!
            var ctx = C2S({width:100, height:200, enableMirroring:true});
            expect(ctx instanceof C2S).to.equal(true);
            expect(ctx.width).to.equal(100);
            expect(ctx.height).to.equal(200);
            expect(ctx.enableMirroring).to.equal(true);

            var ctx2 = C2S(300,400);
            expect(ctx2 instanceof C2S).to.equal(true);
            expect(ctx2.width).to.equal(300);
            expect(ctx2.height).to.equal(400);
            expect(ctx2.enableMirroring).to.equal(false);

            var ctx3 = C2S();
            expect(ctx3 instanceof C2S).to.equal(true);
            expect(ctx3.width).to.equal(500);
            expect(ctx3.height).to.equal(500);
            expect(ctx3.enableMirroring).to.equal(false);

        });

        it("can be created on another document", function () {
            var otherDoc = document.implementation.createHTMLDocument();
            var ctx = C2S({document: otherDoc});
            expect(ctx.getSvg().ownerDocument).to.equal(otherDoc);
        });

    });

    describe("can export to", function() {

        it("inline svg", function() {
            var ctx = new C2S();
            ctx.fillStyle="red";
            ctx.fillRect(100,100,100,100);
            //svg is of course not attached to the document
            var svg = ctx.getSvg();
            expect(svg.nodeType).to.equal(1);
            expect(svg.nodeName).to.equal("svg");
        });

        it("serialized svg", function() {
            var ctx = new C2S();
            ctx.fillStyle="red";
            ctx.fillRect(100,100,100,100);
            //Standalone SVG doesn't support named entities, which document.createTextNode encodes.
            //passing in true will attempt to find all named entities and encode it as a numeric entity.
            var string = ctx.getSerializedSvg(true);
            expect(typeof string).to.equal("string");
            expect(string).to.equal('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500"><defs/><g><rect fill="red" stroke="none" x="100" y="100" width="100" height="100"/></g></svg>');

        });
    });

    describe("with multiple transforms and fill/strokes", function() {

        it("creates new groups", function() {
            var ctx = new C2S();
            ctx.translate(0, 20);
            ctx.fillRect(0, 0, 10, 10);

            ctx.translate(10, 20);
            ctx.fillRect(0, 0, 10, 10);

            ctx.translate(20, 20);
            ctx.fillRect(0, 0, 10, 10);

            var svg = ctx.getSvg();
            var firstGroup = svg.querySelector("g");
            expect(firstGroup.getAttribute("transform")).to.equal("translate(0,20)");
            var secondGroup = firstGroup.querySelector("g");
            expect(secondGroup.getAttribute("transform")).to.equal("translate(10,20)");
            var thirdGroup = secondGroup.querySelector("g");
            expect(thirdGroup.getAttribute("transform")).to.equal("translate(20,20)");

        });

        it("save and restore still works", function() {
            var ctx = new C2S();

            ctx.translate(0, 10);
            ctx.fillRect(0, 0, 10, 10);

            ctx.save();
            ctx.translate(40, 40);
            ctx.fillRect(0, 0, 10, 10);

            ctx.restore();

            ctx.translate(0, 10);
            ctx.fillRect(0, 0, 10, 10);

            var svg = ctx.getSvg();
            var firstGroup = svg.querySelector("g");
            expect(firstGroup.getAttribute("transform")).to.equal("translate(0,10)");
            var secondGroup = firstGroup.childNodes[1];
            expect(secondGroup.getAttribute("transform")).to.equal("translate(40,40)");
            var thirdGroup = firstGroup.childNodes[2];
            expect(thirdGroup.getAttribute("transform")).to.equal("translate(0,10)");

        });
    });

    describe("it will generate ids", function() {

        it("that start with a letter", function() {
            var ctx = new C2S();
            ctx.createRadialGradient(6E1, 6E1, 0.0, 6E1, 6E1, 5E1);
            var svg = ctx.getSvg();
            var id = svg.children[0].children[0].id;
            var test = /^[A-Za-z]/.test(id);
            expect(test).to.equal(true);
        });
    });

    describe("will split up rgba", function() {
        //while browsers support rgba values for fill/stroke, this is not accepted in visio/illustrator
        it("to fill and fill-opacity", function() {
            var ctx = new C2S();
            ctx.fillStyle="rgba(20,40,50,0.5)";
            ctx.fillRect(100,100,100,100);
            var svg = ctx.getSvg();
            expect(svg.querySelector("rect").getAttribute("fill")).to.equal("rgb(20,40,50)");
            expect(svg.querySelector("rect").getAttribute("fill-opacity")).to.equal("0.5");
        });

        it("to stroke and stroke-opacity", function() {
            var ctx = new C2S();
            ctx.strokeStyle="rgba(10,20,30,0.4)";
            ctx.strokeRect(100,100,100,100);
            var svg = ctx.getSvg();
            expect(svg.querySelector("rect").getAttribute("stroke")).to.equal("rgb(10,20,30)");
            expect(svg.querySelector("rect").getAttribute("stroke-opacity")).to.equal("0.4");
        });
    });

    describe("supports path commands", function() {

        it("and moveTo may be called without beginPath, but is not recommended", function() {
            var ctx = new C2S();
            ctx.moveTo(0,0);
            ctx.lineTo(100,100);
            ctx.stroke();
        });
    });

    describe("supports text align", function() {

        it("not specifying a value defaults to 'start'", function() {

            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("text-anchor")).to.equal("start");

        });

        it("assuming ltr, left maps to 'start'", function() {

            var ctx = new C2S();
            ctx.textAlign = "left";
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("text-anchor")).to.equal("start");

        });

        it("assuming ltr, right maps to 'end'", function() {

            var ctx = new C2S();
            ctx.textAlign = "right";
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("text-anchor")).to.equal("end");

        });

        it("center maps to 'middle'", function() {

            var ctx = new C2S();
            ctx.textAlign = "center";
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("text-anchor")).to.equal("middle");

        });

        it("stores the proper values on save and restore", function() {
            var ctx = new C2S();
            ctx.textAlign = "center";
            expect(ctx.textAlign).to.equal("center");
            ctx.save();
            expect(ctx.textAlign).to.equal("center");
            ctx.textAlign = "right";
            expect(ctx.textAlign).to.equal("right");
            ctx.restore();
            expect(ctx.textAlign).to.equal("center");
        });

    });

    describe("supports text baseline", function() {

        it("not specifying a value defaults to alphabetic", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("alphabetic");
        });

        it("not specifying a valid value defaults to alphabetic", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "werwerwer";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("alphabetic");
        });

        it("hanging maps to hanging", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "hanging";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("hanging");
        });

        it("top maps to text-before-edge", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "top";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("text-before-edge");
        });

        it("bottom maps to text-after-edge", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "bottom";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("text-after-edge");
        });

        it("middle maps to central", function() {
            var ctx = new C2S();
            ctx.font = "normal 36px Times";
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "middle";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("dominant-baseline")).to.equal("central");
        });

    });

    describe("supports fonts", function () {
        it("doesn't crash when using a font", function () {
            var ctx = new C2S();
            ctx.font = "normal 12px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
            ctx.fillText("A Text Example", 0, 50);
            var svg = ctx.getSvg();
            expect(svg.querySelector("text").getAttribute("font-family")).to.equal("\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif");
            expect(svg.querySelector("text").getAttribute("font-size")).to.equal("12px");
            expect(svg.querySelector("text").getAttribute("font-weight")).to.equal("normal");
            expect(svg.querySelector("text").getAttribute("font-style")).to.equal("normal");
        });
    });

    describe("supports globalOpacity", function() {
        it("set stroke-opacity when stroking and set fill-opacity when filling",function() {
            var ctx = new C2S();
            ctx.globalAlpha = 0.5;
            ctx.moveTo(5,5);
            ctx.lineTo(15,15);
            ctx.stroke();
            var svg = ctx.getSvg();
            expect(svg.querySelector("path").getAttribute("stroke-opacity")).to.equal('0.5');
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#000000";
            ctx.fill();
            expect(svg.querySelector("path").getAttribute("fill-opacity")).to.equal('0.1');
            //stroke-opacity stays o.5
            expect(svg.querySelector("path").getAttribute("stroke-opacity")).to.equal('0.5');
        });

        it("added into color opacity when stroking or filling with rgba style color. ",function() {
            var ctx = new C2S();
            ctx.strokeStyle="rgba(0,0,0,0.8)";
            ctx.globalAlpha = 0.5;
            ctx.moveTo(5,5);
            ctx.lineTo(15,15);
            ctx.stroke();
            var svg = ctx.getSvg();
            expect(svg.querySelector("path").getAttribute("stroke")).to.equal('rgb(0,0,0)');
            //stroke-opacity should be globalAlpha*(alpha in rgba)
            expect(svg.querySelector("path").getAttribute("stroke-opacity")).to.equal(''+0.8*0.5);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fill();
            expect(svg.querySelector("path").getAttribute("fill-opacity")).to.equal(''+0.6*0.6);
            expect(svg.querySelector("path").getAttribute("stroke-opacity")).to.equal(''+0.8*0.5);
        });
    });

    describe("supports clip", function() {
        it("adds clippath", function() {
            var ctx = new C2S();
            ctx.rect(200, 200, 400, 400);
            ctx.clip();
            ctx.fillStyle = "#000000";
            ctx.rect(100, 100, 300, 300);
            var svg = ctx.getSvg();
            expect(svg.querySelector("clipPath > path").getAttribute("d")).to.not.equal(null);
        });
    });
});
