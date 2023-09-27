import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { MouseEvent, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { authService } from '../firebase'

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false)

  const toggleAccount = () => setNewAccount((newAccount) => !newAccount)

  const onSocialPopup = async (e: MouseEvent<HTMLButtonElement>) => {
    let provider
    if (e.currentTarget.name === 'google') {
      provider = new GoogleAuthProvider()
    }

    if (!provider) return

    await signInWithPopup(authService, provider)
  }

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={'#04aaff'}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm newAccount={newAccount} />
      <div className="authBtns"></div>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? 'Go to Sign In' : 'Go to Create Account'}
      </span>
      <button name="google" onClick={onSocialPopup} className="authBtn">
        Continue with Google <FontAwesomeIcon icon={faGoogle} />
      </button>
    </div>
  )
}

export default Auth
