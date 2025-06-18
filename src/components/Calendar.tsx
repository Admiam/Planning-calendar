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

const locales = { cs };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: any) => dfStartOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

export default function Calendar() {
    const events = useSchedulerStore((s) => s.events);
    const orders = useSchedulerStore((s) => s.orders);
    const addEvent = useSchedulerStore((s) => s.addEvent);

    const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());


    const mapped: RBCEvent[] = events.map((e) => ({
        id: e.id,
        title: orders.find((o) => o.id === e.orderId)?.title || '',
        start: e.start,
        end: e.end,
        resource: e,
    }));

    const onSelectSlot = (slot: SlotInfo) => {
        setSlotInfo(slot);
        setModalOpen(true);
    };

    const handleSave = (
        orderId: string,
        start: Date,
        end: Date,
        status: AppEvent['status']
    ) => {
        addEvent(orderId, start, end, status);
        setModalOpen(false);
    };

    return (
        <div>
            <BigCalendar
                localizer={localizer}
                culture="cs"
                events={mapped}
                selectable
                onSelectSlot={onSelectSlot}
                onSelectEvent={(ev) => console.log('Edit event', ev)}
                style={{ height: 600}}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={currentView}
                onView={(viewName: View) => setCurrentView(viewName)}
                date={currentDate}
                onNavigate={(date: Date, _?: View, _action?: string) => {
                    setCurrentDate(date);
                }}
            />
            {modalOpen && slotInfo && (
                <EventModal
                    slotInfo={slotInfo}
                    orders={orders}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
