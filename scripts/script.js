// DOM elements
const header = document.getElementById('header')
const headerColorCode = document.getElementById('header-color-code')
const guessResult = document.getElementById('guess-result')
const scoreSpan = document.getElementById('score')
const easyButton = document.getElementById('easy-button')
const hardButton = document.getElementById('hard-button')
const boxesContainer = document.getElementById('boxes-container')
const colorBoxes = document.getElementsByClassName('color-boxes')



// Global variables
let chosenRandomBoxNr, chosenRandomColor
let correctBoxText
let currentDifficulty = 'EASY'
const attemptsByDifficulty = {'EASY': 1, 'HARD': 2}
let attemptsLeft = attemptsByDifficulty[currentDifficulty]
let isGuessReactionRunning = false

if (!localStorage.getItem('score')) {localStorage.setItem('score', 0)}




// Event listeners
hardButton.addEventListener('click', difficultySelector)
easyButton.addEventListener('click', difficultySelector)
for (let box of colorBoxes) {
    box.addEventListener('click', confirmGuess)
    box.addEventListener('contextmenu', confirmGuess)
}



// Functions
function generateRandomColor() {
    // Generate a string with a random RGB code for use in CSS
    let randomRed = Math.floor(Math.random() * 256)
    let randomGreen = Math.floor(Math.random() * 256)
    let randomBlue = Math.floor(Math.random() * 256)
    let randomRGBString = `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`
    return randomRGBString
}

function assignRandomColors() {
    // Choose a random number between 0 and 3 for the chosen (correct) box index;
    // choose a random color and write its code in the site's header
    chosenRandomBoxNr = Math.floor(Math.random() * colorBoxes.length)
    chosenRandomColor = generateRandomColor()
    header.style.backgroundColor = 'rgb(70, 130, 180)'
    headerColorCode.style.display = 'block'
    headerColorCode.textContent = chosenRandomColor.toUpperCase()
    
    // Loop through the boxes and assign the colors
    for (let index in colorBoxes) {
        if (index.length == 1) {
            if (index == chosenRandomBoxNr) {
                colorBoxes[index].style.backgroundColor = chosenRandomColor
            } else {
                colorBoxes[index].style.backgroundColor = generateRandomColor()
            }
            colorBoxes[index].classList.remove('color-boxes-hidden')
        }
    }

    // Update the score span text and reset attempts left
    scoreSpan.textContent = Number(localStorage.getItem('score'))
    attemptsLeft = attemptsByDifficulty[currentDifficulty]
}

function confirmGuess(event) {
    event.preventDefault()
    // Briefly shows the guess result on the selected box; updates the score and
    // the remaining attempts; if no attempts left, shows the correct box and 
    // and resets the game; blocks any clicks on boxes while reactions are running
    let guessResultText = event.target.children[0]
    if (isGuessReactionRunning) {
        // pass
    } else {
        //CORRECT CASE
        if (event.target.style.backgroundColor == chosenRandomColor) {         
                isGuessReactionRunning = true     
                guessResultText.classList.toggle('guess-result-visible')
                guessResultText.classList.add('guess-result-correct')      
                guessResultText.textContent = 'Correct!'
                header.style.backgroundColor = chosenRandomColor
                for (let box of colorBoxes) {
                    box.style.backgroundColor = chosenRandomColor
                }
                localStorage.setItem('score', Number(localStorage.getItem('score')) + 1)
                setTimeout(() => {
                    isGuessReactionRunning = false     
                    guessResultText.classList.toggle('guess-result-visible')
                    guessResultText.classList.remove('guess-result-correct')                  
                    assignRandomColors()
                }, 1500);
        }
        //WRONG CASE
        else {     
            isGuessReactionRunning = true     
            guessResultText.classList.toggle('guess-result-visible')
            guessResultText.classList.add('guess-result-wrong')
            guessResultText.textContent = 'Wrong!'
            event.target.classList.add('color-boxes-hidden')
            setTimeout(() => {
                isGuessReactionRunning = false     
                guessResultText.classList.toggle('guess-result-visible')      
                guessResultText.classList.remove('guess-result-wrong')      
                attemptsLeft--
                if (attemptsLeft == 0) {
                    isGuessReactionRunning = true     
                    for (let colorBox of colorBoxes) {
                        if (colorBox.style.backgroundColor == chosenRandomColor) {
                            correctBoxText = colorBox.children[0]
                            correctBoxText.classList.toggle('guess-result-visible')
                            correctBoxText.classList.add('guess-result-correct-one')      
                            correctBoxText.textContent = 'Correct one!'
                        }
                    }
                    setTimeout(() => {
                        isGuessReactionRunning = false     
                        correctBoxText.classList.toggle('guess-result-visible')
                        correctBoxText.classList.remove('guess-result-correct-one')      
                        localStorage.setItem('score', 0)
                        assignRandomColors()
                    }, 1500)
                }
            }, 1500);
        }
    }
}

function difficultySelector(event) {
    // Creates a new game: updates the score, attempts left, and renews the colors 
    // of all boxes; adds or removes boxes according to the selected difficulty level
    localStorage.setItem('score', 0)
    switch(event.target.textContent) {        
        case 'HARD':
            if (colorBoxes.length === 3) {
                for (let i = 0; i < 3; i++) {
                    let newBox = colorBoxes[0].cloneNode(true)
                    newBox.addEventListener('click', confirmGuess)
                    boxesContainer.appendChild(newBox)
                }
            } 
            easyButton.classList.remove('activated-difficulty')
            hardButton.classList.add('activated-difficulty')
            currentDifficulty = 'HARD'
            assignRandomColors()
            break;            
        case 'EASY':
            if (colorBoxes.length === 6) {
                for (let i = 0; i < 6; i++) {   
                    if (i > 2) {
                        colorBoxes[colorBoxes.length - 1].remove()
                    }
                }
            }
            hardButton.classList.remove('activated-difficulty')
            easyButton.classList.add('activated-difficulty')
            currentDifficulty = 'EASY'
            assignRandomColors()
            break;
        }
}
        

easyButton.classList.add('activated-difficulty')
assignRandomColors()
alert('Guess what color matches the (RED, GREEN, BLUE) code shown above!')