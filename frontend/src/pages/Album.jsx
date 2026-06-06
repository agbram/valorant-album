import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFigurinhas, getAlbum } from "../services/api";

export default function Album() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["figurinhas"],
    queryFn: () => getFigurinhas(),
  });

  const { data: albumData } = useQuery({
    queryKey: ["album"],
    queryFn: () => getAlbum(),
  });

  const porCategoria = {};
const figurinhas = data?.data ?? []
const album = albumData?.data ?? []
  figurinhas.forEach((figurinha) => {
    const cat = figurinha.categoria;
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(figurinha);
  });
  return (
    <>
      {Object.entries(porCategoria).map(([categoria, figurinhas]) => (
        <div key={categoria}>
          <h2>{categoria}</h2>
          <div>
            {figurinhas.map((figurinha) => {
              const entradaAlbum = album.find(
                (a) => a.figurinhaId === figurinha.id,
              );
              const quantidade = entradaAlbum?.quantidade ?? 0;

              return (
                <div key={figurinha.id}>
                  {quantidade === 0 ? (
                    <div>❓ {figurinha.nome}</div>
                  ) : (
                    <div>
                      <img src={figurinha.imagem} />
                      <p>{figurinha.nome}</p>
                      {quantidade > 1 && <span>+{quantidade - 1}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
