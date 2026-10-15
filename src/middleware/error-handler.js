import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";


export function notFoundHandler(req, res, next) {

    const error =
        new AppError(
            `Route not found: ${req.method} ${req.originalUrl}`,
            404,
            "ROUTE_NOT_FOUND"
        );

    next(error);
}

export function errorHandler(
    error,
    req,
    res,
    next
) {

    console.error(
        `[ERROR] ${req.method} ${req.originalUrl}`,
        error
    );

    const statusCode =
        error instanceof AppError
            ? error.statusCode
            : 500;


    const code =
        error instanceof AppError
            ? error.code
            : "INTERNAL_SERVER_ERROR";


    logger.error(
        error.message,
        {
            method: req.method,
            url: req.originalUrl,
            statusCode,
            code,
            stack:
                process.env.NODE_ENV !== "production"
                    ? error.stack
                    : undefined
        }
    );


    res.status(statusCode).json({

        success: false,

        error: {
            code,

            message:
                statusCode === 500 &&
                process.env.NODE_ENV === "production"
                    ? "Internal server error"
                    : error.message
        }

    });
}