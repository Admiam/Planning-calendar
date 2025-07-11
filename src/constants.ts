import type {Event} from './types.ts'

// Czech day names for headers in calendar components
export const CZECH_DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

// Define status colors for events
export const statusColor: Record<Event["status"], string> = {
    new:     "#f0ad4e",
    "in-prep":"#0275d8",
    done:    "#5cb85c",
};

export const cellHeight = 60;
