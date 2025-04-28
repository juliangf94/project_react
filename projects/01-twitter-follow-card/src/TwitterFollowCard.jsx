import { useState } from 'react'

export function TwitterFollowCard ({ children, userName, initialIsFollowing }) {
    //useState con valor por defecto, la primera posicion es el valor del estado
    //y la segunda posicion la actualización
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    
    console.log('[TwitterFollowCard] render with userName: ', userName)

    //No modificar la prompt, para eso mejor crear constantes
    const imageSrc = `https://unavatar.io/${userName}`
    // ? = ternearia, if corto
    const text = isFollowing ? 'Siguiendo' : 'Seguir'
    const buttonClassName = isFollowing
        ? 'tw-followCard-button is-following'
        : 'tw-followCard-button'
    //Funcion que da la vuelta de true a false
    const handleClick = () => {
        setIsFollowing(!isFollowing)
        }

    return (
        //Usamos className porque en jv class esta reservado
        <article className='tw-followCard'>
            <header className='tw-followCard-header'>
                <img 
                    className='tw-followCard-avatar'
                    alt= {`El avatar de ${userName}`}
                    src= {imageSrc} />
                <div className='tw-followCard-info'>
                    <strong>{children}</strong>
                    <span
                        className='tw-followCard-infoUserName'>
                        @{userName}
                    </span>
                </div>
            </header>

            <aside>
                <button className={buttonClassName} onClick={handleClick}>
                    <span className='tw-followCard-text'>{text}</span>
                    <span className='tw-followCard-stopFollow'>Dejar de seguir</span>
                </button>
            </aside>
        </article>
    )
}