import moment from "moment";
import { NextPage } from "next";
import { Task } from "../types/Task";
import { Item } from './Item';


type ListProps = {
    tasks : Task[]
}

export const List : NextPage<ListProps> = ({ tasks }) => {
    return (
        <div className={"container-list" + (tasks && tasks.length > 0 ? "" : " empty")}>
            { tasks && tasks.length > 0 
                ?  
                    tasks.map(task => <Item task={task}/>)
                :
                <>
                    <img src="/empty.svg" alt="Nenhuma tarefa encontrada"/>
                    <p>Você ainda não possui tarefas cadastradas!</p>
                </>
            }
        </div>
    );
}