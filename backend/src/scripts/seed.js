"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCsvsToMongo = loadCsvsToMongo;
const csvtojson_1 = __importDefault(require("csvtojson"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const MONGO_URL = process.env.DB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "shopping_cart";
const PRODUCTS_COLLECTION = process.env.PRODUCTS_COLLECTION || "products";
const SALES_COLLECTION = process.env.SALES_COLLECTION || "sales";
const PRODUCTS_CSV_FILE = process.env.PRODUCTS_CSV_FILE || "./data/products.csv";
const SALES_CSV_FILE = process.env.SALES_CSV_FILE || "./data/sales.csv";
function insertCsvToMongo(collectionName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Reading CSV file: ${filePath}`);
            const data = yield (0, csvtojson_1.default)().fromFile(filePath);
            console.log(`Inserting data into collection: ${collectionName}`);
            const collection = mongoose_1.default.connection.collection(collectionName);
            const result = yield collection.insertMany(data);
            console.log(`Successfully inserted ${result.insertedCount} records into '${collectionName}'.`);
        }
        catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    });
}
function loadCsvsToMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        let alreadyConnected = false;
        try {
            yield insertCsvToMongo(PRODUCTS_COLLECTION, PRODUCTS_CSV_FILE);
            yield insertCsvToMongo(SALES_COLLECTION, SALES_CSV_FILE);
            console.log("All files processed successfully!");
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally {
            console.log("Keeping the MongoDB connection active.");
        }
    });
}
