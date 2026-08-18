import { Card, ICardRepository, ListFilter } from "../domain/EntityModule";
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse";
import { left, right } from "../shared/Either";
import { IUseCase, UseCaseUtils } from "./contracts";

export type ListCardsUseCaseProps = {
  filters?: ListFilter;
};

export type ListCardsUseCaseResponse = {
  cards: Card[];
};

export class ListCardsUseCase
  implements IUseCase<ListCardsUseCaseProps, ListCardsUseCaseResponse>
{
  constructor(private cardRepository: ICardRepository) {}
  async execute(
    props: ListCardsUseCaseProps,
    _utils?: UseCaseUtils
  ): ErrorProneResponse<ListCardsUseCaseResponse> {
    const { filters } = props;

    const result = await this.cardRepository.findAll(filters);
    if (result.isLeft()) {
      return left(result.value);
    }

    return right({ cards: result.value });
  }
}
