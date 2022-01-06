import type { NextPage } from 'next' 
import { useEffect } from 'react';
import { useState } from 'react'
import { Login} from '../containers/Login' 
import { Home} from '../containers/Home' 
import { Register } from '../containers/Register';

const Index: NextPage = () => {

  const [accessToken, setToken] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem('accessToken');
        if(token){
          setToken(token);
        }
    }
  }, [])

 if (!accessToken) {
   return !isRegistering ? <Login setIsRegistering={setIsRegistering} setToken={setToken}/> : <Register setToken={setToken} setIsRegistering={setIsRegistering}/>
 }

  return (
    <Home setToken={setToken}/> 
  )
}

export default Index
