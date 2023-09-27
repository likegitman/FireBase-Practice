import {
  faPencil,
  faPencilAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { dbService, storageService } from '../../firebase'
import { GetWeetsTypes } from '../../types/GetWeetsTypes'
import toastOptions from '../../types/ToastOptions'

const LinWeetItem = ({
  weet,
  isMine,
}: {
  weet: GetWeetsTypes
  isMine: boolean
}) => {
  const editingRef = useRef<HTMLInputElement | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [newWeet, setNewWeet] = useState<string | undefined>(weet.text)

  const handleEdit = () => {
    setEditing((prev) => !prev)
    if (editingRef.current) editingRef.current.focus()
  }

  const onDelete = async () => {
    const ok = window.confirm('Are you sure you watn to delete thsi nweet?')
    if (ok) {
      await deleteDoc(doc(dbService, `linweets/${weet.id}`))
      if (weet.attachmentUrl)
        await deleteObject(ref(storageService, weet.attachmentUrl))
    }
  }

  const onEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (weet.text !== newWeet) {
      await updateDoc(doc(dbService, `linweets/${weet.id}`), {
        text: newWeet,
      })
      setEditing(false)
    } else {
      toast.error('There are no changes.', toastOptions)
    }
  }

  return (
    <div className="linweet">
      {editing ? (
        <>
          <form onSubmit={onEdit} className="container linweetEdit">
            <input
              type="text"
              placeholder="Edit your linweet"
              value={newWeet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewWeet(e.target.value)
              }
              onBlur={() => setEditing(false)}
              ref={editingRef}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Linweet" className="formBtn" />
          </form>
          <span
            onClick={() => setEditing((prev) => !prev)}
            className="formBtn cancelBtn"
          >
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{weet.text}</h4>
          {weet.attachmentUrl && (
            <img src={weet.attachmentUrl} alt="linweet img" />
          )}
          {isMine && (
            <div className="linweet__actions">
              <span onClick={handleEdit}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LinWeetItem
