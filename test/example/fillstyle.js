window.C2S_EXAMPLES['fillstyle'] = function(ctx) {
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ',' +
                Math.floor(255 - 42.5 * j) + ',0)';
            ctx.fillRect(j * 25, i * 25, 25, 25);
        }
    }
};