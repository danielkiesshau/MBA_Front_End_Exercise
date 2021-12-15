import moment from "moment";
import { NextPage } from "next";
import { Task } from "../types/Task";

type ItemProps = {
    task : Task
}

export const Item : NextPage<ItemProps> = ({ task }) => {

    const getDateText = (task : Task) => {
        if(task && task.finishDate){
            return `Concluído em: ${moment(task.finishDate).format('DD/MM/yyyy')}`;
        }

        return `Previsão de conclusão em: ${moment(task.previsionDate).format('DD/MM/yyyy')}`;
    }

    return (
        <div className="container-item">
            <img src={task?.finishDate ? '/checked.svg' : 'not-checked.svg'}
                alt={task?.finishDate ? 'Tarefa Concluída' : 'Tarefa não concluída'}/>
            <div>
                <p>{task.name}</p>
                <span>{getDateText(task)}</span>
            </div>
        </div>
    );
}