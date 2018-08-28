#!/usr/bin/env node
var program = require('commander')
var fetchGit = require('./index');

program
	.usage('[options] git-repository-url <dir>')
	.description('download content from a git repository')
	.option('-t, --tag <tag>', 'tag of the git repository')
	.option('-b, --branch <branch>', 'branch of the git repository')
	.option('-s, --ssh', 'use your local ssh-key credential to download the repository')
	.parse(process.argv)

let errorHandler = (err, type) => {
	if (err) {
		let { repo } = err;
		delete err.repo;

//		console.error(type=='info'?'\nerror: '+err.message+'\n':err);
		console.error((err.name?(err.name + ":"):'')+ err.message);

		if(err.name == 'HTTPError' && err.statusCode == 404){
			console.error('\nerror: repository ['+repo.owerAndName+'] not found, need credential? try -s option to download the repo with `git clone`\n');
		}
	}
	process.exit(1);
}

if (!program.args.length) {
	program.outputHelp();
	errorHandler(new Error('git repository url required'), 'info');
}
var {
	tag,
	branch,
	ssh:isSSH
} = program;

if(tag && branch){
	errorHandler(new Error('can not set both branch and tag in a time'), 'info');
}

let options = {
	branchOrTag: branch || tag,
	isSSH,
	source: program.args[0],
	target: program.args[1] || '.'
}
var promise = fetchGit(options);

promise.then(resp => {
	console.log('\nextract success to ' +options.target+'\n');
}).catch(errorHandler);
