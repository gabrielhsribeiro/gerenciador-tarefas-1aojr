import type { NextPage } from "next";

type HeaderProps = {
    sair(): void,
    showModal():void
}

export const Header : NextPage<HeaderProps> = ({sair, showModal}) => {
    const userName = localStorage.getItem('name');
    return (
        <div className="container-header">
            <img src="/logo.svg" alt="Logo Fiap" className="logo"/>
            <button onClick={showModal}><span>+</span>Adicionar Tarefa</button>
            <div className="mobile">
                <span>Olá, {userName}</span>
                <img src="/exit-mobile.svg" alt="Sair" onClick={sair}/>
            </div>
            <div className="desktop">
                <span>Olá, {userName}</span>
                <img src="/exit-desktop.svg" alt="Sair" onClick={sair}/>
            </div>
        </div>
    );
}