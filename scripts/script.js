/**
 * Data of country names and continents comes from github repo "country-json" 
 * GitHub repo is linked here: https://github.com/samayo/country-json
 * 
 * Data of country names, iso codes, and flag images comes from flagpedia API: https://flagpedia.net/
 * Flag images come from this url template: https://flagcdn.com/256x192/${country_abbreviation}.png
 * where ${country_abbreviation} is the abbreviation for a country
 * All flag images are under the public domain
 * */

(function() {
    "use strict";

    var countryContinent;
    var countryCodes;

    /* country names, iso codes and flags from flagpedia API: https://flagpedia.net/ */
    fetch("https://flagcdn.com/en/codes.json")
    .then(response => response.json())
    .then(data => countryCodes = swapObject(data))
    .catch(error => alert(error));

    /* Array of country objects from github repo country-json: https://github.com/samayo/country-json */
    fetch("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json")
    .then(response => response.json())
    .then(data => countryContinent = data)
    .catch(error => alert(error));
    
    window.onload = function() {

        /* event listener for play button */
        document.getElementById("start-btn").addEventListener("click", function() {
            toggleView();

            /*  Getting random array of the coutries to be quizzed on */
            let countries = getCountries(countryContinent);
            shuffle(countries)
            console.log(countries)

            /* Generating Anwsers for the countries */
            generateAnswers(countries);

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

    /**
     * Generates quiz answers
     * @param {array} countries - array of countries to generate anwsers for
     */
    function generateAnswers(array) {
        let bank = document.getElementById("answer-bank")

        for(let i = 0; i < array.length; i++) {
            let btn = document.createElement("button");
            btn.innerText = array[i].country

            btn.addEventListener("click", function() {
                console.log(btn.innerText)
                btn.remove();
            }); // gives button event listener

            bank.appendChild(btn)
        }

    }

    async function game(countries) {
        const roundUI = document.getElementById("round");
        let rounds = countries.length
        let anwsers = [];

        for(let i = 0; i < rounds; i++) {

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

    function generateFlag(ary) {
        let rand = Math.floor(Math.random() * 4) // number between [0, 3]
        let correct_country = ary[rand] // selects first element from array

        let flag = document.getElementById("flag-image")
        flag.src = `https://flagcdn.com/256x192/${correct_country}.png`

        return correct_country;
    }

    /**
     * Swaps the key value pairs of an object
     * This is used only at the beginning of loading the website
     * @param {Object} countries - an object
     * @returns {Object}
     */
    function swapObject(object) {
        let temp = {};
        Object.entries(object).forEach(pair => {
            let value = pair[0]
            let property = pair[1];
                
            temp[property] = value;
        });
    
        return temp;
    }

    function toggleView() {
        document.getElementById("menu-view").classList.toggle("hidden")
        document.getElementById("game-view").classList.toggle("hidden")
    }
})();