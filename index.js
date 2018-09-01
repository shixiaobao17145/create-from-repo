var downloadGitRepo = require('./download-git');

function fetchGit(options) {
	var {
		tag,
		branch,
		source,
		target,
		isSSH
	} = options;

	return downloadGitRepo.fetchGit(source, branch, tag, target, isSSH);
}

module.exports = fetchGit;
