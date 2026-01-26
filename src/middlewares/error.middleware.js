const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
    console.log("Error Name :- " + err.name);
    console.log("Error Kind :- " + err.kind);
    console.error(err.stack);

    if (err.name === "CastError" && err.kind === "ObjectId") {
        err = new AppError(400, "Invalid listing ID");
    }


    if (err.name === "ValidationError") {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors)
                .map((e) => e.message)
                .join(", ");

            err = new AppError(400, messages);
        }
    }

    
    const { status = 500, message = "Internal Server Error" } = err;

    return res.status(status).render("error.ejs", {
        status,
        message,
    });
};

module.exports = errorHandler;
