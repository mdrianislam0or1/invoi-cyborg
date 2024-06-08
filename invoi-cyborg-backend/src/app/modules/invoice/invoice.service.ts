import { InvoiceData } from "./invoice.interface";
import InvoiceModel from "./invoice.model";
import {
  DAILY_RATE,
  WEEKLY_RATE,
  COLLISION_DAMAGE_WAIVER_COST,
  LIABILITY_INSURANCE_COST,
  RENTAL_TAX_RATE,
} from "./invoice.constant";

const calculateTotalCost = (invoiceData: InvoiceData): number => {
  const {
    pickupDate,
    returnDate,
    collisionDamageWaiver,
    liabilityInsurance,
    rentalTax,
    discount,
    vehicle,
  } = invoiceData;

  const durationInDays = Math.ceil(
    (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const rentalCost =
    durationInDays >= 7
      ? WEEKLY_RATE * Math.ceil(durationInDays / 7)
      : DAILY_RATE * durationInDays;

  const totalBeforeTax =
    rentalCost +
    (collisionDamageWaiver ? COLLISION_DAMAGE_WAIVER_COST : 0) +
    (liabilityInsurance ? LIABILITY_INSURANCE_COST : 0);
  const totalTax = rentalTax ? totalBeforeTax * RENTAL_TAX_RATE : 0;
  const totalCost = totalBeforeTax + totalTax - discount;

  return totalCost;
};

const createInvoice = async (
  invoiceData: InvoiceData
): Promise<InvoiceData> => {
  const totalCost = calculateTotalCost(invoiceData);

  const newInvoice = new InvoiceModel({
    ...invoiceData,
    totalCost,
  });

  await newInvoice.save();

  return newInvoice.toObject();
};

export { createInvoice };

export const getInvoices = async (): Promise<any[]> => {
  try {
    const invoices = await InvoiceModel.find();
    return invoices;
  } catch (error) {
    throw new Error("Failed to fetch invoices from the database.");
  }
};
