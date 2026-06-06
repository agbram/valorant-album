import { useQuery } from "@tanstack/react-query";
import { getFigurinhas } from "../services/api";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

export default function Listagem() {
  const [sorting, setSorting] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [raridade, setRaridade] = useState("");
  const [status, setStatus] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["figurinhas", categoria, raridade, status],
    queryFn: () => getFigurinhas({ categoria, raridade, status }),
  });

  const columns = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "categoria", header: "Categoria" },
    { accessorKey: "raridade", header: "Raridade" },
    { accessorKey: "imagem", header: "Imagem" },
    { accessorKey: "descricao", header: "Descrição" },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar estatísticas</p>;
  return (
    <table>
      <select onChange={(e) => setCategoria(e.target.value)}>
        <option value="">Todas</option>
        <option value="Duelista">Duelista</option>
        <option value="Controlador">Controlador</option>
        <option value="Iniciador">Iniciador</option>
        <option value="Sentinela">Sentinela</option>
      </select>

      <select onChange={(e) => setRaridade(e.target.value)}>
        <option value="">Todas</option>
        <option value="Lendaria">Lendária</option>
        <option value="Rara">Rara</option>
        <option value="Comum">Comum</option>
      </select>

      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todas</option>
        <option value="Colada">Colada</option>
        <option value="Repetida">Repetida</option>
      </select>
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
    </table>
  );
}
