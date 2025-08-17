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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

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
      setAddLoading(true);
      try {
        await dispatch(addNode({ name: childName, parentId: node._id })).unwrap();

        if (!expanded) {
          setExpanded(true);
          setPages((prev) => ({ ...prev, [node._id]: 1 }));
          dispatch(getChildNodes({ parentId: node._id, page: 1, limit: 5 }));
        }

        setChildName("");
        setIsAddOpen(false);
      } finally {
        setAddLoading(false);
      }
    }
  };

  const handleUpdateNode = async () => {
    if (editName.trim() && editName !== node.name) {
      setEditLoading(true);
      try {
        await dispatch(updateNode({ id: node._id, data: { name: editName } })).unwrap();
        setIsEditOpen(false);
      } finally {
        setEditLoading(false);
      }
    }
  };

  const handleDeleteNode = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(removeNode(node._id));
      setIsDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

const handleLoadMore = async () => {
  const nextPage = currentPage + 1;
  setLoadMoreLoading(true);
  try {
    await dispatch(getChildNodes({ parentId: node._id, page: nextPage, limit: 5 }));
    setPages((prev) => ({ ...prev, [node._id]: nextPage }));
  } finally {
    setLoadMoreLoading(false);
  }
};


  return (
    <div className="space-y-2">
      <Card className="w-full p-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={toggleChildren}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>

            <span className="flex-1 font-medium">{node.name}</span>
          </div>

          <div className="flex flex-wrap gap-2 ml-auto">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="link" size="icon">
                  <Pencil size={16} className="" />
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

                  <Button className="w-full" onClick={handleUpdateNode} disabled={editLoading}>
                    {editLoading ? (
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
                <Button variant="link" size="icon">
                  <Plus size={16} className="" />
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

                  <Button className="w-full" onClick={handleAddChild} disabled={addLoading}>
                    {addLoading ? (
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

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="link" size="icon">
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong>{node.name}</strong>? This action cannot be undone.
                  </p>
                </DialogHeader>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteNode} disabled={deleteLoading}>
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {expanded && (
        <div className="ml-6 space-y-2">
          {children.map((child) => (
            <TreeNode key={child._id} node={child} />
          ))}

          {children.length < totalChildren && (
            <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={loadMoreLoading}>
              {loadMoreLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
