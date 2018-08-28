var downloadGitRepo = require('./download-git');

function fetchGit(options) {
	var {
		branchOrTag,
		source,
		target,
		isSSH
	} = options;

	return downloadGitRepo.fetchGit(source, branchOrTag, target, isSSH);
}

module.exports = fetchGit;
