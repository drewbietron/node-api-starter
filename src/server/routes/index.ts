import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  try {
    res.status(200).end();
  } catch {
    res.status(500).end();
  }
};

export default index;
