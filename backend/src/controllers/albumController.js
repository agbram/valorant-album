import prisma from "../db/prisma.js";

export const AlbumController = {
    async adicionar(req, res, next){
        try {
        const {figurinhaId, quantidade} = req.params;

        const novaFigurinha = await prisma.album.upsert({
            where: {
                figurinhaId: figurinhaId,
            },
            update: {
                quantidade: {increment: 1},
            },
            create: {
                figurinhaId, quantidade: 1
            },
        });

    console.log("Figurinhas adicionada a coleção: ", novaFigurinha);
    res.status(200).json("Figurinha adicionada a coleção!");

        } catch(error){
            next(error);
        }
    },

    
}


