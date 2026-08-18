import {
  UpdateCardProps as DomainUpdateProps,
  Card,
  CardProps,
  ICardRepository,
} from "../domain/EntityModule";
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse";
import { CompareObjs, Diff } from "../shared/index";
import { left, right } from "../shared/Either";
import { IUseCase, UseCaseUtils } from "./contracts/IUseCase";
// import { logUseCase } from "./decorators/LogUseCase";
// import { UpdateCardSuccessResponseHandler } from "./decorators/UseCaseResponseHandler";
import { CardNotFoundError } from "./errors/CardNotFoundError";

export type UpdateCardUseCaseProps = {
  cardId: string;
  updates: DomainUpdateProps;
  now?: Date;
};

export type UpdateCardUseCaseResponse = {
  card: Card;
  diff: Diff<CardProps>;
};

export class UpdateCardUseCase
  implements IUseCase<UpdateCardUseCaseProps, UpdateCardUseCaseResponse>
{
  constructor(private cardRepository: ICardRepository) {}

//   @logUseCase({
//     success: new UpdateCardSuccessResponseHandler(),
//   })
  async execute(
    props: UpdateCardUseCaseProps,
    _utils?: UseCaseUtils
  ): ErrorProneResponse<UpdateCardUseCaseResponse> {
    const { cardId, updates, now } = props;

    // Get the existing card
    const existingCardResult = await this.cardRepository.findById(cardId);
    if (existingCardResult.isLeft()) {
      return left(existingCardResult.value);
    }

    if (!existingCardResult.value) {
      return left(new CardNotFoundError(cardId));
    }

    const existingCard = existingCardResult.value;
    const currentTime = now || new Date();

    // Update the card using the domain class
    const newCard = Card.clone(existingCard).update(updates, currentTime);

    const diff = CompareObjs.difference(existingCard.props, newCard.props);

    const updateResult = await this.cardRepository.update(
      cardId,
      newCard
    );
    if (updateResult.isLeft()) {
      return left(updateResult.value);
    }

    return right({ card: newCard, diff });
  }
}
