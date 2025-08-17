import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useRedux";
import { getChildNodes } from "@/store/nodeSlice";
import { useState } from "react";
import TreeNode from "./tree-node";

interface Props {
  nodeId: string;
  children: any[];
  totalChildren: number;
  currentPage: number;
  setPages: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
}

export default function TreeChildren({ nodeId, children, totalChildren, currentPage, setPages }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setLoading(true);
    try {
      await dispatch(getChildNodes({ parentId: nodeId, page: nextPage, limit: 5 }));
      setPages((prev) => ({ ...prev, [nodeId]: nextPage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-6 space-y-2">
      {children.map((child) => (
        <TreeNode key={child._id} node={child} />
      ))}

      {children.length < totalChildren && (
        <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={loading}>
          {loading ? (
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
  );
}
