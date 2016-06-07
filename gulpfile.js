'use strict';

var gulp = require('gulp'),
  zip = require('gulp-zip'),
  gitignore = require('gulp-gitignore'),
  crx = require('gulp-crx-pack'),
  fs = require('fs');

var src = ['./*', '!gulpfile.js', '!package.json', '!tq_redmine_plus.pem', '!README.md'];
var buildName = 'tq_redmine_plus';

gulp.task('default', function () {
  gulp.src(src)
    // Exclude files defined in .gitignore
    .pipe(gitignore())
    .pipe(zip(buildName + '.xpi'))
    .pipe(gulp.dest('./build'));
  // gulp.src(src)
  //   // Exclude files defined in .gitignore
  //   .pipe(gitignore())
  //   .pipe(crx({
  //     privateKey: fs.readFileSync('./tq_redmine_plus.pem', 'utf8'),
  //     filename: buildName + '.crx'
  //   }))
  //   .pipe(gulp.dest('./build'));
});
