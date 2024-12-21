import csvtojson from "csvtojson";
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import connectDB from "../services/db_service";
import {IProduct} from "../models/product_model";
import {ISale} from "../models/sale_model";
import mongoose from "mongoose";

// Chargement des variables d'environnement
dotenv.config();

// Déclaration d'un type générique contraint pour les données des fichiers CSV
type CsvRecord = Record<string, any>;

// Variables d'environnement
const MONGO_URL = process.env.DB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "shopping_cart";
const PRODUCTS_COLLECTION = process.env.PRODUCTS_COLLECTION || "products";
const SALES_COLLECTION = process.env.SALES_COLLECTION || "sales";
const PRODUCTS_CSV_FILE = process.env.PRODUCTS_CSV_FILE || "./src/data/products.csv";
const SALES_CSV_FILE = process.env.SALES_CSV_FILE || "./src/data/sales.csv";

// Fonction pour insérer les données d'un fichier CSV dans une collection MongoDB
async function insertCsvToMongo<T extends CsvRecord>(
    collectionName: string,
    filePath: string
): Promise<void> {
    try {
        console.log(`Reading CSV file: ${filePath}`);
        const data: T[] = await csvtojson().fromFile(filePath);

        console.log(`Inserting data into collection: ${collectionName}`);
        const collection = mongoose.connection.collection(collectionName);

        const result = await collection.insertMany(data);

        console.log(
            `Successfully inserted ${result.insertedCount} records into '${collectionName}'.`
        );
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

// Fonction principale
export async function loadCsvsToMongo(): Promise<void> {
    let alreadyConnected = false;

    try {
        // Vérifie si une connexion active existe
        /* if (mongoose.connection.readyState === 1) {
            console.log("MongoDB connection is already active.");
            alreadyConnected = true;
        } else {
            console.log("No active MongoDB connection. Establishing a new connection...");
            await connectDB();
        }

         */

        await insertCsvToMongo<IProduct>(PRODUCTS_COLLECTION, PRODUCTS_CSV_FILE);

        await insertCsvToMongo<ISale>(SALES_COLLECTION, SALES_CSV_FILE);

        console.log("All files processed successfully!");
    } catch (error) {
        console.error("Error:", error);
    } finally {
            //await mongoose.disconnect();
            console.log("Keeping the MongoDB connection active.");
    }
}

