// Require all the things
const gulp = require("gulp");

// Set the path variables
const basePath = "./";
const siteRoot = basePath + "/_site";
const baseSrc = basePath + "_dev";
const baseDest = basePath + "assets";


const paths = {
	styles: {
		src: baseSrc + "/sass/*.scss",
		dest: baseDest + "/css"
	},
	scripts: {
		src: baseSrc + "/js/*.js",
		dest: baseDest + "/js"
	},
	images: {
		src: baseSrc + "/img/*", // be more specific
		dest: baseDest + "/img"
	}
};

export function styles() {
	return gulp.src(paths.styles.src, {since: gulp.lastRun('styles')})

		.pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
	return gulp.src(paths.scripts.src, {since: gulp.lastRun('scripts')})

		.pipe(gulp.dest(paths.scripts.dest));
}

export function images() {
	return gulp.src(paths.scripts.src, {since: gulp.lastRun('images')})

		.pipe(gulp.dest(paths.scripts.dest));
}

export function serve() {

}