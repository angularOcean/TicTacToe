let gameBoard;
const playerOne = 'O'
const playerTwo = 'X'
let currentTurn = playerOne
let playerOneArr = []
let playerTwoArr = []
let winArr = []
let numPlayers = document.querySelectorAll('input[name="numPlayers"]')
let playerAI = true
let gameState = true

const magicSquare = {
    0: 8,
    1: 1,
    2: 6,
    3: 3,
    4: 5,
    5: 7,
    6: 4, 
    7: 9,
    8: 2,
}

const reverseSquare = {
    8: 0,
    1: 1,
    6: 2,
    3: 3,
    5: 4,
    7: 5,
    4: 6,
    9: 7,
    2: 8
}

const cells = document.querySelectorAll('.cell')

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none"
    gameBoard = Array.from(Array(9).keys())
    for (let i =0; i <cells.length; i++) {
        cells[i].innerText = ' '
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener('click', turnClick, false)

        playerOneArr = []
        playerTwoArr = []
        currentTurn = playerOne
        winArr = []
        gameState = true
    }
}

function turnClick(clickEvent) {
    for (let i = 0; i < numPlayers.length; i++) {
        numPlayers[i].addEventListener("change", function() {
          let val = this.value; // this == the clicked radio
          if (val == 'one') { //one player selected
            playerAI = true
            startGame()
          }
          if (val == 'two') {
              playerAI = false
              startGame()
          }
        });
      }
    console.log(clickEvent.target.id, currentTurn, playerAI)
    if (playerAI == true) {  //player vs AI
        if (currentTurn == playerOne) {
            let oneTurn = turn(clickEvent.target.id, playerOne)
            if (gameState == true && oneTurn == true){
                aiTurn()
            }
            
        }

    }
    else { //player vs player
        turn(clickEvent.target.id, currentTurn)
        }
    }

function turn(cellID, player) { //play out player turn
    if (currentTurn == playerOne) { //check if clicked box is already checked by player one or two
        //console.log((playerOneArr.includes(cellID) || playerTwoArr.includes(cellID)), "checking")
        //console.log("Taking turn for ", currentTurn, " cellID ", cellID)
        if (playerOneArr.includes(magicSquare[cellID]) || playerTwoArr.includes(magicSquare[cellID])) {
            //console.log("Square already filled")
            return false
        }
        else { //make move for player One
            gameBoard[cellID] = player
            document.getElementById(cellID).innerText = player
            playerOneArr.push(magicSquare[cellID])
            
        }
    }
    if (currentTurn == playerTwo) { 
        if (playerOneArr.includes(magicSquare[cellID]) || playerTwoArr.includes(magicSquare[cellID])) {
            return false
            }
        else { //make move for player Two
            gameBoard[cellID] = player
            document.getElementById(cellID).innerText = player
            playerTwoArr.push(magicSquare[cellID])
             
        }
    }
  
    let gameWon = checkWin() //check if game is won 
    if (gameWon && currentTurn == playerOne) gameOver("Player One Won!") //if won call gameWon
    if (gameWon && currentTurn == playerTwo) gameOver("Player Two Won!")
    if (gameState == true) {
        tieCheck()
    }
    //change current turn
    if (currentTurn == playerOne) {
        currentTurn = playerTwo
    }
    else if (currentTurn == playerTwo) {
        currentTurn = playerOne
    }
    return true
}

function checkWin(turn = currentTurn, firstArr = playerOneArr, secondArr = playerTwoArr) { //checks if a player has made a winning move 
    let arrCheck = null
    let winCheck = false
    if (turn == playerOne) {
        arrCheck = firstArr
    }
    else if (turn == playerTwo){
        arrCheck = secondArr
    }
    if (arrCheck.length >= 3) {
        for (let i = 0; i < arrCheck.length; i++ ) {
            for (let j = i+1; j < arrCheck.length; j++ ) {
                for (let k = j+1; k < arrCheck.length; k++) {
                    if (arrCheck[i] + arrCheck[j] +arrCheck[k] == 15) {
                        winArr = [reverseSquare[arrCheck[i]], reverseSquare[arrCheck[j]], reverseSquare[arrCheck[k]]]
                        winCheck = true
                    }
                }
            }
        
        }
    }
    return winCheck
}

function tieCheck() {//ends the game in the event of a tie
    if (playerOneArr.length + playerTwoArr.length == 9) {
        console.log("Tie Game!")
        gameOver("Tie Game!")
    }
}

function gameOver(text) { //ends the game
    gameState = false
    console.log(winArr)
    for (let i = 0; i < winArr.length; i++) {
        document.getElementById(winArr[i]).style.backgroundColor = "red"
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    document.querySelector(".endgame").style.display = "block"
    document.querySelector(".endgame .text").innerText = text
}

function aiTurn () {
    let bestMove = minMax()
    console.log(bestMove, "best move for AI", playerTwoArr)
    turn(bestMove, playerTwo)
}

function minMax(arr1 = playerOneArr, arr2 = playerTwoArr) {
    let openSpots = []
    console.log(playerOneArr, playerTwoArr, "current minmax arrs")
    let tempArr1 = [...arr1]
    let tempArr2 = [...arr2]
    for (let i = 1; i < 10; i++ ) {
        if (arr1.includes(i) == false && arr2.includes(i) ==false ) {
            openSpots.push(reverseSquare[i])
        }
    }
    let moveArr = []
    for (let i = 0; i < openSpots.length; i++) {
        let moveArr1 = [...tempArr2]
        moveArr1.push(magicSquare[openSpots[i]])
        if (checkWin(playerTwo, tempArr1, moveArr1)) {
            console.log("winning move", openSpots[i])
            winArr = []
            return openSpots[i]
        }
        else {
            
            let nextSpot = [...openSpots]
            nextSpot.splice[i, 1]
            console.log("checking for losing move", nextSpot)
            for (let j = 0; j < nextSpot.length; j++) {
                let moveArr2 = [...tempArr1]
                moveArr2.push(magicSquare[nextSpot[j]])
                console.log("checking ", nextSpot[j], moveArr2)
                if (checkWin(playerOne, moveArr2 ,moveArr1)) {
                    console.log("losing move", nextSpot[j])
                    moveArr.push(nextSpot[j])
                }
            }
        }
    winArr = []
    if (moveArr.length == 0) {
        console.log("Making random move", openSpots)
        var randomNum = openSpots[Math.floor(Math.random()*openSpots.length)];
        return randomNum
    }
    else {
        console.log("Making don't lose move", moveArr)
        var randomNum = moveArr[Math.floor(Math.random()*moveArr.length)];
        return randomNum
    }
    }
}
