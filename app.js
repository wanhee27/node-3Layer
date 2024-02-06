import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./src/routes/users.router.js";
import ResumeRouter from "./src/routes/resumes.router.js";
import AuthRouter from "./src/routes/auth.router.js";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = 3019;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api", [UsersRouter, ResumeRouter /*AuthRouter*/]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
