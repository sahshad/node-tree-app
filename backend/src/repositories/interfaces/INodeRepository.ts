import { INode } from "../../models/Node";

export interface INodeRepository {
  createNode(nodeData: Partial<INode>): Promise<INode>;
  findRootNodes(page: number, limit: number): Promise<{ data: INode[]; total: number }>;
  findChildNodes(parentId: string, page: number, limit: number): Promise<{ data: INode[]; total: number }>;
  findNodeById(id: string): Promise<INode | null>;
  deleteNodeAndChildren(id: string): Promise<void>;
  updateNode(id: string, data: Partial<INode>): Promise<INode | null>;
}
