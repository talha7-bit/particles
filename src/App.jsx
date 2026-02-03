import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import File from './components/File'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <File/>
   </div>
  )
}

export default App
