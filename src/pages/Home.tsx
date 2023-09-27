import { User } from 'firebase/auth'
import { addDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import LinWeetItem from '../components/LinWeetItem'
import { dbService, storageService } from '../firebase'
import { GetWeetsTypes } from '../types/GetWeetsTypes'
import LinWeetForm from '../components/LinWeetForm'

const Home = ({ userObj }: { userObj: User | null }) => {
  const [linWeets, setLinWeets] = useState<GetWeetsTypes[]>([])

  // const getLinWeets = async () => {
  //   const newLinWeets = await getDocs(collection(dbService, 'linweets'))
  //   newLinWeets.forEach((doc) => {
  //     const linWeetsObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     }
  //     setLinWeets((prev: any) => [...prev, linWeetsObj])
  //   })
  // }

  useEffect(() => {
    onSnapshot(collection(dbService, 'linweets'), (snapshot) => {
      const linweetArray: GetWeetsTypes[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setLinWeets(linweetArray)
    })
  }, [])

  return (
    <div className="container">
      <LinWeetForm userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {linWeets
          .sort((a, b) => b.createdAt! - a.createdAt!)
          .map((weet, idx) => (
            <LinWeetItem
              key={idx}
              weet={weet}
              isMine={userObj?.uid === weet.creatorId}
            />
          ))}
      </div>
    </div>
  )
}

export default Home
