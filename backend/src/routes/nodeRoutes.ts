import { Router } from "express";
import { NodeRepository } from "../repositories/NodeRepository";
import { NodeService } from "../services/NodeService";
import { NodeController } from "../controllers/NodeController";

const router = Router();

const nodeRepo = new NodeRepository();
const nodeService = new NodeService(nodeRepo);
const nodeController = new NodeController(nodeService);

router.post("/", nodeController.createNode);
router.get("/roots", nodeController.getRootNodes);
router.get("/:id/children", nodeController.getChildNodes);
router.patch("/:id", nodeController.updateNode);
router.delete("/:id", nodeController.deleteNode);

export default router;
