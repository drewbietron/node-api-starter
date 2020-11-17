import { Request, Response } from "express";
import database from "../../database/database";

function index(req: Request, res: Response) {
  try {
    res.status(200).json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "down", ...e });
  }
}

export async function databaseCheck(req: Request, res: Response) {
  try {
    await database.authenticate();

    res.status(200).json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "down", ...e });
  }
}

export default index;
