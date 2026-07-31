import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../../src/main/config/app";
import { CardBuilder } from "../../utils/builders/CardBuilder";

jest.mock("../../../src/main/factories/CardRepositoryFactory", () => ({
  CardRepositoryFactory: {
    create: jest.fn(() => {
      const {
        SeededLocalCardRepository,
      } = require("../../utils/seeds/SeededLocalCardRepository");
      return SeededLocalCardRepository.withAllSeeds();
    }),
  },
}));

describe("Card Routes Integration Tests", () => {
  const customTimestamp = new Date("2024-01-01T12:00:00.000Z");

  describe("GET /cards", () => {
    it("should list all cards", async () => {
      const response = await request(app).get("/cards").expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("nome");
      expect(response.body[0]).toHaveProperty("numero");
      expect(response.body[0]).toHaveProperty("quantidade");
      expect(response.body[0]).toHaveProperty("raridade");
      expect(response.body[0]).toHaveProperty("categoria");
      expect(response.body[0]).toHaveProperty("descricao");
      expect(response.body[0]).toHaveProperty("createdAt");
      expect(response.body[0]).toHaveProperty("updatedAt");
    });

    it("should return 200", async () => {
      await request(app).get("/cards").expect(200);
    });
  });

  describe("GET /cards/:cardId", () => {
    it("should return a specific card", async () => {
      const response = await request(app).get("/cards/card-1").expect(200);

      expect(response.body).toHaveProperty("id", "card-1");
      expect(response.body).toHaveProperty("nome", "Default - 1");
    });

    it("should return 404 when card does not exist", async () => {
      await request(app).get("/cards/non-existent-card").expect(404);
    });
  });

  describe("POST /cards", () => {
    it("should create a new card successfully", async () => {
      const newCard = CardBuilder.create()
        .withId("new-card-id")
        .withNumero(1)
        .withNome("Default - 1")
        .withQuantidade(1)
        .withCategoria("Default")
        .withRaridade("Default")
        .withDescricao("nova descricao")
        .withTimestamps(customTimestamp)
        .buildForCreate();

      const response = await request(app)
        .post("/cards")
        .send(newCard)
        .expect(201);

      expect(response.body).toHaveProperty("id", "new-card-id");
      expect(response.body).toHaveProperty("nome", "Default - 1");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidCard = {};

      await request(app).post("/cards").send(invalidCard).expect(400);
    });
  });

  describe("PUT /cards/:cardId", () => {
    it("should update an existing card successfully", async () => {
      const updateData = {
        nome: "Updated nome",
      };

      const response = await request(app)
        .put("/cards/card-1")
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("id", "card-1");
      expect(response.body).toHaveProperty("nome", "Updated nome");
      expect(response.body.updatedAt).not.toBe(response.body.createdAt);
    });

    it("should return 404 when card does not exist", async () => {
      const updateData = {
        nome: "Updated nome",
      };

      await request(app)
        .put("/cards/non-existent-card")
        .send(updateData)
        .expect(404);
    });

    it("should return 400 when invalid data is provided", async () => {
      const invalidData = {
        nome: "",
      };

      await request(app).put("/cards/card-1").send(invalidData).expect(400);
    });
  });

  describe("DELETE /cards/:cardId", () => {
    it("should delete an existing card successfully", async () => {
      await request(app)
        .delete("/cards/card-1")
        .expect(204);
    });

    it("should return 404 when card does not exist", async () => {
      await request(app).delete("/cards/non-existent-card").expect(404);
    });
  });

  describe("Error handling", () => {
    it("should return 404 for invalid paths", async () => {
      await request(app)
        .get("/cards/invalid-path")
        .expect(404);
    });
  });
});
