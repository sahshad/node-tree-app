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
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoadMoreLoading(true);
      await dispatch(getRootNodes({ page, limit: 5 }));
      setLoadMoreLoading(false);
    };

    loadData();
  }, [dispatch, page]);

  const handleAddRoot = async () => {
    if (!newRoot.trim()) return;

    setLoading(true);
    try {
      await dispatch(addNode({ name: newRoot })).unwrap();
      setNewRoot("");
    } catch (err) {
      console.error("Failed to add node:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreRoots = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Add root node" value={newRoot} onChange={(e) => setNewRoot(e.target.value)} />
        <Button onClick={handleAddRoot} disabled={loading}>
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            "Add Root"
          )}
        </Button>
      </div>

      {roots.map((root) => (
        <TreeNode key={root._id} node={root} />
      ))}

      {roots.length < totalRoots && (
        <Button variant="outline" size="sm" onClick={handleLoadMoreRoots} disabled={loadMoreLoading} className="mt-2">
          {loadMoreLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Load More Roots"
          )}
        </Button>
      )}
    </div>
  );
}
