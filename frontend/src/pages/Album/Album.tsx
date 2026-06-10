import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFigurinhas, getAlbum } from "../../services/api";
import styles from "./Album.module.css";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Album() {
  const navigate = useNavigate();
  // Hook do TanStack Query para buscar a lista de todas as figurinhas.
  // O queryKey serve como um identificador único para fazer o cache desses dados.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["figurinhas"],
    queryFn: () => getFigurinhas(),
  });
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");

  // Hook do TanStack Query para buscar os dados do álbum do usuário (quais ele possui e a quantidade).
  const { data: albumData } = useQuery({
    queryKey: ["album"],
    queryFn: () => getAlbum(),
  });
  const figurinhas = data?.data ?? [];
  const album = albumData?.data ?? [];

  // Função que filtra as figurinhas de acordo com o status e a categoria selecionados na tela.
  const figurinhasFiltradas = figurinhas.filter((figurinha) => {
    const entradaAlbum = album.find((a) => a.figurinhaId === figurinha.id);
    const quantidade = entradaAlbum?.quantidade ?? 0;

    if (categoria && figurinha.categoria !== categoria) return false;

    if (status === "Colada") return quantidade >= 1;
    if (status === "Repetida") return quantidade > 1;
    if (status === "Faltando") return quantidade === 0;

    return true;
  });

  // Objeto que agrupa as figurinhas filtradas por suas respectivas categorias (ex: Duelista, Controlador, etc).
  const porCategoria = {};
  figurinhasFiltradas.forEach((figurinha) => {
    const cat = figurinha.categoria;
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(figurinha);
  });

  const adquirido = () => {};

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meu Álbum</h1>
      <h3>Filtros</h3>
      <div className={styles.filtros}>
        <p>Status:</p>
        <select
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">Todas</option>
          <option value="Colada">Colada</option>
          <option value="Repetida">Repetida</option>
          <option value="Faltando">Não obtida</option>
        </select>
        <p>Categoria:</p>
        <select
          onChange={(e) => setCategoria(e.target.value)}
          className={styles.select}
        >
          <option value="">Todos</option>
          <option value="Duelista">Duelista</option>
          <option value="Iniciador">Iniciador</option>
          <option value="Controlador">Controlador</option>
          <option value="Sentinela">Sentinela</option>
        </select>
      </div>
      {Object.entries(porCategoria).map(([categoria, figurinhas]) => (
        <div key={categoria} className={styles.categoria}>
          <h2 className={styles.categoriaTitulo}>{categoria}</h2>
          <div className={styles.grid}>
            {figurinhas.map((figurinha) => {
              const entradaAlbum = album.find(
                (a) => a.figurinhaId === figurinha.id,
              );
              const quantidade = entradaAlbum?.quantidade ?? 0;
              const estaFaltando = quantidade === 0;

              const raridadeClass =
                figurinha.raridade === "Comum"
                  ? styles.cardComum
                  : figurinha.raridade === "Rara"
                    ? styles.cardRara
                    : styles.cardLendaria;

              return (
                <div
                  key={figurinha.id}
                  className={`${styles.card} ${raridadeClass} ${estaFaltando ? styles.cardDesabilitado : ""}`}
                  onClick={() =>
                    !estaFaltando &&
                    navigate({ to: `/figurinhas/${figurinha.id}` })
                  }
                >
                  {estaFaltando ? (
                    <>
                      <div className={styles.placeholder}>?</div>
                      <p className={styles.nomeFaltando}>{figurinha.nome}</p>
                    </>
                  ) : (
                    <>
                      {quantidade > 1 && (
                        <span className={styles.badge}>+{quantidade - 1}</span>
                      )}
                      <img
                        src={figurinha.imagem}
                        alt={figurinha.nome}
                        className={styles.imagem}
                      />
                      <p className={styles.nome}>{figurinha.nome}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
