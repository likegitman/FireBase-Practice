import { deleteDoc, doc } from 'firebase/firestore'
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
  const onDelete = async () => {
    const ok = window.confirm('Are you sure you watn to delete thsi nweet?')
    if (ok) {
      await deleteDoc(doc(dbService, `linweets/${weet.id}`))
    }
  }
  return (
    <S.LinWeetItemBox>
      <h4>{weet.text}</h4>
      {isMine && (
        <>
          <button>Edit Weet</button>
          <button onClick={onDelete}>Delete Weet</button>
        </>
      )}
    </S.LinWeetItemBox>
  )
}

export default LinWeetItem
