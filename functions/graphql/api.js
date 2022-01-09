const {RESTDataSource} = require("apollo-datasource-rest");

const validator = require("../utility_functions/validator");

class RecipesAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = "https://api.spoonacular.com/";
    this.initialize({});
  }
  willSendRequest(request) {
    request.params.set("apiKey", process.env.SPOONACULAR_API_KEY_1);
  }
  async recipes(ingredients="onion", number=1, limitLicense=true, ranking=1, ignorePantry=true) {
    // Add ingredients validator
    const validateNumber = validator.validateInt(number);
    const validateRanking = validator.validateInt(ranking);
    const validateLimitLicense = validator.validateBoolean(limitLicense);
    const validateIgnorePantry = validator.validateBoolean(ignorePantry);

    if (validateNumber && validateRanking && validateLimitLicense && validateIgnorePantry) {
      const data = await this.get("recipes/findByIngredients", {
        ingredients,
        number,
        limitLicense,
        ranking,
        ignorePantry,
      });
      return data || [];
    }
    return [];
  }
  async recipesInfo(ids="715538", includeNutrition=false) {
    // Add ids validator
    const validateIncludeNutrition = validator.validateBoolean(includeNutrition);

    if (validateIncludeNutrition) {
      const data = await this.get("recipes/informationBulk", {
        ids,
        includeNutrition,
      });
      return data || [];
    }
    return [];
  }
}

module.exports.recipesAPI = new RecipesAPI();
