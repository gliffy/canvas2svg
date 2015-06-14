window.C2S_EXAMPLES['arcTo'] = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.arcTo(150, 100, 50, 20, 30);
    ctx.stroke();

    ctx.fillStyle = 'blue';
    // base point
    ctx.fillRect(150, 20, 10, 10);

    ctx.fillStyle = 'red';
    // control point one
    ctx.fillRect(150, 100, 10, 10);
    // control point two
    ctx.fillRect(50, 20, 10, 10);
};