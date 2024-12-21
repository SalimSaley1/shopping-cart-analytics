import mongoose, { Schema, Document } from 'mongoose';

interface ISale extends Document {
  SaleID: Number;
  ProductID: Number;
  Quantity: Number;
  Date: Date;
  TotalAmount: Number;
}
const saleSchema: Schema<ISale> = new Schema({
  SaleID: {
    type: Number,
    required: true,
    unique: true,
  },
  ProductID: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  TotalAmount: {
    type: Number,
    required: true,
  },
});

// Créer un index automatiquement sur les champs
saleSchema.index({ ProductID: 1 });
saleSchema.index({ Date: 1 });
saleSchema.index({ ProductID: 1, Date: 1 });
saleSchema.index({ Quantity: 1 });

const Sale = mongoose.model<ISale>('Sale', saleSchema);

// Crée automatiquement les indices définis dans le schéma
//saleSchema.index({ ProductID: 1 });
//saleSchema.index({ Date: 1 }); //

export {ISale, Sale} ;
