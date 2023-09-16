import { useNavigate } from 'react-router-dom'
import { authService } from '../firebase'

const Profile = () => {
  const navigate = useNavigate()
  const onLogoutClick = () => {
    authService.signOut()
    navigate('/')
  }

  return <button onClick={onLogoutClick}>Log Out</button>
}

export default Profile
