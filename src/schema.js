// const graphql = require('graphql');
import { 
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';
import data from './data';

const productType = new GraphQLObjectType({
  name: 'Product',
  description: "Vape production item",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    image: {
      type: GraphQLString,
      resolve: product => `${process.env.HOST}/images/product/${product.image}`
    },
    features: { type: new GraphQLList(GraphQLString) },
    includes: { type: new GraphQLList(GraphQLString) }
  })
});

const manufacturerType = new GraphQLObjectType({
  name: "Manufacturer",
  description: "Vape production manufacturer",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: {
      type: GraphQLString,
      resolve: manufacturer => `${process.env.HOST}/images/manufacturer/${manufacturer.image}`
    },
    products: {
      type: new GraphQLList(productType),
      resolve: manufacturer => manufacturer.products.map(id => data.product[id])
    }
  })
});

const categoryType = new GraphQLObjectType({
  name: "Category",
  description: "Vape production category",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    products: {
      type: new GraphQLList(productType),
      resolve: category => category.products.map(id => data.product[id])
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      products: {
        type: new GraphQLList(productType),
        resolve: () => {
          const products = [];
          for (const id in data.product) {
            if (data.product.hasOwnProperty(id)) {
              products.push(data.product[id]);
            }
          }
          return products;
        }
      },
      product: {
        type: productType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: function (_, args) {
          return data.product[args.id];
        }
      },
      manufacturers: {
        type: new GraphQLList(manufacturerType),
        resolve: () => {
          const manufacturers = [];
          for (const id in data.manufacturer) {
            if (data.manufacturer.hasOwnProperty(id)) {
              manufacturers.push(data.manufacturer[id]);
            }
          }
          return manufacturers;
        }
      },
      manufacturer: {
        type: manufacturerType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: function (_, args) {
          return data.manufacturer[args.id];
        }
      },
      categories: {
        type: new GraphQLList(categoryType),
        resolve: () => {
          const categories = [];
          for (const id in data.category) {
            if (data.category.hasOwnProperty(id)) {
              categories.push(data.category[id]);
            }
          }
          return categories;
        }
      },
      category: {
        type: categoryType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: function (_, args) {
          return data.category[args.id];
        }
      }
    }
  })
});

export default schema;