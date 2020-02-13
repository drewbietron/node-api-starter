import { Request, Response } from "express";

function index(req: Request, res: Response) {
  try {
    res.status(200).json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "down", ...e });
  }
}

export default index;
