import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./src/routes/users.router.js";
import ResumeRouter from "./src/routes/resumes.router.js";
import AuthRouter from "./src/routes/auth.router.js";
import EmailRouter from "./src/routes/email.router.js";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = 3000;

// Swagger 정의 옵션 설정
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NODE-RESUME",
      version: "1.0.0",
      description: "NODE 숙련주차 개인과제"
    }
  },
  // API 엔드포인트가 있는 파일 경로를 지정합니다.
  apis: ["./src/routes/*.js"] // 라우터 파일의 위치에 따라 경로를 수정하세요.
};

// Swagger 스펙 생성
const specs = swaggerJsdoc(options);

// Swagger UI 미들웨어 등록
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api", [UsersRouter, ResumeRouter, AuthRouter, EmailRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
