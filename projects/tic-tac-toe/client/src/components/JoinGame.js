import React, { useState } from 'react'
import { useChatContext, Channel } from 'stream-chat-react'
import { Game } from './Game'
import CustomInput from './CustomInput'
import style from './JoinGame.module.scss'


function JoinGame() {
  const [rivalUsername, setRivalUSername] = useState("")
  const {client} = useChatContext()
  const [channel, setChannel] = useState(null)
  const [errorMessage, setErrorMessage] = useState("");
  
  const createChannel = async () => {
    setErrorMessage("");
    const response = await client.queryUsers({name: { $eq: rivalUsername }})

    if (response.users.lenght === 0) {
      setErrorMessage("User not found")
      return
    }

    const rivalId = response.users[0].id;

    if (client.userID === rivalId) {
      setErrorMessage("You cannot start a game with yourself!");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, rivalId]
    })

    await newChannel.watch()
    setChannel(newChannel)
  }

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput} >
          <Game channel={channel} setChannel={setChannel} />
        </Channel>        
      ) : (
        <div className={style.joinGame}>
          <h4>Create Game</h4>
          <input 
            type="text"
            className={style.input}
            placeholder='Username of rival...' 
            onChange={(event) => {
              setRivalUSername(event.target.value)
            }} 
          />  
          {errorMessage && <div className={style.errorMessage}>{errorMessage}</div>}
          <button onClick={createChannel} className={style.button}>
            Join/Start Game
          </button>
        </div>
      )}
    </>
  )
}

export default JoinGame