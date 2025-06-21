import { sql } from "../config/db.js";

export async function createTranscation(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount, category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTransactionbyUserId(req, res) {
  try {
    const { UserId } = req.params;

    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id=${UserId}
        `;
    res.status(200).json(transactions);
    console.log(transactions[0]);
  } catch (error) {
    console.log("Error Getting the transaction: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const { Id } = req.params;

    if (isNaN(parseInt(Id))) {
      return res.status(400).json({ message: "Invalid Transaction Id" });
    }

    const result = await sql`
        DELETE FROM transactions WHERE id=${Id} RETURNING *
        `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(201).json({ message: "Transaction deleted successfully!" });
  } catch (error) {
    console.log("Error Deleting the transaction: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummary(req, res) {
  try {
    const { UserId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${UserId}
    `;

    const incomeResult = await sql`
     SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${UserId} AND amount>0
      `;
    const expensesResult = await sql`
     SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${UserId} AND amount<0
      `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error Getting Summary the transaction: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
