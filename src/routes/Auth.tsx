import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import { authService } from '../firebase'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newAccount, setNewAccount] = useState(false)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    if (name === 'email') setEmail(value)
    else if (name === 'password') setPassword(value)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let data
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        )
      } else {
        data = await signInWithEmailAndPassword(authService, email, password)
      }
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }

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
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Enter your Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Enter your Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
        <br />
        <span onClick={toggleAccount}>
          {newAccount ? 'Go to Sign In' : 'Go to Create Account'}
        </span>
      </form>
      <div>
        <button name="google" onClick={onSocialPopup}>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default Auth
