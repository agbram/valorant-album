import {
  CreateCardProps as DomainCreateProps,
  Card,
  ICardRepository,
} from "../domain/EntityModule";
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse";
import { left, right } from "../shared/Either";
import { IUseCase, UseCaseUtils } from "./contracts/IUseCase";
import { CardDuplicateError } from "./errors/CardDuplicateError";

export type CreateCardUseCaseProps = {
  createProps: DomainCreateProps;
  now?: Date;
};

export type CreateCardUseCaseResponse = {
  card: Card;
};

export class CreateCardUseCase implements IUseCase<
  CreateCardUseCaseProps,
  CreateCardUseCaseResponse
> {
  constructor(private readonly cardRepository: ICardRepository) {}
  async execute(
    props: CreateCardUseCaseProps,
    _utils?: UseCaseUtils,
  ): ErrorProneResponse<CreateCardUseCaseResponse> {
    const { createProps, now } = props;

    const existingCardResult = await this.cardRepository.findById(
      createProps.id,
    );

    if (existingCardResult.isLeft()) {
      return left(existingCardResult.value);
    }

    if (existingCardResult.value) {
      return left(new CardDuplicateError(createProps.id));
    }

    const currentTime = now || new Date();

    const card = Card.create(createProps, currentTime);

    const createResult = await this.cardRepository.create(card);

    if (createResult.isLeft()) {
      return left(createResult.value);
    }

    return right({ card });
  }
}
