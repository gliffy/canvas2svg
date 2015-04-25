describe("canvas2svg", function() {

    describe("can by created", function() {

        it("with options", function() {
            var ctx = new C2S({width:100, height:200, enableMirroring:true});
            expect(ctx instanceof C2S).toBe(true);
            expect(ctx.width).toEqual(100);
            expect(ctx.height).toEqual(200);
            expect(ctx.enableMirroring).toEqual(true);

            var ctx2 = new C2S(300,400);
            expect(ctx2 instanceof C2S).toBe(true);
            expect(ctx2.width).toEqual(300);
            expect(ctx2.height).toEqual(400);
            expect(ctx2.enableMirroring).toEqual(false);
        });

        it("with no options and have defaults", function() {
            var ctx = new C2S();
            expect(ctx instanceof C2S).toBe(true);
            expect(ctx.width).toEqual(500);
            expect(ctx.height).toEqual(500);
            expect(ctx.enableMirroring).toEqual(false);
        });

        it("even if it's called as a function", function() {
            //notice the lack of new!
            var ctx = C2S({width:100, height:200, enableMirroring:true});
            expect(ctx instanceof C2S).toBe(true);
            expect(ctx.width).toEqual(100);
            expect(ctx.height).toEqual(200);
            expect(ctx.enableMirroring).toEqual(true);

            var ctx2 = C2S(300,400);
            expect(ctx2 instanceof C2S).toBe(true);
            expect(ctx2.width).toEqual(300);
            expect(ctx2.height).toEqual(400);
            expect(ctx2.enableMirroring).toEqual(false);

            var ctx3 = C2S();
            expect(ctx3 instanceof C2S).toBe(true);
            expect(ctx3.width).toEqual(500);
            expect(ctx3.height).toEqual(500);
            expect(ctx3.enableMirroring).toEqual(false);

        });


  });

  describe("has implemented methods", function() {
      var ctx,
          methods =
              [
                  "save",
                  "restore",
                  "scale",
                  "rotate",
                  "translate",
                  "transform",
                  "beginPath",
                  "moveTo",
                  "closePath",
                  "lineTo",
                  "bezierCurveTo",
                  "quadraticCurveTo",
                  "stroke",
                  "fill",
                  "rect",
                  "fillRect",
                  "strokeRect",
                  "clearRect",
                  "createLinearGradient",
                  "createRadialGradient",
                  "fillText",
                  "strokeText",
                  "measureText",
                  "arc",
                  "clip",
                  "drawImage",
                  "createPattern"
              ];

      beforeEach(function() {
          ctx = new C2S();
      });

      //TODO: better tests for each method
      for(var i=0; i<methods.length; i++) {
          (function(j) {
              it(methods[j], function(){
                 expect(ctx[""+methods[j]]).toBeDefined();
              });
          }(i));
      }

  });

  describe("can export to", function() {

      it("inline svg", function() {
          var ctx = new C2S();
          ctx.fillStyle="red";
          ctx.fillRect(100,100,100,100);
          //svg is of course not attached to the document
          var svg = ctx.getSvg();
          expect(svg.nodeType).toEqual(1);
          expect(svg.nodeName).toEqual("svg");
      });

      it("serialized svg", function() {
          var ctx = new C2S();
          ctx.fillStyle="red";
          ctx.fillRect(100,100,100,100);
          //Standalone SVG doesn't support named entities, which document.createTextNode encodes.
          //passing in true will attempt to find all named entities and encode it as a numeric entity.
          var string = ctx.getSerializedSvg(true);
          expect(typeof string).toBe("string");
          expect(string).toEqual('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500"><defs/><g><rect fill="red" stroke="none" x="100" y="100" width="100" height="100"/></g></svg>');

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
            expect(firstGroup.getAttribute("transform")).toEqual("translate(0,20)");
            var secondGroup = firstGroup.querySelector("g");
            expect(secondGroup.getAttribute("transform")).toEqual("translate(10,20)");
            var thirdGroup = secondGroup.querySelector("g");
            expect(thirdGroup.getAttribute("transform")).toEqual("translate(20,20)");

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
            expect(firstGroup.getAttribute("transform")).toEqual("translate(0,10)");
            var secondGroup = firstGroup.childNodes[1];
            expect(secondGroup.getAttribute("transform")).toEqual("translate(40,40)");
            var thirdGroup = firstGroup.childNodes[2];
            expect(thirdGroup.getAttribute("transform")).toEqual("translate(0,10)");

        });
    });

  describe("it will generate ids", function() {

      it("that start with a letter", function() {
          var ctx = new C2S();
          ctx.createRadialGradient(6E1, 6E1, 0.0, 6E1, 6E1, 5E1);
          var svg = ctx.getSvg();
          var id = svg.children[0].children[0].id;
          var test = /^[A-Za-z]/.test(id);
          expect(test).toEqual(true);
      });
  });

  describe("will split up rgba", function() {
    //while browsers support rgba values for fill/stroke, this is not accepted in visio/illustrator
    it("to fill and fill-opacity", function() {
        var ctx = new C2S();
        ctx.fillStyle="rgba(20,40,50,0.5)";
        ctx.fillRect(100,100,100,100);
        var svg = ctx.getSvg();
        expect(svg.querySelector("rect").getAttribute("fill")).toBe("rgb(20,40,50)");
        expect(svg.querySelector("rect").getAttribute("fill-opacity")).toBe("0.5");
    });

    it("to stroke and stroke-opacity", function() {
        var ctx = new C2S();
        ctx.strokeStyle="rgba(10,20,30,0.4)";
        ctx.strokeRect(100,100,100,100);
        var svg = ctx.getSvg();
        expect(svg.querySelector("rect").getAttribute("stroke")).toBe("rgb(10,20,30)");
        expect(svg.querySelector("rect").getAttribute("stroke-opacity")).toBe("0.4");
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
          expect(svg.querySelector("text").getAttribute("text-anchor")).toBe("start");

      });

      it("assuming ltr, left maps to 'start'", function() {

          var ctx = new C2S();
          ctx.textAlign = "left";
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("text-anchor")).toBe("start");

      });

      it("assuming ltr, right maps to 'end'", function() {

          var ctx = new C2S();
          ctx.textAlign = "right";
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("text-anchor")).toBe("end");

      });

      it("center maps to 'middle'", function() {

          var ctx = new C2S();
          ctx.textAlign = "center";
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("text-anchor")).toBe("middle");

      });

      it("stores the proper values on save and restore", function() {
         var ctx = new C2S();
          ctx.textAlign = "center";
          expect(ctx.textAlign).toBe("center");
          ctx.save();
          expect(ctx.textAlign).toBe("center");
          ctx.textAlign = "right";
          expect(ctx.textAlign).toBe("right");
          ctx.restore();
          expect(ctx.textAlign).toBe("center");
      });

  });

  describe("supports text baseline", function() {

      it("not specifying a value defaults to alphabetic", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("alphabetic");
      });

      it("not specifying a valid value defaults to alphabetic", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.textBaseline = "werwerwer";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("alphabetic");
      });

      it("hanging maps to hanging ", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.textBaseline = "hanging";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("hanging");
      });

      it("top maps to text-before-edge ", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.textBaseline = "top";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("text-before-edge");
      });

      it("bottom maps to text-after-edge ", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.textBaseline = "bottom";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("text-after-edge");
      });

      it("middle maps to central ", function() {
          var ctx = new C2S();
          ctx.font = "normal 36px Times";
          ctx.fillStyle = "#000000";
          ctx.textBaseline = "middle";
          ctx.fillText("A Text Example", 0, 50);
          var svg = ctx.getSvg();
          expect(svg.querySelector("text").getAttribute("dominant-baseline")).toBe("central");
      });

  });

});
