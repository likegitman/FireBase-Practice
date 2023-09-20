import { User } from 'firebase/auth'
import { Routes, Route } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Auth from '../pages/Auth'
import Home from '../pages/Home'
import Profile from '../pages/Profile'

const RouterApp = ({
  isLoggedIn,
  userObj,
  refreshUser,
}: {
  isLoggedIn: boolean
  userObj: User | null
  refreshUser: () => void
}) => {
  return (
    <>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  )
}

export default RouterApp
