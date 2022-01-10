const {gql} = require("apollo-server-express");

const api = require("../api");

const typeDef = gql`
    type Recipe {
        id: Int
        image: String
        imageType: String
        like: Int
        title: String
        missedIngredientCount: Int
        missedIngredients: [MissedIngredients]
        unusedIngredients: [UnusedIngredients]
        usedIngredientCount: Int
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
        sourceUrl: String
        spoonacularSourceUrl: String
        aggregateLikes: Int
        healthScore: Int
        spoonacularScore: Int
        pricePerServing: Float
        analyzedInstructions: [String]
        cheap: Boolean
        creditsText: String
        cuisines: [String]
        dairyFree: Boolean
        diets: [String]
        gaps: String
        glutenFree: Boolean
        instructions: String
        ketogenic: Boolean
        lowFodmap: Boolean
        occasions: [String]
        sustainable: Boolean
        vegan: Boolean
        vegetarian: Boolean
        veryHealthy: Boolean
        veryPopular: Boolean
        whole30: Boolean
        weightWatcherSmartPoints: Int
        dishTypes: [String]
        extendedIngredients: [ExtendedIngredients]
        summary: String
        winePairing: WinePairing
    }
    type MissedIngredients {
        aisle: String
        amount: Float
        id: Int
        image: String
        meta: [String]
        name: String
        original: String
        originalName: String
        unit: String
        unitLong: String
        unitShort: String
    }
    type UnusedIngredients {
      aisle: String
      amount: Float
      id: Int
      image: String
      meta: [String]
      name: String
      original: String
      originalName: String
      unit: String
      unitLong: String
      unitShort: String
  }
    type UsedIngredients {
        aisle: String
        amount: Float
        id: Int
        image: String
        meta: [String]
        name: String
        original: String
        originalName: String
        unit: String
        unitLong: String
        unitShort: String
    }
    type ExtendedIngredients {
        aisle: String
        amount: Float
        consistency: String
        id: Int
        image: String
        meta: [String]
        name: String
        original: String
        originalName: String
        unit: String
    }
    type WinePairing {
        pairedWines: [String]
        pairingText: String
        productMatches: [ProductMatches]
    }
    type ProductMatches {
        id: Int
        title: String
        description: String
        price: String
        imageUrl: String
        averageRating: Float
        ratingCount: Float
        score: Float
        link: String
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
