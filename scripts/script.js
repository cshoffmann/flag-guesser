(function() {
    "use strict";

    // countries from flagpedia API: https://flagpedia.net/
    var COUNTRIES;
    var country_codes;

    fetch("https://flagcdn.com/en/codes.json")
        .then(response => response.json())
        .then(data => COUNTRIES = data)
        .then(data => console.log(data))    // delete later
        .then(() => country_codes = Object.keys(COUNTRIES))
        .then(data => console.log(data))    // delete later
        .catch(error => alert(error))

    
    window.onload = function() {
        const start = document.getElementById("start-btn");

        start.addEventListener("click", function() {
            toggleView(); // switches to game-view

            setTimeout(() => {
                game();
            }, 1000);
        })
    }

    async function game() {
        const timeUI = document.getElementById("time");
        let rounds = document.getElementById("drop-down").value
        let anwsers = [];

        for(let i = 0; i < rounds; i++) {
            let countries = randomCountries(); // gets four random countries
            console.log(countries);

            let correct = generateFlag(countries); // picks the country to generate flag and returns correct country name
            console.log("The correct country is: " + COUNTRIES[correct] + " (country code = " + correct +")")

            generateButtons(countries, correct); // creates four buttons based off of randomCountries() and generateFlat()
            timeUI.innerText = `Round ${i+1}`

            let anwser = await countDown();
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
    async function countDown() {
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

/*                 if(duration < 10) { // changes color of the timer ui to red
                    timeUI.classList.add("quick")
                }
                if(duration == 0) {
                    clearInterval(timerid);
                    
                    setTimeout(() => {
                        resolve(0);
                        timeUI.classList.remove("quick")
                    }, 1000); 
                } */
                if(choice != null) {
                    clearInterval(timerid);
                    resolve(choice);
                }
            }, 1000);
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

            btn.textContent = COUNTRIES[country];
            input.appendChild(btn);
        }
    }

    function toggleView() {
        document.getElementById("menu-view").classList.toggle("hidden")
        document.getElementById("game-view").classList.toggle("hidden")
    }
})();