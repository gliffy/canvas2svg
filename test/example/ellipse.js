window.C2S_EXAMPLES['ellipse'] = function(ctx) {

    // Draw shapes
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 3; j++) {
            ctx.beginPath();
            var x = 45 + j * 80;               // x coordinate
            var y = 45 + i * 80;               // y coordinate
            var radius = 20;                    // Arc radius
            var startAngle = 0;                     // Starting point on circle
            var endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
            var clockwise = i % 2 == 0 ? false : true; // clockwise or anticlockwise
	    var rot = -(i+j*4) * Math.PI/2.4;

            ctx.ellipse(x, y, radius*1.6, radius*.5, rot, startAngle, endAngle, clockwise);

            if (i > 1) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    }
    
};
