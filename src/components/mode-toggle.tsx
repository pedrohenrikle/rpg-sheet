import { PaintBucket } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <PaintBucket className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('zinc')}>
          Zinc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('red')}>Red</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('blue')}>
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('green')}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('orange')}>
          Orange
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
