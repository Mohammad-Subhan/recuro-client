import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Video {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number; // seconds
    size: number; // bytes
    transcription: string;
    shareLink: string;
    author: {
        _id: string;
        fullName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface VideoState {
    videos: Video[];
    search: string;
    sortBy: string;
    order: "asc" | "desc";
    fetchTrigger: number;
}

const initialState: VideoState = {
    videos: [],
    search: "",
    sortBy: "createdAt",
    order: "desc",
    fetchTrigger: 0,
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos: (state, action: PayloadAction<Video[]>) => {
            state.videos = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
        },
        setOrder: (state, action: PayloadAction<"asc" | "desc">) => {
            state.order = action.payload;
        },
        removeVideo: (state, action: PayloadAction<string>) => {
            state.videos = state.videos.filter((v) => v._id !== action.payload);
        },
        triggerRefetch: (state) => {
            state.fetchTrigger += 1;
        },
    },
});

export const { setVideos, setSearch, setSortBy, setOrder, removeVideo, triggerRefetch } = videoSlice.actions;
export default videoSlice.reducer;
