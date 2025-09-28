import useHomePage from './view-model/useHomePage'

const HomePage = () => {
  const { state } = useHomePage()

  return <div>LoadingSpinner</div>
}

export default HomePage
