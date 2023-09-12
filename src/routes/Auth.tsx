import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { MouseEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../firebase'
import { AuthHookForm } from '../types/AuthForm'
import toastOptions from '../types/ToastOptions'

const Auth = () => {
  const form = useForm<AuthHookForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { register, watch, setValue, handleSubmit, formState } = form
  const { errors } = formState
  const [newAccount, setNewAccount] = useState(false)

  const onSubmit = async () => {
    try {
      let data
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          watch('email'),
          watch('password')
        )
        toast.success('Sign up is complete.', toastOptions)
      } else {
        data = await signInWithEmailAndPassword(
          authService,
          watch('email'),
          watch('password')
        )
        toast.success('Sign in is complete.', toastOptions)
      }
      console.log(data)
    } catch (e) {
      toast.error('오류 발생!')
    }
  }

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message, toastOptions)
    } else if (errors.password) {
      toast.error(errors.password.message, toastOptions)
    }
  }, [errors])

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          id="email"
          type="text"
          placeholder="Enter your Email"
          {...register('email', {
            required: {
              value: true,
              message: 'Email is Required',
            },
            pattern: {
              value: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
              message: 'Invalid email format',
            },
          })}
        />
        <input
          id="password"
          type="password"
          placeholder="Enter your Password"
          {...register('password', {
            required: {
              value: true,
              message: 'Password is Required',
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Invalid password format',
            },
          })}
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
