window.C2S_EXAMPLES['linecap'] = function(ctx) {
    var lineCap = ['butt','round','square'];

    // Draw guides
    ctx.strokeStyle = '#09f';
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(140,10);
    ctx.moveTo(10,140);
    ctx.lineTo(140,140);
    ctx.stroke();

    // Draw lines
    ctx.strokeStyle = 'black';
    for (var i=0;i<lineCap.length;i++){
        ctx.lineWidth = 15;
        ctx.lineCap = lineCap[i];
        ctx.beginPath();
        ctx.moveTo(25+i*50,10);
        ctx.lineTo(25+i*50,140);
        ctx.stroke();
    }
}