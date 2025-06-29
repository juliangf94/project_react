import React, { useEffect, useState, useCallback } from 'react'
import Square from './Square'
import { useChannelStateContext, useChatContext } from 'stream-chat-react'
import { Patterns } from '../WinningPatterns'
import styles from '../App.module.scss'

const initialBoardState = ["", "", "", "", "", "", "", "", ""];

function Board({ result, setResult }) {
    const [board, setBoard] = useState(initialBoardState)
    const [player, setPlayer] = useState(null);
    const [turn, setTurn] = useState("X");
    const [isGameActive, setIsGameActive] = useState(false);
    const [startingPlayerSymbol, setStartingPlayerSymbol] = useState("X");

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    // Check if the game is won
    const checkWin = useCallback(() => {
        Patterns.forEach((currPattern) => {
            const firstPlayer = board[currPattern[0]];
            if (firstPlayer === "") return;
            let foundWinningPattern = true;
            currPattern.forEach((idx) => {
                if (board[idx] !== firstPlayer) {
                    foundWinningPattern = false;
                }
            })

            if (foundWinningPattern) {
                setResult({ winner: firstPlayer, state: "won" });
                setIsGameActive(false);
            }
        });
    }, [board, setResult]);

    // Check if the game is a tie
    const checkIfTie = useCallback(() => {
        let filled = true
        board.forEach((square) => {
            if (square === "") {
                filled = false
            }
        })
        if (filled && result.state === "none") {
            setResult({ winner: "none", state: "tie" });
            setIsGameActive(false);
        }
    }, [board, result.state, setResult]);

    // Function for local reset of the match
    const performLocalReset = useCallback(() => {
        setBoard(initialBoardState);
        setStartingPlayerSymbol(prevSymbol => prevSymbol === "X" ? "O" : "X");
        setPlayer(null); // Reset player to trigger re-assignment in useEffect
        setResult({ winner: "none", state: "none" });
        setIsGameActive(true); // Always set to false initially after reset
    }, [setResult]);


    const resetGame = useCallback(async () => {
        // Execute local reset
        performLocalReset();
        // Send a notification to the oponent
        await channel.sendEvent({
            type: "game-reset-request",
            data: {
                resettingUserId: client.userID,
                resettingUserName: client.user.name || client.userID
            }
        });
        console.log("Game has been reset by this player.");
    }, [performLocalReset, channel, client.userID, client.user.name]);

    // Effect to assign player symbol (X or O) and initial turn based on channel members AND startingPlayerSymbol
    useEffect(() => {
        const assignPlayerAndInitialTurn = async () => {
            if (channel.state.members) {
                // Constant order
                const memberIds = Object.keys(channel.state.members).sort();

                // Determina quién es X y quién es O basándose en el ID del cliente (esta lógica es la misma)
                const isClientX = memberIds[0] === client.userID;
                const isClientO = memberIds[1] === client.userID;

                if (isClientX) {
                    setPlayer("X");
                } else if (isClientO) {
                    setPlayer("O");
                }

                // It starts the game with the player who joined first
                setTurn(startingPlayerSymbol);

                if (channel.state.member_count === 2 && player !== null) {
                    setIsGameActive(true);
                }
            }
        };

        // The condition to assign player and initial turn
        if (player === null || result.state === "none") {
            assignPlayerAndInitialTurn();
        }

        channel.on('member.added', assignPlayerAndInitialTurn);
        channel.on('member.removed', assignPlayerAndInitialTurn);

        return () => {
            channel.off('member.added', assignPlayerAndInitialTurn);
            channel.off('member.removed', assignPlayerAndInitialTurn);
        };
    }, [channel, client.userID, player, startingPlayerSymbol, result.state]);



    // Effect to handle game moves
    useEffect(() => {
        const handleGameMove = (event) => {
            if (event.type === "game-move" && event.user.id !== client.userID) {
                const { square, player: remotePlayerSymbol } = event.data;
                setBoard((prevBoard) =>
                    prevBoard.map((val, idx) => (idx === square ? remotePlayerSymbol : val))
                );
                setTurn(remotePlayerSymbol === "X" ? "O" : "X");
                setIsGameActive(true);
                console.log("Game move received:", event.data);
            }
        };

        // Handle game reset request from opponent
        const handleGameResetRequest = (event) => {
            if (event.type === "game-reset-request" && event.user.id !== client.userID) {
                console.log(`Opponent (${event.data.resettingUserName || event.user.id}) has reset the game. Resetting locally.`);
                performLocalReset();
            }
        };

        channel.on(handleGameMove);
        channel.on(handleGameResetRequest);

        return () => {
            channel.off(handleGameMove);
            channel.off(handleGameResetRequest);
        };
    }, [channel, client.userID, performLocalReset]);

    // Effect to check for win or tie
    useEffect(() => {
        checkIfTie()
        checkWin()
    }, [board, checkIfTie, checkWin, result.state])

    // Function to handle square selection
    const chooseSquare = async (square) => {
        // Check if the game is over
        if (result.state === "none" && turn === player && board[square] === "") {
            const newBoard = board.map((val, idx) => {
                if (idx === square) {
                    return player;
                }
                return val;
            });
            setBoard(newBoard);

            // Send the move to the channel
            await channel.sendEvent({
                type: "game-move",
                data: { square, player },
            });

            // Change the turn to the other player
            setTurn(player === "X" ? "O" : "X");
            setIsGameActive(true);
        }
    };

    // Function to get the style for the square
    const getSquareStyle = (val) => {
        if (val === 'X') return styles.x;
        if (val === 'O') return styles.o;
        return styles.square;
    };

    // Function to get the symbol for the square
    const getSymbolForSquare = (value) => {
        if (value === 'X') return '❌';
        if (value === 'O') return '⚪';
        return '';
    };

    // Function to get the winner's name
    const getWinnerName = useCallback(() => {
        // No winner yet
        if (result.winner === "none") return "";

        const winnerSymbol = result.winner;
        let winnerUserId = '';

        // We get the member IDs in sorted order
        const memberIds = Object.keys(channel.state.members).sort();
        const playerXId = memberIds[0];
        const playerOId = memberIds[1];

        if (winnerSymbol === "X") {
            winnerUserId = playerXId;
        } else if (winnerSymbol === "O") {
            winnerUserId = playerOId;
        }

        // We search for the member in the channel
        const winnerMember = channel.state.members[winnerUserId];
        // Return the winner's name
        return winnerMember?.user?.name || winnerUserId;
    }, [result.winner, channel.state.members]);

    // Function to get the opponent's name
    const getOpponentName = useCallback(() => {
        // Fallback
        if (!player || !channel.state.members) return "Opponent";

        const memberIds = Object.keys(channel.state.members).sort();
        // Find other player´s ID
        const opponentId = memberIds.find(id => id !== client.userID);

        if (opponentId) {
            const opponentMember = channel.state.members[opponentId];
            return opponentMember?.user?.name || opponentId;
        }
        // In case it´s not found
        return "Opponent";
    }, [player, client.userID, channel.state.members]);


    return (
        <div className={styles.board}>
            {/*First Row*/}
            <div className={styles.row}>
                <Square chooseSquare={() => {
                    chooseSquare(0)
                }}
                    val={getSymbolForSquare(board[0])}
                    className={getSquareStyle(board[0])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(1)
                }}
                    val={getSymbolForSquare(board[1])}
                    className={getSquareStyle(board[1])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(2)
                }}
                    val={getSymbolForSquare(board[2])}
                    className={getSquareStyle(board[2])}
                />
            </div>
            {/*Second Row*/}
            <div className={styles.row}>
                <Square chooseSquare={() => {
                    chooseSquare(3)
                }}
                    val={getSymbolForSquare(board[3])}
                    className={getSquareStyle(board[3])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(4)
                }}
                    val={getSymbolForSquare(board[4])}
                    className={getSquareStyle(board[4])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(5)
                }}
                    val={getSymbolForSquare(board[5])}
                    className={getSquareStyle(board[5])}
                />
            </div>
            {/*Third Row*/}
            <div className={styles.row}>
                <Square chooseSquare={() => {
                    chooseSquare(6)
                }}
                    val={getSymbolForSquare(board[6])}
                    className={getSquareStyle(board[6])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(7)
                }}
                    val={getSymbolForSquare(board[7])}
                    className={getSquareStyle(board[7])}
                />
                <Square chooseSquare={() => {
                    chooseSquare(8)
                }}
                    val={getSymbolForSquare(board[8])}
                    className={getSquareStyle(board[8])}
                />
            </div>
            {/* Show whose turn it is */}
            {result.state === "none" && player && (
                <h2 className={styles.turnMessage}>
                    It's {turn === player ? "Your" : `${getOpponentName()}'s`} Turn ({turn})
                </h2>
            )}
            {/* Message of waiting your oponent */}
            {channel.state.member_count < 2 && (
                <h2 style={{ color: 'yellow', textAlign: 'center', marginTop: '10px' }}>
                    Waiting for {getOpponentName()} to reset the game...
                </h2>
            )}
            {/* Show Winner´s message */}
            {result.state === "won" && result.winner !== "none" && (
                <h2 className={styles.winMessage}>
                    ¡{getWinnerName()} ha ganado!
                </h2>
            )}
            {/* Show tie message */}
            {result.state === "tie" && (
                <h2 style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>
                    It's a tie!
                </h2>
            )}

            {/* Show reset button only if game was active and now ended*/}
            {result.state !== "none" && (
                <button onClick={resetGame} className={styles.resetButton}>
                    Reset Game
                </button>
            )}
        </div>
    )
}

export default Board