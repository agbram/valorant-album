import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFigurinhas,
  updateFigurinhas,
  getFigurinhaPorId,
} from "../../services/api"; // Importe seus métodos de API aqui
import { useState, useEffect, FormEvent } from "react";
import { getRouteApi } from "@tanstack/react-router";
import styles from "./Edicao.module.css";
import { CriarFigurinhaPayload } from "../../types";

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

  // 3. Busca os dados da API apenas se estiver no modo Edição.
  // O uso do "enabled: isEdicao" no useQuery do TanStack Query impede que a requisição seja feita ao abrir a tela de cadastro novo.
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

  // Mutação do TanStack Query para ADICIONAR nova figurinha.
  // Usado para enviar os novos dados para a API (via POST).
const mutationAdicionar = useMutation<unknown, Error, CriarFigurinhaPayload>({
  mutationFn: (data: CriarFigurinhaPayload) => createFigurinhas(data),
    onSuccess: () => {
      // Atualiza os dados no cache global para a lista de figurinhas, forçando a listagem a atualizar.
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
      limparFormulario();
      alert("Figurinha cadastrada com sucesso!");
    },
  });

  // 5. Mutação do TanStack Query para ATUALIZAR figurinha existente.
const mutationEditar = useMutation<unknown, Error, Partial<CriarFigurinhaPayload>>({
  mutationFn: (data: Partial<CriarFigurinhaPayload>) => updateFigurinhas(id, data), // Certifique-se que sua api aceita (id, data)
    onSuccess: () => {
      // Invalida a lista geral e o cache da figurinha específica editada.
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

  // 6. Trata a submissão de forma dinâmica baseada no modo da tela, chamando a mutação adequada.
  const handleSubmit = (e: FormEvent) => {
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
      <div className={styles.container}>
        <h1 className={styles.titulo}>
          {isEdicao
            ? `Editando a Figurinha ${id}`
            : "Cadastrando Nova Figurinha"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Numero:</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className={styles.input}
              disabled
            />
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Categoria:</label>
            <select
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Selecione...</option>
              <option value="Duelista">Duelista</option>
              <option value="Controlador">Controlador</option>
              <option value="Iniciador">Iniciador</option>
              <option value="Sentinela">Sentinela</option>
            </select>
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Raridade:</label>
            <select
              name="raridade"
              value={raridade}
              onChange={(e) => setRaridade(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Selecione...</option>
              <option value="Lendaria">Lendária</option>
              <option value="Rara">Rara</option>
              <option value="Comum">Comum</option>
            </select>
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Imagem:</label>
            <textarea
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              required
              className={styles.input}
              placeholder="Insira a url da imagem"
            />
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={styles.input}
            />
          </div>
          <br />

          {(mutationAdicionar.isError || mutationEditar.isError) && (
            <p style={{ color: "red" }}>
              Erro ao processar requisição. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            disabled={salvandoDados}
            className={styles.botao}
          >
            {salvandoDados
              ? "Salvando..."
              : isEdicao
                ? "Salvar Alterações"
                : "Cadastrar"}
          </button>
        </form>
      </div>
    </>
  );
}
