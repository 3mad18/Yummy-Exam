let myData = document.getElementById("myData");
let data = [];

function closeSideNav() {
    $('.side-nav-menu').removeClass('open');
    $('#navHeader').removeClass('right');
    $('#sidebarToggle').removeClass('fa-xmark').addClass('fa-align-justify');
}



// Loading...//


document.addEventListener("DOMContentLoaded", function () {
    $('#sidebarToggle').on('click', function () {
        let sidebar = $('.side-nav-menu');
        let navHeader = $('#navHeader');
        sidebar.toggleClass('open');
        navHeader.toggleClass('right');
        $(this).toggleClass('fa-align-justify fa-xmark');
    });

    $('.loader').fadeOut(1000, function () {
        $('.loading').fadeOut(500, function () {
            $('body').css('overflow', 'auto');
        });
    });





    // get Product on load



    function fetchProductsOnLoad() {
        let myHttp = new XMLHttpRequest();
        myHttp.open('GET', "https://www.themealdb.com/api/json/v1/1/search.php?s=");
        myHttp.send();
        myHttp.addEventListener("readystatechange", function () {
            if (myHttp.readyState == 4 && myHttp.status == 200) {
                let data = JSON.parse(myHttp.response).meals;
                displayMeals(data);
            }
        });
    }

    fetchProductsOnLoad();
});


async function showMealDetails(mealId) {
    myData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        response = await response.json();

        if (response.meals && response.meals.length > 0) {
            const meal = response.meals[0];
            myData.innerHTML = `
                <div class="meal-details text-white d-flex">
                    <div class="col-md-4 me-3">
                        <h2>${meal.strMeal}</h2>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100 rounded-3">
                    </div>
                    <div class="col-md-8">
                        <h3>Instructions:</h3>
                        <p>${meal.strInstructions}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            ${Object.keys(meal).filter(key => key.startsWith('strIngredient') && meal[key]).map(key => `<li>${meal[key]}</li>`).join('')}
                        </ul>
                       <h3>Tags:</h3>
                        <p>${meal.strTags ? meal.strTags.split(',').map(tag => `<span class="badge bg-primary me-1">${tag.trim()}</span>`).join(' ') : 'No tags available.'}</p>
                    <h3>Source:</h3>
                        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                        </div>
                </div>`;
        } else {
            myData.innerHTML = '<p>No meal details found.</p>';
        }
    } catch (error) {
        console.error('Error fetching meal details:', error);
        myData.innerHTML = '<p>Error fetching meal details. Please try again.</p>';
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}


// Categories




function fetchCategories() {
    let myHttp = new XMLHttpRequest();
    myHttp.open('GET', "https://www.themealdb.com/api/json/v1/1/categories.php");
    myHttp.send();
    myHttp.addEventListener("readystatechange", function () {
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            data = JSON.parse(myHttp.response).categories;
            displayCategories();
        }
    });
}

// Get categories Meals



async function getCategoryMeals(category) {
    myData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        response = await response.json();

        if (response.meals && response.meals.length > 0) {
            displayMeals(response.meals.slice(0, 20));
        } else {
            myData.innerHTML = '<p>No meals found in this category.</p>';
        }
    } catch (error) {
        console.error('Error fetching category meals:', error);
        myData.innerHTML = '<p>Error fetching meals. Please try again.</p>';
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}




// Display Category




function displayCategories() {
    if (!myData) return;
    let cartona = '';
    for (let i = 0; i < data.length; i++) {
        cartona += `
            <div class="col-md-3 justify-content-center d-flex">
                <div onclick="getCategoryMeals('${data[i].strCategory}')" class="image-container rounded-3 cursor-pointer">
                    <img src="${data[i].strCategoryThumb}" alt="${data[i].strCategory}">
                    <div class="overlay">
                        <h1><strong>${data[i].strCategory}</strong></h1>
                        <p>${data[i].strCategoryDescription || 'No description available'}</p>
                    </div>
                </div>
            </div>`;
    }
    myData.innerHTML = cartona;
}




// Areas




function getArea() {
    closeSideNav();
    let myHttp = new XMLHttpRequest();
    myHttp.open('GET', "https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    myHttp.send();
    myHttp.addEventListener("readystatechange", function () {
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            data = JSON.parse(myHttp.response).meals;
            displayArea();
        }
    });
}

// Display Area  





function displayArea() {
    if (!myData || !data) return;
    let cartoona = "";
    for (let i = 0; i < data.length; i++) {
        cartoona += `
        <div class="col-md-3 text-white border-2">
            <div onclick="getAreaMeals('${data[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${data[i].strArea}</h3>
            </div>
        </div>`;
    }
    myData.innerHTML = cartoona;
}



//    Get Area Meals




async function getAreaMeals(area) {
    myData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        response = await response.json();

        if (response.meals && response.meals.length > 0) {
            displayMeals(response.meals.slice(0, 20));
        } else {
            myData.innerHTML = '<p>No meals found for this area.</p>';
        }
    } catch (error) {
        console.error('Error fetching area meals:', error);
        myData.innerHTML = '<p>Error fetching meals. Please try again.</p>';
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}


// Ingredients


function getIngredients() {
    closeSideNav();
    let myHttp = new XMLHttpRequest();
    myHttp.open('GET', "https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    myHttp.send();
    myHttp.addEventListener("readystatechange", function () {
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            let response = JSON.parse(myHttp.response);
            if (response.meals && response.meals.length > 0) {
                data = response.meals;
                displayIngredients();
            } else {
                myData.innerHTML = '<p>No ingredients found.</p>';
            }
        }
    });
}


//  Display Ingredients


function displayIngredients() {
    if (!myData) return;
    if (!data || data.length === 0) {
        myData.innerHTML = '<p>No ingredients available.</p>';
        return;
    }

    let cartoona = '';

    for (let i = 0; i < data.length; i++) {
        cartoona += `
            <div class="col-md-3 text-white">
                <div onclick="getIngredientsMeals('${data[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${data[i].strIngredient}</h3>
                    <p>${data[i].strDescription ? data[i].strDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
                </div>
            </div>`;
    }

    myData.innerHTML = cartoona;
}



/// Get Ingredients Meals

function getIngredientsMeals(ingredient) {
    closeSideNav();
    let myHttp = new XMLHttpRequest();
    myHttp.open('GET', `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    myHttp.send();
    myHttp.addEventListener("readystatechange", function () {
        if (myHttp.readyState == 4 && myHttp.status == 200) {
            let data = JSON.parse(myHttp.response).meals;
            displayMeals(data);
        }
    });
}




//Search

function showSearchInputs() {
    let searchContainer = document.getElementById("searchContainer");
    if (!searchContainer) return;
    searchContainer.innerHTML = `
        <div class="row py-4">
            <div class="col-md-6">
                <h3 class="text-white">Search By Name</h3>
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent bg-danger text-white" type="text">
            </div>
            <div class="col-md-6">
                <h3 class="text-white">Search By First Letter</h3>
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text">
            </div>
        </div>`;
    myData.innerHTML = "";
}


// Search By Name

async function searchByName(term) {
    closeSideNav()
    myData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}


// Search By First Letter


async function searchByFLetter(term) {
    closeSideNav()
    myData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}


function displayMeals(meals) {
    if (!myData) return;
    console.log('Displaying meals:', meals);

    let cartona = '';
    for (let i = 0; i < meals.length; i++) {
        cartona += `
            <div class="col-md-3">
                <div class="image-container mb-3 rounded-3" onclick="showMealDetails('${meals[i].idMeal}')">
                    <img src="${meals[i].strMealThumb}" class="card-img-top" alt="${meals[i].strMeal}">
                    <div class="overlay">
                        <h2 class="card-title"><strong>${meals[i].strMeal}</strong></h2>
                    </div>
                </div>
            </div>`;
    }
    myData.innerHTML = cartona;
}

//   Contacts

function showContacts() {
    myData.innerHTML = `
    <div class="contact  d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="validateInput('name')" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100  d-none">Enter Valid Name</div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="validateInput('email')" type="email" class="form-control" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *example@yyy.zzz</div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="validateInput('phone')" type="text" class="form-control" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="validateInput('age')" type="number" class="form-control" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" onkeyup="validateInput('password')" type="password" class="form-control" placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Password contain only numbers at least 8*</div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" onkeyup="validateInput('repassword')" type="password" class="form-control" placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Passwords do not match</div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>`;

    document.getElementById("submitBtn").addEventListener("click", submitForm);
}


//   Validation functions

function validateInput(type) {
    let inputField = document.getElementById(`${type}Input`);
    let alertField = document.getElementById(`${type}Alert`);
    let isValid = false;

    switch (type) {
        case 'name':
            isValid = /^[a-zA-Z\s]{5,8}$/.test(inputField.value);
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputField.value);
            break;
        case 'phone':
            isValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(inputField.value);
            break;
        case 'age':
            isValid = /^(0?[1-9]|[1-9][0-9]|1[01][0-9]|120)$/.test(inputField.value);
            break;
        case 'password':
            isValid = /^\d{8,}$/.test(inputField.value);
            break;
        case 'repassword':
            isValid = inputField.value === document.getElementById("passwordInput").value;
            break;
    }

    alertField.classList.toggle("d-none", isValid);
    toggleSubmitButton();
}

function toggleSubmitButton() {
    const allValid = ['name', 'email', 'phone', 'age', 'password', 'repassword'].every(type => {
        return !document.getElementById(`${type}Alert`).classList.contains("d-block");
    });
    document.getElementById("submitBtn").disabled = !allValid;
}

function submitForm() {

    alert("Form submitted successfully!");



}