import type { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";

type LoginProps = {
    setToken(s: string): void
    setUser(s: string): void
}

export const Login: NextPage<LoginProps> = ({setToken, setUser}) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const doLogin = async () => {
        try{
            setError('');
            if(!login || !password){
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                const obj = result.data;
                localStorage.setItem('accessToken',obj.token);
                localStorage.setItem('name',obj.name);
                setToken(obj.token);
            }
        }catch(e : any){
            console.log(`Erro ao efetuar login: ${e}`);
            if(e?.response?.data?.error){
                setError(e.response.data.error);
            }else{
                setError(`Erro ao efetuar login, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const createUser = async () => {
        setUser('1');
        setToken('');
    }

    return (
        <div className="container-login_user">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {error && <p className="error">{error}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Login Icone" />
                    <input type='text' placeholder="Login"
                        value={login}
                        onChange={evento => setLogin(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                    />
                </div>
                <button onClick={doLogin} disabled={loading}>{loading ? '...Carregando': 'Login'}</button>
                <button onClick={createUser}>Primeiro Acesso</button>
            </div>
        </div>
    );
}