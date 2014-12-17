var gulp = require('gulp');
var wiredep = require('wiredep').stream;

gulp.task('default', function() {
});

gulp.task('bower', function () {
	gulp.src('./index.html')
		.pipe(wiredep({
			cwd: '/home/fulton/Desktop/bubbles',
			onPathInjected: function(fileObject) {
				console.log("INJECTED: " + fileObject.file);
			}
		}))
		.pipe(gulp.dest('./'));
});
