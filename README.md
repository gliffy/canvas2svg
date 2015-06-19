Canvas2Svg [![Build Status](https://travis-ci.org/gliffy/canvas2svg.svg?branch=master)](https://travis-ci.org/gliffy/canvas2svg)
==========
This library turns your Canvas into SVG using javascript. In other words, this library lets you build an SVG document 
using the canvas api. Why use it?
* You have a canvas drawing you want to persist as an SVG file.
* You like exporting things.
* Because you didn't want to transform your custom file format to SVG.

Demo
==========
http://gliffy.github.io/canvas2svg/

How it works
==========
We create a mock 2d canvas context. Use the canvas context like you would on a normal canvas. As you call methods, we 
build up a scene graph in SVG. Yay!

Usage
==========
```javascript
//Create a new mock canvas context. Pass in your desired width and height for your svg document.
var ctx = new C2S(500,500);

//draw your canvas like you would normally
ctx.fillStyle="red";
ctx.fillRect(100,100,100,100);
//etc...

//serialize your SVG
var mySerializedSVG = ctx.getSerializedSvg(); //true here, if you need to convert named to numbered entities.

//If you really need to you can access the shadow inline SVG created by calling:
var svg = ctx.getSvg();
```

Tests
==========
To run tests:
```
npm install
npm test
```

To run tests against Chrome and Firefox, call karma directly. This is not the default npm test due to the limited 
browser selection in travis.
```
npm install karma-cli -g
karma start
```

Debug
=========
Play with canvas2svg in the provided test/playground.html or run test locally in your browser in test/testrunner.html


Add An Example Case
=========
Add a test file to the test/example folder. In your file make sure to add the drawing function to the global `C2S_EXAMPLES`,
with your filename as a key. For example `test\example\linewidth.js` should look something like:
```javascript
window.C2S_EXAMPLES['linewidth'] = function(ctx) {
    for (var i = 0; i < 10; i++){
        ctx.lineWidth = 1+i;
        ctx.beginPath();
        ctx.moveTo(5+i*14,5);
        ctx.lineTo(5+i*14,140);
        ctx.stroke();
    }
};
```
install gulp globally if you haven't done so already
```
npm install -g gulp
```
Then run the following to update playground.html and testrunner.html 
```
gulp
```
You should now be able to select your new example from playground.html or see it run in testrunner.html 

If you find a bug, or want to add functionality, please add a new test case and include it with your pull request.

Updates
==========
- v1.0.15 Setup travis, add testharness and debug playground, and fix regression for __createElement refactor
- v1.0.14 bugfix for gradients, move __createElement to scoped createElement function, so all classes have access. 
- v1.0.13 set paint order before stroke and fill to make them behavior like canvas
- v1.0.12 Implementation of ctx.prototype.arcTo.
- v1.0.11 call lineTo instead moveTo in ctx.arc, fixes closePath issue and straight line issue
- v1.0.10 when lineTo called, use M instead of L unless subpath exists
- v1.0.9 use currentDefaultPath instead of <path>'s d attribute, fixes stroke's different behavior in SVG and canvas.
- v1.0.8 reusing __createElement and adding a properties undefined check
- v1.0.7 fixes for multiple transforms and fills and better text support from stafyniaksacha
- v1.0.6 basic support for text baseline (contribution from KoKuToru)
- v1.0.5 fixes for #5 and #6 (with contributions from KoKuToru)
- v1.0.4 generate ids that start with a letter
- v1.0.3 fixed #4 where largeArcFlag was set incorrectly in some cases 
- v1.0.2 Split up rgba values set in fill/stroke to allow illustrator import support.
- v1.0.1 Allow C2S to be called as a function. https://github.com/gliffy/canvas2svg/issues/2 
- v1.0.0 Initial release

Misc
==========
Some canvas 2d context methods are not implemented yet. Watch out for setTransform and arcTo.

License
==========
This library is licensed under the MIT license.
