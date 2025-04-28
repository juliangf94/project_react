export const saveGameToStorage = ({ board, turn }) => {
    // Guardar partida
    // Se puede usar una base de datos
    window.localStorage.setItem('board', JSON.stringify(board))
    window.localStorage.setItem('turn', turn)
}

export const resetGameStorage = () => {
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
}