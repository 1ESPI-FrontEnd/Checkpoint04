import {useState, useEffect} from 'react'

const Tarefas = () => {
    //HOOK-useState - manipula o estado da variável e guarda os dados
    const [tarefas,setTarefas] = useState(() => {
        const salvarTarefas = localStorage.getItem("item-tarefa")
        return salvarTarefas ? JSON.parse(salvarTarefas): [];
    });
    const [campo, setCampo] = useState("");

    //HOOK-useEffect - realiza um efeito colateral, no exemplo vai
    //carregar automaticamente as tarefas cadastradas.
    useEffect(() => {
        localStorage.setItem("item-tarefa", JSON.stringify(tarefas));
    }, [tarefas])
    
    const AdicionarTarefa=(e) => {
        e.preventDefault();
        if (!campo.trim()) return;

        const novaTarefa = {
            id:Date.now(),
            text:campo,
        }

        setTarefas([...tarefas, novaTarefa]);
        setCampo();
    };

    const RemoverTarefa = (id) => {
        const apagarTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
        setTarefas(apagarTarefas);
    }

  return (
    <>
        <div className="">
        <h2 className="">Minha Lista de Tarefas</h2>

        <form onSubmit={AdicionarTarefa} className="">
            <input
            type="text"
            value={campo}
            onChange={(e) => setCampo(e.target.value)}
            placeholder="Digite uma nova tarefa..."
            className=""
            />
            <button type="submit" className="">
            Adicionar
            </button>
        </form>

        <ul className="space-y-3">
            {tarefas.map((tarefa) => (
            <li key={tarefa.id} className="">
                <span className="">{tarefa.text}</span>

                {/* arrow function (função seta) que encapsula a execução de outra função. 
                Ela garante que RemoverTarefa só seja executada quando o evento acontecer (como um clique de botão), 
                e não assim que a página carregar.
                */}
                <button onClick={()=> RemoverTarefa(tarefa.id)}
                className="">
                Excluir
                </button>
            </li>
            ))}
        </ul>

        {tarefas.length === 0 && <p className="">Nenhuma tarefa salva.</p>}
        </div>
      
    </>
  )
}

export default Tarefas
