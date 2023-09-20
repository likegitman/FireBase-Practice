import { User } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { dbService, storageService } from '../../firebase'
import { v4 as uuidv4 } from 'uuid'

const LinWeetForm = ({ userObj }: { userObj: User | null }) => {
  const form = useForm({ defaultValues: { linweet: '' } })
  const { register, watch, setValue } = form
  const [attachment, setAttachment] = useState<string>()

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
          <img src={attachment} width="50px" height="50px" alt="linweet img" />
          <button onClick={() => setAttachment('')}>Clear</button>
        </div>
      )}
    </form>
  )
}

export default LinWeetForm
