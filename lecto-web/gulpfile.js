/* eslint-disable */

/**
 * Gulp jobs for hatchets. Includes:
 * 
 * 1. A gulp job to webpack up all the javascript files into bundle.js
 * 2. A gulp job to zip up each component
 * 3. A gulp job to send each zipped component to an S3 bucket
 *
 * @author David Zhang
 */

/* Gulp plugins */
var webpack = require('webpack');
var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var awspublish = require('gulp-awspublish');
var s3 = require('vinyl-s3');
var gunzip = require('gulp-gunzip');
var unzip = require('gulp-unzip');
var path = require('path');

/* Config yaml file defined across app */
var config = require('config')

/** Publish a single arbirtary module (general publish) */
gulp.task('publish-single', function() {
	var argv = require('yargs')
		.usage('Usage: gulp publish --folder=[string] --bucket=[string] --suite=[string]')
		.demandOption(['folder', 'bucket'])
		.argv;

	var bucketName = argv.bucket;
	if (argv.suite) {
		bucketName = argv.bucket + '/' + argv.suite;
	}

	var folder = argv.folder;
	var publisher = awspublish.create({
		params: {
			Bucket: bucketName
		},
		'accessKeyId': config.AWS_CONFIG.accessKeyId,
		'secretAccessKey': config.AWS_CONFIG.secretAccessKey
	});

	var headers = {
		'Cache-Control': 'max-age=315360000, no-transform, private'
	};
	return gulp.src(path.join(folder, '/**/*'))
		.pipe(zip(folder + '.zip'))
		.pipe(awspublish.gzip({ ext: '.gz' }))
		.pipe(publisher.publish(headers))
		.pipe(awspublish.reporter())
});

gulp.task('download', function() {
	var argv = require('yargs')
		.usage('Usage: gulp download --bucket=[string] --dest=[string] --compName=[string] --suite=[string]')
		.demandOption(['bucket', 'dest', 'compName'])
		.argv;

	var bucketName = argv.bucket;
	if (argv.suite) {
		bucketName = argv.bucket + '/' + argv.suite;
	}

	var compName = argv.compName;
	var dest = argv.dest;
	return s3.src('s3://' + bucketName + '/' + compName + '.zip.gz', { buffer: false })
		.pipe(gunzip())
		.pipe(unzip())
		.pipe(gulp.dest(dest + '/' + compName));
});

/** A gulp job for webpacking a bunch of files together into
a bundle.js to be required in the HTML (contains minifited package in
production environments) */
gulp.task('webpack', function (callback) { 
	webpack(require('./webpack.config.js'), function(err, stats) {
		if(err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString({
			// output options
		}));
		callback();
	})
})

