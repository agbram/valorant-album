import { ErrorProneResponse } from "../contracts/ErrorProneResponse";
import {Card, Categoria, Raridade} from "./Card";

export type ListFilter = { 
  nome?: string
  categoria?: Categoria
  raridade?: Raridade
  status?: "faltando" | "adquirida" | "repetida"
  numero?: number
};

export interface ICardRepository {
  create(card: Card): ErrorProneResponse<Card | null>
  findById(id: string): ErrorProneResponse<Card | null>
  findByNumero(numero: number): ErrorProneResponse<Card | null>
  findAll(filters?: ListFilter): ErrorProneResponse<Card[]>
  update(id: string, card: Card): ErrorProneResponse<Card | null>
  delete(id: string): ErrorProneResponse<null>
  existsById(id: string): ErrorProneResponse<boolean>
  changeQuantity(id:string, quantidade: number): ErrorProneResponse<null>
  findByNome(nome: string): ErrorProneResponse<Card | null>
}
