#!/usr/bin/env node
var program = require('commander')
var fetchGit = require('./index');
var fs = require('fs');
var path = require('path');

program
	.usage('[options] git-repository-url <dir>')
	.description('download content from a git repository')
	.option('-b, --branch <branch>', 'branch of the git repository', 'master')
	.option('-t, --tag <tag>', 'specify the tag instead of branch of the git repository')
	.option('-s, --ssh', 'use your local ssh-key credential to download the repository')
	.option('--force', 'force to download regardless the target dir is not empty')
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
	force:isForce,
	ssh:isSSH
} = program;

if(tag && branch){
	errorHandler(new Error('can not set both branch and tag in a time'), 'info');
}

let options = {
	tag,
	branch,
	isSSH,
	source: program.args[0],
	target: program.args[1] || '.'
}

//check the target dir && --force mode
let targetPath = path.resolve(options.target);
if(fs.existsSync(targetPath)){
	if(!fs.statSync(targetPath).isDirectory()){
		errorHandler(new Error('target directory '+targetPath+' should be a directory'))
	}

	if(fs.readdirSync(targetPath).length){
		if(!isForce){
			errorHandler(new Error('target directory '+targetPath+' is not empty, add --force option if you still want to download it'))
		}else if(isSSH){
			errorHandler(new Error('--force mode does not work in clone(with -s option) mode'))
		}
	}
}

var promise = fetchGit(options);

promise.then(resp => {
	console.log('\nextract success to ' +options.target+'\n');
}).catch(errorHandler);
