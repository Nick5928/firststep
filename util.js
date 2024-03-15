$(document).ready(function() {



var APIKEY = "f4058b0d61bc49f1b9af103ffc6677c6";
var BASEURL = "https://api.spoonacular.com";


$("#gen_res").click(async function () {
    let ingred = $("#ingredient").val();
    let ingredID = await getIngredId(ingred);

    let calories = await getCalories(ingredID, 1);

    window.alert(calories);
})

$("#submit_recipe").click(async function ()
{
    let ingredient1 = $("#First_ingredient").val();
    let ingredient2 = $("#Second_ingredient").val();
    let ingredient3 = $("#Third_ingredient").val();
    let recipe = await getRecipe(ingredient1,ingredient2,ingredient3);
    


    window.alert(recipe.id)
})

async function getIngredId(ingred) {    
    let response = await fetch(`${BASEURL}/food/ingredients/search?apiKey=${APIKEY}&query=${ingred}&number=1`);

    let data = await response.json();


    var ingredID = data.results[0].id;

    console.log(ingredID);

    return ingredID;
};



async function getCalories(ingredID, amount) {

    let URL = `${BASEURL}/food/ingredients/${ingredID}/information?apiKey=${APIKEY}&amount=${amount}`;

    console.log(URL);

    let response = await fetch(URL);
    
    let data = await response.json();

    let calories = getCal(data);

    console.log(calories);

    return calories;

};

function getCal(data) {

    let nutrients = data.nutrition.nutrients;

    for(let nutrient of nutrients) {
        if(nutrient.name == "Calories") return nutrient.amount;
    }

    return null;

};

async function getRecipe(ingredient1,ingredient2,ingredient3)
{ 
    let URL = `${BASEURL}/recipes/findByIngredients?apiKey=e9fc8d058c00426586140d364018243a&ingredients=${ingredient1},+${ingredient2},+${ingredient3}`;

    console.log(URL);

    let response = await fetch(URL);
   
    
    let recipe = await response.json();
    console.log(recipe);
    return recipe;
};
});


