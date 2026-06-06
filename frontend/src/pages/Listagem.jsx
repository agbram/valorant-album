import {
  useQuery,
  useMutation,
  useQueryClient,
  Mutation,
} from "@tanstack/react-query";
import {
  adicionarColecao,
  deleteFigurinhas,
  getAlbum,
  getFigurinhas,
  removerColecao,
  updateFigurinhas,
} from "../services/api";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Link } from '@tanstack/react-router'
import { useState } from "react";

export default function Listagem() {
  const [sorting, setSorting] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [raridade, setRaridade] = useState("");
  const [status, setStatus] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoriaTemp, setCategoriaTemp] = useState("");
  const [raridadeTemp, setRaridadeTemp] = useState("");
  const [statusTemp, setStatusTemp] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["figurinhas", categoria, raridade, status],
    queryFn: () => getFigurinhas({ categoria, raridade, status }),
  });

  const { data: albumData } = useQuery({
    queryKey: ["album", quantidade],
    queryFn: () => getAlbum({ quantidade }),
  });

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

  const mutationApagarDoCatalogo = useMutation({
    mutationFn: (figurinhaId) => deleteFigurinhas(figurinhaId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      queryClient.invalidateQueries({ queryKey: ["figurinhas"] });
    },
  });

  const columns = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "categoria", header: "Categoria" },
    { accessorKey: "raridade", header: "Raridade" },
    { accessorKey: "imagem", header: "Imagem" },
    { accessorKey: "descricao", header: "Descrição" },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const entradaAlbum = albumData?.data?.find(
          (a) => a.figurinhaId === row.original.id,
        );
        return (
          <div>
            <p>Qtd: {entradaAlbum?.quantidade ?? 0}</p>
            <button
              disabled={mutationAdicionar.isPending}
              onClick={() => mutationAdicionar.mutate(row.original.id)}
            >
              +
            </button>
            <button
              disabled={mutationRemover.isPending}
              onClick={() => mutationRemover.mutate(row.original.id)}
            >
              -
            </button>
            <Link to="/figurinhas/$id/editar" params={{ id: row.original.id }}>
              Editar
            </Link>
            <button
              disabled={mutationApagarDoCatalogo.isPending}
              onClick={() => mutationApagarDoCatalogo.mutate(row.original.id)}
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
    <table>
      <div>
        <select onChange={(e) => setCategoriaTemp(e.target.value)}>
          <option value="">Todas</option>
          <option value="Duelista">Duelista</option>
          <option value="Controlador">Controlador</option>
          <option value="Iniciador">Iniciador</option>
          <option value="Sentinela">Sentinela</option>
        </select>

        <select onChange={(e) => setRaridadeTemp(e.target.value)}>
          <option value="">Todas</option>
          <option value="Lendaria">Lendária</option>
          <option value="Rara">Rara</option>
          <option value="Comum">Comum</option>
        </select>

        <select onChange={(e) => setStatusTemp(e.target.value)}>
          <option value="">Todas</option>
          <option value="Colada">Colada</option>
          <option value="Repetida">Repetida</option>
        </select>
        <button
          onClick={() => {
            setCategoria(categoriaTemp);
            setRaridade(raridadeTemp);
            setStatus(statusTemp);
          }}
        >
          Filtrar
        </button>
      </div>
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
          <tr key={linha.id}>
            {linha.getVisibleCells().map((celula) => (
              <td key={celula.id}>
                {flexRender(celula.column.columnDef.cell, celula.getContext())}
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
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
