const express = require("express");
const { 
  graphqlHTTP 
} = require("express-graphql");
const { 
  buildSchema, 
  assertInputType 
} = require("graphql");

const app = express();


// Construct a schema, using GraphQL schema language


var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
     // Your code goes here
    return restaurants[arg.id-1]
  },
  restaurants: () => {
    // Your code goes here
    return restaurants
  },
  setrestaurant: ({ input }) => {
    restaurants.push({
      name:input.name, 
      description:input.description, 
      id:restaurants.length+1})
    return input
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    let i = id -1
    if(!restaurants[i]){
      throw new Error("Restaurant not listed.")
    }
    const ok = Boolean(restaurants[i]) //irr
    let deletedrest = restaurants[i] 
    deletedrest = restaurants.splice(i, 1)
    return {ok}
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    let i = id -1
    if(!restaurants[i]){
      throw new Error("Restaurant not listed.")
    }
    restaurants[i] = {
      ...restaurants[i], ...restaurant    }
    return restaurants[i]

  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5501;
app.listen(5501, () => console.log("Running Graphql on Port:" + port));

console.log('Running a GraphQL API server at http://localhost:5501/graphql');

//export default root;