/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {

    pgm.renameColumn('cards', 'createdAt', 'created_at');
    pgm.renameColumn('cards', 'updatedAt', 'updated_at');

    pgm.sql(
        `INSERT INTO cards (id, numero, nome, categoria, raridade, imagem, descricao, quantidade, created_at, updated_at) VALUES
('1', 1, 'Jett', 'Duelista', 'Rara', 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png', 'Mestre da mobilidade, domina os céus e surpreende inimigos com sua velocidade.', 1, NOW(), NOW()),
('2', 2, 'Reyna', 'Duelista', 'Comum', 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png', 'Se fortalece a cada eliminação.', 1, NOW(), NOW()),
('3', 3, 'Phoenix', 'Duelista', 'Comum', 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png', 'Controla o fogo para dominar o combate.', 1, NOW(), NOW()),
('4', 4, 'Neon', 'Duelista', 'Comum', 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png', 'Velocidade extrema e energia elétrica.', 1, NOW(), NOW()),
('5', 5, 'Iso', 'Duelista', 'Comum', 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e72-c28f29c8b0d1/displayicon.png', 'Especialista em confrontos individuais.', 1, NOW(), NOW()),
('6', 6, 'Waylay', 'Duelista', 'Lendaria', 'https://media.valorant-api.com/agents/waylay/displayicon.png', 'Manipula a luz para caçar seus inimigos.', 1, NOW(), NOW()),
('7', 7, 'Raze', 'Duelista', 'Lendaria', 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png', 'Especialista em explosivos.', 1, NOW(), NOW()),
('8', 8, 'Yoru', 'Duelista', 'Comum', 'https://media.valorant-api.com/agents/7f36bcae-457b-cbce-63da-204bf615d4b6/displayicon.png', 'Engana inimigos com portais e ilusões.', 1, NOW(), NOW()),
('9', 9, 'Astra', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png', 'Mestre das sombras.', 1, NOW(), NOW()),
('10', 10, 'Omen', 'Controlador', 'Lendaria', 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png', 'Mestre das sombras.', 1, NOW(), NOW()),
('11', 11, 'Brimstone', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png', 'Liderança e poder orbital.', 1, NOW(), NOW()),
('12', 12, 'Viper', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png', 'Controle de área com veneno.', 1, NOW(), NOW()),
('13', 13, 'Clove', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png', 'Desafia a própria morte.', 1, NOW(), NOW()),
('14', 14, 'Harbor', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png', 'Controla correntes de água.', 1, NOW(), NOW()),
('15', 15, 'Miks', 'Controlador', 'Comum', 'https://media.valorant-api.com/agents/miks/displayicon.png', 'Controlador focado em suporte.', 1, NOW(), NOW()),
('16', 16, 'Sage', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png', 'Capaz de curar e ressuscitar aliados.', 1, NOW(), NOW()),
('17', 17, 'Cypher', 'Sentinela', 'Rara', 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png', 'Informação é poder.', 1, NOW(), NOW()),
('18', 18, 'Killjoy', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/1f6f10d1-4b6b-7f7d-cd91-5cbf0b5fba95/displayicon.png', 'Tecnologia a serviço da defesa.', 1, NOW(), NOW()),
('19', 19, 'Vyse', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/vyse/displayicon.png', 'Armadilhas metálicas devastadoras.', 1, NOW(), NOW()),
('20', 20, 'Deadlock', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png', 'Especialista em contenção.', 1, NOW(), NOW()),
('21', 21, 'Veto', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/veto/displayicon.png', 'Neutraliza habilidades inimigas.', 1, NOW(), NOW()),
('22', 22, 'Chamber', 'Sentinela', 'Comum', 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fed-84a9e28c69d7/displayicon.png', 'Precisão mortal e teleporte.', 1, NOW(), NOW()),
('23', 23, 'Sova', 'Iniciador', 'Lendaria', 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png', 'Reconhecimento preciso.', 1, NOW(), NOW()),
('24', 24, 'Breach', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png', 'Força bruta de iniciação.', 1, NOW(), NOW()),
('25', 25, 'Skye', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png', 'A natureza luta ao seu lado.', 1, NOW(), NOW()),
('26', 26, 'Kay/O', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png', 'Silencia habilidades inimigas.', 1, NOW(), NOW()),
('27', 27, 'Gekko', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png', 'Luta ao lado de criaturas leais.', 1, NOW(), NOW()),
('28', 28, 'Tejo', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/tejo/displayicon.png', 'Especialista em reconhecimento.', 1, NOW(), NOW()),
('29', 29, 'Fade', 'Iniciador', 'Comum', 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png', 'Transforma pesadelos em armas.', 1, NOW(), NOW())
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
