const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

function copyHtml() {
  return src('app/renderer/index.html').pipe(dest('build/renderer'));
}

function copyCss() {
  return src('app/renderer/**/*.css')
  .pipe(postcss([require("postcss")(tailwindcss()), autoprefixer()]))
  .pipe(dest('build/renderer'));
}

function copyImages() {
  return src('app/renderer/**/*.png').pipe(dest('build/renderer'));
}

copyHtml.displayName = 'copy-html';
copyCss.displayName = 'copy-css';
copyHtml.displayName = 'copy-images';

exports.copyHtml = copyHtml;
exports.copyCss = copyCss;
exports.copyImages = copyImages;
