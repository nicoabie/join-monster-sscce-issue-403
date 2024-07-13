import assert from 'assert/strict';

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLID,
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
const Thing = new GraphQLInterfaceType({
  name: 'Thing',
  extensions: {
    joinMonster: {
      sqlTable: 'things',
      uniqueKey: 'id',
      alwaysFetch: ['things_type'],
    },
  },
  resolveType: (value, context, info) => {
    return value.things_type
  },
  fields: {
    id: {
      type: GraphQLID,
      sqlColumn: 'id'
    },
    name: {
      type: GraphQLString,
      sqlColumn: 'names'
    }
  }
})

const Foo = new GraphQLObjectType({
  name: 'Foo',
  interfaces: [Thing],
  fields: {
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    }
  }
});

const Bar = new GraphQLObjectType({
  name: 'Bar',
  interfaces: [Thing],
  fields: {
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  }
});

const Baz = new GraphQLObjectType({
  name: 'Baz',
  interfaces: [Thing],
  fields: {
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  }
});
// end your definition of the schema

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    things: {
      type: new GraphQLList(Thing),
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
  query: QueryRoot,
  types: [Foo, Bar, Baz]
});


(async () => {
  // define the query you want to test
  const source = `
  {
    things {
      id
      name
      
      ... on Bar {
        description
      }

      ... on Baz {
        description
      }
    }
  }
  `;

  // define the expected result
  const expected = {
    things: [
      { id: '1', name: 'A Foo Thing' },
      { id: '2', name: 'A Bar Thing', description: 'Bar Description' },
      { id: '3', name: 'A Baz Thing', description: 'Baz Description' }
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