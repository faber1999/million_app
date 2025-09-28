import { useState } from 'react'

const useHomePage = () => {
  const [state, setState] = useState({})
  return {
    state
  }
}

export default useHomePage
