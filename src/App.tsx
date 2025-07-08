import './App.css'
import { useState } from 'react';
import {useSchedulerStore} from './store/useStore';
import type {Event} from './types.ts';
import EventModal from "./components/EventModal.tsx";
import {floorDateToIncrement} from "./utils/date.ts";
import Calendar from "./components/calendar/Calendar.tsx";

function App() {
    const [modalOpen, setModalOpen] = useState(false);
    const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null);

    const events = useSchedulerStore((s) => s.events);
    const addEvent = useSchedulerStore((s) => s.addEvent);

    const createDefaultSlot = () => {
        const start = floorDateToIncrement(new Date());
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
        return {
            start,
            end
        };
    };


    const handleSave = (
        parentId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => {
        addEvent(parentId, orderName, orderCode, start, end, status);
        setModalOpen(false);
    };

  return (
      <div>
         <button className="btn btn-outline-primary me-2 mt-2 z-3"
                  type="button"
                  onClick={() => {
                      setModalOpen(true)
                      setSlotRange(createDefaultSlot());
                  }}>
              Vložit zakázku
          </button>
          <main className="w-100 h-100">
              <Calendar/>
          </main>
          {modalOpen && slotRange && (
              <EventModal
                  initialStart={slotRange.start}
                  initialEnd={slotRange.end}
                  events={events}
                  onSave={handleSave}
                  currentEvent={null}
                  onClose={() => setModalOpen(false)}
                  isEditing={false}
              />
          )}
      </div>
  )
}

export default App
