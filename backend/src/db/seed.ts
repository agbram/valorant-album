import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const figurinhas = [
  // Duelistas
  {
    numero: 1,
    nome: 'Jett',
    categoria: 'Duelista',
    raridade: 'Rara',
    imagem: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png',
    descricao: 'Mestre da mobilidade, domina os céus e surpreende inimigos com sua velocidade.'
  },
  {
    numero: 2,
    nome: 'Reyna',
    categoria: 'Duelista',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png',
    descricao: 'Se fortalece a cada eliminação.'
  },
  {
    numero: 3,
    nome: 'Phoenix',
    categoria: 'Duelista',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png',
    descricao: 'Controla o fogo para dominar o combate.'
  },
  {
    numero: 4,
    nome: 'Neon',
    categoria: 'Duelista',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png',
    descricao: 'Velocidade extrema e energia elétrica.'
  },
  {
    numero: 5,
    nome: 'Iso',
    categoria: 'Duelista',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png',
    descricao: 'Especialista em confrontos individuais.'
  },
  {
    numero: 6,
    nome: 'Waylay',
    categoria: 'Duelista',
    raridade: 'Lendaria',
    imagem: 'https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/displayicon.png',
    descricao: 'Manipula a luz para caçar seus inimigos.'
  },
  {
    numero: 7,
    nome: 'Raze',
    categoria: 'Duelista',
    raridade: 'Lendaria',
    imagem: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png',
    descricao: 'Especialista em explosivos.'
  },
  {
    numero: 8,
    nome: 'Yoru',
    categoria: 'Duelista',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png',
    descricao: 'Engana inimigos com portais e ilusões.'
  },

  // Controladores
  {
    numero: 9,
    nome: 'Omen',
    categoria: 'Controlador',
    raridade: 'Lendaria',
    imagem: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png',
    descricao: 'Mestre das sombras.'
  },
  {
    numero: 10,
    nome: 'Brimstone',
    categoria: 'Controlador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png',
    descricao: 'Liderança e poder orbital.'
  },
  {
    numero: 11,
    nome: 'Viper',
    categoria: 'Controlador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png',
    descricao: 'Controle de área com veneno.'
  },
  {
    numero: 12,
    nome: 'Clove',
    categoria: 'Controlador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png',
    descricao: 'Desafia a própria morte.'
  },
  {
    numero: 13,
    nome: 'Harbor',
    categoria: 'Controlador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png',
    descricao: 'Controla correntes de água.'
  },
  {
    numero: 14,
    nome: 'Miks',
    categoria: 'Controlador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/displayicon.png',
    descricao: 'Controlador focado em suporte.'
  },
  {
    numero: 15,
    nome: 'Astra',
    categoria: 'Controlador',
    raridade: 'Lendaria',
    imagem: 'https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/displayicon.png',
    descricao: 'Controlador do plano astral.'
  },

  // Sentinelas
  {
    numero: 16,
    nome: 'Sage',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png',
    descricao: 'Capaz de curar e ressuscitar aliados.'
  },
  {
    numero: 17,
    nome: 'Cypher',
    categoria: 'Sentinela',
    raridade: 'Rara',
    imagem: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png',
    descricao: 'Informação é poder.'
  },
  {
    numero: 18,
    nome: 'Killjoy',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png',
    descricao: 'Tecnologia a serviço da defesa.'
  },
  {
    numero: 19,
    nome: 'Vyse',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png',
    descricao: 'Armadilhas metálicas devastadoras.'
  },
  {
    numero: 20,
    nome: 'Deadlock',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png',
    descricao: 'Especialista em contenção.'
  },
  {
    numero: 21,
    nome: 'Veto',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/displayicon.png',
    descricao: 'Neutraliza habilidades inimigas.'
  },
  {
    numero: 22,
    nome: 'Chamber',
    categoria: 'Sentinela',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png',
    descricao: 'Precisão mortal e teleporte.'
  },

  // Iniciadores
  {
    numero: 23,
    nome: 'Sova',
    categoria: 'Iniciador',
    raridade: 'Lendaria',
    imagem: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png',
    descricao: 'Reconhecimento preciso.'
  },
  {
    numero: 24,
    nome: 'Breach',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png',
    descricao: 'Força bruta de iniciação.'
  },
  {
    numero: 25,
    nome: 'Skye',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png',
    descricao: 'A natureza luta ao seu lado.'
  },
  {
    numero: 26,
    nome: 'Kay/O',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png',
    descricao: 'Silencia habilidades inimigas.'
  },
  {
    numero: 27,
    nome: 'Gekko',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
    descricao: 'Luta ao lado de criaturas leais.'
  },
  {
    numero: 28,
    nome: 'Tejo',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/displayicon.png',
    descricao: 'Especialista em reconhecimento.'
  },
  {
    numero: 29,
    nome: 'Fade',
    categoria: 'Iniciador',
    raridade: 'Comum',
    imagem: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png',
    descricao: 'Transforma pesadelos em armas.'
  }
];



// Popula o banco com os agentes do Valorant e entradas iniciais do álbum.
// Limpa as tabelas antes de inserir para evitar duplicatas.
// Album inicial: Waylay colada, Astra repetida, Sova colada, Vyse repetida.
async function seed() {
  await prisma.album.deleteMany();
  await prisma.figurinha.deleteMany();

  const data: any = {
    data: figurinhas,
    skipDuplicates: true,
  };

  await prisma.figurinha.createMany(data);
  await prisma.album.createMany({
    data: [
      {figurinhaId: 6, quantidade: 1},
      {figurinhaId: 15, quantidade: 2},
      {figurinhaId: 23, quantidade: 1},
      {figurinhaId: 18, quantidade: 3},
    ]
  })
} 


seed();
console.log('✅ Seed concluído!')