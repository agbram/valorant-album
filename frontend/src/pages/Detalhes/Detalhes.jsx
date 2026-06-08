import { getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFigurinhaPorId,
  getAlbum,
  adicionarColecao,
  removerColecao,
} from "../../services/api";
import styles from './Detalhes.module.css'

const routeApi = getRouteApi("/figurinhas/$id");
export default function Detalhes() {
  const queryClient = useQueryClient();
  const { id } = routeApi.useParams();

  const { data: figurinhaExistente } = useQuery({
    queryKey: ["figurinha", id],
    queryFn: () => getFigurinhaPorId(id),
  });

  const { data: albumData } = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbum({ figurinhaId: id }),
  });

  const figurinha = figurinhaExistente?.data;
  const entradaAlbum = albumData?.data?.find(
    (a) => a.figurinhaId === Number(id),
  );

  const mutationAdicionar = useMutation({
    mutationFn: (figurinhaId) => adicionarColecao(figurinhaId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  const mutationRemover = useMutation({
    mutationFn: (figurinhaId) => removerColecao(figurinhaId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  if (!figurinha) return <p>Carregando...</p>;

return (
  <div className={styles.container}>
    <div className={styles.card}>
      <div className={styles.imagemContainer}>
        <img src={figurinha.imagem} alt={figurinha.nome} className={styles.imagem} />
      </div>
      <div className={styles.info}>
        <h1 className={styles.nome}>{figurinha.nome}</h1>
        <p className={styles.descricao}>{figurinha.descricao}</p>

        <div className={styles.meta}>
          <span className={styles.tag}>{figurinha.categoria}</span>
          <span className={`${styles.tag} ${
            figurinha.raridade === 'Comum' ? styles.tagComum :
            figurinha.raridade === 'Rara' ? styles.tagRara :
            styles.tagLendaria
          }`}>{figurinha.raridade}</span>
        </div>

        <div className={styles.quantidade}>
          <span className={styles.qtdLabel}>Quantidade:</span>
          <button className={styles.btnQtd} disabled={mutationRemover.isPending} onClick={() => mutationRemover.mutate(figurinha.id)}>-</button>
          <span className={styles.qtdValor}>{entradaAlbum?.quantidade ?? 0}</span>
          <button className={styles.btnQtd} disabled={mutationAdicionar.isPending} onClick={() => mutationAdicionar.mutate(figurinha.id)}>+</button>

          <span className={`${styles.status} ${
            !entradaAlbum ? styles.statusFaltando :
            entradaAlbum.quantidade === 1 ? styles.statusColada :
            styles.statusRepetida
          }`}>
            {!entradaAlbum ? 'Faltando' : entradaAlbum.quantidade === 1 ? 'Colada' : 'Repetida'}
          </span>
        </div>
      </div>
    </div>
  </div>
)
}
