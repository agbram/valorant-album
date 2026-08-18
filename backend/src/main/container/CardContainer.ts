import { ICardRepository } from "../../domain/EntityModule";

import {
  CreateCardOperation,
  DeleteCardOperation,
  GetCardOperation,
  ListCardsOperation,
  PatchQuantityOperation,
  UpdateCardOperation,
} from "../../presentation/http/operations";

import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardUseCase,
  ListCardsUseCase,
  UpdateCardUseCase,
  PatchQuantityUseCase
} from "../../useCases";

import { CardRepositoryFactory } from "../factories";
import { logger } from "../solutions";

export interface CardUseCases {
  listCard: ListCardsUseCase;
  createCard: CreateCardUseCase;
  getCard: GetCardUseCase;
  updateCard: UpdateCardUseCase;
  deleteCard: DeleteCardUseCase;
  patchQuantity: PatchQuantityUseCase;
}

export interface CardOperations {
  listCard: ListCardsOperation;
  createCard: CreateCardOperation;
  getCard: GetCardOperation;
  updateCard: UpdateCardOperation;
  deleteCard: DeleteCardOperation;
  patchQuantity: PatchQuantityOperation;
}

export class cardContainer {
  private static _repository: ICardRepository | null = null;
  private static _useCases: CardUseCases | null = null;
  private static _operations: CardOperations | null = null;

  static getRepository(): ICardRepository {
    if (!this._repository) {
      logger.debug("create card repository");
      this._repository = CardRepositoryFactory.create();
    }
    return this._repository;
  }

  static getUseCases(): CardUseCases {
    if (!this._useCases) {
      const repository = this.getRepository();
      this._useCases = {
        listCard: new ListCardsUseCase(repository),
        createCard: new CreateCardUseCase(repository),
        getCard: new GetCardUseCase(repository),
        updateCard: new UpdateCardUseCase(repository),
        deleteCard: new DeleteCardUseCase(repository),
        patchQuantity: new PatchQuantityUseCase(repository)
      };
    }
    return this._useCases;
  }

  static getOperations(): CardOperations {
    if (!this._operations) {
      const useCases = this.getUseCases();
      this._operations = {
        listCard: new ListCardsOperation(useCases.listCard),
        createCard: new CreateCardOperation(useCases.createCard),
        getCard: new GetCardOperation(useCases.getCard),
        updateCard: new UpdateCardOperation(useCases.updateCard),
        deleteCard: new DeleteCardOperation(useCases.deleteCard),
        patchQuantity: new PatchQuantityOperation(useCases.patchQuantity)
      };
    }
    return this._operations;
  }

  static reset(): void {
    this._repository = null;
    this._useCases = null;
    this._operations = null;
  }
}
