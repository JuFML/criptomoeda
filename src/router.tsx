import { createBrowserRouter } from 'react-router'
import Home from './pages/home'
import Detail from './pages/detail'
import Notfound from './pages/notfound'

const router = () => {
  return (
    createBrowserRouter([
        {
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/detail/:cripto',
                    element: <Detail />
                },
                {
                    path: '*',
                    element: <Notfound />
                },
            ]
        }
    ])
  )
}

export default router
