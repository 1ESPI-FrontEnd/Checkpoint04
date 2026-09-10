import {useState, useEffect} from 'react'

const Tarefas = () => {
    // HOOK useState: inicializa o estado com tarefas salvas no localStorage (lazy initialization)
    const [tarefas, setTarefas] = useState(() => {
        const salvarTarefas = localStorage.getItem("item-tarefa")
        return salvarTarefas ? JSON.parse(salvarTarefas) : [];
    });

    // HOOK useState: guarda o valor do campo de texto do título
    const [campo, setCampo] = useState("");
    // HOOK useState: guarda o valor do campo de descrição
    const [descricao, setDescricao] = useState("");
    // HOOK useState: guarda o valor do campo de data
    const [data, setData] = useState("");
    // HOOK useState: guarda o valor do select de prioridade
    const [prioridade, setPrioridade] = useState("Média");

    // HOOK useState: guarda o filtro de status atual
    const [filtro, setFiltro] = useState("Todas");
    // HOOK useState: guarda a ordem de prioridade (Nenhuma / BaixaParaAlta / AltaParaBaixa)
    const [ordemPrioridade, setOrdemPrioridade] = useState("Nenhuma");

    // HOOK useEffect: salva as tarefas no localStorage sempre que o array mudar
    useEffect(() => {
        localStorage.setItem("item-tarefa", JSON.stringify(tarefas));
    }, [tarefas])

    // Mapa de pesos para ordenação
    const pesoPrioridade = { Baixa: 1, Média: 2, Alta: 3 };

    // CALLBACK: handler do evento onSubmit do formulário
    const AdicionarTarefa = (e) => {
        e.preventDefault();
        if (!campo.trim()) return;

        const novaTarefa = {
            id: Date.now(),
            text: campo,
            descricao,
            data,
            prioridade,
            status: "Pendente",
        }

        setTarefas([...tarefas, novaTarefa]);
        setCampo("");
        setDescricao("");
        setData("");
        setPrioridade("Média");
    };

    // CALLBACK: handler do evento onClick do botão de remover
    const RemoverTarefa = (id) => {
        // FILTER: cria novo array excluindo a tarefa com o id correspondente
        const apagarTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
        setTarefas(apagarTarefas);
    }

    // CALLBACK: handler do evento onClick do botão de concluir
    const TarefaConcluida = (id) => {
        // MAP: percorre o array e substitui a tarefa com o id correspondente, alternando o status
        const atualizarTarefas = tarefas.map((tarefa) => {
            if (tarefa.id === id) {
                return {...tarefa, status: tarefa.status === "Pendente" ? "Concluida" : "Pendente"};
            }
            return tarefa;
        });
        setTarefas(atualizarTarefas);
    };

    // Função de filtragem + ordenação combinada
    const FiltrarTarefas = (status) => {
        let resultado = tarefas;

        if (status !== "Todas") {
            // FILTER: filtra pelo status (Pendente/Concluida)
            resultado = resultado.filter((tarefa) => tarefa.status === status);
        }

        // SORT: ordena por prioridade se a ordem não for "Nenhuma"
        if (ordemPrioridade !== "Nenhuma") {
            resultado = [...resultado].sort((a, b) => {
                const diff = pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade];
                // BaixaParaAlta: ordem crescente (1,2,3)
                // AltaParaBaixa: ordem decrescente (3,2,1)
                return ordemPrioridade === "BaixaParaAlta" ? diff : -diff;
            });
        }

        return resultado;
    };

    // Helper: retorna a classe de cor correspondente à prioridade
    const corPrioridade = (p) => {
        switch(p) {
            case "Alta": return "text-red-400";
            case "Média": return "text-yellow-400";
            case "Baixa": return "text-green-400";
            default: return "text-gray-300";
        }
    };

  return (
    <>
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-400 rounded-2xl shadow-2xl border border-gray-400">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Minha Lista de Tarefas</h2>

            {/* CALLBACK onSubmit: dispara AdicionarTarefa ao submeter o formulário */}
            <form onSubmit={AdicionarTarefa} className="flex flex-col gap-2 mb-6">
                {/* CALLBACK onChange: atualiza o estado "campo" a cada tecla digitada */}
                <input
                    type="text"
                    value={campo}
                    onChange={(e) => setCampo(e.target.value)}
                    placeholder="Título da tarefa..."
                    className="px-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-1"
                />
                {/* CALLBACK onChange: atualiza o estado "descricao" */}
                <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição (opcional)..."
                    className="px-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-1"
                />
                <div className="flex gap-2">
                    {/* CALLBACK onChange: atualiza o estado "data" ao selecionar data */}
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="flex-1 px-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-1"
                    />
                    {/* CALLBACK onChange: atualiza o estado "prioridade" ao trocar a opção */}
                    <select
                        value={prioridade}
                        onChange={(e) => setPrioridade(e.target.value)}
                        className="flex-1 px-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-1"
                    >
                        <option value="Alta">🔴 Alta</option>
                        <option value="Média">🟡 Média</option>
                        <option value="Baixa">🟢 Baixa</option>
                    </select>
                </div>
                <button type="submit" className="bg-gray-500 hover:bg-gray-600 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer">
                    Adicionar
                </button>
            </form>

            {/* Filtros de status */}
            <div className="flex justify-center gap-1 mb-6 font-medium">
                Filtrar por:
                {/* CALLBACK onClick: define o filtro de status como "Todas" */}
                <button onClick={() => setFiltro("Todas")}
                    className={`${filtro === "Todas" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Todas
                </button>
                {/* CALLBACK onClick: define o filtro de status como "Pendente" */}
                <button onClick={() => setFiltro("Pendente")}
                    className={`${filtro === "Pendente" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Pendente
                </button>
                {/* CALLBACK onClick: define o filtro de status como "Concluida" */}
                <button onClick={() => setFiltro("Concluida")}
                    className={`${filtro === "Concluida" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Concluída
                </button>
            </div>

            {/* Ordenação por prioridade */}
            <div className="flex justify-center gap-1 mb-6 font-medium">
                Prioridade:
                {/* CALLBACK onClick: desativa a ordenação (mostra na ordem de criação) */}
                <button onClick={() => setOrdemPrioridade("Nenhuma")}
                    className={`${ordemPrioridade === "Nenhuma" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Todas
                </button>
                {/* CALLBACK onClick: ordena de menor para maior prioridade (Baixa → Média → Alta) */}
                <button onClick={() => setOrdemPrioridade("BaixaParaAlta")}
                    className={`${ordemPrioridade === "BaixaParaAlta" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Crescente
                </button>
                {/* CALLBACK onClick: ordena de maior para menor prioridade (Alta → Média → Baixa) */}
                <button onClick={() => setOrdemPrioridade("AltaParaBaixa")}
                    className={`${ordemPrioridade === "AltaParaBaixa" ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-800 font-medium px-5 py-1 rounded-2xl transition-colors cursor-pointer text-white`}>
                    Decrescente
                </button>
            </div>

            <ul className="space-y-3">
                {/* MAP: percorre o array filtrado/ordenado e renderiza um <li> para cada tarefa */}
                {FiltrarTarefas(filtro).map((tarefa) => (
                    <li key={tarefa.id} className="flex items-center justify-between p-3 bg-gray-500 rounded-2xl border border-b-gray-800 shadow-2xl hover:bg-gray-600">
                        <div className="flex-1 mr-2">
                            <span className="font-medium">{tarefa.text}</span>
                            {tarefa.descricao && (
                                <p className="text-sm text-gray-300">{tarefa.descricao}</p>
                            )}
                            <div className="flex gap-3 text-xs mt-1">
                                {tarefa.data && <span>📅 {tarefa.data}</span>}
                                <span className={corPrioridade(tarefa.prioridade)}>
                                    {tarefa.prioridade}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* CALLBACK onClick (arrow function): chama TarefaConcluida com o id da tarefa */}
                            <button onClick={() => TarefaConcluida(tarefa.id)}
                                className="bg-gray-700 hover:bg-gray-800 font-medium px-3 py-1 rounded-2xl transition-colors cursor-pointer">
                                {tarefa.status === "Pendente" ? "🟪" : "☑️"}
                            </button>
                            {/* CALLBACK onClick (arrow function): chama RemoverTarefa com o id da tarefa */}
                            <button onClick={() => RemoverTarefa(tarefa.id)}
                                className="bg-gray-700 hover:bg-gray-800 font-medium px-3 py-1 rounded-2xl transition-colors cursor-pointer">
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