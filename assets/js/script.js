var searchBtnEl = document.querySelector(".search-btn");
var userInputEl = document.querySelector("#user-input");
var resultEl = document.querySelector("#result");
var descriptionEl = document.querySelector("#description");

function activateSearchBtn() {
    var userInput = userInputEl.value;
    console.log(userInput);
    var baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
    var finalUrl = `${baseUrl}?query=${encodeURIComponent(userInput)}&apiKey=4b9fe343ff764f7494d88321c248a6ee`;
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
            for (var i = 0; i < data.results.length; i++) {
                var tag = document.createElement('a');
                tag.setAttribute("href", "#");
                tag.setAttribute("class", "block");
                tag.setAttribute("data-id", data.results[i].id);
                tag.textContent = data.results[i].title;
                console.log(data.results[i].title);
                resultEl.appendChild(tag);
            }
        });
}

resultEl.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("a") === true) {
        var inputId = element.getAttribute("data-id");
        console.log(inputId);
    }
    fetch(`https://api.spoonacular.com/recipes/${inputId}/information?apiKey=4b9fe343ff764f7494d88321c248a6ee`, {
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

            for (var i = 0; i < data.extendedIngredients.length; i++) {
                var ingreLine = document.createElement('p');
                ingreLine.textContent = data.extendedIngredients[i].original;
                descriptionEl.appendChild(ingreLine);
            }
        });
    fetch(`https://api.spoonacular.com/recipes/${inputId}/analyzedInstructions?apiKey=4b9fe343ff764f7494d88321c248a6ee`, {
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

