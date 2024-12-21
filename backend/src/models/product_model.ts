import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
}


const productSchema: Schema<IProduct> = new Schema({
  ProductID: {
    type: Number,
    required: true,
    unique: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});


productSchema.index({ ProductID: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

// Crée automatiquement les indices définis dans le schéma
//productSchema.index({ ProductID: 1 });
//productSchema.index({ Category: 1 });

export {IProduct, Product};
