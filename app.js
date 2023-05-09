/* ----- constants ----- */
const MARKS = {
  0: '#9bbc0f', //blank
  1: '#0f380f', //marked
  '-1': '#306230' //marked empty
}
//solutions and clues for puzzles
const PUZZLES = [
  {
    name: 'a heart',
    solution: [
      1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0
    ],
    topClue: [3, 4, 4, 4, 3],
    leftClue: [[2, 2], 5, 5, 3, 1]
  },
  {
    name: 'a skull',
    solution: [
      0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0
    ],
    topClue: [2, [2, 2], 4, [2, 2], 2],
    leftClue: [3, 5, [1, 1, 1], 3, [1, 1]]
  },
  {
    name: 'a boat',
    solution: [
      0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0
    ],
    topClue: [1, 2, 5, [2, 2], [1, 1]],
    leftClue: [2, 3, 1, 5, 3]
  },
  {
    name: 'a capital a',
    solution: [
      0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1
    ],
    topClue: [3, [1, 1], [1, 1], [1, 1], 3],
    leftClue: [1, [1, 1], [1, 1], 5, [1, 1]]
  },
  {
    name: 'a capital z',
    solution: [
      1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1
    ],
    topClue: [
      [2, 1],
      [1, 2],
      [1, 1, 1],
      [2, 1],
      [1, 2]
    ],
    leftClue: [5, [1, 1], 1, [1, 1], 5]
  }
]

/* ----- state variables ----- */
let board
let winner
let check = 0

//Change puzzle back to 0

let puzzle = 0 // Iterator for which puzzle user is playing.
let clicker = 1 //set to 1 initially, -1 if marking blank

/* ----- cached elements ----- */
const messageEl = document.querySelector('h1')
const resetBtn = document.querySelector('#reset')
const checkBtn = document.querySelector('#check')
const newPuzzBtn = document.querySelector('#newPuzzle')
const filledBtn = document.querySelector('#toggleFilled')
const blankBtn = document.querySelector('#toggleBlank')
const boardAdd = document.querySelector('#board')
const cells = [...document.querySelectorAll('#board > div')]

/* ----- functions ----- */
const init = () => {
  board = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]
  winner = null
  render()
}

const renderBoard = () => {
  board.forEach((arr, cell) => {
    const cellId = `cell${cell}`
    const cellEl = document.getElementById(cellId)
    cellEl.style.backgroundColor = MARKS[arr]
    if (MARKS[arr] === '#306230') {
      cellEl.innerText = 'X'
    }
    if (MARKS[arr] !== '#306230') {
      //clears X
      cellEl.innerText = ''
    }
  })

  //DRYer Code - Defining repeatable code for each set of clues
  const clueDiv = (clue, id) => {
    const clueEl = document.getElementById(id)
    let longClue = ''
    if (clue.length > 1) {
      clue.forEach((cl, idx2) => {
        longClue += `<div>${cl}</div>`
      })
    } else {
      longClue = `<div>${clue}</div`
    }
    clueEl.innerHTML = longClue
  }

  PUZZLES[puzzle].topClue.forEach((clue, idx) => {
    const clueId = `col${idx}`
    clueDiv(clue, clueId)
  })

  PUZZLES[puzzle].leftClue.forEach((clue, idx) => {
    const clueId = `row${idx}`
    clueDiv(clue, clueId)
  })
}

const renderMessage = () => {
  if (winner) {
    messageEl.innerHTML = `You won! It's ${PUZZLES[puzzle].name}!`
  } else if (check) {
    messageEl.innerHTML = "Nope, that's not it, try again"
  } else {
    messageEl.innerHTML = "What's it supposed to be?"
  }
}

const renderControls = () => {
  resetBtn.style.visibility = winner ? 'hidden' : 'visible'
  newPuzzBtn.style.visibility = winner ? 'visible' : 'hidden'
}

const render = () => {
  renderBoard()
  renderMessage()
  renderControls()
}

const generateBoard = () => {
  let abstractBoard = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]

  for (let i = 0; i < abstractBoard.length; i++) {
    abstractBoard[i] = Math.floor(Math.random() * 2)
  }
  return abstractBoard
}

const topClueGen = (abBoard) => {
  const compArray = []
  let simpArray0 = []
  let simpArray1 = []
  let simpArray2 = []
  let simpArray3 = []
  let simpArray4 = []

  let simpNum0 = 0
  let simpNum1 = 0
  let simpNum2 = 0
  let simpNum3 = 0
  let simpNum4 = 0

  for (let i = 0; i < abBoard.length; i++) {
    switch (i) {
      case 0:
      case 5:
      case 10:
      case 15:
      case 20:
        //only above i cases apply to topClue[0] in abstract board --> Also applies to boards below
        if (abBoard[i] === 1) simpNum0++
        if (abBoard[i] === 0) {
          if (simpNum0 > 0) simpArray0.push(simpNum0)
          simpNum0 = 0 //revert to 0 to construct next clue
        }
        if (i === 20) {
          if (simpArray0.length === 0 || simpNum0 > 0) simpArray0.push(simpNum0)
        }
        break
      case 1:
      case 6:
      case 11:
      case 16:
      case 21:
        if (abBoard[i] === 1) simpNum1++
        if (abBoard[i] === 0) {
          if (simpNum1 > 0) simpArray1.push(simpNum1)
          simpNum1 = 0
        }
        if (i === 21) {
          if (simpArray1.length === 0 || simpNum1 > 0) simpArray1.push(simpNum1)
        }
        break
      case 2:
      case 7:
      case 12:
      case 17:
      case 22:
        if (abBoard[i] === 1) simpNum2++
        if (abBoard[i] === 0) {
          if (simpNum2 > 0) simpArray2.push(simpNum2)
          simpNum2 = 0
        }
        if (i === 22) {
          if (simpArray2.length === 0 || simpNum2 > 0) simpArray2.push(simpNum2)
        }
        break
      case 3:
      case 8:
      case 13:
      case 18:
      case 23:
        if (abBoard[i] === 1) simpNum3++
        if (abBoard[i] === 0) {
          if (simpNum3 > 0) simpArray3.push(simpNum3)
          simpNum3 = 0
        }
        if (i === 23) {
          if (simpArray3.length === 0 || simpNum3 > 0) simpArray3.push(simpNum3)
        }
        break
      case 4:
      case 9:
      case 14:
      case 19:
      case 24:
        if (abBoard[i] === 1) simpNum4++
        if (abBoard[i] === 0) {
          if (simpNum4 > 0) simpArray4.push(simpNum4)
          simpNum4 = 0
        }
        if (i === 24) {
          if (simpArray4.length === 0 || simpNum4 > 0) simpArray4.push(simpNum4)
        }
        break
      default:
        console.log('There should not be anything that fits here.')
        break
    }
  }
  compArray.push(simpArray0)
  compArray.push(simpArray1)
  compArray.push(simpArray2)
  compArray.push(simpArray3)
  compArray.push(simpArray4)

  return compArray
}

//leftClueGen working incorrectly
const leftClueGen = (abBoard) => {
  const compArray = []
  let simpArray = []
  let simpNum = 0
  for (let i = 0; i < abBoard.length; i++) {
    if (abBoard[i] === 1) {
      simpNum++
    }
    if (abBoard[i] === 0) {
      if (simpNum > 0) {
        simpArray.push(simpNum)
      }
      simpNum = 0
    }
    if (i === 4 || i === 9 || i === 14 || i === 19 || i === 24) {
      if (simpArray.length === 0 || simpNum > 0) {
        simpArray.push(simpNum)
      }
      compArray.push(simpArray)
      simpArray = []
      simpNum = 0
    }
  }
  return compArray
}

const generatePuzzle = () => {
  const namePuzz = 'abstract'
  let abBoard = generateBoard()
  let tClue = topClueGen(abBoard)
  let lClue = leftClueGen(abBoard)

  let puzzObj = {
    name: namePuzz,
    solution: abBoard,
    topClue: tClue,
    leftClue: lClue
  }

  return puzzObj
}

//new "feature" introduced 9 May 2023 @1:54pm check solution now clears board of marked blank. After the check of checkBoard[i] === -1, it also changes board[i]
const checkPuzzle = () => {
  let checkTotal = 0
  let checkBoard = board
  for (let i = 0; i < checkBoard.length; i++) {
    if (checkBoard[i] === -1) {
      //This is meant to help the board check starting on line 314 by removing the -1s from checkBoard, but now it's removing them from board as well.
      checkBoard[i] = 0
      console.log('This is board: ' + board)
      console.log('This is checkBoard: ' + checkBoard)
    }
  }
  console.log('This is the solution: ' + PUZZLES[puzzle].solution)
  for (let i = 0; i < checkBoard.length; i++) {
    if (PUZZLES[puzzle].solution[i] === checkBoard[i]) {
      checkTotal++
    }
  }
  if (checkTotal === 25) {
    winner = 1
    check = 0
    render()
  } else {
    check++
    render()
  }
}

const nextPuzzle = () => {
  //add logic for puzzle = 5 that congratulates the winner and ends the game/populates new board
  if (puzzle >= 4) {
    // Generate new puzzles ahead of time
    //puzzle = 0
    //Append new puzzles
    //Organize new cells in style.css

    PUZZLES.push(generatePuzzle())
  }
  puzzle++
  board = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]
  render()
  winner = null
  init()
}

handlePlacement = (evt) => {
  if (winner) return
  const cellIdx = cells.indexOf(evt.target)
  //Guards
  if (board[cellIdx] === 1 || board[cellIdx] === -1) {
    board[cellIdx] = 0
    render()
    return
  }
  board[cellIdx] = clicker
  render()
}

resetGame = () => {
  board = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]
  render()
}

const markBlank = () => {
  clicker = -1
  filledBtn.style.color = '#0f380f'
  filledBtn.style.backgroundColor = '#9bbc0f'
  blankBtn.style.color = '#9bbc0f'
  blankBtn.style.backgroundColor = '#0f380f'
}

const markFilled = () => {
  clicker = 1
  filledBtn.style.color = '#9bbc0f'
  filledBtn.style.backgroundColor = '#0f380f'
  blankBtn.style.color = '#0f380f'
  blankBtn.style.backgroundColor = '#9bbc0f'
}

init()

/* ----- event listeners ----- */
document.getElementById('board').addEventListener('click', handlePlacement)
resetBtn.addEventListener('click', resetGame) //See if I need to change reset button as I implement more puzzles
checkBtn.addEventListener('click', checkPuzzle)
filledBtn.addEventListener('click', markFilled)
blankBtn.addEventListener('click', markBlank)
newPuzzBtn.addEventListener('click', nextPuzzle)
