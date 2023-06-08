import gulp from "gulp";
import { getPath } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

let isDev = !process.argv.includes('--build');
const path = getPath(isDev);

global.app = {
    isBuild: ! isDev,
    isDev: isDev,
    path: path,
    gulp: gulp,
    plugins: plugins,
};

import { api } from "./gulp/tasks/api.js";
import { favicon } from "./gulp/tasks/favicon.js";
import { brochures } from "./gulp/tasks/brochures.js";
import { ico } from "./gulp/tasks/ico.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { video } from "./gulp/tasks/video.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { makeSvgSprite } from "./gulp/tasks/svgSprite.js";
import { zip } from "./gulp/tasks/zip.js";

function watcher() {
    gulp.watch(path.watch.api, api);
    gulp.watch(path.watch.favicon, favicon);
    gulp.watch(path.watch.brochures, brochures);
    gulp.watch(path.watch.ico, ico);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.video, video);
}

export { makeSvgSprite };

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series(fonts, gulp.parallel(api, brochures, favicon, ico, html, scss, js, images, video));

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);

export { dev };
export { build };
export { deployZIP };

gulp.task('default', dev);