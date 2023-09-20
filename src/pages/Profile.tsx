import { updateProfile, User } from 'firebase/auth'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, dbService } from '../firebase'
import { GetWeetsTypes } from '../types/GetWeetsTypes'

const Profile = ({ userObj }: { userObj: User | undefined }) => {
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
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={displayName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDisplayName(e.target.value)
          }
          placeholder="Display name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogoutClick}>Log Out</button>
    </>
  )
}

export default Profile
