import { Card, ICardRepository } from "../domain/EntityModule";
import { ErrorProneResponse } from "../domain/contracts/ErrorProneResponse";
import { left, right } from "../shared/Either";
import { IUseCase, UseCaseUtils } from "./contracts/IUseCase";
import { CardNotFoundError } from "./errors/CardNotFoundError";

export type GetCardUseCaseProps = {
    cardId: string;
}

export type GetCardUseCaseResponse = {
    card: Card;
}

export class GetCardUseCase implements IUseCase<GetCardUseCaseProps, GetCardUseCaseResponse>
{
    constructor(private cardRepository: ICardRepository){}

    async execute(props: GetCardUseCaseProps, _utils?: UseCaseUtils): ErrorProneResponse<GetCardUseCaseResponse> {
        const {cardId} = props;

        const result = await this.cardRepository.findById(cardId);     

        if(result.isLeft()){
            return left(result.value);
        }

        if(!result.value){
            return left(new CardNotFoundError(cardId))
        }

        return right({
            card: result.value
        })
    }
}