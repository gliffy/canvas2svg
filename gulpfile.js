"use strict";

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var bump = require('gulp-bump');


function updateExample(filename) {
    var playground = fs.readFileSync(path.join(__dirname, filename), {'encoding': 'utf8'});
    var filenames = fs.readdirSync(path.join(__dirname,'test/example'));
    var $ = cheerio.load(playground);
    var $examples = $('#examples');
    var $select = $('#select');
    $examples.empty();
    $select.empty();
    filenames.forEach(function(filename) {
        var name = filename.replace('.js', '');
        $examples.append($('<script type="text/javascript" src="example/'+filename+'"></script>'));
        $select.append($('<option value="'+name+'">'+name+'</option>'));
    });
    fs.writeFileSync(path.join(__dirname, filename), $.html(), {'encoding': 'utf8'})
}

// run this after adding an example file to update playground.html, and testrunner.html
gulp.task('update_examples', function() {
    updateExample('test/playground.html');
    updateExample('test/testrunner.html');
});

gulp.task('bump', function() {
    gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['update_examples']);
