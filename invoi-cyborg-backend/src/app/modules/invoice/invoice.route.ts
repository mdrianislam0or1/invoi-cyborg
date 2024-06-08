import express from "express";
import { createInvoiceHandler } from "./invoice.controller";
import { getInvoices } from "./invoice.service";

const router = express.Router();

router.post("/invoice", createInvoiceHandler);
router.get("/", getInvoices);

export const InvoiceRouter = router;
