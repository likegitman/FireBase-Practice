import { User } from 'firebase/auth'
import { Routes, Route } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Auth from '../pages/Auth'
import Home from '../pages/Home'
import Profile from '../pages/Profile'

const RouterApp = ({
  isLoggedIn,
  userObj,
}: {
  isLoggedIn: boolean
  userObj: User | undefined
}) => {
  return (
    <>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  )
}

export default RouterApp
