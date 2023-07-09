var showSavedBtn = document.querySelector("#show-btn");

showSavedBtn.addEventListener('click', function(){

    var likedFood = localStorage.getItem('isLiked');
    var arrayLikedFood = likedFood.split(',');
    console.log(arrayLikedFood);

    for(var i=0; i<arrayLikedFood.length; i++){
        var userInput = arrayLikedFood[i];
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
              
            });
    }
 

});  