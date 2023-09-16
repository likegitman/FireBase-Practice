import RouterApp from './routes/RouterApp'
import { authService } from './firebase'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { User } from 'firebase/auth'

function App() {
  const [init, setInit] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userObj, setUserObj] = useState<User>()

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)
        setUserObj(user)
      } else {
        setIsLoggedIn(false)
      }
      setInit(true)
    })
  }, [])

  return (
    <>
      <ToastContainer />
      {init ? (
        <RouterApp isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        'Initialize'
      )}
      <footer>&copy; {new Date().getFullYear()} Linwitter</footer>
    </>
  )
}

export default App
