import { ChangeEvent, FormEvent } from 'react'
import { useForm } from 'react-hook-form'

const Home = () => {
  const form = useForm({ defaultValues: { find: '' } })
  const { register, watch } = form
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  console.log(watch('find'))

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          {...register('find', {
            maxLength: 120,
          })}
        />
        <input type="submit" value="Linweet" />
      </form>
    </div>
  )
}

export default Home
