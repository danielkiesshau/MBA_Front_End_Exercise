import type { NextPage } from 'next' 
import { useEffect } from 'react';
import { useState } from 'react'
import { Login} from '../pages/containers/Login' 
import { Home} from '../pages/containers/Home' 
import { Register } from '../pages/containers/Register';

const Index: NextPage = () => {

  const [accessToken, setToken] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem('accessToken');
        if(token){
          setToken(token);
        }
    }
  }, [])

 if (!accessToken)  return (<Login setToken={setToken}/>);

  return (
    <Home setToken={setToken}/> 
  )
}

export default Index
