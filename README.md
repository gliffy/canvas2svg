Canvas2Svg
==========
This library turns your Canvas into SVG using javascript. In other words, this library lets you build an SVG document using the canvas api. Why use it?
* You have a canvas drawing you want to persist as an SVG file.
* You like exporting things.
* Because you didn't want to transform your custom file format to SVG.

Demo
==========
http://gliffy.github.io/canvas2svg/

How it works
==========
We create a mock 2d canvas context. Use the canvas context like you would on a normal canvas. As you call methods, we build up a scene graph in SVG. Yay!

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
var mySerializedSVG = ctx.toString(); //true here, if you need to convert named to numbered entities.

//If you really need to you can access the shadow inline SVG created by calling:
var svg = ctx.__root;
```

Misc
==========
Some canvas 2d context methods are not implemented yet. Watch out for setTransform and arcTo.

License
==========
This plugin is licensed under the MIT license.
