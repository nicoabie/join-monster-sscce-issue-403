import assert from 'assert/strict';

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';

import pkg from 'join-monster';
const joinMonster = pkg.default;

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// modifiy here if you want to use another database
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './setup.db'
  }
});

// begin your definition of the schema
const Tag = new GraphQLObjectType({
  name: 'Tags',
  extensions: {
    joinMonster: {
      sqlTable: 'tags',
      uniqueKey: 'id',
    },
  },
  fields: {
    id: {
      type: GraphQLInt
    },
    body: {
      type: GraphQLString
    },
  }
});

const UserTag = new GraphQLObjectType({
  name: 'UserTags',
  extensions: {
    joinMonster: {
      sqlTable: 'user_tags',
      uniqueKey: 'user_id', // this is the magic that allows the join to work
    },
  },
  fields: {
    a_tags: {
      type: new GraphQLList(Tag),
      extensions: {
        joinMonster: {
          sqlJoin: (ut, t) => `${ut}.tag_id = ${t}.id and ${ut}.type = 'a'`
        }
      }
    },
    b_tags: {
      type: new GraphQLList(Tag),
      extensions: {
        joinMonster: {
          sqlJoin: (ut, t) => `${ut}.tag_id = ${t}.id and ${ut}.type = 'b'`
        }
      }
    },
    c_tags: {
      type: new GraphQLList(Tag),
      extensions: {
        joinMonster: {
          sqlJoin: (ut, t) => `${ut}.tag_id = ${t}.id and ${ut}.type = 'c'`
        }
      }
    },
  }
});

const User = new GraphQLObjectType({
  name: 'Users',
  extensions: {
    joinMonster: {
      sqlTable: 'users',
      uniqueKey: 'id',
    },
  },
  fields: {
    id: {
      type: GraphQLInt
    },
    tags: {
      type: UserTag,
      extensions: {
        joinMonster: {
          sqlJoin: (u, ut) => `${u}.id = ${ut}.user_id`
        },
      },
    }
  }
});
// end your definition of the schema

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(User),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, {}, sql => {
          return knex.raw(sql)
        })
      }
    }
  })
});

const schema = new GraphQLSchema({
  description: 'a test schema',
  query: QueryRoot
});


(async () => {
  // define the query you want to test
  const source = `
  {
    users {
      id
      tags {
        a_tags {
          id
        }
        b_tags {
          id
        }
        c_tags {
          id
        }
      }
    }
  }
  `;

  // define the expected result
  const expected = {
    users: [
      {
        id: 1,
        tags: {
          a_tags: [
            {
              id: 1,
            },
            {
              id: 3,
            }
          ],
          b_tags: [
            {
              id: 2,
            },
            {
              id: 4,
            }
          ],
          c_tags: []
        }
      }
    ]
  };
  
  const { data, errors } = await graphql({schema, source});
  
  if (errors?.length) {
    console.error(errors);
  }

  // JSON.parse of JSON.stringify bc of https://github.com/apollographql/apollo-server/issues/3149
  assert.deepEqual(JSON.parse(JSON.stringify(data)), expected);

  console.log('test passed');

  knex.destroy();
})();