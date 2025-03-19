// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import {routeTree} from './routeTree.gen';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './contexts/AuthContext';
import { useMemo } from 'react';

function AppRouter() {
  const auth = useAuthContext();
  
  // Utiliser useMemo pour éviter de recréer le routeur à chaque rendu
  const router = useMemo(() => {
    return createRouter({
      routeTree,
      context: {
        auth,
      },
    });
  }, [auth]);

  return <RouterProvider router={router} />;
}

function App() {
    // const [count, setCount] = useState(0)

    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    )
}

export default App
