import { Request, Response } from "express";
import { createInvoice, getInvoices } from "./invoice.service";

const createInvoiceHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoiceData = req.body;
    const createdInvoice = await createInvoice(invoiceData);
    res.status(201).json({ status: "success", data: createdInvoice });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export { createInvoiceHandler };

export const getInvoicesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await getInvoices();
    res.status(200).json({ status: "success", data: invoices });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
