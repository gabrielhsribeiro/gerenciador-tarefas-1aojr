import type { NextPage } from "next";
import { useState } from "react";
import { validateUserAPI } from "../context/validateAPI";
import { executeRequest } from "../services/api";

type UserProps = {
    setToken(s: string): void
    setUser(s: string): void
}

export const User: NextPage<UserProps> = ({setToken, setUser}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const createUser = async () => {
        try{
            setError('');
            const error_msg=validateUserAPI(name,email,password);
            if(error_msg!==''){
                setError(error_msg);
                return
            }

            const body = {
                name,
                email,
                password
            };

            const result = await executeRequest('user', 'POST', body);
            if(result && result.data){
                const obj = result.data;
                localStorage.setItem('accessToken',obj.token);
                localStorage.setItem('name',obj.name);
                setToken(obj.token);
            }

        }catch(e : any){
            console.log(`Erro ao criar usuário: ${e}`);
            if(e?.response?.data?.error){
                setError(e.response.data.error);
            }else{
                setError(`Erro ao criar usuário, tente novamente.`);
            }
        }
    }

    const goBack = async () => {
        localStorage.clear();
        setToken('');
        setUser('');
    }

    return (
        <div className="container-login_user">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {error && <p className="error">{error}</p>}
                <div className="input">
                    <img src="/user.svg" alt="Login Icone" />
                    <input type='text' placeholder="Usuário"
                        value={name}
                        onChange={evento => setName(evento.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div className="input">
                    <img src="/mail.svg" alt="Login Icone" />
                    <input type='text' placeholder="Login"
                        value={email}
                        onChange={evento => setEmail(evento.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                        autoComplete="new-password"

                    />
                </div>
                <button onClick={createUser}>Criar Usuário</button>
                <button onClick={goBack}>Voltar Login</button>
            </div>
        </div>
    );
}
