const graphql = require('graphql');
const data = require('./data.json');

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    friends: {
      type: new graphql.GraphQLList(userType),
      resolve: user => user.friends.map(id => data[id])
    }
  })
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args` describes the arguments that the `user` query accepts
        args: {
          id: { type: graphql.GraphQLString }
        },
        // The resolve function describes how to "resolve" or fulfill
        // the incoming query.
        // In this case we use the `id` argument from above as a key
        // to get the User from `data`
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

export default schema;