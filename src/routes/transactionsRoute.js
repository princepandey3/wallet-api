import express from "express";

import {
  createTranscation,
  deleteTransactionById,
  getSummary,
  getTransactionbyUserId,
} from "../controller/transactionController.js";

const router = express.Router();

router.get("/:UserId", getTransactionbyUserId);

router.post("/", createTranscation);

router.delete("/:Id", deleteTransactionById);

router.get("/summary/:UserId", getSummary);

export default router;
