const {gql} = require("apollo-server-express");
const api = require("./api");

const typeDef = gql`
    type Recipe {
        id: Int
        title: String
        missedIngredients: [MissedIngredients]
        usedIngredients: [UsedIngredients]
    }
    type RecipeInfo {
        id: Int
        title: String
        image: String
        imageType: String
        servings: Int
        readyInMinutes: Int
        license: String
        sourceName: String
        sourceURL: String
        spoonacularSourceURL: String
        aggregateLikes: Int
        healthScore: Int
        spoonacularScore: Int
        pricePerServing: Int
        cheap: Boolean
        creditsText: String
        dairyFree: Boolean
        gaps: String
        glutenFree: Boolean
        instructions: String
        ketogenic: Boolean
        lowFodmap: Boolean
        sustainable: Boolean
        vegan: Boolean
        vegetarian: Boolean
        veryHealthy: Boolean
        veryPopular: Boolean
        whole30: Boolean
        weightWatcherSmartPoints: Int
        summary: String
    }
    type MissedIngredients {
        aisle: String
        amount: Int
        id: Int
        image: String
        name: String
        original: String
        originalName: String
        unit: String
        unitLong: String
        unitShort: String
    }
    type UsedIngredients {
        aisle: String
        amount: Int
        id: Int
        image: String
        meta: String
        name: String
        original: String
        originalName: String
        unit: String
        unitLong: String
        unitShort: String
    }
`;

const resolvers = {
  Query: {
    recipes: (_, {ingredients, number, limitLicense, ranking, ignorePantry}) => {
      return api.recipesAPI.recipes(ingredients, number, limitLicense, ranking, ignorePantry);
    },
    recipesInfo: (_, {ids, includeNutrition}) => {
      return api.recipesAPI.recipesInfo(ids, includeNutrition);
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
