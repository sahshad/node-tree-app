// components/Tree/dialogs/EditNodeDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateNode } from "@/store/nodeSlice";
import { useAppDispatch } from "@/hooks/useRedux";

interface Props {
  node: { _id: string; name: string };
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function EditNodeDialog({ node, open, setOpen }: Props) {
  const dispatch = useAppDispatch();
  const [editName, setEditName] = useState(node.name);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (editName.trim() && editName !== node.name) {
      setLoading(true);
      try {
        await dispatch(updateNode({ id: node._id, data: { name: editName } })).unwrap();
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">Update the name of this node.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Node name" />
          <Button className="w-full" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
