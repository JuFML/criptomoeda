import { Outlet } from 'react-router'
import { Header } from '../header'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout