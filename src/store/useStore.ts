import {create} from 'zustand';
import { v4 as uuid } from 'uuid';

export interface Event {
    id: string;
    parentId: string;
    title: string;
    code: string;
    start: Date;
    end: Date;
    status: 'new' | 'in-prep' | 'done';
}

interface SchedulerState {
    events: Event[];
    addEvent: (
        parentId: string,
        title: string,
        code : string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => void;
    updateEvent: (
        id: string,
        parentId: string,
        title: string,
        code: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => void;
    deleteEvent: (id: string) => void;

}

export const useSchedulerStore = create<SchedulerState>((set) => ({
    events: [],
    addEvent: (parentId, title, code, start, end, status) =>
        set((state) => ({
            events: [
                ...state.events,
                { id: uuid(), parentId, title, code, start, end, status },
            ],
        })),
    updateEvent: (id, parentId, title, code , start, end, status) =>
        set((s) => ({
            events: s.events.map((ev) =>
                ev.id === id ? { ...ev, parentId: parentId, title, code, start, end, status } : ev
            ),
        })),
    deleteEvent: (id) =>
        set((state) => ({
            events: state.events.filter((ev) => ev.id !== id),
        })),
}));