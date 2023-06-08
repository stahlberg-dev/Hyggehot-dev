export const ico = () => {
    return app.gulp.src(app.path.src.ico)
    .pipe(app.gulp.dest(app.path.build.ico));
};