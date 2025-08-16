import Node, { INode } from "../models/Node";
import { INodeRepository } from "./interfaces/INodeRepository";

export class NodeRepository implements INodeRepository {
  async createNode(nodeData: Partial<INode>): Promise<INode> {
    return await Node.create(nodeData);
  }

   async findRootNodes(page: number, limit: number): Promise<{ data: INode[]; total: number }> {
    const total = await Node.countDocuments({ parentId: null });
    const data = await Node.find({ parentId: null })
      .skip((page - 1) * limit)
      .limit(limit);
    return { data, total };
  }

    async findChildNodes(parentId: string, page: number, limit: number): Promise<{ data: INode[]; total: number }> {
    const total = await Node.countDocuments({ parentId });
    const data = await Node.find({ parentId })
      .skip((page - 1) * limit)
      .limit(limit);
    return { data, total };
  }

  async findNodeById(id: string): Promise<INode | null> {
    return await Node.findById(id);
  }

  async updateNode(id: string, data: Partial<INode>) {
    return await Node.findByIdAndUpdate(id, data, {new: true})
  }

  async deleteNodeAndChildren(id: string): Promise<void> {
    const nodes = await Node.find();
    const collectIds = (targetId: string): string[] => {
      const children = nodes.filter(n => String(n.parentId) === String(targetId));
      return children.reduce(
        (acc, child) => [...acc, child.id, ...collectIds(child.id)],
        [] as string[]
      );
    };
    const idsToDelete = [id, ...collectIds(id)];
    await Node.deleteMany({ _id: { $in: idsToDelete } });
  }
}
