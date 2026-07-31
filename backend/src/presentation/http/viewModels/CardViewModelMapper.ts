import { Card } from "../../../domain/EntityModule";
import { CardViewModel } from "./CardViewModel";
import { calculateCardStatus } from "../../../shared/calculateCardStatus"; 

export class CardViewModelMapper {
  static toViewModel(card: Card): CardViewModel {
    const { createdAt, updatedAt, ...rest } = card.props;
    
    return {
      ...rest,
      status: calculateCardStatus(card.props.quantidade),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}