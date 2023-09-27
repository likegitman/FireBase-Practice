import { User } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Navigation = ({ userObj }: { userObj: User | null }) => {
  return (
    <nav>
      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
        }}
      >
        <li>
          <Link to="/" style={{ marginRight: 10 }}>
            <FontAwesomeIcon icon={faTwitter} color={'#04aaff'} size="2x" />
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            style={{
              marginLeft: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={'#04aaff'} size="2x" />
            <span style={{ marginTop: '20px' }}>
              {userObj?.displayName}'s Profile
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
