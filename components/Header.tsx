import type { NextPage } from "next";
// import { User } from "../types/User";

type HeaderProps = {
    sair(): void,
    showModal():void
}

// type UserProps = {
//     user: User
// }

export const Header : NextPage<HeaderProps/*,UserProps*/> = ({sair, showModal/*,user*/}) => {
    return (
        <div className="container-header">
            <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
            <button onClick={showModal}><span>+</span>Adicionar Tarefa</button>
            <div className="mobile">
                <span>Olá, </span>
                <img src="/exit-mobile.svg" alt="Sair" onClick={sair}/>
            </div>
            <div className="desktop">
                <span>Olá, </span>
                <img src="/exit-desktop.svg" alt="Sair" onClick={sair}/>
            </div>
        </div>
    );
}