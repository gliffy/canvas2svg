// Example from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
window.C2S_EXAMPLES['rotate'] = function(ctx) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(80, 60, 140, 30);

    // Matrix transformation
    ctx.translate(150, 75);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-150, -75);

    // Rotated rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(80, 60, 140, 30);

    ctx.resetTransform();
}