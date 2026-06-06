import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const api = axios.create({
    baseURL
});


export const getFigurinhas = (filtros) => api.get('/catalogo', { params: filtros });

export const createFigurinhas = (data) => api.post('/catalogo', data);

export const updateFigurinhas = (id, data) => api.put(`/catalogo/${id}`, data);

export const deleteFigurinhas = (id) => api.delete(`/catalogo/${id}`);

export const getAlbum = (filtros) => api.get('/album', {params: filtros});

export const getStats = () => api.get('/album/stats');

export const adicionarColecao = (figurinhaId) => api.post(`/album/${figurinhaId}`);

export const removerColecao = (figurinhaId) => api.delete(`/album/${figurinhaId}`);

export const getFigurinhaPorId = (id) => api.get(`/catalogo/${id}`)

