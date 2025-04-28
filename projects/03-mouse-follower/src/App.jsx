import { useEffect, useState } from 'react'
import './App.css'

const FollowMouse = () => {
  //Activar o desactivar bolita en puntero
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  // Effect Pointer Move
  useEffect(() => {
  console.log('effect ', {enabled})

  const handleMove = (event) => {
    const { clientX, clientY } = event
    console.log('handleMove', { clientX, clientY })
    setPosition({ x: clientX, y: clientY })
  }

  if (enabled) {
    window.addEventListener('pointermove', handleMove)
  }    
  // Clean useEffect
  // Se ejecuta cuando el componente se desmonta y cuando cambian las
  // dependencias
  return () => {
    window.removeEventListener('pointermove', handleMove)
  }

  }, [enabled])

  // [] => Solo se ejecuta una vez cuando se monta el componente
  // [enabled] => Se ejecuta cuando cambia enabled y uando se monta el componente
  // undefined => Se ejecuta cada vez que se renderiza el componente

  // Effect Change body ClassName
  useEffect(() => {
    document.body.classList.toggle('no-cursor', enabled)

    return () => {
      document.body.classList.remove('no-cursor')
    }
  }, [enabled])

    return (
      <>
      <div style={{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid #fff',
        borderRadius: '50%',
        opacity: 0.8,
        pointerEvents: 'none',
        left: -25,
        top: -25,
        width: 50,
        height: 50,
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      />
      

       <h3>Project 3</h3>
        <button onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Desactivate ' : 'Activate '} 
          follow
        </button>
        </>
  )
}

function App() {
  
  return (
    <main>    
      <FollowMouse />     
    </main>
  )
}

export default App
