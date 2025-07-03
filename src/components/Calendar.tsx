import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import {useState} from "react";
import EventModal from "./EventModal.tsx";
import {useSchedulerStore} from "../store/useStore.ts";
import type {Event} from "../types.ts";
import 'gridstack/dist/gridstack.min.css';
import CalendarGrid from "./CalendarGrid.tsx";
import {statusColor} from "../constants.ts";

export default function CalendarComponent() {
    const [range, setRange] = useState({startDate: new Date(), endDate: new Date()});
    const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

    dayjs.extend(isBetween)
    const events = useSchedulerStore((s) => s.events);
    const updateEvent = useSchedulerStore((s) => s.updateEvent);

    const handleUpdate = (
        parentId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => {
        if (currentEvent)
            updateEvent(currentEvent.id, parentId, orderName, orderCode, start, end, status);
        setModalOpen(false);
    };

    const gridEvents = [
  { code: 'eventOne', start: new Date(2025,7,3), end: new Date(2025,7,3), title: 'Meeting', bgColor: statusColor["in-prep"] },
  { code: 'eventTwo', start: new Date(2023,7,1), end: new Date(2025,7,3), title: 'Single day', bgColor: statusColor["new"] }
];

    return (
        <div>
            <CalendarGrid year={2025} month={7} events={gridEvents} />;

            {modalOpen && slotRange && (
                <EventModal
                    initialStart={slotRange.start}
                    initialEnd={slotRange.end}
                    events={events}
                    currentEvent={currentEvent}
                    onSave={handleUpdate}
                    onClose={() => setModalOpen(false)}

                />
            )}
        </div>
    );
}
