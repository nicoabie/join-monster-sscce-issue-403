# Join Monster Quick SSCCE Base Repository

Use this repository to create an [SSCCE](http://www.sscce.org/) for your issue! It will greatly help us figure out what is going wrong and your issue
will be much easier to investigate.

## Create your SSCCE locally

### Step 1 - Install this repository locally

Start by [Forking this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo),
then [clone it on your machine](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

Run `npm install` to install the necessary dependencies.

Run `npm test` to make sure everything is ok before testing your code.

### Step 1 - Create the SSCCE

You now need to create a failing test that accurately represents the issue you're experiencing.

Modify [test.js](./test.js) to show the failure.
Modify [setup.sql](./setup.sql) to describe tables and data.

Remember the [SSCCE rules](http://www.sscce.org/). It should be:

- *Short (Small)* - It should not include anything that is not relevant to your issue.
- *Self Contained* - Ensure everything is included, ready to go.
- *Correct* - It should demonstrate the problem you're encountering (i.e. the sscce should fail, but with the right error).
- *Example* - Displays the problem we are trying to solve.

### Step 2 - Run the SSCCE

Use one of our npm scripts to run your SSCCE.

Running with a dialect other than sqlite will require installing an extra package
& having a database running.

#### sqlite (recommended if the issue is not dialect specific)

Run the following command to create a sqlite db file
```shell
cat setup.sql | sqlite3 setup.db
```

```shell
npm test
```

#### postgres

You'll need to install the `pg` package and have a postgres database running.

```shell
# Do this only once.
npm install pg
# or
npm install pg-native
```

Configure knex connection https://knexjs.org/guide/#configuration-options in [test.js](./test.js)

```shell
npm test
```

#### mysql

```shell
# Do this only once.
npm install mysql2
```

Configure knex connection https://knexjs.org/guide/#configuration-options in [test.js](./test.js)

```shell
npm test
```

### Step 3 - Commit your SSCCE & sent it to us

Open an issue on the [main join-monster repo](https://github.com/join-monster/join-monster/) describing
your problem and include a link to your SSCCE in it.

You can also open a PR of your fork to [this repository](https://github.com/join-monster/join-monster-sscce),
this way your SSCCE will be run on our CI and will continue existing even if you delete your fork.

## FAQ

### What if you want to make some changes to the SSCCE?

Just add more commits on top of it, in your fork, and your PR will be updated automatically, and the SSCCE will be executed again.

### I don't want to open a pull request for this

You don't have to! You can just add a link to your forked repository in your issue.

However, opening a pull request will ensure the SSCCE continues to exist even if you delete your fork. Less clutter in your repository list!

## Thanks

This repository was inspired by the work done by the [sequelize](https://github.com/sequelize/sequelize-sscce) team 
