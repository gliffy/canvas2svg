window.C2S_EXAMPLES['arcTo2'] = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(100, 225);             // P0
    ctx.arcTo(300, 25, 500, 225, 75); // P1, P2 and the radius
    ctx.lineTo(500, 225);             // P2
    ctx.stroke();
};