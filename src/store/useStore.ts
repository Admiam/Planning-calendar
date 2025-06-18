import {create} from 'zustand';
import { v4 as uuid } from 'uuid';

export interface Order {
    id: string;
    title: string;
    code: string;
    parentId?: string;
}

export interface Event {
    id: string;
    orderId: string;
    title: string;
    start: Date;
    end: Date;
    status: 'new' | 'in-prep' | 'done';
}

interface SchedulerState {
    orders: Order[];
    events: Event[];
    addOrder: (title: string, code: string, parentId?: string) => void;
    addEvent: (
        orderId: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => void;
}

export const useSchedulerStore = create<SchedulerState>((set) => ({
    orders: [],
    events: [],
    addOrder: (title, code, parentId) =>
        set((state) => ({
            orders: [...state.orders, { id: uuid(), title, code, parentId }],
        })),
    addEvent: (orderId, start, end, status) =>
        set((state) => ({
            events: [
                ...state.events,
                { id: uuid(), orderId, title: '', start, end, status },
            ],
        })),
}));
