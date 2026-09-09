import {useState, useEffect} from 'react'

const Tarefas = () => {
    //HOOK-useState - manipula o estado da variável e guarda os dados
    const [tarefas,setTarefas] = useState(() => {
        const salvarTarefas = localStorage.getItem("item-tarefa")
        return salvarTarefas ? JSON.parse(salvarTarefas): [];
    });
    const [campo, setCampo] = useState("");

    const [filtro, setFiltro] = useState("Todas");

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
            status: "Pendente",
        }

        setTarefas([...tarefas, novaTarefa]);
        setCampo("");
    };

    const RemoverTarefa = (id) => {
        const apagarTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
        setTarefas(apagarTarefas);
    }

    const TarefaConcluida = (id) => {
        const atualizarTarefas = tarefas.map((tarefa) => {
            if (tarefa.id === id) {
                return {...tarefa, status: tarefa.status === "Pendente" ? "Concluida" : "Pendente"};
            }
            return tarefa;
        });

        setTarefas(atualizarTarefas);
    };

    const FiltrarTarefas = (status) => {
        if (status === "Todas") {
            return tarefas;
        }
        return tarefas.filter((tarefa) => tarefa.status === status);
    };

  return (
    <>
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-400 rounded-2xl shadow-2xl border border-gray-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Minha Lista de Tarefas</h2>

        <form onSubmit={AdicionarTarefa} className="flex gap-2 mb-6">
            <input
            type="text"
            value={campo}
            onChange={(e) => setCampo(e.target.value)}
            placeholder="Digite uma nova tarefa..."
            className="flex-1 px-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 "
            />
            <button type="submit" className="bg-gray-500 hover:bg-gray-600 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer">
            Adicionar
            </button>
        </form>

        <div className="flex justify-center gap-1 mb-6 font-medium">
            Filtrar por: 
            <button onClick={() => setFiltro("Todas")}
                className="bg-gray-700 hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor- text-white">
                Todas
            </button>
            <button onClick={() => setFiltro("Pendente")}
                className="bg-gray-700 hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor- text-white">
                Pendente
            </button>
            <button onClick={() => setFiltro("Concluida")}
                className="bg-gray-700 hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor- text-white">
                Concluída
            </button>
        </div>

        <ul className="space-y-3">
            {FiltrarTarefas(filtro).map((tarefa) => (
            <li key={tarefa.id} className="flex items-center justify-between p-3 bg-gray-500 rounded-2xl border border-b-gray-800 shadow-2xl hover:bg-gray-600">
                <span className="">{tarefa.text}</span>
                
                {/* arrow function (função seta) que encapsula a execução de outra função. 
                Ela garante que RemoverTarefa só seja executada quando o evento acontecer (como um clique de botão), 
                e não assim que a página carregar.
                */}
                <div className="flex items-center gap-2">

                <div className="flex items-center gap-2 font-medium">
                    {tarefa.status}
                    <button onClick={()=> TarefaConcluida(tarefa.id)}
                        className="bg-gray-700 hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer">
                        {tarefa.status === "Pendente" ? "🟪" : "☑️"}
                     
                    </button>
                </div>
                <button onClick={()=> RemoverTarefa(tarefa.id)}
                className="bg-gray-700 hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer">
                X
                </button>
                </div>
            </li>
            ))}
        </ul>

        {tarefas.length === 0 && <p className="text-center text-gray-700 italic mt-4">Nenhuma tarefa salva.</p>}
        </div>
      
    </>
  )
}

export default Tarefas
