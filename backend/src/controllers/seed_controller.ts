import {loadCsvsToMongo} from "../scripts/seed";


export const seedController = async (req: any, res: any) => {
    try {
        await loadCsvsToMongo();
        res.status(200).json({ message: "Base de données initialisée avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'initialisation de la base de données." });
    }
};
