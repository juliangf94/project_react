import styles from './App.module.scss';
import Login from './components/Login';
import SignUp from './components/SignUp';
import JoinGame from "./components/JoinGame"

import { StreamChat } from "stream-chat"
import { Chat } from 'stream-chat-react'
import Cookies from "universal-cookie"
import { useState } from "react"




function App() {
  const api_key = "yfet8ks49yz9";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("userName");
    client.disconnectUser();
    setIsAuth(false);
  }

  if (token) {
    client.connectUser(
      {
        id: cookies.get("userId"),
        name: cookies.get("userName"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"),
        hashedPassword: cookies.get("hashedPassword"),
      }, token
    )
      .then((user) => {
        setIsAuth(true)
      });
  }
  return (
    <div className={styles.App}>
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button className={styles.logOutButton} onClick={logOut}>
            Log Out
          </button>
        </Chat>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
