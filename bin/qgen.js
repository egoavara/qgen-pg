#!/usr/bin/env node
const { program } = require("commander");
program
    .command('build [...pattern]', 'query to typescript function generator', { executableFile: './qgen-build.js' })
    .command('test', 'test', { executableFile: './qgen-test.js' })
    .parse()