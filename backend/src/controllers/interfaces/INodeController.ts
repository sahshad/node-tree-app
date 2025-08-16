import { RequestHandler } from "express";

export interface INodeController {
  createNode: RequestHandler;
  getRootNodes: RequestHandler;
  getChildNodes: RequestHandler;
  deleteNode: RequestHandler;
  updateNode: RequestHandler;
}
