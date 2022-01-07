import { NextPage } from "next";
import { useState } from "react"
import { useRouter } from 'next/router'
import { executeRequest } from "../../services/api";
import { LoginResponse } from "../../types/LoginResponse";

type RegisterProps = {
    setToken(s: string) : void
}


const isFormValid = (email: string, password: string, name: string): boolean => {
    if (!email || !password || !name) return false;
    return true;
}

export const Register : NextPage<RegisterProps> = ({setToken}) => {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setError] = useState('');
    const [msgSuccess, setSuccess] = useState('');

    const validateForm = () => {
        if (isFormValid(email,password, name)) {
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
        setError('Ocorreu erro ao efetuar o registro, tente novamenete');
    }

    const doRegister = async () => {
        try {
            validateForm();

            setError('');

            const body = {
                name,
                email,
                password,
            };

            await executeRequest('user', 'POST', body);

            const loginBody = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', loginBody);
            if(result && result.data){
                const loginResponse = result.data as LoginResponse;
                localStorage.setItem('accessToken', loginResponse.token);
                localStorage.setItem('userName', loginResponse.name);
                localStorage.setItem('userEmail', loginResponse.email);
            }

            router.back();
        } catch (e : any) {
            console.log(e)
            setAPIError(e);
        }
    }

    const onClickLogo = () => {
        router.back();
    }

    return (
        <div className="container-register">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" onClick={onClickLogo} />
            <div className="form">
                {msgError && <p>{msgError}</p>}
                {msgSuccess && <p className="message-success">{msgSuccess}</p>}
                <div className="input">
                    <img src="/user.svg" alt="Informe seu nome" />
                    <input type="text" placeholder="Informe seu nome"
                        value={name} onChange={evento => setName(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={email} onChange={evento => setEmail(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <button onClick={doRegister}>Registrar</button>
            </div>
    </div>
    )
}

export default Register;