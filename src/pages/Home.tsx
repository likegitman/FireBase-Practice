import { User } from 'firebase/auth'
import { addDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import LinWeetItem from '../components/LinWeetItem'
import { dbService } from '../firebase'
import { GetWeetsTypes } from '../types/GetWeetsTypes'

const Home = ({ userObj }: { userObj: User | undefined }) => {
  const form = useForm({ defaultValues: { linweet: '' } })
  const { register, watch, setValue } = form
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addDoc(collection(dbService, 'linweets'), {
      text: watch('linweet'),
      createdAt: Date.now(),
      creatorId: userObj?.uid,
    })

    setValue('linweet', '')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          {...register('linweet', {
            maxLength: 120,
          })}
        />
        <input type="submit" value="Linweet" />
      </form>
      <ul>
        {linWeets
          .sort((a, b) => b.createdAt! - a.createdAt!)
          .map((weet, idx) => (
            <LinWeetItem
              key={idx}
              weet={weet}
              isMine={userObj?.uid === weet.creatorId}
            />
          ))}
      </ul>
    </div>
  )
}

export default Home
