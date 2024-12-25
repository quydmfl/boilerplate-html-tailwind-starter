const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    html: {
        src: 'src/pages/*.html',
        partials: 'src/partials/**/*.html',
        dest: 'dist/',
    },
    css: {
        src: 'src/assets/css/tailwind.css',
        dest: 'dist/css/',
    },
};

// Process HTML files and include partials
function html() {
    return gulp
        .src(paths.html.src)
        .pipe(fileInclude({ basepath: '@file' }).on('error', (err) => console.error(err)))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Process Tailwind CSS
function css() {
    return gulp
        .src(paths.css.src)
        .pipe(postcss().on('error', (err) => console.error(err)))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.stream());
}

// Watch files for changes
function watchFiles() {
    gulp.watch([paths.html.src, paths.html.partials], html);
    gulp.watch(paths.css.src, css);
}

// Serve project and reload browser on changes
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        port: 3000,
    });

    watchFiles(); // Attach watchers
}

// Build task
const build = gulp.series(gulp.parallel(html, css), serve);

exports.default = build;
