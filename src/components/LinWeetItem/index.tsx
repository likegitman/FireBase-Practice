import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import {
  ChangeEvent,
  FormEvent,
  LegacyRef,
  MutableRefObject,
  RefObject,
  useRef,
  useState,
} from 'react'
import { dbService, storageService } from '../../firebase'
import { GetWeetsTypes } from '../../types/GetWeetsTypes'
import * as S from './style'

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
    await updateDoc(doc(dbService, `linweets/${weet.id}`), {
      text: newWeet,
    })
    setEditing(false)
  }

  return (
    <S.LinWeetItemBox>
      {editing ? (
        <>
          <form onSubmit={onEdit}>
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
            />
            <input type="submit" value="Update Linweet" />
          </form>
          <button onClick={() => setEditing((prev) => !prev)}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{weet.text}</h4>
          {weet.attachmentUrl && (
            <img
              src={weet.attachmentUrl}
              alt="linweet img"
              width="50px"
              height="50px"
            />
          )}
          {isMine && (
            <>
              <button onClick={handleEdit}>Edit Weet</button>
              <button onClick={onDelete}>Delete Weet</button>
            </>
          )}
        </>
      )}
    </S.LinWeetItemBox>
  )
}

export default LinWeetItem
