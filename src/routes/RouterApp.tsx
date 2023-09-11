import { User } from 'firebase/auth'
import { Routes, Route } from 'react-router-dom'
import Auth from './Auth'
import EditProfile from './EditProfile'
import Home from './Home'
import Profile from './Profile'

const RouterApp = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </>
      ) : (
        <Route path="/" element={<Auth />} />
      )}
    </Routes>
  )
}

export default RouterApp
