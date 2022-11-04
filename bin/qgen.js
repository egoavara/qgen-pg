#!/usr/bin/env node
import { program } from 'commander'

program
    .command('querys [...pattern]', 'query to typescript function generator', {executableFile : './qgen-querys.js'})
    .command('types', 'postgres type parser generator', {executableFile : './qgen-types.js'})
    .parse()