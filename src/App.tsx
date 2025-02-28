// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import {routeTree} from './routeTree.gen';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './contexts/AuthContext';

function AppRouter() {
  const auth = useAuthContext();

  const router = createRouter({
    routeTree,
    context: {
      auth,
    },
  });

  return <RouterProvider router={router} />;
}

function App() {
    // const [count, setCount] = useState(0)

    return (
        <AuthProvider>
            <AppRouter />
            <Toaster />
        </AuthProvider>
    )
}

export default App
