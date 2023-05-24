import { series, dest, src, task } from "gulp";
import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import gulp_bump from "gulp-bump";

function updateExample(filename) {
    var encoding = "utf8";
    var playground = fs.readFileSync(path.join(__dirname, filename), { encoding });
    var filenames = fs.readdirSync(path.join(__dirname, "test/example"));
    var $ = cheerio.load(playground);
    var $examples = $("#examples");
    var $select = $("#select");
    $examples.empty();
    $select.empty();
    filenames.forEach(function (filename) {
        var name = filename.replace(".js", "");
        $examples.append($(`<script type="text/javascript" src="example/${filename}"></script>`));
        $select.append($(`<option value="${name}">${name}</option>`));
    });
    fs.writeFileSync(path.join(__dirname, filename), $.html(), { encoding });
}

const updatePlayground = function(done) {
    updateExample("test/playground.html");
    done();
};

const updateTestrunner = function(done) {
    updateExample("test/testrunner.html");
    done();
};

// run this after adding an example file to update playground.html, and testrunner.html

export function bump() {
    return src(["./package.json", "./bower.json"])
        .pipe(gulp_bump({ type: "patch" }))
        .pipe(dest("./"));
}

export const update_examples = series(updatePlayground, updateTestrunner);

export default update_examples;
