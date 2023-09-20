import RouterApp from './routes/RouterApp'
import { authService } from './firebase'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateCurrentUser, User } from 'firebase/auth'

function App() {
  const [init, setInit] = useState<boolean>(false)
  const [userObj, setUserObj] = useState<User | null>(null)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user)
      }
      setInit(true)
    })
  }, [])

  const refreshUser = async () => {
    await updateCurrentUser(authService, authService.currentUser)
    setUserObj(authService.currentUser)
  }

  return (
    <>
      <ToastContainer />
      {init ? (
        <RouterApp
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        'Initialize'
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Linwitter</footer> */}
    </>
  )
}

export default App
