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
    <div>
      <AuthForm newAccount={newAccount} />
      <span onClick={toggleAccount}>
        {newAccount ? 'Go to Sign In' : 'Go to Create Account'}
      </span>
      <button name="google" onClick={onSocialPopup}>
        Continue with Google
      </button>
    </div>
  )
}

export default Auth
