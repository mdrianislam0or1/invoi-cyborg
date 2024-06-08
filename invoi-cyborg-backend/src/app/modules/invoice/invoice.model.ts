import mongoose, { Schema, Document } from "mongoose";
import { InvoiceData } from "./invoice.interface";

const InvoiceSchema: Schema = new Schema({
  reservationId: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  discount: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle: {
    id: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    seats: { type: Number, required: true },
    bags: { type: Number, required: true },
    features: { type: [String], required: true },
    rates: {
      hourly: { type: Number, required: true },
      daily: { type: Number, required: true },
      weekly: { type: Number, required: true },
    },
    imageURL: { type: String, required: true },
  },
  collisionDamageWaiver: { type: Boolean, required: true },
  liabilityInsurance: { type: Boolean, required: true },
  rentalTax: { type: Boolean, required: true },
  totalCost: { type: Number, required: true },
});

export default mongoose.model<InvoiceData & Document>("Invoice", InvoiceSchema);
