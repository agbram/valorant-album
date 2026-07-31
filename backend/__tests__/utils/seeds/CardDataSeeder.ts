import { ICardRepository } from "../../../src/domain/EntityModule/ICardRepository";
import { Card, Categoria, Raridade } from "../../../src/domain/EntityModule";

export class CardDataSeeder {
  constructor(private cardRepository: ICardRepository) {}

  async seed(): Promise<void> {
    const existingCards = await this.cardRepository.findAll();

    if (existingCards.isLeft()) {
      console.error("[Seed] Erro ao validar banco:", existingCards.value);
      return;
    }

    // Evita duplicar os dados se o app reiniciar no Docker
    if (existingCards.value.length > 0) {
      return;
    }

    console.log(
      "[Seed] Populando banco de dados para testes/desenvolvimento...",
    );
    
    const mockCards = [
      // Duelistas
      {
        id: "1",
        numero: 1,
        nome: "Jett",
        categoria: "Duelista" as Categoria,
        raridade: "Rara" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png",
        descricao:
          "Mestre da mobilidade, domina os céus e surpreende inimigos com sua velocidade.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        numero: 2,
        nome: "Reyna",
        categoria: "Duelista" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png",
        descricao: "Se fortalece a cada eliminação.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        numero: 3,
        nome: "Phoenix",
        categoria: "Duelista" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png",
        descricao: "Controla o fogo para dominar o combate.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        numero: 4,
        nome: "Neon",
        categoria: "Duelista" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png",
        descricao: "Velocidade extrema e energia elétrica.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        numero: 5,
        nome: "Iso",
        categoria: "Duelista" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e72-c28f29c8b0d1/displayicon.png",
        descricao: "Especialista em confrontos individuais.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        numero: 6,
        nome: "Waylay",
        categoria: "Duelista" as Categoria,
        raridade: "Lendaria" as Raridade,
        imagem: "https://media.valorant-api.com/agents/waylay/displayicon.png",
        descricao: "Manipula a luz para caçar seus inimigos.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        numero: 7,
        nome: "Raze",
        categoria: "Duelista" as Categoria,
        raridade: "Lendaria" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png",
        descricao: "Especialista em explosivos.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "8",
        numero: 8,
        nome: "Yoru",
        categoria: "Duelista" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/7f36bcae-457b-cbce-63da-204bf615d4b6/displayicon.png",
        descricao: "Engana inimigos com portais e ilusões.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Controladores
      {
        id: "9",
        numero: 9,
        nome: "Astra",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png",
        descricao: "Mestre das sombras.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "10",
        numero: 10,
        nome: "Omen",
        categoria: "Controlador" as Categoria,
        raridade: "Lendaria" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png",
        descricao: "Mestre das sombras.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "11",
        numero: 11,
        nome: "Brimstone",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png",
        descricao: "Liderança e poder orbital.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "12",
        numero: 12,
        nome: "Viper",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png",
        descricao: "Controle de área com veneno.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "13",
        numero: 13,
        nome: "Clove",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png",
        descricao: "Desafia a própria morte.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "14",
        numero: 14,
        nome: "Harbor",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png",
        descricao: "Controla correntes de água.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "15",
        numero: 15,
        nome: "Miks",
        categoria: "Controlador" as Categoria,
        raridade: "Comum" as Raridade,
        imagem: "https://media.valorant-api.com/agents/miks/displayicon.png",
        descricao: "Controlador focado em suporte.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Sentinelas
      {
        id: "16",
        numero: 16,
        nome: "Sage",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png",
        descricao: "Capaz de curar e ressuscitar aliados.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "17",
        numero: 17,
        nome: "Cypher",
        categoria: "Sentinela" as Categoria,
        raridade: "Rara" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png",
        descricao: "Informação é poder.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "18",
        numero: 18,
        nome: "Killjoy",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/1f6f10d1-4b6b-7f7d-cd91-5cbf0b5fba95/displayicon.png",
        descricao: "Tecnologia a serviço da defesa.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "19",
        numero: 19,
        nome: "Vyse",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem: "https://media.valorant-api.com/agents/vyse/displayicon.png",
        descricao: "Armadilhas metálicas devastadoras.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "20",
        numero: 20,
        nome: "Deadlock",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png",
        descricao: "Especialista em contenção.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "21",
        numero: 21,
        nome: "Veto",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem: "https://media.valorant-api.com/agents/veto/displayicon.png",
        descricao: "Neutraliza habilidades inimigas.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "22",
        numero: 22,
        nome: "Chamber",
        categoria: "Sentinela" as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fed-84a9e28c69d7/displayicon.png",
        descricao: "Precisão mortal e teleporte.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Iniciadores
      {
        id: "23",
        numero: 23,
        nome: "Sova",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Lendaria" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
        descricao: "Reconhecimento preciso.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "24",
        numero: 24,
        nome: "Breach",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png",
        descricao: "Força bruta de iniciação.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "25",
        numero: 25,
        nome: "Skye",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png",
        descricao: "A natureza luta ao seu lado.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "26",
        numero: 26,
        nome: "Kay/O",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png",
        descricao: "Silencia habilidades inimigas.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "27",
        numero: 27,
        nome: "Gekko",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png",
        descricao: "Luta ao lado de criaturas leais.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "28",
        numero: 28,
        nome: "Tejo",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem: "https://media.valorant-api.com/agents/tejo/displayicon.png",
        descricao: "Especialista em reconhecimento.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "29",
        numero: 29,
        nome: "Fade",
        categoria: "Iniciador" as Categoria as Categoria,
        raridade: "Comum" as Raridade,
        imagem:
          "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png",
        descricao: "Transforma pesadelos em armas.",
        quantidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const props of mockCards) {
      const card = new Card(props);
      const result = await this.cardRepository.create(card);

      if (result.isLeft()) {
        console.error(`[Seed] Erro no card ${props.nome}:`, result.value);
      }
    }
  }
}
