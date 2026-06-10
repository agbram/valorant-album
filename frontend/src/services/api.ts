import axios from "axios";
import type { Figurinha, EntradaAlbum, AlbumStats, CriarFigurinhaPayload, FiltrosFigurinha } from "../types";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const api = axios.create({
    baseURL
});

// Busca todas as figurinhas do catálogo, com filtros opcionais.
export const getFigurinhas = (filtros?: FiltrosFigurinha) => api.get<Figurinha[]>('/catalogo', { params: filtros });

// Cria uma nova figurinha no catálogo.
export const createFigurinhas = (data: CriarFigurinhaPayload) => api.post<Figurinha>('/catalogo', data);

// Atualiza uma figurinha existente no catálogo.
export const updateFigurinhas = (id: string, data: Partial<CriarFigurinhaPayload>) => api.put<Figurinha>(`/catalogo/${id}`, data);

// Remove uma figurinha do catálogo.
export const deleteFigurinhas = (id: number) => api.delete(`/catalogo/${id}`);

// Busca as entradas do álbum do colecionador, com filtros opcionais.
export const getAlbum = (filtros?: FiltrosFigurinha) => api.get<EntradaAlbum[]>('/album', { params: filtros });

// Busca as estatísticas de progresso do álbum.
export const getStats = () => api.get<AlbumStats>('/album/stats');

// Adiciona uma figurinha à coleção do usuário (ou incrementa se já existir).
export const adicionarColecao = (figurinhaId: number) => api.post(`/album/${figurinhaId}`);

// Remove uma cópia de uma figurinha da coleção do usuário.
export const removerColecao = (figurinhaId: number) => api.delete(`/album/${figurinhaId}`);

// Busca uma figurinha específica pelo ID.
export const getFigurinhaPorId = (id: string) => api.get<Figurinha>(`/catalogo/${id}`);
