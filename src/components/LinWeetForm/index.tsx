import { User } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { dbService, storageService } from '../../firebase'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import toastOptions from '../../types/ToastOptions'

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

    if (watch('linweet').length === 0)
      return toast.warning('Please Input your mind', toastOptions)

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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="What's on your mind?"
          {...register('linweet', {
            maxLength: 120,
          })}
          autoComplete="new-password"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChanged}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{ backgroundImage: attachment }}
            alt="linweet img"
          />
          <div className="factoryForm__clear" onClick={() => setAttachment('')}>
            <span>Clear</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}

export default LinWeetForm
