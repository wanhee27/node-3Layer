import express from "express";
import { prisma } from "../utils/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 생성 API
router.post("/resumes", authMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;

    if (!title) {
      return res.status(404).json({ success: false, message: "제목을 입력해주세요." }); // 404 - Not Found (찾을 수 없음)
    }
    if (!content) {
      return res.status(404).json({ success: false, message: "내용을 입력해주세요" }); // 404 - Not Found (찾을 수 없음)
    }
    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        title,
        content,
        status: "APPLY"
      }
    });
    return res.status(201).json({ message: "이력서가 등록되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 모든 이력서 목록 조회 API
router.get("/resumes", async (req, res, next) => {
  try {
    const orderKey = req.query.orderKey ?? "resumeId";
    const orderValue = req.query.orderValue ?? "desc";

    if (!["resumeId", "status"].includes(orderKey)) {
      return res.status(400).json({ success: false, message: "orderKey가 올바르지 않습니다." }); // 400 - Bad Request (잘못된요청)
    }
    if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
      return res.status(400).json({ success: false, message: "orderValue가 올바르지 않습니다." }); // 400 - Bad Request (잘못된요청)
    }

    const resume = await prisma.resumes.findMany({
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { name: true } },
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        {
          [orderKey]: orderValue
        }
      ]
    });
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회 API
router.get("/resumes/:resumeId", async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeI는 필수값입니다." }); // 400 - Bad Request (잘못된요청)
    }
    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { name: true } },
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!resume) {
      return res.status(200).json({ data: {} });
    }
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 이력서 수정 API
router.patch("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId, grade } = req.user;
    const { title, content, status } = req.body;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId }
    });
    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." }); // 404 - Not Found (찾을 수 없음)
    }
    // 내가 작성한 이력서이거나 admin일 경우 지나간다.
    if (grade === "user" && userId !== resume.userId) {
      return res.status(403).json({ message: "이력서를 수정할 권한이 없습니다." }); // 403 - Forbidden (금지됨)
    }
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeId는 필수값입니다." }); // 400 - Bad Request (잘못된요청)
    }
    if (!title) {
      return res.status(400).json({ success: false, message: "이력서 제목을 입력해주세요." }); // 400 - Bad Request (잘못된요청)
    }
    if (!content) {
      return res.status(400).json({ success: false, message: "이력서를 작성해주세요." }); // 400 - Bad Request (잘못된요청)
    }
    if (!status) {
      return res.status(400).json({ success: false, message: "상태값은 필수입니다." }); // 400 - Bad Request (잘못된요청)
    }
    // status 존재한다면
    if (!["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"].includes(status)) {
      return res.status(400).json({ success: false, message: "올바르지 않은 상태값 입니다." }); // 400 - Bad Request (잘못된요청)
    }

    await prisma.resumes.update({
      where: { resumeId: +resumeId },
      data: { title, content, status }
    });
    return res.status(200).json({ message: "이력서 수정사항이 저장되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제 API
router.delete("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { userId } = req.user;

    const resume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId }
    });
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeI는 필수값입니다." }); // 400 - Bad Request (잘못된요청)
    }
    if (!resume) {
      return res.status(404).json({ success: false, message: "이력서 조회에 실패하였습니다." }); // 404 - Not Found (찾을 수 없음)
    }
    if (userId !== resume.userId) {
      return res.status(403).json({ success: false, message: "이력서를 수정할 권한이 없습니다." }); // 403 - Forbidden (금지됨)
    }

    await prisma.resumes.delete({
      where: { resumeId: +resumeId }
    });

    return res.status(200).json({ message: "이력서가 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

//NOTE - Swagger 추가

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: 이력서 관련 API
 */

/**
 * @swagger
 * /api/resumes:
 *   post:
 *     summary: 이력서 생성
 *     tags: [Resumes]
 *     description: 새로운 이력서를 생성하는 API
 *     requestBody:
 *       description: 이력서 생성 요청 body data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *                 example: 이력서 제목 예시
 *               content:
 *                 type: string
 *                 description: 이력서 내용
 *                 example: 이력서 내용 예시
 *     responses:
 *       201:
 *         description: 이력서 생성 성공
 *       400:
 *         description: 잘못된 요청 또는 필수 필드 누락
 *       403:
 *         description: 권한이 없음
 */

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: 모든 이력서 목록 조회
 *     tags: [Resumes]
 *     description: 모든 이력서 목록을 조회하는 API
 *     parameters:
 *       - in: query
 *         name: orderKey
 *         schema:
 *           type: string
 *         description: 정렬 기준 필드 (resumeId 또는 status) 기본 resumeID
 *       - in: query
 *         name: orderValue
 *         schema:
 *           type: string
 *         description: 정렬 방식 (asc 또는 desc) 기본 desc
 *     responses:
 *       200:
 *         description: 모든 이력서 목록 조회 성공
 *       400:
 *         description: 잘못된 요청 또는 올바르지 않은 정렬 기준 또는 방식
 */

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   get:
 *     summary: 특정 이력서 조회
 *     tags: [Resumes]
 *     description: 특정 이력서를 조회하는 API
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 이력서의 ID
 *     responses:
 *       200:
 *         description: 이력서 조회 성공
 *       400:
 *         description: 잘못된 요청 또는 필수 필드 누락
 *       404:
 *         description: 이력서가 없음
 */

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   patch:
 *     summary: 이력서 수정
 *     tags: [Resumes]
 *     description: 특정 이력서를 수정하는 API
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 이력서의 ID
 *     requestBody:
 *       description: 이력서 수정 요청 body data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *                 example: 수정된 이력서 제목
 *               content:
 *                 type: string
 *                 description: 이력서 내용
 *                 example: 수정된 이력서 내용
 *               status:
 *                 type: string
 *                 description: 이력서 상태
 *                 example: PASS
 *     responses:
 *       200:
 *         description: 이력서 수정 성공
 *       400:
 *         description: 잘못된 요청 또는 필수 필드 누락
 *       403:
 *         description: 권한이 없음
 *       404:
 *         description: 이력서가 없음
 */

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   delete:
 *     summary: 이력서 삭제
 *     tags: [Resumes]
 *     description: 특정 이력서를 삭제하는 API
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 이력서의 ID
 *     responses:
 *       200:
 *         description: 이력서 삭제 성공
 *       400:
 *         description: 잘못된 요청 또는 필수 필드 누락
 *       403:
 *         description: 권한이 없음
 *       404:
 *         description: 이력서가 없음
 */

export default router;
