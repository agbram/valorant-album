import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFigurinhas } from "../../services/api";
import { useState } from "react";
import styles from "./Cadastro.module.css";

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
      <div className={styles.container}>
        <h1 className={styles.titulo}>Cadastrando figurinha</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Numero:</label>
            <input
              className={styles.input}
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Nome:</label>
            <input
              className={styles.input}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Categoria:</label>
            <select
              className={styles.select}
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
          </div>
          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Raridade:</label>
            <select
              className={styles.select}
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
          </div>
          <br />

          <div className={styles.campo}>
            <label className={styles.label}>Imagem:</label>
            <textarea
              className={styles.input}
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              placeholder="Insira a url da imagem"
              required
            />
          </div>

          <br />
          <div className={styles.campo}>
            <label className={styles.label}>Descrição:</label>
            <textarea
              className={styles.input}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <br />

          <button
            type="submit"
            disabled={mutationAdicionar.isPending}
            className={styles.botao}
          >
            {mutationAdicionar.isError && (
              <p>Erro ao cadastrar figurinha. Tente novamente.</p>
            )}
            {mutationAdicionar.isPending ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </>
  );
}
