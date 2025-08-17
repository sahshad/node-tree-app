// components/Tree/dialogs/AddNodeDialog.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useRedux";
import { addNode, getChildNodes } from "@/store/nodeSlice";

interface Props {
  node: { _id: string; name: string; childCount: number };
  open: boolean;
  setOpen: (value: boolean) => void;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  setPages: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
}

export default function AddNodeDialog({ node, open, setOpen, expanded, setExpanded, setPages }: Props) {
  const dispatch = useAppDispatch();
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const defaultIndex = (node.childCount || 0) + 1;
      setChildName(`${node.name}.${defaultIndex}`);
    }
  }, [open, node]);

  const handleAdd = async () => {
    if (!childName.trim()) return;

    setLoading(true);
    try {
      await dispatch(addNode({ name: childName, parentId: node._id })).unwrap();

      if (!expanded) {
        setExpanded(true);
        setPages((prev) => ({ ...prev, [node._id]: 1 }));
        dispatch(getChildNodes({ parentId: node._id, page: 1, limit: 5 }));
      }

      setChildName("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Child Node</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter a name for the new child node under <strong>{node.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input placeholder="Child name" value={childName} onChange={(e) => setChildName(e.target.value)} />
          <Button className="w-full" onClick={handleAdd} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
