# Rules for Using Branches For Developers

1. Once a new branch has been created in the repo developers have to fetch it using : `git fetch <link> <remote_branch_name>`
2. After git fetch command everyone has to use `git checkout development` to switch to development branch
3. All work should be done on this branch. 
4. Developers while committing will only commit directly to development branch using `git push <link> development` command
5. **No developer should merge, commit to Staging, Main**
6. **Avoid** pushing code using `git push <link>` 
7. While Pulling code make sure you are in the development branch and use the command `git pull <link> development`
