import { ICardRepository } from "../../domain/EntityModule/ICardRepository"; 
import { PostgresCardRepository } from "../../solutions/PostgresCardRepository";
import { PostgresConnection, PostgresAddress } from "../../solutions/postgres"; 
import { logger } from "../solutions";

export class CardRepositoryFactory { 

  static create(): ICardRepository {
  
    logger.debug("chamada do ICardRepository")

    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:12345@db:5432/postgres';
    
    const dbAddress = PostgresAddress.fromFullAddress(dbUrl);
    
    const connection = new PostgresConnection({ dbAddress }, logger);
    
    return new PostgresCardRepository(connection); 
  } 
}
