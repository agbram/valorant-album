import { text } from 'node:stream/consumers';

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

    pgm.createType('categoria', ["Iniciador", "Sentinela", "Controlador", "Duelista", "Default"])
    pgm.createType('raridade', ["Comum", "Rara", "Lendaria", "Default"])
    pgm.createTable("cards", {
        id: 'id',
        numero: {type: 'integer', notNull: true},
        nome: {type: 'varchar(100)', notNull: true},
        categoria: {type: 'categoria', default: "Default"},
        raridade: {type: 'raridade', default: "Default"},
        quantidade: {type: 'integer', default: 0},
        imagem: {type: 'text', notNull: false},
        descricao: {type: 'varchar(100)', notNull: false},
        createdAt: {type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')},
        updatedAt: {type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')}
    })

    pgm.createIndex('cards', 'numero');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
