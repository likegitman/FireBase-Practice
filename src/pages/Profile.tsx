import { updateProfile, User } from 'firebase/auth'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService, dbService } from '../firebase'
import { GetWeetsTypes } from '../types/GetWeetsTypes'
import toastOptions from '../types/ToastOptions'

const Profile = ({
  userObj,
  refreshUser,
}: {
  userObj: User | null
  refreshUser: () => void
}) => {
  const [myLinWeets, setMyLinWeets] = useState<GetWeetsTypes[]>([])
  const [displayName, setDisplayName] = useState<string | undefined>(
    userObj?.displayName ?? ''
  )
  const navigate = useNavigate()

  const onLogoutClick = () => {
    authService.signOut()
    navigate('/')
    window.location.reload()
  }

  const getMyLinWeets = async () => {
    const myLinweets = query(
      collection(dbService, 'linweets'),
      where('creatorId', '==', `${userObj?.uid}`),
      orderBy('createdAt', 'asc')
    )

    const querySnapshot = await getDocs(myLinweets)
    querySnapshot.forEach((doc) => {
      setMyLinWeets((prev) => {
        return [{ ...doc.data() }, ...prev]
      })
    })
  }

  useEffect(() => {
    getMyLinWeets()
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (userObj?.displayName !== displayName) {
      await updateProfile(userObj!, { displayName })
    } else {
      toast.warning('이름을 변경해주세요.', toastOptions)
    }
    refreshUser()
  }

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          value={displayName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDisplayName(e.target.value)
          }
          autoFocus
          placeholder="Display name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <button onClick={onLogoutClick} className="formBtn cancelBtn logOut">
        <span>Log Out</span>
      </button>
    </div>
  )
}

export default Profile
