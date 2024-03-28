import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string)
          localStorage.setItem('ordo-beatorum', JSON.stringify(jsonData))
          navigate('/ordo-beatorum')
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center gap-14">
      <h1 className="text-5xl font-bold">Ordo Beatorum</h1>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="file:bg-secondary file:text-secondary-foreground file:rounded-md file:mr-2 h-fit w-fit cursor-pointer"
          />
          <Button type="submit" className="font-semibold fron">
            Gerar ficha
          </Button>
        </form>
      </div>
    </div>
  )
}
