(function() {
    "use strict";

    var worldCountries;
    var countryCodes;

    /* country names, iso codes and flags from flagpedia API: https://flagpedia.net/ */
    fetch("https://flagcdn.com/en/codes.json")
    .then(response => response.json())
    .then(data => countryCodes = data)
    .catch(error => alert(error));

    /* Array of country objects from github repo country-json: https://github.com/samayo/country-json */
    fetch("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json")
    .then(response => response.json())
    .then(data => worldCountries = data)
    .catch(error => alert(error));
    
    window.onload = function() {

        /* event listener for play button */
        document.getElementById("start-btn").addEventListener("click", function() {
            toggleView();
            let countries = getCountries(worldCountries);
            shuffle(countries) // shuffles countries
            console.log(countries)
            

            setTimeout(() => {
                /* game(); */
            }, 1000);
        })
    }
    
    /**
     * Returns a filtered array of countries based on continent (user input from #drop-down.value)
     * @param {array} countries - array of countries
     * @returns {array}
     */
    function getCountries(array) {
        let region = document.getElementById("drop-down").value;
        let temp = [];
        temp = array.filter(country => country.continent == region); // will use filter to get countries of a region
        
        return temp;
    }

    /**
     * Randomizes order of elements in an array. 
     * Based off of Durstenfeld shuffle algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
     * @param {array} array - any array
     */
    function shuffle(array) {
        for(let i = array.length-1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    async function game() {
        const roundUI = document.getElementById("round");
        let rounds = document.getElementById("drop-down").value
        let anwsers = [];

        for(let i = 0; i < rounds; i++) {
            let countries = randomCountries(); // gets four random countries
            console.log(countries);

            let correct = generateFlag(countries); // picks the country to generate flag and returns correct country name
            console.log("The correct country is: " + countryCodes[correct] + " (country code = " + correct +")")

            generateButtons(countries, correct); // creates four buttons based off of randomCountries() and generateFlat()
            roundUI.innerText = `Round ${i+1}`

            let anwser = await round();
            console.log("anwser: "+anwser);
            anwsers.push(anwser)

        }
        console.log(anwsers)

        // tells the user how many flags they got correct at the end
        let correct = 0
        for(let i = 0; i < anwsers.length; i++) {
            if(anwsers[i] == 1) {
                correct++;
            }
        }
        alert("You got "+correct+" out of "+anwsers.length+" flags correct")
        toggleView();
    }

    // starts the timer from 10 seconds
    async function round() {
        // add event listeners for buttons 
        let btns = document.querySelectorAll(".btn")
        var choice = null;

        btns.forEach(element => { // event listeners for buttons
            element.addEventListener("click", function() {
                choice = this.value 
            })
        });

        return new Promise(resolve => {
            var timerid = setInterval(() => {
                if(choice != null) {
                    clearInterval(timerid);
                    resolve(choice);
                }
            }, 500);
        })
    }

    function randomCountries() {
        let temp = [];

        for(let i = 0; i < 4; i++) {
            let rand = Math.floor(Math.random() * country_codes.length);
            let random_country = country_codes[rand];
            temp.push(random_country);

            // makes sure all countries in temp[] are unique
            for(let x = 0; x < temp.length; x++) { 
                if(random_country == temp[x-1]) {
                    temp.pop(random_country);
                    i--;
                    break;
                }
            }
        }
        return temp
    }

    function generateFlag(ary) {
        let rand = Math.floor(Math.random() * 4) // number between [0, 3]
        let correct_country = ary[rand] // selects first element from array

        let flag = document.getElementById("flag-image")
        flag.src = `https://flagcdn.com/256x192/${correct_country}.png`

        return correct_country;
    }

    // generates the four choice buttons
    function generateButtons(country_array, correct_country) {
        const input = document.getElementById("user-input");
        input.textContent = "" // clears any previous buttons

        for(let i = 0; i < country_array.length; i++) {
            let country = country_array[i];
            let btn = document.createElement("button");
            btn.classList.add("btn")

            if(country == correct_country) {
                btn.value = 1; // indicates correct anwser
            } else {
                btn.value = 0; // indicates wrong anwser
            }

            btn.textContent = countryCodes[country];
            input.appendChild(btn);
        }
    }

    function toggleView() {
        document.getElementById("menu-view").classList.toggle("hidden")
        document.getElementById("game-view").classList.toggle("hidden")
    }
})();