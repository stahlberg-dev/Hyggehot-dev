export const brochures = () => {
    return app.gulp.src(app.path.src.brochures)
    .pipe(app.gulp.dest(app.path.build.brochures));
};