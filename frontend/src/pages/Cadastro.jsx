import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFigurinhas } from "../services/api";
import { useState } from "react";

export default function Cadastro() {
  const queryClient = useQueryClient();


  const mutationAdicionar = useMutation({
    mutationFn: (data) => createFigurinhas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
      setNumero("");
      setNome("");
      setDescricao("");
      setCategoria("");
      setRaridade("");
      setImagem("");
      alert("Figurinha cadastrada com sucesso!");
    },
  });

  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [raridade, setRaridade] = useState("");
  const [imagem, setImagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    mutationAdicionar.mutate({
      numero: Number(numero),
      nome,
      descricao,
      categoria,
      raridade,
      imagem,
    });
  };

  return (
    <>
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

        <button type="submit" disabled={mutationAdicionar.isPending}>
          {mutationAdicionar.isError && (
            <p>Erro ao cadastrar figurinha. Tente novamente.</p>
          )}
          {mutationAdicionar.isPending ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </>
  );
}
