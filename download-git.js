let downloadUrl = require('download');
var gitclone = require('git-clone');
var rm = require('rimraf').sync;

module.exports = {
	fetchGit:function(url, branch = 'master', tag, dest, isSSH){
		let repo = this.url2Repo(url, branch,tag);
		if(!isSSH){
			return this.downloadZip(repo, dest);
		}else{
			return this.downloadByClone(repo, dest);
		}
	},
	downloadByClone:function(repo, dest){
		let resolve,reject, promise = new Promise((rs,rj)=>(resolve = rs, reject=rj));
		//====compose the info message
		let strs = ['exec git clone with url: ' + repo.sshUrl];
		['branch','tag'].forEach(key=>{
			if(repo[key]){
				strs.push(` ${key}: ${repo[key]}`);
			}
		});
		console.log(strs.join(','));
		//=== end of compose the info message
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
	url2Repo:function(url, branch, tag){
		let reg = /((f|ht)tps?:\/\/[^\/]*\/|\w+@[^:]*?:)?([^\/]*\/[^\/]*?)(\.[^\/]*)?$/i;
		//matches
		//0: whole string, which is the whole url
		//1:git@xxx.com or https://xxx.com
		//2: f or ht
		//3: ownerAndName
		//4: .git 
		let matches = url.match(reg);
		//debug
		//console.log('matches', matches);
		let owerAndName = matches[3];
		let origin = matches[1] || 'https://github.com/';
		let repo = {
			origin,
			owerAndName,
			branch,
			tag,
			branchOrTag: branch || tag
		}
		if(matches[1] && !matches[2]){//it is ssh type url like git@xxx.com
			//			console.log('debug: match the ssh type url');
			repo.sshUrl = url;
			let rawOrigin = origin.split(/@|:/)[1];
			origin = 'https://' + rawOrigin +'/';
			repo.rawOrigin = rawOrigin;
			//console.log('debug: match the ssh type url');
		}else{
			let protocolIdx = origin.indexOf(':');
			repo.rawOrigin = origin.substring(protocolIdx+3, origin.length - 1);
			repo.sshUrl = 'git@'+repo.rawOrigin+':'+owerAndName+'.git';
		}
		let repoUrl = origin + owerAndName + '.git';
		repo.repoUrl = repoUrl;
		let zipUrl = origin + owerAndName + '/archive/' + repo.branchOrTag + '.zip';
		repo.zipUrl = zipUrl;
		//debug
		console.log('repo', repo);
		return repo;
	},
	downloadZip:function (repo, dest){
		console.log('downloading:' + repo.zipUrl);
		return downloadUrl(repo.zipUrl, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } }).then(()=>repo).catch(err=>{err.repo = repo; throw err});
	}
}

