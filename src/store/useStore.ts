import {create} from 'zustand';
import { v4 as uuid } from 'uuid';

export interface Event {
    id: string;
    eventId: string;
    title: string;
    code: string;
    start: Date;
    end: Date;
    status: 'new' | 'in-prep' | 'done';
}

interface SchedulerState {
    events: Event[];
    addEvent: (
        eventId: string,
        title: string,
        code : string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => void;
    updateEvent: (
        id: string,
        orderId: string,
        title: string,
        code: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => void;
}

export const useSchedulerStore = create<SchedulerState>((set) => ({
    events: [],
    addEvent: (eventId, title, code, start, end, status) =>
        set((state) => ({
            events: [
                ...state.events,
                { id: uuid(), eventId, title, code, start, end, status },
            ],
        })),
    updateEvent: (id, orderId, title, code , start, end, status) =>
        set((s) => ({
            events: s.events.map((ev) =>
                ev.id === id ? { ...ev, orderId, title, code, start, end, status } : ev
            ),
        })),
}));
