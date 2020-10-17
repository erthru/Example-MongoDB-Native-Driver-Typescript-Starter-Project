import { Response } from "express";

export const ok = (res: Response, data: any) => {
    res.status(200).json({
        error: 0,
        message: "ok",
        ...data,
    });
};

export const created = (res: Response, data: any) => {
    res.status(201).json({
        error: 0,
        message: "created",
        ...data,
    });
};

export const error = (res: Response, error: any) => {
    res.status(500).json({
        error: 0,
        message: error.message,
    });
};
