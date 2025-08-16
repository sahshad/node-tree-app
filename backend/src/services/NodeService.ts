import { INode } from "../models/Node";
import { INodeRepository } from "../repositories/interfaces/INodeRepository";
import { INodeService } from "./interfaces/INodeService";

export class NodeService implements INodeService {
  constructor(private nodeRepository: INodeRepository) {}

  async createNode(nodeData: Partial<INode>): Promise<INode> {
    return await this.nodeRepository.createNode(nodeData);
  }

  async getRootNodes(page = 1, limit = 10): Promise<{ data: INode[]; total: number }> {
    return await this.nodeRepository.findRootNodes(page, limit);
  }

  async getChildNodes(parentId: string, page = 1, limit = 10): Promise<{ data: INode[]; total: number }> {
    return await this.nodeRepository.findChildNodes(parentId, page, limit);
  }

  async deleteNode(id: string): Promise<void> {
    return await this.nodeRepository.deleteNodeAndChildren(id);
  }

  async updateNode(id: string, data: Partial<INode>) {
    return await this.nodeRepository.updateNode(id, data);
  }

  // private buildTree(nodes: INode[], parentId: string | null = null): any[] {
  //   return nodes
  //     .filter(node => String(node.parentId) === String(parentId))
  //     .map(node => ({
  //       ...node.toObject(),
  //       children: this.buildTree(nodes, node.id.toString())
  //     }));
  // }
}
