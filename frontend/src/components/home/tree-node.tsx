import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChildNodes, addNode, removeNode, updateNode } from "@/store/nodeSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";

interface Props {
  node: { _id: string; name: string; childCount: number; parentId?: string | null };
}

export function TreeNode({ node }: Props) {
  const dispatch = useAppDispatch();
  const childrenData = useAppSelector((state) => state.nodes.children[node._id]);
  const children = childrenData?.nodes || [];
  const totalChildren = childrenData?.total || 0;

  const [expanded, setExpanded] = useState(false);
  const [pages, setPages] = useState<Record<string, number>>({});

  const [editName, setEditName] = useState(node.name);
  const [childName, setChildName] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const currentPage = pages[node._id] ?? 1;

  const toggleChildren = () => {
    if (!expanded) {
      if (!childrenData) {
        dispatch(getChildNodes({ parentId: node._id, page: 1, limit: 5 }));
        setPages((prev) => ({ ...prev, [node._id]: 1 }));
      }
    }
    setExpanded(!expanded);
  };

  const handleAddChild = async () => {
    if (childName.trim()) {
      await dispatch(addNode({ name: childName, parentId: node._id })).unwrap();

      if (!expanded) {
        setExpanded(true);

        setPages((prev) => ({ ...prev, [node._id]: 1 }));
        dispatch(getChildNodes({ parentId: node._id, page: 1, limit: 5 }));
      }

      setChildName("");
      setIsAddOpen(false);
    }
  };

  const handleUpdateNode = () => {
    if (editName.trim() && editName !== node.name) {
      dispatch(updateNode({ id: node._id, data: { name: editName } }));
      setIsEditOpen(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(getChildNodes({ parentId: node._id, page: nextPage, limit: 5 }));
    setPages((prev) => ({ ...prev, [node._id]: nextPage }));
  };

  return (
    <div className="space-y-2">
      <Card className="w-full p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleChildren}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>

          <span className="flex-1 font-medium">{node.name}</span>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil size={16} className="mr-1" />
                Edit
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Change the name of this node and click save to update it.
                </p>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Node name" />

                <Button className="w-full" onClick={handleUpdateNode}>
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);

              if (open) {
                const defaultIndex = (node.childCount || 0) + 1;
                setChildName(`${node.name}.${defaultIndex}`);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-1" />
                Child
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Child Node</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Enter a name for the new child node. It will be added under <strong>{node.name}</strong>.
                </p>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Input placeholder="Child name" value={childName} onChange={(e) => setChildName(e.target.value)} />

                <Button className="w-full" onClick={handleAddChild}>
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" size="sm" onClick={() => dispatch(removeNode(node._id))}>
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </Card>

      {expanded && (
        <div className="ml-6 space-y-2">
          {children.map((child) => (
            <TreeNode key={child._id} node={child} />
          ))}

          {children.length < totalChildren && (
            <Button variant="outline" size="sm" onClick={handleLoadMore}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
