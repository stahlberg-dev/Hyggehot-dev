export const api = () => {
    return app.gulp.src(app.path.src.api)
    .pipe(app.gulp.dest(app.path.build.api));
};