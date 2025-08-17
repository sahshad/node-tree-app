import { useState } from "react";
import type {Dispatch, SetStateAction} from "react"
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import EditNodeDialog from "../dialogs/edit-node-dialog";
import AddNodeDialog from "../dialogs/add-node-dialog";
import DeleteNodeDialog from "../dialogs/delete-node-dialog";


interface Props {
  node: { _id: string; name: string; childCount: number; parentId?: string | null };
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  setPages: Dispatch<SetStateAction<Record<string, number>>>;
}

export default function TreeNodeActions({ node, expanded, setExpanded, setPages }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 ml-auto">
      <Button variant="link" size="icon" onClick={() => setIsEditOpen(true)}>
        <Pencil size={16} />
      </Button>

      <Button variant="link" size="icon" onClick={() => setIsAddOpen(true)}>
        <Plus size={16} />
      </Button>

      <Button variant="link" size="icon" onClick={() => setIsDeleteOpen(true)}>
        <Trash2 size={16} className="text-red-500" />
      </Button>

      <EditNodeDialog node={node} open={isEditOpen} setOpen={setIsEditOpen} />
      <AddNodeDialog
        node={node}
        open={isAddOpen}
        setOpen={setIsAddOpen}
        expanded={expanded}
        setExpanded={setExpanded}
        setPages={setPages}
      />
      <DeleteNodeDialog node={node} open={isDeleteOpen} setOpen={setIsDeleteOpen} />
    </div>
  );
}
