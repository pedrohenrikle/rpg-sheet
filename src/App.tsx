import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { OrdoBeatorum } from './pages/ordo-beatorum'

export function App() {
  return (
    <ThemeProvider defaultTheme="red" storageKey="vite-ui-theme">
      <OrdoBeatorum />
      <Toaster />
    </ThemeProvider>
  )
}
