module.exports = function (task, gulp, sitesettings, need, taskObj) {
  'use strict';

  const path = require('path');
  const fs = require('fs-extra');
  const plumber	= require('gulp-plumber');
  const location = sitesettings.location;

  const config = {
    baseSize: 32,
    mode: 'sprite',
    templates: {
      scss: require('fs').readFileSync('./gulp/resources/sprite.scss', 'utf-8')
    },
    common: 'rc-icon',
    layout: 'horizontal',
    cssFile: '../src/icons/icons.scss',
    preview: false,
    svg: {
      sprite: 'royal-canin.sprite.svg'
    }
  }

  gulp.task('svgSprites', function (done) {

    fs.emptyDir('./src/icons/', function (err) {
      if (err) return console.error(err)
    });

    fs.ensureDir('./src/icons/', function (err) {
      console.log(err) // => null
      // dir has now been created, including the directory it is to be placed in
    });

    return gulp.src(path.join(__dirname, '../../' + location['rawfiles']['svgs'] + '/output/*.svg'))
      .pipe(plumber())
      .pipe(need.svgSprites(config))
      .on('error', function(error){
        console.log(error);
      })
      .pipe(gulp.dest('./dist'))
      .on('end', function () {
        console.log('Moving inline SVGs.')
        fs.copySync('./src/svgs/inline/', './dist/', {overwrite: true});
        done();
      })
  })
}
