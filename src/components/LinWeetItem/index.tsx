import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ChangeEvent, FormEvent, useState } from 'react'
import { dbService } from '../../firebase'
import { GetWeetsTypes } from '../../types/GetWeetsTypes'
import * as S from './style'

const LinWeetItem = ({
  weet,
  isMine,
}: {
  weet: GetWeetsTypes
  isMine: boolean
}) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [newWeet, setNewWeet] = useState<string | undefined>(weet.text)
  const onDelete = async () => {
    const ok = window.confirm('Are you sure you watn to delete thsi nweet?')
    if (ok) await deleteDoc(doc(dbService, `linweets/${weet.id}`))
  }

  const onEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await updateDoc(doc(dbService, `linweets/${weet.id}`), {
      text: newWeet,
    })
    console.log(weet, newWeet)
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
              required
            />
            <input type="submit" value="Update Linweet" />
          </form>
          <button onClick={() => setEditing((prev) => !prev)}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{weet.text}</h4>
          {isMine && (
            <>
              <button onClick={() => setEditing((prev) => !prev)}>
                Edit Weet
              </button>
              <button onClick={onDelete}>Delete Weet</button>
            </>
          )}
        </>
      )}
    </S.LinWeetItemBox>
  )
}

export default LinWeetItem
