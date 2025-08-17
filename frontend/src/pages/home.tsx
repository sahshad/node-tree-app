import { TreeView } from "@/components/home/tree-view";

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="py-5">
        <h1 className="text-4xl font-bold mb-4 text-center">Node Tree App</h1>
      </div>
      <TreeView />
    </main>
  );
}
