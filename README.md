# create-from-repo

create-from-repo is a tool for creating a new project by download from an existing git repo.


## Install

	npm install -g create-from-repo

## Usage

	create-from-repo [options] <repo-url> <download-target>

    -b, --branch <branch>  branch of the git repository (default: master)
    -t, --tag <tag>        specify the tag instead of branch of the git repository
    -s, --ssh              use your local ssh-key credential to download the repository
    --force                force to download regardless the target dir is not empty
    -h, --help             output usage information

## Examples

	create-from-repo https://github.com/shixiaobao17145/create-from-repo.git .

Or

	create-from-repo git@github.com:shixiaobao17145/create-from-repo.git .

Or 

	create-from-repo shixiaobao17145/create-from-repo .

It will download the create-from-repo to current dir. It will also work in other domain in the full-url mode, like `create-from-repo https://gitee.com/bobshi/create-from-repo .`

If the repo you're downloading is not a public one, you can add -s option to apply you local ssh cridential to download it by using the git clone command.

**Note**: the target directory should be a nonexist one or be an empty one, nevertheless you can add --force option to force it download to an exist folder, whereas --force would not work in ssh mode(with -s option) due to the native git clone command restriction;



