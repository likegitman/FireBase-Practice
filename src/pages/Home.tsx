import { User } from 'firebase/auth'
import { addDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import LinWeetItem from '../components/LinWeetItem'
import { dbService, storageService } from '../firebase'
import { GetWeetsTypes } from '../types/GetWeetsTypes'
import { v4 as uuidv4 } from 'uuid'

const Home = ({ userObj }: { userObj: User | undefined }) => {
  const form = useForm({ defaultValues: { linweet: '' } })
  const { register, watch, setValue } = form
  const [linWeets, setLinWeets] = useState<GetWeetsTypes[]>([])
  const [attachment, setAttachment] = useState<string>()

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
    let attachmentUrl = ''

    if (attachment) {
      const imgFileRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`)
      const res = await uploadString(imgFileRef, attachment, 'data_url')
      attachmentUrl = await getDownloadURL(res.ref)
    }

    const linweetObj = {
      text: watch('linweet'),
      createdAt: Date.now(),
      creatorId: userObj?.uid,
      attachmentUrl,
    }

    await addDoc(collection(dbService, 'linweets'), linweetObj)

    setValue('linweet', '')
    setAttachment('')
  }

  const onFileChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const theFile: FileList | null = e.target.files
    if (!theFile) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const { result } = reader
      setAttachment(result?.toString())
    }
    reader.readAsDataURL(theFile[0])
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
        <input type="file" accept="image/*" onChange={onFileChanged} />
        <input type="submit" value="Linweet" />
        {attachment && (
          <div>
            <img
              src={attachment}
              width="50px"
              height="50px"
              alt="linweet img"
            />
            <button onClick={() => setAttachment('')}>Clear</button>
          </div>
        )}
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
