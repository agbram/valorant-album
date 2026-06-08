import {
  useQuery,
  useMutation,
  useQueryClient,
  Mutation,
} from "@tanstack/react-query";
import {
  deleteFigurinhas,
  getAlbum,
  getFigurinhas,
  updateFigurinhas,
} from "../../services/api";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import styles from "./Listagem.module.css";

export default function Listagem() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [raridade, setRaridade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoriaTemp, setCategoriaTemp] = useState("");
  const [raridadeTemp, setRaridadeTemp] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["figurinhas", categoria, raridade],
    queryFn: () => getFigurinhas({ categoria, raridade }),
  });

  const { data: albumData } = useQuery({
    queryKey: ["album", quantidade],
    queryFn: () => getAlbum({ quantidade }),
  });

  const mutationApagarDoCatalogo = useMutation({
    mutationFn: (figurinhaId) => deleteFigurinhas(figurinhaId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  const columns = [
    { accessorKey: "id", header: "Id" },
    {
      accessorKey: "imagem",
      header: "Imagem",
      cell: ({ row }) => (
        <img
          src={row.original.imagem}
          alt={row.original.nome}
          style={{ width: 48, height: 48, objectFit: "cover" }}
        />
      ),
    },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "categoria", header: "Categoria" },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const entradaAlbum = albumData?.data?.find(
          (a) => a.figurinhaId === row.original.id,
        );
        return (
          <div className={styles.acoes}>
            <Link
              to="/figurinhas/$id/editar"
              params={{ id: row.original.id }}
              className={styles.btnEditar}
            >
              Editar
            </Link>
            <button
              disabled={mutationApagarDoCatalogo.isPending}
              onClick={() => mutationApagarDoCatalogo.mutate(row.original.id)}
              className={styles.btnRemover}
            >
              Remover
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar estatísticas</p>;
  if (data?.data?.length === 0) return <p>0 ocorrências</p>;
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Figurinhas</h1>
      <div className={styles.filtros}>
        <label>Categoria:</label>
        <select
          className={styles.select}
          onChange={(e) => setCategoriaTemp(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Duelista">Duelista</option>
          <option value="Controlador">Controlador</option>
          <option value="Iniciador">Iniciador</option>
          <option value="Sentinela">Sentinela</option>
        </select>

        <label>Raridade:</label>
        <select
          className={styles.select}
          onChange={(e) => setRaridadeTemp(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Lendaria">Lendária</option>
          <option value="Rara">Rara</option>
          <option value="Comum">Comum</option>
        </select>

        <button
          className={styles.botaoFiltrar}
          onClick={() => {
            setCategoria(categoriaTemp);
            setRaridade(raridadeTemp);
          }}
        >
          Filtrar
        </button>
      </div>

      <div className={styles.filtrosAtivos}>
        {categoria && (
          <span className={styles.badge}>
            Categoria: {categoria}{" "}
            <button onClick={() => setCategoria("")}>✕</button>
          </span>
        )}
        {raridade && (
          <span className={styles.badge}>
            Raridade: {raridade}{" "}
            <button onClick={() => setRaridade("")}>✕</button>
          </span>
        )}
      </div>
      <table className={styles.tabela}>
        <thead>
          {table.getHeaderGroups().map((figurinha) => (
            <tr key={figurinha.id}>
              {figurinha.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((linha) => (
<tr 
  key={linha.id} 
  onClick={() => navigate({ to: `/figurinhas/${linha.original.id}`})}
  style={{ cursor: 'pointer' }}
>
              {linha.getVisibleCells().map((celula) => (
                <td key={celula.id}>
                  {flexRender(
                    celula.column.columnDef.cell,
                    celula.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={styles.btnPagina}
              >
                Anterior
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={styles.btnPagina}
              >
                Próximo
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
