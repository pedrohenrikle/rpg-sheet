/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModeToggle } from '@/components/mode-toggle'
import * as Box from '@/components/box'
import { Separator } from '@/components/ui/separator'
import {
  Backpack,
  BookOpenText,
  CirclePlusIcon,
  FlameKindling,
  Minus,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Link } from 'react-router-dom'

interface ProfileProps {
  name: string
  age: number
  lore: string
  imageUrl: string
  physicist: number
  mental: number
  life: number
  mana: number
  money: number
  drunkSkill: string
}

type InventoryItem = {
  [key: string]: {
    damage?: number
    range?: number
    quantity: number
  }
}

export function OrdoBeatorum() {
  const [profile, setProfile] = useState<ProfileProps>({
    name: 'RPGista',
    age: 0,
    lore: '',
    imageUrl: '',
    physicist: 0,
    mental: 0,
    life: 0,
    mana: 0,
    money: 0,
    drunkSkill: 'Roteiro',
  })

  const [proficiencies, setProficiencies] = useState<(string | number)[]>([])
  const [features, setFeatures] = useState<(string | number)[]>([])
  const [life, setLife] = useState(profile.physicist * 4)
  const [mana, setMana] = useState(profile.mental * 4)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const { toast } = useToast()

  const [itemModal, setItemModal] = useState(false)
  const [addMoney, setAddMoney] = useState(false)
  const [decreaseMoney, setDecreaseMoney] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('ordo-beatorum')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        const jsonFile = new File(
          [JSON.stringify(parsedData)],
          'ordo-beatorum.json',
          { type: 'application/json' },
        )

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(jsonFile)

        const fileList = dataTransfer.files

        const inputElement = document.createElement('input')
        inputElement.type = 'file'
        inputElement.files = fileList

        const event = new Event('change', { bubbles: true })
        Object.defineProperty(event, 'target', {
          value: inputElement,
          writable: false,
        })

        const eventConverted = event as unknown

        handleFileUpload(eventConverted as ChangeEvent<HTMLInputElement>)
      } catch (error) {
        console.error('Erro ao analisar dados do armazenamento local:', error)
      }
    }
  }, [])

  const handleAddItem = (
    itemName: string,
    itemDamage: number,
    itemRange: number,
    itemQuantity: number,
  ) => {
    addItemToInventory(itemName, itemDamage, itemRange, itemQuantity)
    setItemModal(false)
  }

  const addItemToInventory = (
    itemName: string,
    itemDamage: number,
    itemRange: number,
    itemQuantity: number,
  ) => {
    // Adicionar o novo item ao inventário
    setInventory((prevInventory) => [
      ...prevInventory,
      {
        [itemName]: {
          damage: itemDamage,
          range: itemRange,
          quantity: itemQuantity,
        },
      },
    ])
  }

  const incrementLife = () => {
    if (life < profile.physicist * 4) {
      setLife((prevLife) => prevLife + 1)
    }
  }

  const decrementLife = () => {
    if (life > 0) {
      setLife((prevLife) => prevLife - 1)
    }
  }

  const incrementMana = () => {
    if (mana < profile.mental * 4) {
      setMana((prevMana) => prevMana + 1)
    }
  }

  const decrementMana = () => {
    if (mana > 0) {
      setMana((prevMana) => prevMana - 1)
    }
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const fileContent = event.target?.result as string
      if (!fileContent) return

      const jsonData = JSON.parse(fileContent)
      const {
        profile: newProfile,
        proficiencies: newProficiencies,
        inventory: newInventory,
      } = jsonData as {
        profile: ProfileProps
        proficiencies: any
        inventory: any[]
      }

      setProfile(newProfile)
      setProficiencies(newProficiencies)
      setFeatures(newProficiencies)

      setInventory(newInventory || [])

      setLife(newProfile.life)
      setMana(newProfile.mana)
    }
    reader.readAsText(file)
  }

  const incrementValue = (index: number) => {
    setProficiencies((prevProficiencies) => {
      const newProficiencies = [...prevProficiencies]
      if (typeof newProficiencies[index] === 'number') {
        newProficiencies[index] = (newProficiencies[index] as number) + 1
      }
      return newProficiencies
    })
    setFeatures((prevFeatures) => {
      const newFeatures = [...prevFeatures]
      if (typeof newFeatures[index] === 'number') {
        newFeatures[index] = (newFeatures[index] as number) + 1
      }
      return newFeatures
    })
  }

  const decrementValue = (index: number) => {
    setProficiencies((prevProficiencies) => {
      const newProficiencies = [...prevProficiencies]
      const currentValue = newProficiencies[index]
      if (typeof currentValue === 'number' && currentValue > 0) {
        newProficiencies[index] = currentValue - 1
      }
      return newProficiencies
    })
    setFeatures((prevFeatures) => {
      const newFeatures = [...prevFeatures]
      const currentValue = newFeatures[index]
      if (typeof currentValue === 'number' && currentValue > 0) {
        newFeatures[index] = currentValue - 1
      }
      return newFeatures
    })
  }

  const handleSave = () => {
    const profileWithStats = {
      ...profile,
      life,
      mana,
    }

    const dataToSave = {
      profile: profileWithStats,
      proficiencies,
      inventory,
    }

    const jsonData = JSON.stringify(dataToSave, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'rpg-ordo-beatorum.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: 'Ficha salva!',
      description: 'A ficha foi salva! Cheque seus downloads.',
    })

    localStorage.setItem('ordo-beatorum', JSON.stringify(dataToSave))
  }

  function handleRest() {
    setLife(profile.physicist * 4)
    setMana(profile.mental * 4)
  }

  const removeItemFromInventory = (index: number) => {
    const updatedInventory = [...inventory]
    updatedInventory.splice(index, 1)
    setInventory(updatedInventory)
  }

  function incrementMoney(valueToAdd: number) {
    if (!isNaN(valueToAdd)) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        money: prevProfile.money + valueToAdd,
      }))
      setAddMoney(false)
    }
  }

  function decrementMoney(valueToRemove: number) {
    if (!isNaN(valueToRemove)) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        money: prevProfile.money - valueToRemove,
      }))
      setDecreaseMoney(false)
    }
  }

  return (
    <div className=" text-slate-200 antialiased scroll-smooth flex items-center flex-col">
      <article className="flex w-[1440px] justify-between py-3 gap-5 items-center ">
        <Link to={'/'} unstable_viewTransition>
          <h1 className="font-semibold text-xl">pedrohfk</h1>
        </Link>
        <span className="flex gap-5 items-center">
          <Button className="font-semibold" size={'sm'} onClick={handleSave}>
            Salvar
          </Button>
          <Input
            type="file"
            onChange={handleFileUpload}
            className="file:bg-secondary file:text-secondary-foreground file:rounded-md file:mr-2 h-fit w-fit cursor-pointer"
            accept=".json"
          />
          <ModeToggle />
        </span>
      </article>
      <Separator />
      <div className="w-screen h-fit ">
        <div className="max-w-[1440px] mx-auto my-4">
          <ResizablePanelGroup direction="horizontal" className="gap-5">
            <ResizablePanel className="flex flex-col gap-12 overflow-x-hidden max-h-[89vh]">
              {/* pericias */}
              <Box.Root className="overflow-y-auto flex-1">
                <Box.Header>
                  <Box.Icon>
                    <BookOpenText size={26} className="text-primary" />
                  </Box.Icon>
                  Perícias e Magias
                </Box.Header>
                <Box.Content>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Característica
                        </TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {features.map((item, index) => {
                        if (index % 2 === 0) {
                          const feature = item as string
                          const value = features[index + 1] as number
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {feature}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-5">
                                  <span className="text-primary font-bold text-lg w-6">
                                    {value}
                                  </span>
                                  <Button
                                    variant={'secondary'}
                                    onClick={() => decrementValue(index + 1)}
                                  >
                                    -
                                  </Button>
                                  <Button
                                    variant={'secondary'}
                                    onClick={() => incrementValue(index + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        }
                        return null
                      })}
                    </TableBody>
                  </Table>
                </Box.Content>
              </Box.Root>

              {/* itens */}
              <Box.Root className="overflow-y-auto flex-1">
                <Box.Header className="justify-between">
                  <div className="flex gap-5 items-center">
                    <span className="flex gap-5">
                      <Box.Icon>
                        <Backpack size={26} className="text-primary" />
                      </Box.Icon>
                      Inventário
                    </span>

                    <Dialog open={itemModal}>
                      <DialogTrigger>
                        <Button
                          size={'icon'}
                          onClick={() => setItemModal(true)}
                        >
                          <CirclePlusIcon />
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        onEscapeKeyDown={() => setItemModal(false)}
                        onPointerDownOutside={() => setItemModal(false)}
                      >
                        <DialogHeader>
                          <DialogTitle>Adicionar novo item</DialogTitle>
                          <DialogDescription>
                            Digite abaixo os dados do novo item.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          className="flex flex-col gap-5"
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const itemName = formData.get('itemName') as string
                            const itemDamage = parseInt(
                              formData.get('itemDamage') as string,
                              10,
                            )
                            const itemRange = parseInt(
                              formData.get('itemRange') as string,
                              10,
                            )
                            const itemQuantity = parseInt(
                              formData.get('itemQuantity') as string,
                              10,
                            )
                            // Chamar a função para adicionar o item
                            handleAddItem(
                              itemName,
                              itemDamage,
                              itemRange,
                              itemQuantity,
                            )
                            setItemModal(false) // Fechar o diálogo após adicionar o item
                          }}
                        >
                          <Input
                            type="text"
                            name="itemName"
                            placeholder="Nome do item"
                            required
                          />
                          <Input
                            type="number"
                            name="itemDamage"
                            placeholder="Dano"
                            min="0"
                            required
                          />
                          <Input
                            type="number"
                            name="itemRange"
                            placeholder="Alcance"
                            min="0"
                            required
                          />
                          <Input
                            type="number"
                            name="itemQuantity"
                            placeholder="Quantidade"
                            min="1"
                            required
                          />
                          <span className="flex w-full justify-between mt-5">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setItemModal(false)}
                              >
                                Fechar
                              </Button>
                            </DialogClose>
                            <Button type="submit">Adicionar</Button>
                          </span>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Box.Header>
                <Box.Content>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Quantidade</TableHead>
                        <TableHead className="w-[300px]">Item</TableHead>
                        <TableHead>Dano</TableHead>
                        <TableHead>Alcance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item, index) => {
                        const itemName = Object.keys(item)[0]
                        const itemDetails = item[itemName] as {
                          damage?: number
                          range?: number
                          quantity?: number
                        }

                        const damage = itemDetails && itemDetails.damage
                        const range = itemDetails && itemDetails.range
                        const quantity = itemDetails && itemDetails.quantity

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {quantity}
                            </TableCell>
                            <TableCell className="font-medium">
                              {itemName}
                            </TableCell>
                            <TableCell>
                              {damage ? (
                                <span className="text-primary font-bold text-lg w-6">
                                  {damage}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {range ? (
                                <span className="text-primary font-bold text-lg w-6">
                                  {range}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {/* Botão de exclusão */}
                              <Button
                                variant="destructive"
                                onClick={() => removeItemFromInventory(index)}
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Box.Content>
              </Box.Root>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={35}>
              {/* perfil */}
              <Box.Root className="max-h-fit">
                <Box.Header className="flex-col">
                  <span className="w-full flex flex-col">
                    <h1 className="text-primary text-2xl">{profile.name}</h1>
                    <p className="text-sm font-light">
                      Idade:{' '}
                      <span className="text-primary">{profile.age} anos</span>
                    </p>
                    <p className="text-sm font-light">
                      Locomoção:{' '}
                      <span className="text-primary">
                        {profile.physicist * 3}m / turno
                      </span>
                    </p>
                    <p className="text-sm font-light">
                      Habilidade de bêbado:{' '}
                      <span className="text-primary">{profile.drunkSkill}</span>
                    </p>
                    <div className="flex gap-2 items-center mt-3">
                      <Wallet className="mb-0.5" />
                      <span className="text-primary">
                        {profile.money.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>

                      <Dialog open={decreaseMoney}>
                        <DialogTrigger>
                          <Button
                            size={'icon'}
                            variant={'secondary'}
                            className="flex size-8"
                            onClick={() => setDecreaseMoney(true)}
                          >
                            <Minus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          onPointerDownOutside={() => setDecreaseMoney(false)}
                          onEscapeKeyDown={() => setDecreaseMoney(false)}
                        >
                          <DialogHeader>
                            <DialogTitle>Remover dinheiro</DialogTitle>
                            <DialogDescription>
                              Digite abaixo o valor a ser removido.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(
                                e.currentTarget as HTMLFormElement,
                              )
                              const valueToRemove = parseFloat(
                                (
                                  formData.get('decrementMoney') as string
                                ).replace(',', '.'),
                              )
                              decrementMoney(valueToRemove)
                              e.currentTarget.reset()
                            }}
                            className="flex flex-col gap-5"
                          >
                            <Input
                              type="text"
                              name="decrementMoney"
                              placeholder="Valor"
                              pattern="[0-9]+([,\.][0-9]+)?"
                              title="Utilize apenas números e uma vírgula para separar casas decimais"
                              required
                            />
                            <span className="flex w-full justify-between mt-5">
                              <DialogClose>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => setDecreaseMoney(false)}
                                >
                                  Fechar
                                </Button>
                              </DialogClose>
                              <Button type="submit">Remover</Button>
                            </span>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={addMoney}>
                        <DialogTrigger>
                          <Button
                            size={'icon'}
                            variant={'secondary'}
                            className="flex size-8"
                            onClick={() => setAddMoney(true)}
                          >
                            <Plus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          onPointerDownOutside={() => setAddMoney(false)}
                          onEscapeKeyDown={() => setAddMoney(false)}
                        >
                          <DialogHeader>
                            <DialogTitle>Adicionar dinheiro</DialogTitle>
                            <DialogDescription>
                              Digite abaixo o valor a ser adicionado.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(
                                e.currentTarget as HTMLFormElement,
                              )
                              const valueToAdd = parseFloat(
                                (
                                  formData.get('incrementMoney') as string
                                ).replace(',', '.'),
                              )
                              incrementMoney(valueToAdd)
                              e.currentTarget.reset()
                            }}
                            className="flex flex-col gap-5"
                          >
                            <Input
                              type="text"
                              name="incrementMoney"
                              placeholder="Valor"
                              pattern="[0-9]+([,\.][0-9]+)?"
                              title="Utilize apenas números e uma vírgula para separar casas decimais"
                              required
                            />
                            <span className="flex w-full justify-between mt-5">
                              <DialogClose>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => setAddMoney(false)}
                                >
                                  Fechar
                                </Button>
                              </DialogClose>
                              <Button type="submit">Adicionar</Button>
                            </span>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </span>
                  <img
                    src={profile.imageUrl}
                    alt="User character token"
                    className="rounded-lg aspect-square object-cover w-full max-w-96"
                  />
                </Box.Header>

                <Box.Content className="flex flex-col">
                  <section className="flex flex-col gap-5">
                    <div>
                      <p className="text-base font-light mb-2">
                        Vida:{' '}
                        <span className="text-primary font-semibold text-lg">
                          {life} / {profile.physicist * 4}
                        </span>
                      </p>
                      <Progress
                        value={(life / (profile.physicist * 4)) * 100}
                        className="mb-5"
                      />
                      <div className="flex justify-between">
                        <span className="flex gap-2">
                          <Button variant="secondary" onClick={decrementLife}>
                            -
                          </Button>
                          <Button variant="secondary" onClick={incrementLife}>
                            +
                          </Button>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-light mb-2">
                        Mana:{' '}
                        <span className="text-primary font-semibold text-lg">
                          {mana} / {profile.mental * 4}
                        </span>
                      </p>
                      <Progress
                        value={(mana / (profile.mental * 4)) * 100}
                        className="mb-5"
                      />
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={decrementMana}>
                          -
                        </Button>
                        <Button variant="secondary" onClick={incrementMana}>
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Switch />
                        <p className="text-base font-sem">Bêbado</p>
                      </div>
                      <Button className="w-fit" onClick={handleRest}>
                        <FlameKindling />
                      </Button>
                    </div>
                  </section>
                </Box.Content>
              </Box.Root>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
