import express from "express";
import cookieParser from "cookie-parser";
import SignsRouter from "./routes/sign.router.js";
import UsersRouter from "./routes/users.router.js";
import ResumeRouter from "./routes/resumes.router.js";
import EmailRouter from "./routes/email.router.js";
import LogMiddleware from "./middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/", [SignsRouter, UsersRouter, ResumeRouter, EmailRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
