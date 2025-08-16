import { Request, response, Response } from "express";
import { NodeService } from "../services/NodeService";
import asyncHandler from "express-async-handler";
import { INodeController } from "./interfaces/INodeController";

export class NodeController implements INodeController {
  constructor(private nodeService: NodeService) {}

  createNode = asyncHandler(async (req: Request, res: Response) => {
    const node = await this.nodeService.createNode(req.body);
    res.status(201).json(node);
  });

  getRootNodes = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.nodeService.getRootNodes(page, limit);
    res.status(200).json(result);
  });

  getChildNodes = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
     const result = await this.nodeService.getChildNodes(id, page, limit);
    res.status(200).json(result);
  })

  deleteNode = asyncHandler(async (req: Request, res: Response) => {
    await this.nodeService.deleteNode(req.params.id);
    res.status(204).send();
  });

  updateNode = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const updated = await this.nodeService.updateNode(id, data);
    res.status(200).json({
      message: "Node updated successfully",
      updated,
    });
  });
}
