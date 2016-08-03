const fs = require('fs');

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const istanbul = require('gulp-istanbul');

const srcFiles = ['lib/**/*.js'];
const testFiles = ['test/**/*.js', 'gulpfile.js'];

const eslintRules = JSON.parse(fs.readFileSync('./.eslintrc'));

// Linter tasks -------------------------------------------
gulp.task('lint:src', () => (
  gulp.src(srcFiles)
    .pipe(eslint(eslintRules))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
));

gulp.task('lint:test', () => (
  gulp.src(testFiles)
    .pipe(eslint(Object.assign(eslintRules, {
      envs: ['node', 'es6', 'mocha'],
    })))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
));

gulp.task('lint', ['lint:src', 'lint:test']);

gulp.task('lint:watch', () => {
  gulp.watch(srcFiles, ['lint:src'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type} running tasks...`);
    });

  gulp.watch(testFiles, ['lint:test'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type} running tasks...`);
    });
});

// Test tasks ---------------------------------------------
gulp.task('pre-test', () => (
  gulp.src(srcFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('test', ['pre-test'], () => {
  process.env.SECRET = 'THIS IS A BAD SECRET';
  return gulp.src(testFiles, { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
});

gulp.task('test:watch', ['test'], () => {
  gulp.watch([srcFiles, testFiles], ['test'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type} running tasks...`);
    });
});

// Server tasks -------------------------------------------
gulp.task('start', ['lint', 'test'], () => {
  nodemon({
    script: './lib/index.js',
  });
});

gulp.task('default', ['lint', 'test']);
gulp.task('watch', ['lint:watch', 'test:watch', 'start']);
