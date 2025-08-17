import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as api from "@/api/nodeApi";

interface Node {
  _id: string;
  name: string;
  parentId?: string | null;
}

interface PaginatedResponse {
  data: Node[];
  total: number;
}

interface NodeState {
  roots: Node[];
  children: Record<string, { nodes: Node[]; total: number }>;
  totalRoots: number;
  loading: boolean;
  error: string | null;
}

const initialState: NodeState = {
  roots: [],
  children: {},
  totalRoots: 0,
  loading: false,
  error: null,
};

export const getRootNodes = createAsyncThunk(
  "nodes/getRootNodes",
  async ({ page, limit }: { page: number; limit: number }) => {
    const res = await api.fetchRootNodes(page, limit);
    return res.data as PaginatedResponse;
  }
);

export const getChildNodes = createAsyncThunk(
  "nodes/getChildNodes",
  async ({ parentId, page, limit }: { parentId: string; page: number; limit: number }) => {
    const res = await api.fetchChildNodes(parentId, page, limit);
    return { parentId, ...res.data } as { parentId: string } & PaginatedResponse;
  }
);

export const addNode = createAsyncThunk("nodes/addNode", async (data: { name: string; parentId?: string }) => {
  const res = await api.createNode(data);
  return res.data as Node;
});

export const updateNode = createAsyncThunk(
  "nodes/updateNode",
  async ({ id, data }: { id: string; data: { name: string } }) => {
    const res = await api.updateNode(id, data);
    return res.data;
  }
);

export const removeNode = createAsyncThunk("nodes/removeNode", async (id: string) => {
  await api.deleteNode(id);
  return id;
});

const nodeSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRootNodes.fulfilled, (state, action) => {
        if (state.roots) {
          state.roots.push(...action.payload.data);
        } else {
          state.roots = action.payload.data;
        }
        state.totalRoots = action.payload.total;
        state.loading = false;
      })
      .addCase(getChildNodes.fulfilled, (state, action) => {
        const { parentId, data, total } = action.payload;

        if (state.children[parentId]) {
          const existing = state.children[parentId].nodes;
          const newNodes = data.filter((n) => !existing.some((e) => e._id === n._id));
          state.children[parentId].nodes.push(...newNodes);
          state.children[parentId].total = total;
        } else {
          state.children[parentId] = {
            nodes: data,
            total,
          };
        }
      })
      .addCase(addNode.fulfilled, (state, action) => {
        if (action.payload.parentId) {
          const parentId = action.payload.parentId;
          if (state.children[parentId]) {
            state.children[parentId].nodes = [action.payload, ...state.children[parentId].nodes];
            state.children[parentId].total += 1;
          } else {
            state.children[parentId] = {
              nodes: [action.payload],
              total: 1,
            };
          }
        } else {
          state.roots = [action.payload, ...state.roots];
          state.totalRoots++;
        }
      })
      .addCase(updateNode.fulfilled, (state, action) => {
        const { updated } = action.payload;
        const parentId = updated.parentId;
        const _id = updated._id;
        if (parentId) {
          const listObj = state.children[parentId];
          if (listObj) {
            const idx = listObj.nodes.findIndex((n) => n._id === _id);
            if (idx !== -1) {
              listObj.nodes[idx] = updated;
            }
          }
        } else {
          const idx = state.roots.findIndex((n) => n._id === _id);
          if (idx !== -1) state.roots[idx] = updated;
        }
      })
      .addCase(removeNode.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;

        const rootIdx = state.roots.findIndex((n) => n._id === id);
        if (rootIdx !== -1) {
          state.roots.splice(rootIdx, 1);
          state.totalRoots -= 1;
        }

        for (const key in state.children) {
          const listObj = state.children[key];
          const beforeLength = listObj.nodes.length;
          listObj.nodes = listObj.nodes.filter((n) => n._id !== id);
          const afterLength = listObj.nodes.length;
          listObj.total -= beforeLength - afterLength;
        }
      });
  },
});

export default nodeSlice.reducer;
