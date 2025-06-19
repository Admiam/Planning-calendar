import { useState } from 'react';
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views,
    type View,
    type SlotInfo,
    type Event as RBCEvent
} from 'react-big-calendar';
import { format, parse, startOfWeek as dfStartOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cs } from 'date-fns/locale';
import { useSchedulerStore, type Event as AppEvent } from '../store/useStore';
import EventModal from './EventModal';
import {FaTrash} from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal.tsx";

const locales = { cs };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: any) => dfStartOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

export default function Calendar() {
    const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentEvent, setCurrentEvent] = useState<AppEvent | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete] = useState<AppEvent | null>(null);

    const events = useSchedulerStore((s) => s.events);
    const addEvent = useSchedulerStore((s) => s.addEvent);
    const updateEvent = useSchedulerStore((s) => s.updateEvent);
    const deleteEvent = useSchedulerStore((s) => s.deleteEvent);
    const confirmDelete = () => {
        if (toDelete) deleteEvent(toDelete.id);
        setShowConfirm(false);
        setToDelete(null);
        setModalOpen(false);
        setCurrentEvent(null)
    };

    const mapped: RBCEvent[] = events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        resource: e,
    }));

    const eventStyleGetter = (
        event: RBCEvent,
    ) => {
        const status = (event.resource as AppEvent).status;
        let backgroundColor: string;
        switch (status) {
            case 'new':     backgroundColor = '#f0ad4e'; break; // yellow
            case 'in-prep': backgroundColor = '#0275d8'; break; // blue
            case 'done':    backgroundColor = '#5cb85c'; break; // green
            default:        backgroundColor = '#777';      break;
        }
        return {
            style: {
                backgroundColor,
                borderColor: backgroundColor,
                color: 'white'
            }
        };
    };

    const onSelectSlot = (slot: SlotInfo) => {
        setSlotInfo(slot);
        setModalOpen(true);
    };

    const handleSave = (
        parentId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: AppEvent['status']
    ) => {
        if (currentEvent) {
            updateEvent(currentEvent.id, parentId, orderName, orderCode, start, end, status);
        } else {
            addEvent(parentId, orderName, orderCode, start, end, status);
        }
        setModalOpen(false);
        setCurrentEvent(null)
    };

    const onSelectEvent = (ev: RBCEvent) => {
        const appEv = ev.resource as AppEvent;
        setCurrentEvent(appEv);
        if (ev.start && ev.end) {
            const slot: SlotInfo = {
                start: ev.start,
                end: ev.end,
                slots: [ev.start],
                action: 'select',
            };
            setSlotInfo(slot);
        }
        setModalOpen(true);
    };

    const CustomEvent = ({ event }: { event: RBCEvent }) => {
        const appEv = event.resource as AppEvent;
        return (
            <div style={{ position: 'relative' }}>
                <span>{event.title}</span>
                <span
                    className="rbc-delete-icon"
                    onClick={() => {
                        setToDelete(appEv)
                        setShowConfirm(true)
                    }}
                >
        <FaTrash className="text-danger"/>
      </span>
            </div>
        );
    };

    const badgeName = (status: AppEvent['status']) => {
        switch (status) {
            case 'new':     return 'NOVÁ';
            case 'in-prep': return 'V PŘÍPRAVĚ';
            case 'done':    return 'HOTOVÁ';
        }
    };


    return (
        <div>
            <BigCalendar
                localizer={localizer}
                culture="cs"
                events={mapped}
                selectable
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                style={{ height: 600}}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={currentView}
                onView={(viewName: View) => setCurrentView(viewName)}
                date={currentDate}
                onNavigate={(date: Date, _?: View, _action?: string) => {
                    setCurrentDate(date);
                }}
                eventPropGetter={eventStyleGetter}
                components={{ event: CustomEvent }}

            />
            {modalOpen && slotInfo && (
                showConfirm && toDelete ? (
                    <ConfirmationModal
                        show={showConfirm}
                        toDelete={toDelete}
                        onHide={() => {
                            setShowConfirm(false)
                            setModalOpen(false);
                            setCurrentEvent(null)
                        }}
                        onConfirm={confirmDelete}
                        badgeName={badgeName}
                    />
                ) : (
                    <EventModal
                        slotInfo={slotInfo}
                        events={events}
                        currentEvent={currentEvent}
                        onSave={handleSave}
                        onClose={() => setModalOpen(false)}
                    />
                )
            )}



        </div>
    );
}
