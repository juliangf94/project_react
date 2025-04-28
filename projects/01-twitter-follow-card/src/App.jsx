import { useState } from 'react'
import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard'
export function App () {
    //Se propagan los cambios, se renderiza todo pero no cambia el DOM
    /*//Pasar funciones como parametros/prompts
    const format = (userName) => `@${userName}`
    //Un componente es una factoria de elementos, una funcion que te devuelve un elemento
    //Un elemento es lo que React renderiza*/

    const users = [
        {
            userName: 'midudev',
            name: 'Miguel Ángel Durán',
            isFollowing: true
        },
        {
          userName: 'pheralb',
          name: 'Pablo H.',
          isFollowing: false
        },
        {
          userName: 'PacoHdezs',
          name: 'Paco Hdez',
          isFollowing: true
        },
        {
          userName: 'TMChein',
          name: 'Tomas',
          isFollowing: false
        }
    ]

    return (
        <section className='App'>
            {
                users.map(({ userName, name, isFollowing }) => (               
                    <TwitterFollowCard 
                        key={userName}
                        userName={userName}
                        initialIsFollowing={isFollowing}
                    >                 
                        {name}
                    </TwitterFollowCard> 
                ))
            }
        </section>
    )
}

/*
//En vez de usar React.Fragment usamos <> </>
<section className="App">
            <TwitterFollowCard userName='midudev' /*initialIsFollowing={true}>                 
            Miguel Ángel Durán
            </TwitterFollowCard>   
                
            <TwitterFollowCard isFollowing userName="pheralb">              
                Pablo Hernandez
            </TwitterFollowCard>

            
        </section> */