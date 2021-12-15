import { NextPage } from "next";
import { useEffect } from "react";
import { useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { List } from "../components/List";
import { executeRequest } from "../services/api";
import { Task } from "../types/Task";

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');
    const [tasks, setTasks] = useState<Task[]>([]);

    const sair = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setToken('');
    }

    const getFilteredList = async () => {
        try{
            let filter = '?status='+status;
            if(previsionDateStart){
                filter += '&previsionDateStart='+previsionDateStart;
            }

            if(previsionDateEnd){
                filter += '&previsionDateEnd='+previsionDateEnd;
            }

            const result = await executeRequest('task'+filter, 'GET');
            if(result && result.data){
                setTasks(result.data as Task[]);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() =>{
        getFilteredList();
    }, [status, previsionDateStart, previsionDateEnd]);

    return (
    <>
        <Header sair={sair}/>
        <Filter 
            previsionDateStart={previsionDateStart}
            previsionDateEnd={previsionDateEnd}
            status={status}
            setPrevisionDateStart={setPrevisionDateStart}
            setPrevisionDateEnd={setPrevisionDateEnd}
            setStatus={setStatus}
        />
        <List tasks={tasks}/>
        <Footer />
    </>);
}