import { RouterProvider } from 'react-router-dom'
import useApp from './shared/useApp'

function App() {
  const { router } = useApp()

  return <RouterProvider router={router} />
}

export default App
