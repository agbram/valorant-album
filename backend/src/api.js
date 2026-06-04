import "dotenv/config";
import express from "express";
import cors from 'cors';
import catalogoRoutes from "./routes/catalogo.js"

const app = express();
app.use(cors());
app.use(express.json());

app.use('/catalogo', catalogoRoutes)

app.get('/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`🟢 Servidor rodando na porta ${PORT}`))