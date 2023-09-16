import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../../firebase'
import { AuthFormState } from '../../types/AuthFormState'
import toastOptions from '../../types/ToastOptions'

const AuthForm = ({ newAccount }: { newAccount: boolean }) => {
  const form = useForm<AuthFormState>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { register, watch, handleSubmit, formState } = form
  const { errors } = formState

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message, toastOptions)
    } else if (errors.password) {
      toast.error(errors.password.message, toastOptions)
    }
  }, [errors])

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
      toast.error('오류가 발생했습니다.', toastOptions)
    }
  }
  return (
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
            value: /^(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
            message: 'Invalid password format',
          },
        })}
      />
      <input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
    </form>
  )
}

export default AuthForm
