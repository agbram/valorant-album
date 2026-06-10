import { getFigurinhas } from "../../services/api";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adicionarColecao, getAlbum } from "../../services/api";
import styles from "./Pacote.module.css";
import { Figurinha } from '../../types'

export default function Pacote() {
  const queryClient = useQueryClient();
  
  // Hook do TanStack Query para buscar todas as figurinhas possíveis para o sorteio do pacote.
  const { data } = useQuery({
    queryKey: ["pacote"],
    queryFn: () => getFigurinhas(),
  });

  // Hook do TanStack Query para buscar o álbum do usuário e saber quais figurinhas ele já possui.
  const { data: albumData } = useQuery({
    queryKey: ["album"],
    queryFn: () => getAlbum(),
  });

const [figurinhaSorteada, setFigurinhaSorteada] = useState<Figurinha | null>(null)
  const [podeAbrir, setPodeAbrir] = useState(() => {
    const ultima = localStorage.getItem("ultimaAbertura");
    if (!ultima) return true;
    return new Date().getTime() - Number(ultima) > 24 * 60 * 60 * 1000;
  });
  const [mensagem, setMensagem] = useState("");
  const [tempoRestante, setTempoRestante] = useState("");

  const figurinhas = data?.data ?? [];
  const album = albumData?.data ?? [];
  
  // Função que realiza o sorteio aleatório de uma figurinha baseada nas probabilidades de cada raridade.
  const sortear = () => {
    const numero = Math.random(); // gera entre 0 e 1

    let raridadeEscolhida;
    if (numero < 0.05) raridadeEscolhida = "Lendaria";
    else if (numero < 0.3) raridadeEscolhida = "Rara";
    else raridadeEscolhida = "Comum";

    // filtra figurinhas da raridade sorteada
    const candidatas = figurinhas.filter(
      (f) => f.raridade === raridadeEscolhida,
    );

    // sorteia uma aleatória dentre as candidatas
    const indice = Math.floor(Math.random() * candidatas.length);
    return candidatas[indice];
  };

  // Mutação do TanStack Query para adicionar a figurinha sorteada na coleção do usuário através da API.
const mutationAdicionar = useMutation<unknown, Error, number>({
  mutationFn: (figurinhaId: number) => adicionarColecao(figurinhaId),

    onSuccess: () => {
      // Invalida as queries antigas para baixar novamente os dados mais recentes do álbum.
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    },
  });
  const ultima = localStorage.getItem("ultimaAbertura");
  const proximaAbertura = ultima
    ? new Date(Number(ultima) + 24 * 60 * 60 * 1000).toLocaleString("pt-BR")
    : null;

  // Função responsável por verificar as regras de abertura do pacote (ex: tempo), fazer o sorteio e chamar a mutação de adição.
  const abrirPacote = () => {
    if (!podeAbrir) return;

    localStorage.setItem("ultimaAbertura", new Date().getTime().toString());
    setPodeAbrir(false);

    const figurinha = sortear();
    const entradaAntes = album.find((a) => a.figurinhaId === figurinha.id)
    setFigurinhaSorteada(figurinha);
    setMensagem(
      entradaAntes
        ? `+1 Repetida! Você já tinha ${entradaAntes.quantidade}`
        : "Nova figurinha desbloqueada!",
    );
    mutationAdicionar.mutate(figurinha.id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Teste sua sorte</h1>

      <button
        className={styles.btnAbrir}
        onClick={abrirPacote}
        disabled={!podeAbrir}
      >
        Abrir Pacote
      </button>
      {!podeAbrir && !figurinhaSorteada && (
        <p className={styles.mensagemBloqueio} >Próximo pacote disponível: {proximaAbertura}</p>
      )}
      {figurinhaSorteada && (
        <div className={styles.card}>
          <img
            src={figurinhaSorteada.imagem}
            alt={figurinhaSorteada.nome}
            className={styles.imagem}
          />
          <p className={styles.nome}>{figurinhaSorteada.nome}</p>
          <span
            className={`${styles.raridade} ${
              figurinhaSorteada.raridade === "Comum"
                ? styles.raridadeComum
                : figurinhaSorteada.raridade === "Rara"
                  ? styles.raridadeRara
                  : styles.raridadeLendaria
            }`}
          >
            {figurinhaSorteada.raridade}
          </span>
          <p
            className={
              mensagem.includes("Nova")
                ? styles.mensagemNova
                : styles.mensagemRepetida
            }
          >
            {mensagem}
          </p>
        </div>
      )}
    </div>
  );
}
