// Define an event for the calendar component
export type CalendarEvent = {
    code: string;
    start: Date;
    end: Date;
    title: string;
    bgColor: string;
};

// Define the event interface
export interface Event {
    id: string;
    parentId: string;
    title: string;
    code: string;
    start: Date;
    end: Date;
    status: 'new' | 'in-prep' | 'done';
}

// Props for calendar component
export interface CalendarComponentProps {
    year: number;
    month: number;
    events: CalendarEvent[];
}