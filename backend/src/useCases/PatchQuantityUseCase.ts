import { 
  Card, 
  CardProps, 
  ICardRepository, 
} from "../domain/EntityModule"; 
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse"; 
import { CompareObjs, Diff } from "../shared/index"; 
import { left, right } from "../shared/Either"; 
import { IUseCase, UseCaseUtils } from "./contracts/IUseCase"; 
import { CardNotFoundError } from "./errors/CardNotFoundError"; 

export type PatchQuantityUseCaseProps = { 
  cardId: string; 
  updates: { quantidade: number };
  now?: Date; 
}; 

export type PatchQuantityUseCaseResponse = { 
  card: Card; 
  diff: Diff<CardProps>; 
}; 

export class PatchQuantityUseCase implements IUseCase<PatchQuantityUseCaseProps, PatchQuantityUseCaseResponse> { 
  constructor(private cardRepository: ICardRepository) {} 

  async execute( 
    props: PatchQuantityUseCaseProps, 
    _utils?: UseCaseUtils 
  ): ErrorProneResponse<PatchQuantityUseCaseResponse> { 
    const { cardId, updates, now } = props; 

    const existingCardResult = await this.cardRepository.findById(cardId); 
    if (existingCardResult.isLeft()) { 
      return left(existingCardResult.value); 
    } 
    if (!existingCardResult.value) { 
      return left(new CardNotFoundError(cardId)); 
    } 

    const existingCard = existingCardResult.value; 
    const currentTime = now || new Date(); 

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
