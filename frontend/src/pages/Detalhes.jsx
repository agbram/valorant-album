import { getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFigurinhaPorId,
  getAlbum,
  adicionarColecao,
  removerColecao,
} from "../services/api";

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
    <>
      <h1>Detalhes da figurinha {figurinha.numero}</h1>
      <h2>Personagem: {figurinha.nome}</h2>
      <h3>Descrição: {figurinha.descricao}</h3>
      <p>Categoria: {figurinha.categoria}</p>
      <p>Raridade: {figurinha.raridade}</p>
      <p>Imagem: {figurinha.imagem}</p>
      <button
        disabled={mutationAdicionar.isPending}
        onClick={() => mutationAdicionar.mutate(figurinha.id)}
      >
        +
      </button>
      <h4>Quantidade: {entradaAlbum?.quantidade ?? 0}</h4>
      <button
        disabled={mutationRemover.isPending}
        onClick={() => mutationRemover.mutate(figurinha.id)}
      >
        -
      </button>
    </>
  );
}
