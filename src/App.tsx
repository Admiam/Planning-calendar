import './App.css'
import { useState } from 'react';
import {type Event as AppEvent, useSchedulerStore} from './store/useStore';
import Calendar from './components/Calendar'
import EventModal from "./components/EventModal.tsx";
import type {SlotInfo} from "react-big-calendar";
import {floorDateToIncrement} from "./utils/date.ts";

function App() {
    const [modalOpen, setModalOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null);

    // const orders = useSchedulerStore(s => s.orders);
    const events = useSchedulerStore((s) => s.events);
    const addEvent = useSchedulerStore((s) => s.addEvent);

    const createDefaultSlot = (): SlotInfo => {
        const start = floorDateToIncrement(new Date());
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
        return {
            start,
            end,
            slots: [start],
            action: 'select'
        };
    };


    const handleSave = (
        orderId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: AppEvent['status']
    ) => {
        addEvent(orderId, orderName, orderCode, start, end, status);
        setModalOpen(false);
    };

  return (
      <div className="">
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container-fluid d-flex justify-content-between">
                  <form className=" justify-content-start">
                      <button className="btn btn-outline-success me-2"
                              type="button"
                              onClick={() => {
                                  setModalOpen(true)
                                  setSlotInfo(createDefaultSlot());
                              }}>
                          Vložit zakázku
                      </button>
                  </form>
                  <form className="d-flex" role="search">
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                      <button className="btn btn-outline-success" type="submit">Search</button>
                  </form>
              </div>
          </nav>
          <main className="flex-1 p-4">
              <Calendar/>
          </main>
          <aside className="w-25 border p-4">

          </aside>
          {modalOpen && slotInfo && (
              <EventModal
                  slotInfo={slotInfo}
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
