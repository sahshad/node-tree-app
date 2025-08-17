import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getRootNodes, addNode } from "@/store/nodeSlice";
import { TreeNode } from "./tree-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TreeView() {
  const dispatch = useAppDispatch();
  const { roots, totalRoots } = useAppSelector((state) => state.nodes);

  const [page, setPage] = useState(1);
  const [newRoot, setNewRoot] = useState("");

  useEffect(() => {
    dispatch(getRootNodes({ page, limit: 5 }));
  }, [dispatch, page]);

  const handleAddRoot = () => {
    if (newRoot.trim()) {
      dispatch(addNode({ name: newRoot }));
      setNewRoot("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add root node"
          value={newRoot}
          onChange={(e) => setNewRoot(e.target.value)}
        />
        <Button onClick={handleAddRoot}>Add Root</Button>
      </div>

      {roots.map((root) => (
        <TreeNode key={root._id} node={root} />
      ))}

      {roots.length < totalRoots && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          className="mt-2"
        >
          Load More Roots
        </Button>
      )}
    </div>
  );
}
