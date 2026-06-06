import { useQuery } from "@tanstack/react-query"
import { getStats } from "../services/api"

export default function Dashboard(){

    const {data, isLoading, isError } = useQuery({
        queryKey: ['stats'],
        queryFn: () => getStats()
    })

    if(isLoading) return <p>Carregando...</p>
    if(isError) return <p>Erro ao carregar estatísticas</p>

return (
  <>
    <h1>Meu Álbum Valorant</h1>
    <p>Total no catálogo: {data.data.totalCatalago}</p>
    <p>Coladas: {data.data.totalColadas}</p>
    <p>Faltando: {data.data.totalFaltando}</p>
    <p>Repetidas: {data.data.totalRepetidas}</p>
    <p>Progresso: {data.data.percentual}%</p>
    <div style={{ width: '100%', background: '#ccc', borderRadius: 8 }}>
      <div style={{ width: `${data.data.percentual}%`, background: 'red', height: 20, borderRadius: 8 }}/>
    </div>
  </>
)
}