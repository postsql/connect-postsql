connect-postsql
===============

PostSQL (PostgreSQL via database functions) session store for Connect


Usage with sails.js
-------------------

add the following lines to `sails/lib/session.js` :

```
  case 'postsql':
    var PGStore = require('connect-postsql');
    sessionConfig.store = new(PGStore(require('express')))(sessionConfig);
    break;
```

and then configure it in `config/session.js` :

```
  adapter: 'postsql',
  
  database: 'dbname',
  host: 'localhost',
  user: 'dbuser',
  password: 'dbpasswd',
  port: 5432,
```

Installing support in Postgresql database
------------------------------------------

To install the support functions in the database just execute:

  psql databasename -f sql/connect-postsql-support.sql


