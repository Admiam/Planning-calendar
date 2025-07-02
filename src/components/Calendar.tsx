import { Scheduler, type SchedulerData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import "@bitnoi.se/react-scheduler/dist/style.css";
import {useCallback, useState} from "react";
import EventModal from "./EventModal.tsx";
import {type Event as AppEvent, type Event, useSchedulerStore} from "../store/useStore.ts";
import {differenceInSeconds} from "date-fns";
import {getRandomNumber} from "../utils/utils.ts";

const statusColor: Record<Event["status"], string> = {
    new:     "#f0ad4e",
    "in-prep":"#0275d8",
    done:    "#5cb85c",
};

export default function CalendarComponent() {
    const [range, setRange] = useState({startDate: new Date(), endDate: new Date()});
    const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

    dayjs.extend(isBetween)
    const events = useSchedulerStore((s) => s.events);
    const updateEvent = useSchedulerStore((s) => s.updateEvent);

    const handleRangeChange = useCallback((r: { startDate: Date; endDate: Date }) => {
        setRange(r);
    }, []);

    const filteredEvents = events.filter((ev) => {
        const s  = dayjs(ev.start),
            e  = dayjs(ev.end),
            rs = dayjs(range.startDate),
            re = dayjs(range.endDate);
        return (
            s.isBetween(rs, re, null, "[]") ||
            e.isBetween(rs, re, null, "[]") ||
            (s.isBefore(rs, "day") && e.isAfter(re, "day"))
        );
    });

    // 2) Group by parentId
    const byParent = filteredEvents.reduce((acc, ev) => {
        if (!acc[ev.parentId]) acc[ev.parentId] = [];
        acc[ev.parentId].push(ev);
        return acc;
    }, {} as Record<string, Event[]>);

    // 3) Build the SchedulerData array
    const schedulerData: SchedulerData = Object.entries(byParent).map(
        ([parentId, evts]) => ({
            id: parentId,
            label: {
                // you can customize icon/title/subtitle however you like:
                icon:     `https://picsum.photos/${getRandomNumber(20, 80)}`,
                title:    evts[0].code,   // ← here
                subtitle: `${evts.length} events`,
            },
            data: evts.map((ev) => ({
                id:        ev.id,
                startDate: ev.start,
                endDate:   ev.end,
                occupancy: differenceInSeconds(ev.end, ev.start),
                title:     ev.title,
                subtitle:  ev.code,
                description: "",              // or pull from another field
                bgColor:   statusColor[ev.status],
            })),
        })
    );

    const filteredMockedSchedulerData = schedulerData.map((person) => ({
        ...person,
        data: person.data.filter(
            (project) =>
                dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
                dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
                (dayjs(project.startDate).isBefore(range.startDate, "day") &&
                    dayjs(project.endDate).isAfter(range.endDate, "day"))
        )
    }))

    const onSelectEvent = (id: string) => {
        let event = findEventById(id)
        setCurrentEvent(event);
        if (event.start && event.end) {
            const slot = {
                start: event.start,
                end: event.end,
            };
            setSlotRange(slot);
        }
        setModalOpen(true);
    };

    const findEventById = (id: string): Event => {
        return events.find((ev) => ev.id === id) as Event;
    }

    const handleUpdate = (
        parentId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: AppEvent['status']
    ) => {
        if (currentEvent)
            updateEvent(currentEvent.id, parentId, orderName, orderCode, start, end, status);
        setModalOpen(false);
    };


    return (
        <div>

                <Scheduler
                    data={filteredMockedSchedulerData}
                    onRangeChange={handleRangeChange}
                    onTileClick={(tile) => onSelectEvent(tile.id)}
                    onItemClick={(item) => console.log("clicked row", item)}
                    config={{
                        zoom: 1,
                        lang: 'en',
                        filterButtonState: 0,
                        // maxRecordsPerPage: 20,
                    }}
                />

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
