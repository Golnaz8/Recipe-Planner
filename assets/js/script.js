var searchBtnEl = document.querySelector(".search-btn");
var userInputEl = document.querySelector("#user-input");
var resultEl = document.querySelector("#result");
var descriptionEl = document.querySelector("#description");
var britishBreakfastEl = document.querySelector("#british-brkfst");
var breakfastEl = document.querySelector("#dropdown1");
var mainCourseEl = document.querySelector("#dropdown2");
var sideDishEl = document.querySelector("#dropdown3");
var dessertEl = document.querySelector("#dropdown4");
var favFoodsEl = document.querySelector("#fav-food");
var heroImageEl = document.querySelector("#hero-image");

var allLiked = [];


// This creates the image and heading elements for a recipe
// and the div that is the "recipe card". 
// It returns the parent div.
function makeRecipeCard(recipe) {
    console.log(recipe)
    var recipeDiv = document.createElement("div");
    recipeDiv.setAttribute("class", "recipe-card image-container");
    recipeDiv.setAttribute("id", "custom-container");
    var img = document.createElement('img');
    var source = recipe.image;
    img.setAttribute("src", source);
    var favIcon = document.createElement('i');
    favIcon.setAttribute("class", "material-icons favorite-icon");
    favIcon.setAttribute("data-id", recipe.id);
    favIcon.textContent = "favorite_border";
    recipeDiv.appendChild(img);
    recipeDiv.appendChild(favIcon);
    var tag = document.createElement('a');
    tag.setAttribute("href", "#");
    tag.setAttribute("data-id", recipe.id);
    tag.textContent = recipe.title;
    console.log(recipe.title);
    
    recipeDiv.appendChild(tag);
    return recipeDiv;
}

//this function takes user inpute and fetch up tp 10 kind of food which user wants to search
function activateSearchBtn() {
    
    //first delete previous serch result
    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        resultEl.removeChild(childNode);
    }


    var userInput = userInputEl.value;
    userInputEl.value = " ";

    if (userInput) {
        console.log(userInput);
        var baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
        var finalUrl = `${baseUrl}?query=${encodeURIComponent(userInput)}&apiKey=96dedef6d4244eee817b8f5cc4b3179f`;
        fetch(finalUrl, {
            method: 'GET',
            credentials: 'same-origin',
            redirect: 'follow',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data.results.length);
                heroImageEl.remove();
                for (var i = 0; i < data.results.length; i++) {
                    var card = makeRecipeCard(data.results[i]);
                    resultEl.appendChild(card);
                }
            });
    

    }else {
        return;
    }


}

//this function fetch ingredients and instruction of the food which user selects 
//also calls computeCalories function to calculate calories of the food 
resultEl.addEventListener("click", function (event) {
    var childNodes = descriptionEl.childNodes;

    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }

    var element = event.target;

    if (element.matches("a") === true) {
        var inputId = element.getAttribute("data-id");
        console.log(inputId);
    }else {
        return;
    }
    fetch(`https://api.spoonacular.com/recipes/${inputId}/information?apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.extendedIngredients.length);

            computeCalories(data);
        });
    fetch(`https://api.spoonacular.com/recipes/${inputId}/analyzedInstructions?apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data[0].steps.length);
            for (var i = 0; i < data[0].steps.length; i++) {
                var descLine = document.createElement('span');
                descLine.textContent = data[0].steps[i].step;
                descriptionEl.appendChild(descLine);
            }
        });

});

searchBtnEl.addEventListener('click', activateSearchBtn);

// ----- Queen Start

// CalorieNinjas API
var calorieNinjasKey = "t1JgrLUNfPPtvjjAKrN40A==YNBpxRyU6VgWySYh";
var calorieNinjasUrl = "https://api.calorieninjas.com/v1/nutrition";

var totalCalories = 0;

function getNutritionPromise(item, caloriesHeading) {
    // Some recipes use fractions e.g. "1/4", so make sure 
    // this will be computed in calorie count.
    var queryText = item.original;
    var fraction = 1.0;
    if (item.amount < 1) {
        fraction = item.amount;
        queryText = `1 ${item.unit} ${item.originalName}`;
    }
    // Some recipes use cup for solid ingredients which produces a wrong calorie figure
    // but we can convert to ounces (oz). Also handles fractional cups (e.g. "1/4").
    if (item.unit == "cup" || item.unit == "cups") {
        fraction = 8 * item.amount;
        queryText = `1 oz ${item.originalName}`;
    }

    queryText = queryText.replace(" ml", "ml").replace(" gr.", "g");

    return fetch(`${calorieNinjasUrl}?query=${queryText}`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
        headers: {
            "X-Api-Key": calorieNinjasKey
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var calories = 0;
            if (data.items.length > 0) {
                // Some ingredients are "to taste" or do not have a quantity; skip these in our total.
                // (e.g. "salt and pepper to taste")
                if (item.unit !== "servings" && item.unit !== "serving") {
                    calories = data.items[0].calories * fraction;
                    totalCalories = totalCalories + calories;
                }

                caloriesHeading.textContent = `${Math.round(totalCalories)} Calories total`;
            }
            console.log(`${item.original}  Calories: ${calories}  (${item.unit})`)
            return calories;
        });
}

function computeCalories(data) {
    totalCalories = 0;

    // Add up calories for each ingredient
    // and display on page in a heading
    var caloriesHeading = document.createElement('h3');
    descriptionEl.appendChild(caloriesHeading);

    for (var i = 0; i < data.extendedIngredients.length; i++) {
        var ingreLine = document.createElement('p');
        ingreLine.textContent = data.extendedIngredients[i].original;
        descriptionEl.appendChild(ingreLine);

        getNutritionPromise(data.extendedIngredients[i], caloriesHeading)
            .then(calories => {
                ;
            });
    }
}


//--------Golnaz added these--------


//even listener for navbar dropdown
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);
});
// document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.collapsible');
//     var instances = M.Collapsible.init(elems);
// });


//evenlistener for each of five different type of breakfast in navbar
//when user select each of them this function fetch 10 different food of that and shows on screen
breakfastEl.addEventListener("click", function (event) {

    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        resultEl.removeChild(childNode);
    }


    var element = event.target;
    if (element.matches("a") === true) {
        var inputId = element.getAttribute("id");
        console.log(inputId);
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${inputId}&type=breakfast&number=10&apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(data => {
            heroImageEl.remove();
            for (var i = 0; i < data.results.length; i++) {
                var card = makeRecipeCard(data.results[i]);
                resultEl.appendChild(card);
            }
        });

});


//evenlistener for each of five different type of main course in navbar
//when user select each of them this function fetch 10 different food of that and shows on screen
mainCourseEl.addEventListener("click", function (event) {

    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        resultEl.removeChild(childNode);
    }


    var element = event.target;
    if (element.matches("a") === true) {
        var inputId = element.getAttribute("id");
        console.log(inputId);
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${inputId}&type=main course&number=10&apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results.length);
            heroImageEl.remove();
            for (var i = 0; i < data.results.length; i++) {
                var card = makeRecipeCard(data.results[i]);
                resultEl.appendChild(card);
            }
        });

});


//evenlistener for each of five different type of side dish in navbar
//when user select each of them this function fetch 10 different food of that and shows on screen
sideDishEl.addEventListener("click", function (event) {

    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        resultEl.removeChild(childNode);
    }


    var element = event.target;
    if (element.matches("a") === true) {
        var inputId = element.getAttribute("id");
        console.log(inputId);
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${inputId}&type=side dish&number=10&apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results.length);
            heroImageEl.remove();
            for (var i = 0; i < data.results.length; i++) {
                var card = makeRecipeCard(data.results[i]);
                resultEl.appendChild(card);
            }
        });

});


//evenlistener for each of five different type of desserts in navbar
//when user select each of them this function fetch 10 different food of that and shows on screen
dessertEl.addEventListener("click", function (event) {

    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        resultEl.removeChild(childNode);
    }


    var element = event.target;
    if (element.matches("a") === true) {
        var inputId = element.getAttribute("id");
        console.log(inputId);
    }

    fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${inputId}&type=dessert&number=10&apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results.length);
            heroImageEl.remove();
            for (var i = 0; i < data.results.length; i++) {
                var card = makeRecipeCard(data.results[i]);
                resultEl.appendChild(card);
            }
        });

});


//when user click on heart of each food, it saves that isliked food in local storage
// and change the empty heart to full heart as an isliked
resultEl.addEventListener('click', function (event) {

    var isLikedFood = localStorage.getItem("isLiked");
    if (isLikedFood) {
      allLiked = isLikedFood.split(',');
      console.log(allLiked);
    }
  
    var element = event.target;

    if (element.matches("i") === true) {
        var inputId = element.getAttribute("data-id");
        element.textContent = "favorite";
        console.log(inputId);
    } else {
        return;
    }
    localStorage.setItem('isLiked', inputId);
    allLikedRender();

});



function allLikedRender() {

    var likedFood = localStorage.getItem('isLiked');
    var arrayLikedFood = likedFood.split(',');

    var difference = arrayLikedFood.slice(-1);
    var differ = difference[0];
    var check = allLiked.includes(differ);

    console.log(difference);
    console.log(differ);
    console.log(check);
    if (!check) {
        allLiked.push(differ);
        console.log(allLiked);
    }

    //update local storage
    var stringAllLiked = allLiked.join(',');
    localStorage.setItem("isLiked", stringAllLiked);
}

//when user click on favorite food button, it shows the other html page
favFoodsEl.addEventListener("click", function() {
  window.location.href = "favs.html";
});
