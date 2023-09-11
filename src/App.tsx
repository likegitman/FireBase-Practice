import RouterApp from './routes/RouterApp'
import { authService } from './firebase'
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'

function App() {
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
      setInit(true)
    })
  }, [])

  return (
    <>
      {init ? <RouterApp isLoggedIn={isLoggedIn} /> : 'Initialize'}
      <footer>&copy; {new Date().getFullYear()} Linwitter</footer>
    </>
  )
}

export default App
