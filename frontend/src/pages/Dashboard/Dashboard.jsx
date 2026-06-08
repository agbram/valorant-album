import { useQuery } from "@tanstack/react-query"
import { getStats } from "../../services/api"
import styles from './Dashboard.module.css'

export default function Dashboard(){

    // Hook do TanStack Query para buscar os dados estatísticos do álbum.
    // Ele gerencia automaticamente os estados de carregamento (isLoading) e erro (isError).
    const {data, isLoading, isError } = useQuery({
        queryKey: ['stats'],
        queryFn: () => getStats()
    })

    if(isLoading) return <p>Carregando...</p>
    if(isError) return <p>Erro ao carregar estatísticas</p>

return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Meu Álbum Valorant</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Total no Catálogo</p>
          <p className={styles.cardValor}>{data.data.totalCatalago}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Coladas</p>
          <p className={styles.cardValor}>{data.data.totalColadas}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Faltando</p>
          <p className={styles.cardValor}>{data.data.totalFaltando}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Repetidas</p>
          <p className={styles.cardValor}>{data.data.totalRepetidas}</p>
        </div>
      </div>

      <div className={styles.progressoContainer}>
        <div className={styles.progressoLabel}>
          <span>Progresso</span>
          <span>{data.data.percentual}%</span>
        </div>
        <div className={styles.progressoBar}>
          <div className={styles.progressoFill} style={{ width: `${data.data.percentual}%` }} />
        </div>
      </div>
    </div>
)
}