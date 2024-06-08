import { Router } from "express";
import { InvoiceRouter } from "../modules/invoice/invoice.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/api/invo",
    route: InvoiceRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
