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
    var choice;
    var correct;

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
            console.log(countryContinent)

            /*  Getting random array of the coutries to be quizzed on */
            let selectedCountries = getCountries(countryContinent);

            /* Generating Anwsers for the countries */
            generateButtons(selectedCountries);

            /* Shuffles countries */
            shuffle(selectedCountries)
            console.log(selectedCountries)

            setTimeout(() => {
                game(selectedCountries);
            }, 1000);
        })
    }

    /**
     * Starts the game, iterating through the flags to quiz the player
     * @param {array} countries - array of countries to generate anwsers for
     */
    async function game(countries) {
        const roundUI = document.getElementById("round");
        let rounds = countries.length
        let score = [];

        for(let i = 0; i < rounds; i++) {
            correct = countries[i].country // current country name
            displayFlag(correct);
            roundUI.innerText = `Round: ${i+1} / ${rounds}`
            roundUI.className = "";
            
            let answer = await round();
            console.log(`The user chose: ${answer}`);

            if(correct == answer) { // user chooses correct answer
                console.log("Correct!");
                score.push(1);
            }
            else { // user chooses wrong answer
                console.log("Wrong");
                score.push(0);
            }
            console.log(score)
        }
    }

    /**
     * Does something if the user selects the correct answer
     * @param {Element} ui - DOM element that updates
     */
    async function isCorrect() {
        const roundUI = document.getElementById("round");
        roundUI
        roundUI.innerText = "Correct!"        
    }

    /**
     * Does something if the user selects the worng answer
     * @param {Element} ui - DOM element that updates
     */
    function isWrong(ui) {
        const roundUI = document.getElementById("round");
        roundUI.innerText = "Correct!"   

    }

    /**
     * Waits for user to select click on answer button, activiting the "click" event and calling buttonClick() function
     * 
     */
    async function round() {  
        return new Promise(resolve => {

            var timerid = setInterval(() => {
                if(choice != null) {
                    clearInterval(timerid);

                    /* wait two seconds until going to next round */
                    setTimeout(() => {
                        resolve(choice);
                        choice = null;
                    }, 2000);
                }
            }, 100); 
        })
    }

    /**
     * Generates quiz buttons 
     * @param {array} array - array of countries to generate anwsers for
     */
    function generateButtons(array) {
        let wordBank = document.getElementById("answer-bank")

        for(let i = 0; i < array.length; i++) {
            let btn = document.createElement("button");
            btn.innerText = array[i].country
            btn.classList.add("button")
            btn.addEventListener("click", buttonClick)
            wordBank.appendChild(btn)
        }
        console.log(document.querySelectorAll(".button"))
    }

    /**
     * Event listener for the answer buttons that will be generated. Assigns the country
     * name of the corresponding button to to the global variable choice, and removes itself
     */
    function buttonClick() {
        choice = this.innerText;
        checkAnswer()
    }

    function checkAnswer() {
        const roundUI = document.getElementById("round");

        if(choice == correct) {
            roundUI.classList.add("correct")
            console.log(roundUI)
            roundUI.innerText = "Correct!"  
        } else {
            roundUI.classList.add("incorrect")
            roundUI.innerText = "Incorrect!"  
        }
    }

    /**
     * Takes a country object, finds it abbreviation and displays it's flag
     * @param {string} countryName - a country object
     */
    function displayFlag(countryName) {
        let flag = document.getElementById("flag-image")
        let abbreviation = (countryCodes[countryName])

        /* special case */
        if(abbreviation == undefined) {
            console.log("SPECIAL CASE")
        }

        console.log(`The correct country is: ${countryName} (${abbreviation})`)
        flag.src = `https://flagcdn.com/256x192/${abbreviation}.png`
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