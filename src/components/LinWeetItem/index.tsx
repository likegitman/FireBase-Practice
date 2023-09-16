import { GetWeetsTypes } from '../../types/GetWeetsTypes'
import * as S from './style'

const LinWeetItem = ({
  weet,
  isMine,
}: {
  weet: GetWeetsTypes
  isMine: boolean
}) => {
  return (
    <S.LinWeetItemBox>
      <h4>{weet.text}</h4>
      {isMine && (
        <>
          <button>Edit Weet</button>
          <button>Delete Weet</button>
        </>
      )}
    </S.LinWeetItemBox>
  )
}

export default LinWeetItem
