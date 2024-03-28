import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error: Error | undefined = useRouteError() as Error | undefined
  console.error(error)

  let errorMessage = ''

  if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'Erro desconhecido'
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center flex-col gap-3">
      <h1 className="font-bold text-3xl">Oops!</h1>
      <p className="text-lg">
        A aventura já vai começar, mas ela fica pra outra direção!
      </p>
      <p className="flex mt-5 items-center gap-2 text-lg">
        Aparentemente, foi um erro do tipo:
        <i className="font-bold text-xl text-primary mt-0.5">{errorMessage}</i>
      </p>
      <img
        className="w-96 rounded-lg"
        src="https://media.tenor.com/8eNVOl7jmDUAAAAM/zoro-lost.gif"
        alt="Zoro perdido"
      />
    </div>
  )
}
