import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getChildNodes } from "@/store/nodeSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronDown } from "lucide-react";
import TreeNodeActions from "./tree-node-actions";
import TreeChildren from "./tree-children";

interface Props {
  node: { _id: string; name: string; childCount: number; parentId?: string | null };
}

export default function TreeNode({ node }: Props) {
  const dispatch = useAppDispatch();
  const childrenData = useAppSelector((state) => state.nodes.children[node._id]);
  const children = childrenData?.nodes || [];
  const totalChildren = childrenData?.total || 0;

  const [expanded, setExpanded] = useState(false);
  const [pages, setPages] = useState<Record<string, number>>({});
  const [loadingChildren, setLoadingChildren] = useState(false);

  const currentPage = pages[node._id] ?? 1;

  const toggleChildren = async () => {
    if (!expanded && !childrenData) {
      setLoadingChildren(true);
      try {
        await dispatch(getChildNodes({ parentId: node._id, page: 1, limit: 5 }));
        setPages((prev) => ({ ...prev, [node._id]: 1 }));
      } finally {
        setLoadingChildren(false);
      }
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div className="space-y-2">
      <Card className="w-full p-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="link" size="sm" onClick={toggleChildren}>
              {loadingChildren ? (
                <div className="w-3 h-3 animate-spin border-2 border-muted-foreground border-t-transparent rounded-full" />
              ) : expanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>

            <span className="flex-1 font-medium">{node.name}</span>
          </div>

          <TreeNodeActions node={node} expanded={expanded} setExpanded={setExpanded} setPages={setPages} />
        </div>
      </Card>

      {expanded && (
        <TreeChildren
          nodeId={node._id}
          children={children}
          totalChildren={totalChildren}
          currentPage={currentPage}
          setPages={setPages}
        />
      )}
    </div>
  );
}
