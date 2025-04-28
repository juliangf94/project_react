import { useState } from 'react'
import './App.css'
import confetti from "canvas-confetti"

import { Square } from './components/Square'
import { TURNS } from './constants' 
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { WinnerModaL } from './components/WinnerModal'
import { saveGameToStorage, resetGameStorage } from './logic/storage'

//Create Board
//Create turns
//Create event for click in cells

function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage) 
    return Array(9).fill(null)
    /*return boardFromStorage ? JSON.parse(boardFromStorage) :
    Array(9).fill(null)*/
  })
  // Nunca usar useState dentro de un if
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    // ?? mira si lo primero es null o undefined
    return turnFromStorage ?? TURNS.X
  })

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()    
  }

  const updateBoard = (index) => {
    // No actualizamos esta posicion si ya tiene algo o hay ganador
    if(board[index] || winner) return
    //Actualizamos el tablero
    /* Nunca mutar las prompts y el estado, sino que creamos un nuevo array.
    Uso del Spread y rest operator */
    const newBoard = [...board]
    newBoard[index] = turn // x u o
    setBoard(newBoard)
    // Cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // Revisamos si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {   
      confetti() 
      setWinner(newWinner) //Esto es asincrono
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
  }
}
  return (
    <main className='board'>
      <h1>Tic tac toe</h1> 
      <button onClick={resetGame}>Game Reset</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
         {TURNS.O}
        </Square>
      </section>
      
      <WinnerModaL resetGame={resetGame} winner={winner}/>
      
    </main>
    
  )
}

export default App