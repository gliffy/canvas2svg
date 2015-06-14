window.C2S_EXAMPLES['arc'] = function(ctx) {

    // Draw shapes
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 3; j++) {
            ctx.beginPath();
            var x = 25 + j * 50;               // x coordinate
            var y = 25 + i * 50;               // y coordinate
            var radius = 20;                    // Arc radius
            var startAngle = 0;                     // Starting point on circle
            var endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
            var clockwise = i % 2 == 0 ? false : true; // clockwise or anticlockwise

            ctx.arc(x, y, radius, startAngle, endAngle, clockwise);

            if (i > 1) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    }
    
};