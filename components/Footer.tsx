import moment from "moment";
import { NextPage } from "next";
type FooterProps = {
}

export const Footer : NextPage<FooterProps> = ({ }) => {
    return (
        <div className="container-footer">
            <button><img src="/add.svg" alt="Adiciona Tarefa"/> Adicionar uma tarefa</button>
            <span>© Copyright {moment().year()}. Todos os direitos reservados.</span>
        </div>
    );
}