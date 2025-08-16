import { Schema, model, Document } from "mongoose";

export interface INode extends Document {
  name: string;
  parentId?: string | null;
}

const nodeSchema = new Schema<INode>({
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Node", default: null }
});

export default model<INode>("Node", nodeSchema);
