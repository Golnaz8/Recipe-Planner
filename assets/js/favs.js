var showSavedBtn = document.querySelector("#show-btn");
var favListEl = document.querySelector("#fav-list");
var instractionEl = document.querySelector("#instruction")
var spoonacularKey = "5c3c7f61c1234b6f8841a0292e529a78";



//when user click on show button, it shows all favorite foods on screen
showSavedBtn.addEventListener('click', function () {


    var childNodes = favListEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        favListEl.removeChild(childNode);
    }


    var likedFood = localStorage.getItem('isLiked');
    if (likedFood) {
        var arrayLikedFood = likedFood.split(',');
        console.log(typeof arrayLikedFood);

        for (var i = 0; i < arrayLikedFood.length; i++) {
            var userInput = arrayLikedFood[i];
            console.log(userInput);
            fetch(`https://api.spoonacular.com/recipes/${arrayLikedFood[i]}/information?apiKey=${spoonacularKey}`, {
                method: 'GET',
                credentials: 'same-origin',
                redirect: 'follow',
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    console.log(data.title);

                    var recipeDiv = document.createElement("div");
                    recipeDiv.setAttribute("class", "recipe-card image-container");
                    recipeDiv.setAttribute("id", "custom-container");
                    var img = document.createElement('img');
                    var source = data.image;
                    img.setAttribute("src", source);
                    recipeDiv.appendChild(img);
                    var tag = document.createElement('a');
                    tag.setAttribute("href", "#modal1");	
                    tag.setAttribute("class", "btn modal-trigger");
                    //----------------------------------------------------
                    tag.setAttribute("data-id", data.id);
                    //----------------------------------------------------
                    tag.textContent = data.title;
                    recipeDiv.appendChild(tag);
                    favListEl.appendChild(recipeDiv);
                });
        }
    } else {
        return;
    }


});



favListEl.addEventListener("click", function (event) {

    var childNodes = instractionEl.childNodes;

    for (var i = childNodes.length - 1; i >= 0; i--) {
        var childNode = childNodes[i];
        instractionEl.removeChild(childNode);
    }

    var element = event.target;

    if (element.matches("a") === true) {
        var inputId = element.getAttribute("data-id");
        console.log(inputId);
    } else {
        return;
    }
    fetch(`https://api.spoonacular.com/recipes/${inputId}/information?apiKey=${spoonacularKey}`, {
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
                instractionEl.appendChild(ingreLine);
            }
        })
        .then(function(calories){
            fetch(`https://api.spoonacular.com/recipes/${inputId}/analyzedInstructions?apiKey=${spoonacularKey}`, {
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
                instractionEl.appendChild(descLine);
            }
        });
    
        });

});

// Initialize the modal
document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    // Add event listeners to the dropdown triggers
    var dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var cuisine = this.id;
            fetchAndDisplayContent("#description-" + cuisine);
        });
    });

    // Add event listeners to the recipe names
    var recipeNames = document.querySelectorAll('.recipe-name');
    recipeNames.forEach(function (name) {
        name.addEventListener('click', function () {
            var description = this.getAttribute('data-description');
            displayModalDescription(description);
        });
    });
});

// Function to fetch HTML tag content and display it in a modal
function fetchAndDisplayContent(tagId) {
    var tagElement = document.querySelector(tagId);
    if (tagElement) {
        var content = tagElement.innerHTML;
        // Display the content in a modal
        var modal = M.Modal.getInstance(document.querySelector('#modal1'));
        modal.open();
        var modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = content;
    }
}

// Function to display the description in the modal
function displayModalDescription(description) {
    // Display the description in a modal
    var modal = M.Modal.getInstance(document.querySelector('#modal1'));
    modal.open();
    var modalDescription = document.querySelector('#modal-description');
    modalDescription.textContent = description;
}
