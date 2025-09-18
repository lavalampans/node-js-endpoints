import { Router } from "express";
import { eventController } from "../controllers/event.controller";

const router = Router();

router.get("/", eventController.getEvents);
router.post("/", eventController.postEvent);
router.put("/:id", eventController.putEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;
