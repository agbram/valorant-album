import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFigurinhas, updateFigurinhas, getFigurinhaPorId } from "../services/api"; // Importe seus métodos de API aqui
import { useState, useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router"

const routeApi = getRouteApi("/figurinhas/$id/editar");

// 1. Declare o routeApi APENAS UMA VEZ e fora do componente. 
// O ponto de interrogação ($id?) diz ao roteador que o ID não é obrigatório (serve para cadastro).

export default function Editar() {
  const queryClient = useQueryClient();

  // 2. Capture o ID usando a API configurada acima
  const { id } = routeApi.useParams();
  const isEdicao = id !== undefined;

  // Estados dos inputs do formulário
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [raridade, setRaridade] = useState("");
  const [imagem, setImagem] = useState("");

  // 3. Busca os dados da API apenas se estiver no modo Edição
  const { data: figurinhaExistente } = useQuery({
    queryKey: ["figurinha", id],
    queryFn: () => getFigurinhaPorId(id),
    enabled: isEdicao, // Bloqueia a requisição se for um cadastro novo
  });

  // 4. Preenche os inputs na tela automaticamente assim que os dados da API chegarem
  useEffect(() => {
    if (isEdicao && figurinhaExistente) {
      setNumero(String(figurinhaExistente.data.numero ?? ""));
      setNome(figurinhaExistente.data.nome ?? "");
      setDescricao(figurinhaExistente.data.descricao ?? "");
      setCategoria(figurinhaExistente.data.categoria ?? "");
      setRaridade(figurinhaExistente.data.raridade ?? "");
      setImagem(figurinhaExistente.data.imagem ?? "");
    }
  }, [figurinhaExistente, isEdicao]);

  // Mutação para ADICIONAR nova figurinha
  const mutationAdicionar = useMutation({
    mutationFn: (data) => createFigurinhas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
      limparFormulario();
      alert("Figurinha cadastrada com sucesso!");
    },
  });

  // 5. Mutação para ATUALIZAR figurinha existente
  const mutationEditar = useMutation({
    mutationFn: (data) => updateFigurinhas(id, data), // Certifique-se que sua api aceita (id, data)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
      queryClient.invalidateQueries({ queryKey: ["figurinha", id] });
      alert("Figurinha atualizada com sucesso!");
    },
  });

  const limparFormulario = () => {
    setNumero("");
    setNome("");
    setDescricao("");
    setCategoria("");
    setRaridade("");
    setImagem("");
  };

  // 6. Trata a submissão de forma dinâmica baseada no modo da tela
  const handleSubmit = (e) => {
    e.preventDefault();

    const dadosFormulario = {
      numero: Number(numero),
      nome,
      descricao,
      categoria,
      raridade,
      imagem,
    };

    if (isEdicao) {
      mutationEditar.mutate(dadosFormulario);
    } else {
      mutationAdicionar.mutate(dadosFormulario);
    }
  };

  // Define se qualquer uma das requisições está salvando dados
  const salvandoDados = mutationAdicionar.isPending || mutationEditar.isPending;

  return (
    <>
      <h1>
        {isEdicao ? `Editando a Figurinha ${id}` : "Cadastrando Nova Figurinha"}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <label>Numero:</label>
        <input
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <br />
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <br />
        <label>Categoria:</label>
        <select
          name="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          <option value="Duelista">Duelista</option>
          <option value="Controlador">Controlador</option>
          <option value="Iniciador">Iniciador</option>
          <option value="Sentinela">Sentinela</option>
        </select>
        <br />
        <label>Raridade:</label>
        <select
          name="raridade"
          value={raridade}
          onChange={(e) => setRaridade(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          <option value="Lendaria">Lendária</option>
          <option value="Rara">Rara</option>
          <option value="Comum">Comum</option>
        </select>
        <br />
        <label>Imagem:</label>
        <input
          type="text"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          required
        />
        <br />
        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <br />

        {(mutationAdicionar.isError || mutationEditar.isError) && (
          <p style={{ color: "red" }}>Erro ao processar requisição. Tente novamente.</p>
        )}

        <button type="submit" disabled={salvandoDados}>
          {salvandoDados 
            ? "Salvando..." 
            : isEdicao ? "Salvar Alterações" : "Cadastrar"
          }
        </button>
      </form>
    </>
  );
}
