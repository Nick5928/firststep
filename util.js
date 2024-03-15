$(document).ready(function() {



    var APIKEY = "f4058b0d61bc49f1b9af103ffc6677c6";
    var BASEURL = "https://api.spoonacular.com";

    var table = $("#ingredient_table");


    var totalCal = 0;

    var targetCal = 0;


    $("#gen_meal_plan").click(async function() {

        let recipTable = $("#recip_table");

        let targetCalories = $("#target_cal").val();

        console.log(targetCalories);
        let meals = await mealPlan(targetCalories);



        for(let meal of meals.meals){
            let info = await getRecipNutri(meal.id);


            let recip = meal.title;
            let carbs = getNutri(info, "Carbohydrates");
            let fat = getNutri(info, "Fat");
            let protein = getNutri(info, "Protein");
            let calories = getNutri(info, "Calories");
            let sourceURL = meal.sourceUrl;

            let newRowHtml = `
            <tr>
                <td class="link_cell"><a href="${sourceURL}" target="_blank">${recip}</a></td>
                <td class = carbs_cell>${carbs}</td>
                <td class = fat_cell>${fat}</td>
                <td class = protein_cell>${protein}</td>
                <td class = calories_cell>${calories}</td>
            </tr>
        `;
            
            $(recipTable).find("tbody").append(newRowHtml);

        }
        




        
    });




    $("#submit_btn").click(function() {

        targetCal = $("#target_cal").val();

        createChart(totalCal, targetCal);

    });

    $("#insert_ingredient").click(async function() {
        let ingredient = $("#ingredient").val();
        let amount = $("#amount").val();
        let units = $("#units").val();

        let ingredID = await getIngredID(ingredient);
        let ingredInfo = await getInfo(ingredID, amount, units);
        


        let img = ingredInfo.image;
        let carbs = getNutriAmount(ingredInfo, "Carbohydrates");
        let fat = getNutriAmount(ingredInfo, "Fat");
        let protein = getNutriAmount(ingredInfo, "Protein");
        let calories = getNutriAmount(ingredInfo, "Calories");
        

        let imgURL = `https://spoonacular.com/cdn/ingredients_100x100/${img}`

        let newRowHtml = `
            <tr>
                <td class = ingred_cell>${ingredient} <img class = "picture ${ingredient}" src="${imgURL}" style="width:30px; height:25px"></td></td>
                <td class = carbs_cell>${carbs}</td>
                <td class = fat_cell>${fat}</td>
                <td class = protein_cell>${protein}</td>
                <td class = calories_cell>${calories}</td>
            </tr>
        `;

        
        $(table).find("tbody").append(newRowHtml);



        totalCal += calories;


        if(totalCal > targetCal) createChart(targetCal-.000000001, targetCal);
        else createChart(totalCal, targetCal);
        

    });


    $("#submit_recipe").click(async function ()
{
    let ingredient1 = $("#First_ingredient").val();
    let ingredient2 = $("#Second_ingredient").val();
    let ingredient3 = $("#Third_ingredient").val();
    let recipe = await getRecipe(ingredient1,ingredient2,ingredient3);


    let title1 = recipe[0].title;

    $("#recipe_data").find("p").text(title1);
})


    


    function createChart(num_calories, num_target_calories) {

        google.charts.load('current', {'packages':['corechart']});

        google.charts.setOnLoadCallback(drawChart);

        var chart;
        var data;
        var options;
        var data = new google.visualization.DataTable();

            function drawChart() {
                data = new google.visualization.DataTable();
                data.addColumn('string', 'Element');
                data.addColumn('number', 'Number');
                data.addRows([
                ['Calories', num_calories],
                ['Remaining calories', num_target_calories - num_calories]
                ]);
        
                options = { 'title': 'Percentage of Target Calories',
                            'titleTextStyle': { color: "black"},
                            'width': 400,
                            'height': 200,
                            'backgroundColor': 'white',
                            'slices' : {
                            0 : {color: 'green'},
                            1 : {color: 'lightgray', textStyle:{color: 'black'}}
                            },
                            pieSliceBorderColor: 'none'
        
                        };
        
                chart = new google.visualization.PieChart($("#cal_chart")[0]);
                chart.draw(data, options);
        
        
            };
        

        // Instantiate and draw the chart
        var chart = new google.visualization.PieChart($("#cal_chart")[0]);
        chart.draw(data, options);
    };


    async function getIngredID(ingred) {    

    
        let URL = `${BASEURL}/food/ingredients/search?apiKey=${APIKEY}&query=${ingred}&number=1`


        let response = await fetch(URL);

        let data = await response.json();


        var ingredID = data.results[0].id;

        console.log(ingredID);

        return ingredID;
    };




    async function getRecipe(ingredient1,ingredient2,ingredient3)
    { 
        let URL = `${BASEURL}/recipes/findByIngredients?apiKey=${APIKEY}&ingredients=${ingredient1},+${ingredient2},+${ingredient3}`;

        console.log(URL);

        let response = await fetch(URL);


        let recipe = await response.json();

        return recipe;

    };



    async function getInfo(ingredID, amount) {

        let URL = `${BASEURL}/food/ingredients/${ingredID}/information?apiKey=${APIKEY}&amount=${amount}`;


        let response = await fetch(URL);
        
        let info = await response.json();

        return info;


    };

    function getNutriAmount(data, target) {

        let nutrients = data.nutrition.nutrients;

        for(let nutrient of nutrients) {
            if(nutrient.name == target) return nutrient.amount;
        }

        return null;

    };



    async function mealPlan(targetCalories) {
        let URL = `${BASEURL}/mealplanner/generate?apiKey=${APIKEY}&timeFrame=day&targetCalories=${targetCalories}`;

        let response = await fetch(URL);

        let meals = await response.json();

        return meals;

    };


    async function getRecipNutri(id) {
        let URL = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${APIKEY}`


        let response = await fetch(URL);

        let info = await response.json();

        return info;



    }


    function getNutri(data, target) {
        let nutrients = data.nutrients;
        for(let nutrient of nutrients) {
            if(nutrient.name == target) return nutrient.amount;
        }

        return null;
    }




    
});


