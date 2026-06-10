// Interfaces centrais do projeto - definem o formato dos dados que trafegam entre o frontend e o backend.

export interface Figurinha {
  id: number;
  numero: number;
  nome: string;
  categoria: 'Duelista' | 'Controlador' | 'Sentinela' | 'Iniciador';
  raridade: 'Comum' | 'Rara' | 'Lendaria';
  imagem: string;
  descricao?: string;
}

export interface EntradaAlbum {
  id: number;
  figurinhaId: number;
  quantidade: number;
  figurinha?: Figurinha;
}


export interface AlbumStats {
  totalCatalago: number;
  totalColadas: number;
  totalFaltando: number;
  totalRepetidas: number;
  percentual: number;
}

export interface CriarFigurinhaPayload {
  numero: number;
  nome: string;
  descricao?: string;
  categoria: string;
  raridade: string;
  imagem: string;
}

export interface FiltrosFigurinha {
  categoria?: string;
  raridade?: string;
  figurinhaId?: string;
}
