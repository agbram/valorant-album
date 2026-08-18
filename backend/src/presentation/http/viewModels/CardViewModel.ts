import { CardProps } from "../../../domain/EntityModule";

export type StatusFigurinha = "faltando" | "adquirida" | "repetida";

export type CardViewModel = Omit<
  CardProps,
  "createdAt" | "updatedAt" | "quantidade"> & {
  quantidade: number;
  status: StatusFigurinha;
  createdAt: string;
  updatedAt: string;
};
