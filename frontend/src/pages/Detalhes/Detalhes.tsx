import { getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFigurinhaPorId,
  getAlbum,
  adicionarColecao,
  removerColecao,
} from "../../services/api";
import styles from "./Detalhes.module.css";
import { EntradaAlbum } from "../../types";

type AlbumResponse = {
  data: EntradaAlbum[];
};

type MutationContext = {
  albumAnterior: AlbumResponse | undefined;
};

const routeApi = getRouteApi("/figurinhas/$id");
export default function Detalhes() {
  const queryClient = useQueryClient();
  const { id } = routeApi.useParams();

  // Hook do TanStack Query para buscar os detalhes específicos de UMA figurinha pelo ID.
  const { data: figurinhaExistente } = useQuery({
    queryKey: ["figurinha", id],
    queryFn: () => getFigurinhaPorId(id),
  });

  // Hook do TanStack Query para buscar as informações do álbum específicas para essa figurinha (se o usuário tem e quantas).
  const { data: albumData } = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbum({ figurinhaId: id }),
  });

  const figurinha = figurinhaExistente?.data;
  const entradaAlbum = albumData?.data?.find(
    (a) => a.figurinhaId === Number(id),
  );

  // Mutação do TanStack Query para adicionar mais uma cópia dessa figurinha na coleção do usuário.
  const mutationAdicionar = useMutation<
    unknown,
    Error,
    number,
    MutationContext
  >({
    mutationFn: (figurinhaId: number) => adicionarColecao(figurinhaId),

    // 1. Ocorre IMEDIATAMENTE ao clicar no botão
    onMutate: async (figurinhaId) => {
      // Cancelar qualquer busca (refetch) em andamento para que não sobrescreva nossa atualização otimista
      await queryClient.cancelQueries({ queryKey: ["album", id] });

      // Guardar o estado ATUAL do cache (antes da modificação) para podermos fazer o rollback se der erro
      const albumAnterior = queryClient.getQueryData<AlbumResponse>([
        "album",
        id,
      ]);

      // Atualizar o cache manualmente de forma otimista (exemplo: somando +1 na quantidade)
      // DICA: Você precisará olhar como é o formato dos dados que a sua API retorna (se é um array, um objeto, etc)
      // e retornar esse mesmo formato alterado.
      queryClient.setQueryData(
        ["album", id],
        (dadosAntigos: AlbumResponse | undefined) => {
          // Se por algum motivo o cache estiver vazio, não fazemos nada
          if (!dadosAntigos || !dadosAntigos.data) return dadosAntigos;

          // 1. Clonamos o array antigo de figurinhas do álbum
          const novaListaDeAlbuns = [...dadosAntigos.data];

          // 2. Procuramos se a figurinha já existe no álbum
          const index = novaListaDeAlbuns.findIndex(
            (a) => a.figurinhaId === Number(figurinhaId),
          );

          if (index !== -1) {
            // Se ela já existe, pegamos a figurinha atual e somamos +1 na quantidade
            novaListaDeAlbuns[index] = {
              ...novaListaDeAlbuns[index],
              quantidade: novaListaDeAlbuns[index].quantidade + 1,
            };
          } else {
            // Se ela não existe (faltando), nós simulamos a criação dela com quantidade 1
            novaListaDeAlbuns.push({
              id: 0, // temporário, será substituído pelo onSettled
              figurinhaId: Number(figurinhaId),
              quantidade: 1,
            });
          }

          // 3. Retornamos o formato original da API do Axios (objeto contendo .data)
          return {
            ...dadosAntigos,
            data: novaListaDeAlbuns,
          };
        },
      );

      // Retornar os dados antigos. Eles serão passados para a função onError caso a requisição falhe.
      return { albumAnterior };
    },

    // 2. Ocorre SOMENTE se a API retornar erro (ex: 500, 400 ou sem internet)
    onError: (err, figurinhaId, context) => {
      // Desfazer a ação otimista, voltando para o valor que salvamos no "onMutate"
      if (context?.albumAnterior) {
        queryClient.setQueryData(["album", id], context.albumAnterior);
        alert("Falhou");
        // Opcional: mostrar um toast/alert avisando o usuário que falhou
      }
    },

    // 3. Ocorre SEMPRE no final (dando sucesso ou erro)
    onSettled: () => {
      // Forçar uma busca na API para garantir que os dados da tela estão exatamente iguais aos do banco de dados
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  // Mutação otimista para remover uma cópia da figurinha da coleção.
  // Se tiver repetidas (quantidade > 1), decrementa. Se for a última (quantidade = 1), remove do álbum.
  const mutationRemover = useMutation<unknown, Error, number, MutationContext>({
    mutationFn: (figurinhaId: number) => removerColecao(figurinhaId),

    // 1. Ocorre IMEDIATAMENTE ao clicar no botão
    onMutate: async (figurinhaId) => {
      // Cancela refetches em andamento para não sobrescrever a atualização otimista
      await queryClient.cancelQueries({ queryKey: ["album", id] });

      // Salva o estado atual do cache para rollback em caso de erro
      const albumAnterior = queryClient.getQueryData<AlbumResponse>([
        "album",
        id,
      ]);

      queryClient.setQueryData(
        ["album", id],
        (dadosAntigos: AlbumResponse | undefined) => {
          if (!dadosAntigos || !dadosAntigos.data) return dadosAntigos;

          // Clona o array atual do álbum
          const novaListaDeAlbuns = [...dadosAntigos.data];

          // Busca o índice da figurinha no álbum
          const index = novaListaDeAlbuns.findIndex(
            (a) => a.figurinhaId === Number(figurinhaId),
          );

          if (index !== -1) {
            if (novaListaDeAlbuns[index].quantidade > 1) {
              // Tem repetidas — decrementa 1
              novaListaDeAlbuns[index] = {
                ...novaListaDeAlbuns[index],
                quantidade: novaListaDeAlbuns[index].quantidade - 1,
              };
            } else {
              // Era a última cópia — remove a entrada do álbum
              novaListaDeAlbuns.splice(index, 1);
            }
          }

          // Retorna o novo estado no formato da API
          return { ...dadosAntigos, data: novaListaDeAlbuns };
        },
      );

      return { albumAnterior };
    },

    // 2. Ocorre SOMENTE se a API retornar erro — desfaz a ação otimista
    onError: (err, figurinhaId, context) => {
      if (context?.albumAnterior) {
        queryClient.setQueryData(["album", id], context.albumAnterior);
        alert("Falhou");
      }
    },

    // 3. Ocorre SEMPRE no final — sincroniza com o banco independente do resultado
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  if (!figurinha) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imagemContainer}>
          <img
            src={figurinha.imagem}
            alt={figurinha.nome}
            className={styles.imagem}
          />
        </div>
        <div className={styles.info}>
          <h1 className={styles.nome}>{figurinha.nome}</h1>
          <p className={styles.descricao}>{figurinha.descricao}</p>

          <div className={styles.meta}>
            <span className={styles.tag}>{figurinha.categoria}</span>
            <span
              className={`${styles.tag} ${
                figurinha.raridade === "Comum"
                  ? styles.tagComum
                  : figurinha.raridade === "Rara"
                    ? styles.tagRara
                    : styles.tagLendaria
              }`}
            >
              {figurinha.raridade}
            </span>
          </div>

          <div className={styles.quantidade}>
            <span className={styles.qtdLabel}>Quantidade:</span>
            <button
              className={styles.btnQtd}
              disabled={mutationRemover.isPending}
              onClick={() => mutationRemover.mutate(figurinha.id)}
            >
              -
            </button>
            <span className={styles.qtdValor}>
              {entradaAlbum?.quantidade ?? 0}
            </span>
            <button
              className={styles.btnQtd}
              disabled={mutationAdicionar.isPending}
              onClick={() => mutationAdicionar.mutate(figurinha.id)}
            >
              +
            </button>

            <span
              className={`${styles.status} ${
                !entradaAlbum
                  ? styles.statusFaltando
                  : entradaAlbum.quantidade === 1
                    ? styles.statusColada
                    : styles.statusRepetida
              }`}
            >
              {!entradaAlbum
                ? "Faltando"
                : entradaAlbum.quantidade === 1
                  ? "Colada"
                  : "Repetida"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
