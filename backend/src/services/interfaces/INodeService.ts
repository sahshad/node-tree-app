import { INode } from "../../models/Node";

export interface INodeService {
  createNode(nodeData: Partial<INode>): Promise<INode>;
  getRootNodes(page: number, limit: number): Promise<{ data: INode[]; total: number }>;
  getChildNodes(parentId: string, page: number, limit: number): Promise<{ data: INode[]; total: number }>;
  deleteNode(id: string): Promise<void>;
  updateNode(id: string, data: Partial<INode>): Promise<INode | null>;
}
