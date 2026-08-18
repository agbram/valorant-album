import { ICardRepository } from "../domain/EntityModule";
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse";
import { left, right } from "../shared/Either";
import { IUseCase, UseCaseUtils } from "./contracts/IUseCase";
import { CardNotFoundError } from "./errors/CardNotFoundError";

export type DeleteCardUseCaseProps = {
  cardId: string;
};

export type DeleteCardUseCaseResponse = {
  cardId: string;
};

export class DeleteCardUseCase implements IUseCase<
  DeleteCardUseCaseProps,
  DeleteCardUseCaseResponse
> {
  constructor(private cardRepository: ICardRepository) {}

  async execute(
    props: DeleteCardUseCaseProps,
    _utils?: UseCaseUtils,
  ): ErrorProneResponse<DeleteCardUseCaseResponse> {
    const { cardId } = props;

    const existingCommentResult = await this.cardRepository.existsById(cardId);

    if (existingCommentResult.isLeft()) {
      return left(existingCommentResult.value);
    }

    if (!existingCommentResult.value) {
      return left(new CardNotFoundError(cardId));
    }

    const deleteResult = await this.cardRepository.delete(cardId);
    if (deleteResult.isLeft()) {
      return left(deleteResult.value);
    }

    return right({ cardId });
  }
}
