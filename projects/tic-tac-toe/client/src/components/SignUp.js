import React, { useState } from 'react'
import Axios from 'axios'
import Cookies from "universal-cookie"
import style from '../App.module.scss'

function SignUp({setIsAuth}) {
    const cookies = new Cookies()
    const [ user, setUser ] = useState(null)

    const signUp = () => {        
        Axios.post("http://localhost:3001/signup", user).then(res => {
            const { token, userId, firstName, lastName, userName, hashedPassword } = 
                res.data
            cookies.set("token", token)
            cookies.set("userId", userId)
            cookies.set("userName",userName)
            cookies.set("firstName", firstName)
            cookies.set("lastName", lastName)
            cookies.set("hashedPassword", hashedPassword)
            setIsAuth(true)
        })
    }
    //Todo lo que se va a renderizar en la pagina
    return (
        <div className={style.signUp}>
            <label>Sign Up</label>
            {//onChange escucha cuando el usuario escribe algo en el input
            // ...user copia las propiedades que ya existan en user
            //event.target.value es lo que el usuario escribio 
            }            
            <input 
                placeholder='First Name'               
                onChange={(event) => {
                    setUser({ ...user, firstName: event.target.value })
                }}    
            />
            <input 
                placeholder='Last Name' 
                onChange={(event) => {
                    setUser({ ...user, lastName: event.target.value })
                }}    
            />
            <input 
                placeholder='UserName' 
                onChange={(event) => {
                    setUser({ ...user, userName: event.target.value })
                }}    
            />
            <input 
                placeholder='Password' 
                onChange={(event) => {
                    setUser({ ...user, password: event.target.value })
                }}    
            />
            <button className={style.signUpButton} onClick={signUp}>Sign Up</button>
        </div>
    )
}

export default SignUp;