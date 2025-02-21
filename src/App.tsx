// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import {routeTree} from './routeTree.gen';
import { Toaster } from './components/ui/toast';

const router = createRouter({routeTree: routeTree})

function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
        <RouterProvider router={router} />
        <Toaster />
        </>
    )
}

export default App
