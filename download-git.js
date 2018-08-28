let downloadUrl = require('download');
var gitclone = require('git-clone');
var rm = require('rimraf').sync;

module.exports = {
	fetchGit:function(url, branchOrTag = 'master', dest, isSSH){
		let repo = this.url2Repo(url, branchOrTag);
		if(!isSSH){
			return this.downloadZip(repo, dest);
		}else{
			return this.downloadByClone(repo, dest);
		}
	},
	downloadByClone:function(repo, dest){
		let resolve,reject, promise = new Promise((rs,rj)=>(resolve = rs, reject=rj));
		console.log('exec git clone with url:' + repo.sshUrl + ', branchOrTag:' + repo.branchOrTag);
		gitclone(repo.sshUrl, dest, { checkout: repo.branchOrTag, shallow: repo.branchOrTag == 'master' }, function (err) {
			if (err === undefined) {
				rm(dest + '/.git')
				resolve('success');
			} else {
				reject(err)
			}
		});
		return promise;
	},
	url2Repo:function(url, branchOrTag){
		let reg = /((f|ht)tps?:\/\/[^\/]*\/|\w+@[^:]*?:)?([^\/]*\/[^\/]*?)(\.[^\/]*)?$/i;
		let matches = url.match(reg);
		let owerAndName = matches[3];
		let origin = matches[1] || 'https://github.com/';
		let repo = {
			origin,
			owerAndName,
			branchOrTag
		}
		if(!matches[2]){
			repo.sshUrl = url;
			let rawOrigin = origin.split(/@|:/)[1];
			origin = 'https://' + rawOrigin +'/';
			repo.rawOrigin = rawOrigin;
		}else{
			let protocolIdx = origin.indexOf(':');
			repo.rawOrigin = origin.substring(protocolIdx+3, origin.length - 1);
			repo.sshUrl = 'git@'+repo.rawOrigin+':'+owerAndName+'.git';
		}
		let repoUrl = origin + owerAndName + '.git';
		repo.repoUrl = repoUrl;
		let zipUrl = origin + owerAndName + '/archive/' + branchOrTag + '.zip';
		repo.zipUrl = zipUrl;
		return repo;
	},
	downloadZip:function (repo, dest){
		console.log('downloading:' + repo.zipUrl);
		return downloadUrl(repo.zipUrl, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } }).then(()=>repo).catch(err=>{err.repo = repo; throw err});
	}
}

