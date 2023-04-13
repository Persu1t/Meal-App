// Fetching the important html attributes from the DOM
let randomImageHolder = document.querySelector('.random-img-holder')
let randomFoodFavoriteBtn = document.querySelector('#random-food-favorite')
let searchBarValue = document.querySelector('#search-bar');
let serachBtn = document.querySelector('.btn-outline-success')
let recipeTitle = document.querySelector('.modal-title ')
let recipeImage = document.querySelector('#food-img')
let recipeVideo = document.querySelector('#recipe-video')
let foodCategory = document.querySelector('#category-food')
let foodCountry = document.querySelector('#food-country')
let ingredientsList = document.querySelector('#ing-list')
let foodInstructions = document.querySelector('#instructions')
let toggleBtn = document.querySelector('#toggle-btn')
let searchedRecipeDisplay = document.querySelector('#searched-recipe-display')
let favRecipeDisplay = document.querySelector('#fav-recipe-list')

// Adding the event listener to the window when DOM content loads
window.addEventListener('DOMContentLoaded', (event) => {
    fetchRandomFood()
    displayRecipesFromLocal()
})

// Adding the event listener to the model of random food api i.e " Add to favorite button"
randomFoodFavoriteBtn.addEventListener('click', (event) => {
  alert("Please upgrade to the Cookpad+ for this service")
})

// Fetching the food from random food api
function fetchRandomFood (){
   let randomMeal =  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
   randomMeal.then((response)=>{
    return response.json()
   }).then((data)=>{
    displayFoodDetails(data)
   }).catch((error)=>{
    console.log(error)
   })
}

// Displaying the food from the random food api
function displayFoodDetails (data) {
  randomImageHolder.style.backgroundImage = `url("${data.meals[0].strMealThumb}")`
    recipeTitle.innerHTML = data.meals[0].strMeal
    toggleBtn.innerHTML = data.meals[0].strMeal
    const videoUrl = `https://www.youtube.com/embed/${data.meals[0].strYoutube.slice(-11)}`
    recipeVideo.setAttribute("src", videoUrl)
    foodCategory.innerHTML = data.meals[0].strCategory
    foodCountry.innerHTML = data.meals[0].strArea
    for(let i=1; i<= 20; i++){
        let li = document.createElement('li')
        if(data.meals[0][`strIngredient${i}`]){
            
            li.setAttribute("class", "font-color")
            li.innerHTML =`${data.meals[0][`strIngredient${i}`]}, -${data.meals[0][`strMeasure${i}`]}`
            ingredientsList.appendChild(li)
        }
    }
    foodInstructions.innerHTML = data.meals[0].strInstructions

}

// Added the event listener to the search button
serachBtn.addEventListener("click", fetchInputValue)

// Function that is added on the search button
function fetchInputValue(e){
    e.preventDefault()
    let searchedValue = searchBarValue.value
    console.log(searchedValue)
    fetchSearchedFood(searchedValue)
}

// Fetching the food from the api that was ritten in the search box 
function fetchSearchedFood(searchedValue) {
    let searchedMeal = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedValue}`)
    searchedMeal.then((response )=>{
        return response.json()
    } ).then((value)=>{
        if(value.meals == null){
            alert('This meal is not available :(')
        }
        console.log(value)
        displayAllSearchedFood(value)
    }).catch((error)=>{
        console.log( error)
    });
}

// Displaying all the food that has been fetched from the food searching api.
function displayAllSearchedFood(value){
    searchedRecipeDisplay.innerHTML= ""
    value.meals.forEach(meal =>{
        let div = document.createElement('div')
        let ingredientsArray = []
        for(let i=0; i<=20; i++){
            if(meal[`strIngredient${i}`]){
                ingredientsArray.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
            }
        }
        let ingredientsHtml = ingredientsArray.map((ing) => `<li class="font-color">${ing}</li>`).join("")
        div.innerHTML = `<div class="card" style="width: 18rem;" id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button type="button" class="btn btn-primary add-to-favorite">Add to favorite</button>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${meal.idMeal}"
          id="toggle-btn">
          Know more about this
        </button>
        <div class="modal fade" id="staticBackdrop-${meal.idMeal}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
          aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color: black;">${meal.strMeal}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="modal-body-img"><iframe src="https://www.youtube.com/embed/${meal.strYoutube.match(/(?<=v=)[\w-]+/)}" class="recipe-video"></iframe></div>
                <div class="modal-small-headings">
                  <ul id="food-points">
                    <li id="category-food-${meal.idMeal}" class="font-color">${meal.strCategory}</li>
                    <li id="food-country-${meal.idMeal}" class="font-color">${meal.strArea}</li>
                  </ul>
                </div>
                <div class="modal-secondry-points">
                  <ul id="ing-heading">
                    <li class="font-color">Ingredients</li>
                  </ul>
                  <ul id="ing-list-${meal.idMeal}">
                    ${ingredientsHtml}
                  </ul>
                </div>
                <div class="modal-para">
                  <p id="instructions-${meal.idMeal}" class="font-color">
                  ${meal.strInstructions}
                  </p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>`
      searchedRecipeDisplay.appendChild(div)
      })
      //  Adding event listener to the "Add to favorite " button
      document.addEventListener('click', function(event) {
        if (event.target.matches('.add-to-favorite')) {
        //  Here this line of code is making deep copy of the card that was created in the  displayAllSearchedFood(value) function
          let card = event.target.closest('.card').cloneNode(true);
          let cardId = event.target.closest('.card').getAttribute('id')
          addRecipeToFavorite(card, cardId)
          console.log('Add to favorite button clicked!');
        }
      })

}

// This function adds the food  to a array which is saved in the local storage
function addRecipeToFavorite(card, cardId) {
  const favorites = localStorage.getItem("favorites") 
    ? JSON.parse(localStorage.getItem("favorites")) 
    : [];  // --> this line inisialzes an empty array if nothing  found
  let cardVideoUrl = card.querySelector('.recipe-video').src
  let cardRecipeName = card.querySelector('.card-title').innerText
  let cardRecipeCategory = card.querySelector(`#category-food-${cardId}`).innerText
  let cardRecipeCountry = card.querySelector(`#food-country-${cardId}`).innerText
  let instructionsOfRecipe = card.querySelector(`#instructions-${cardId}`).innerText

  let ingredientsList = []
  card.querySelectorAll(`#ing-list-${cardId} li`).forEach((li)=>{
    ingredientsList.push(li.innerText)
  })

  let newRecipes = {
  recipeVideoUrl : cardVideoUrl,
  recipeName: cardRecipeName,
  recipeCategory: cardRecipeCategory,
  recipeCountry: cardRecipeCountry,
  recipeInstructions: instructionsOfRecipe,
  recipeIngredients: ingredientsList
  }

  const isDuplicate = favorites.some(favorite => {
    const favoriteCopy = { ...favorite };
    delete favoriteCopy.id;
    const newRecipeCopy = { ...newRecipes };
    delete newRecipeCopy.id;
    return JSON.stringify(favoriteCopy) === JSON.stringify(newRecipeCopy);
  });
  if (isDuplicate) {
    alert('This recipe already exists in favorites!');
    return;
  }

  const newRecipeWithId = {
    id: Date.now(),
    ...newRecipes
  }
  favorites.push(newRecipeWithId)
  alert("This recipe is added to favorites!");
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayRecipesFromLocal()
}

// This function fetches the recipe object from the array and display it at favorite sections. 
function displayRecipesFromLocal(){
  favRecipeDisplay.innerHTML = ""
  const favorites = JSON.parse(localStorage.getItem("favorites"))
  console.log("favorites from localStorage:", favorites);
  if (favorites) {
    favorites.forEach((recipe) => {
      console.log("recipe to display:", recipe);
      let li = document.createElement('li')
      li.classList.add('card')
      li.innerHTML = `<iframe src="${recipe.recipeVideoUrl}" class="card-img-top" alt="..."></iframe>
      <div class="card-body">
        <h5 class="card-title">${recipe.recipeName}</h5>
        <button type="button" class="btn btn-danger remove-recipe" data-index="${recipe.id}">Remove recipe</button>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${recipe.id}"
          id="toggle-btn">
          Know more about this
        </button>
        <div class="modal fade" id="staticBackdrop-${recipe.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
          aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel" style="color: black;">${recipe.recipeName}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="modal-body-img"><iframe src="${recipe.recipeVideoUrl}" class="recipe-video"></iframe></div>
                <div class="modal-small-headings">
                  <ul id="food-points">
                    <li class="font-color">${recipe.recipeCategory}</li>
                    <li class="font-color">${recipe.recipeCountry}</li>
                  </ul>
                </div>
                <div class="modal-secondry-points">
                  <ul id="ing-heading">
                    <li class="font-color">Ingredients</li>
                  </ul>
                  <ul id="ing-list-${recipe.id}">
                    ${recipe.recipeIngredients.map((ing) => `<li class="font-color">${ing}</li>`).join("")}
                  </ul>
                </div>
                <div class="modal-para">
                  <p class="font-color">
                  ${recipe.recipeInstructions}
                  </p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
        favRecipeDisplay.append(li)
    })
  }else{
    favRecipeDisplay.innerHTML = "<h2>You have no favorite food :(</h2>"
  }

  // Adding the event listener to the Remove recipe button
  favRecipeDisplay.addEventListener('click', (e)=>{
    if(e.target.classList.contains('remove-recipe')){
      const id = parseInt(e.target.dataset.index)
      console.log(id)
      removeRecipe(id)
    }
  })

}

// Remove the recipe  object from the array that is in local storage and update the DOM  to display the recipe
function removeRecipe(id){
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  const index = favorites.findIndex(recipe => recipe.id === id); // Find index based on id
  if (index !== -1) {
    favorites.splice(index, 1); // Remove item at index
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayRecipesFromLocal();
  }
}








