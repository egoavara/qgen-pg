#!/usr/bin/env node
const { program } = require("commander");
program
    .command('build [...pattern]', 'query to typescript function generator', { executableFile: './sqlfnc-build.js' })
    .command('watch [...pattern]', 'query to typescript function generator with watcher', { executableFile: './sqlfnc-watch.js' })
    .command('test', 'test', { executableFile: './sqlfnc-test.js' })
    .parse()