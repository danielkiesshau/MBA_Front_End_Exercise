import { NextPage } from "next";
import { useState } from "react"
import { useRouter } from 'next/router'
import { executeRequest } from "../../services/api";
import { LoginResponse } from "../../types/LoginResponse";

type LoginProps = {
    setToken(s: string) : void
}


const isFormValid = (login: string, password: string): boolean => {
    if (!login || !password) return false;
    return true;
}

export const Login : NextPage<LoginProps> = ({setToken}) => {
    const router = useRouter()

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setError] = useState('');

    const validateForm = () => {
        if (isFormValid(login,password)) {
            setError('favor preencher os dados');
            return;
        }
    };

    const setAPIError = (e: any) => {
        if(e?.response?.data?.error){
            console.log(e?.response);
            setError(e?.response?.data?.error);
            return;
        }
        console.log(e);
        setError('Ocorreu erro ao efetuar login, tente novamenete');
    }

    const doLogin = async () => {
        try {
            validateForm();

            setError('');

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                const loginResponse = result.data as LoginResponse;
                localStorage.setItem('accessToken', loginResponse.token);
                localStorage.setItem('userName', loginResponse.name);
                localStorage.setItem('userEmail', loginResponse.email);
                setToken(loginResponse.token);
            }
        } catch (e : any) {
            setAPIError(e);
        }
    }

    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {msgError && <p>{msgError}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={login} onChange={evento => setLogin(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <button onClick={doLogin}>Login</button>
                <button onClick={() => {
                    router.push('/containers/Register');
                }} className="button-register">Registrar</button>
            </div>
        </div>
    )
}

export default Login;
