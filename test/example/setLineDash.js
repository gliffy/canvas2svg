window.C2S_EXAMPLES['setLineDash'] = function(ctx) {
    ctx.save();
    ctx.lineWidth = 4;
    for (var i = 0; i < 10; i++){
        ctx.setLineDash([(i+1)*5,10]);
        ctx.beginPath();
        ctx.moveTo(5+i*14,5);
        ctx.lineTo(5+i*14,140);
        ctx.stroke();
    }
    ctx.restore();
};