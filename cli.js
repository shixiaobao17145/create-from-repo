#!/usr/bin/env node
var program = require('commander')
var fetchGit = require('./index');

program
    .usage('[options] git-repository-url <dir>')
    .description('download content from a git repository')
    .option('-t, --tag <tag>', 'tag of the git repository')
    .option('-b, --branch <branch>', 'branch of the git repository')
    .parse(process.argv)

let errorHandler = (err, type) => {
    if (err) {
        console.error(type=='info'?'\nerror: '+err.message+'\n':err);
    }
    process.exit(1);
}

if (!program.args.length) {
    program.outputHelp();
    errorHandler(new Error('git repository url required'), 'info');
}
var {
    tag,
    branch
} = program;

if(tag && branch){
    errorHandler(new Error('can not set both branch and tag in a time'), 'info');
}

let options = {
    branchOrTag: branch || tag,
    source: program.args[0],
    target: program.args[1] || '.'
}
var promise = fetchGit(options);

promise.then(resp => {
    console.log('\nextract success to ' +options.target+'\n');
}).catch(errorHandler);
