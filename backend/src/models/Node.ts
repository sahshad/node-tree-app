import { Schema, model, Document } from "mongoose";

export interface INode extends Document {
  name: string;
  parentId?: string | null;
  childCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const nodeSchema = new Schema<INode>(
  {
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Node", default: null },
    childCount: {type: Number, default: 0}
  },
  { timestamps: true }
);

export default model<INode>("Node", nodeSchema);
