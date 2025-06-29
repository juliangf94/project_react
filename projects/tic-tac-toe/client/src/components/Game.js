import React, { useState } from 'react'
import Board from './Board'
import { Window, MessageList, MessageInput, Channel } from 'stream-chat-react'
import CustomMessage from './CustomMessage';
import styles from "./Chat.module.scss"


export function Game({ channel, setChannel }) {
    const [playersJoined, setPlayersJoined] = useState(
        channel.state.watcher_count === 2
    );
    const [result, setResult] = useState({ winner: "none", state: "none" });

    channel.on("user.watching.start", (event) => {
        setPlayersJoined(event.watcher_count === 2)
    })

    if (!playersJoined) {
        return <div className={styles.waitingMessage}>Waiting for other player to join...</div>
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameBoardContainer}>
                <h1 className={styles.gameTitle}>Tic Tac Toe</h1>
                <Board result={result} setResult={setResult} />

                <div className={styles.gameButtons}>
                    {/*Leave Game button*/}
                    <button
                        className={styles.leaveGame}
                        onClick={async () => {
                            await channel.stopWatching()
                            setChannel(null)
                        }}>
                        Leave Game
                    </button>
                </div>
            </div>

            {/*Chat*/}
            <div className={styles.chatContainer}>
                <Channel channel={channel} >
                    <Window>
                        <MessageList
                            disableDateSeparator
                            closeReactionSelectorOnClick
                            hideDeletedMessages
                            messageActions={["react"]}
                            Message={CustomMessage}
                        />
                        <MessageInput noFiles placeholder="Write your message..." />
                    </Window>
                </Channel>
            </div>
        </div>
    )
}
