window.C2S_EXAMPLES['transform'] = function(ctx) {
    // case 1
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.setTransform(1,1,0,1,0,0);
    ctx.fillRect(0,0,100,100);
    ctx.resetTransform();

    // case 2
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 50, 50);
    ctx.resetTransform();

    // case 3
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0)
    ctx.transform(2, 0, 0, 2, 0, 0)
    ctx.lineTo(100, 100)
    ctx.transform(2, 0, 0, 1, 0, 0)
    ctx.lineTo(100, 100)
    ctx.closePath()
    ctx.fill()
    ctx.resetTransform();
}