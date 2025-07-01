// import { useState } from 'react';
// import { useSchedulerStore, type Event as AppEvent } from '../store/useStore';
// import EventModal from './EventModal';
// import {FaTrash} from "react-icons/fa";
// import ConfirmationModal from "./ConfirmationModal.tsx";
// import { addHours, subHours } from 'date-fns'
// import 'react-calendar-timeline/dist/styles.css';
import { Scheduler, type SchedulerData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import "@bitnoi.se/react-scheduler/dist/style.css";
import {useCallback, useState, type SetStateAction} from "react";

export default function CalendarComponent() {
    const [filterButtonState, setFilterButtonState] = useState(0);

    dayjs.extend(isBetween)

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const handleRangeChange = useCallback((range: SetStateAction<{ startDate: Date; endDate: Date; }>) => {
        setRange(range);
    }, []);

    const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
        ...person,
        data: person.data.filter(
            (project) =>
                // we use "dayjs" for date calculations, but feel free to use library of your choice
                dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
                dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
                (dayjs(project.startDate).isBefore(range.startDate, "day") &&
                    dayjs(project.endDate).isAfter(range.endDate, "day"))
        )
    }))
    // const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null);
    // const [modalOpen, setModalOpen] = useState(false);
    // const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    // const [currentDate, setCurrentDate] = useState<Date>(new Date());
    // const [currentEvent, setCurrentEvent] = useState<AppEvent | null>(null);
    // const [showConfirm, setShowConfirm] = useState(false);
    // const [toDelete, setToDelete] = useState<AppEvent | null>(null);
    //
    // const events = useSchedulerStore((s) => s.events);
    // const addEvent = useSchedulerStore((s) => s.addEvent);
    // const updateEvent = useSchedulerStore((s) => s.updateEvent);
    // const deleteEvent = useSchedulerStore((s) => s.deleteEvent);
    // const confirmDelete = () => {
    //     if (toDelete) deleteEvent(toDelete.id);
    //     setShowConfirm(false);
    //     setToDelete(null);
    //     setModalOpen(false);
    //     setCurrentEvent(null)
    // };

    // const mapped: RBCEvent[] = events.map((e) => ({
    //     id: e.id,
    //     title: e.title,
    //     start: e.start,
    //     end: e.end,
    //     resource: e,
    // }));

    // const eventStyleGetter = (
    //     event: RBCEvent,
    // ) => {
    //     const status = (event.resource as AppEvent).status;
    //     let backgroundColor: string;
    //     switch (status) {
    //         case 'new':     backgroundColor = '#f0ad4e'; break; // yellow
    //         case 'in-prep': backgroundColor = '#0275d8'; break; // blue
    //         case 'done':    backgroundColor = '#5cb85c'; break; // green
    //         default:        backgroundColor = '#777';      break;
    //     }
    //     return {
    //         style: {
    //             backgroundColor,
    //             borderColor: backgroundColor,
    //             color: 'white'
    //         }
    //     };
    // };

    // const onSelectSlot = (slot: SlotInfo) => {
    //     setSlotInfo(slot);
    //     setModalOpen(true);
    // };

    // const handleSave = (
    //     parentId: string,
    //     orderName: string,
    //     orderCode: string,
    //     start: Date,
    //     end: Date,
    //     status: AppEvent['status']
    // ) => {
    //     if (currentEvent) {
    //         updateEvent(currentEvent.id, parentId, orderName, orderCode, start, end, status);
    //     } else {
    //         addEvent(parentId, orderName, orderCode, start, end, status);
    //     }
    //     setModalOpen(false);
    //     setCurrentEvent(null)
    // };

    // const onSelectEvent = (ev: RBCEvent) => {
    //     const appEv = ev.resource as AppEvent;
    //     setCurrentEvent(appEv);
    //     if (ev.start && ev.end) {
    //         const slot: SlotInfo = {
    //             start: ev.start,
    //             end: ev.end,
    //             slots: [ev.start],
    //             action: 'select',
    //         };
    //         setSlotInfo(slot);
    //     }
    //     setModalOpen(true);
    // };

    // const CustomEvent = ({ event }: { event: RBCEvent }) => {
    //     const appEv = event.resource as AppEvent;
    //     return (
    //         <div style={{ position: 'relative' }}>
    //             <span>{event.title}</span>
    //             <span
    //                 className="rbc-delete-icon"
    //                 onClick={() => {
    //                     setToDelete(appEv)
    //                     setShowConfirm(true)
    //                 }}
    //             >
    //     <FaTrash className="text-danger"/>
    //   </span>
    //         </div>
    //     );
    // };

    // const badgeName = (status: AppEvent['status']) => {
    //     switch (status) {
    //         case 'new':     return 'NOVÁ';
    //         case 'in-prep': return 'V PŘÍPRAVĚ';
    //         case 'done':    return 'HOTOVÁ';
    //     }
    // };

    let isLoading = false; // This can be set based on your data fetching logic
    return (
        <div>

            <Scheduler
                data={filteredMockedSchedulerData}
                isLoading={isLoading}
                onRangeChange={handleRangeChange}
                onTileClick={(clickedResource) => console.log(clickedResource)}
                onItemClick={(item) => console.log(item)}
                onFilterData={() => {
                    // Some filtering logic...
                    setFilterButtonState(1);
                }}
                onClearFilterData={() => {
                    // Some clearing filters logic...
                    setFilterButtonState(0)
                }}
                config={{
                    zoom: 0,
                    filterButtonState,
                }}
            />

            {/*slotInfo &&*/}
            {/*{modalOpen && (*/}
            {/*    showConfirm && toDelete ? (*/}
            {/*        <ConfirmationModal*/}
            {/*            show={showConfirm}*/}
            {/*            toDelete={toDelete}*/}
            {/*            onHide={() => {*/}
            {/*                setShowConfirm(false)*/}
            {/*                setModalOpen(false);*/}
            {/*                setCurrentEvent(null)*/}
            {/*            }}*/}
            {/*            onConfirm={confirmDelete}*/}
            {/*            badgeName={badgeName}*/}
            {/*        />*/}
            {/*    ) : (*/}
            {/*        <EventModal*/}
            {/*            slotInfo={slotInfo}*/}
            {/*            events={events}*/}
            {/*            currentEvent={currentEvent}*/}
            {/*            onSave={handleSave}*/}
            {/*            onClose={() => setModalOpen(false)}*/}
            {/*        />*/}
            {/*    )*/}
            {/*)}*/}



        </div>
    );
}

const mockedSchedulerData: SchedulerData = [
    {
        id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
        label: {
            icon: "https://picsum.photos/24",
            title: "Joe Doe",
            subtitle: "Frontend Developer"
        },
        data: [
            {
                id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
                startDate: new Date("2023-04-13T15:31:24.272Z"),
                endDate: new Date("2023-08-28T10:28:22.649Z"),
                occupancy: 3600,
                title: "Project A",
                subtitle: "Subtitle A",
                description: "array indexing Salad West Account",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "22fbe237-6344-4c8e-affb-64a1750f33bd",
                startDate: new Date("2023-10-07T08:16:31.123Z"),
                endDate: new Date("2023-11-15T21:55:23.582Z"),
                occupancy: 2852,
                title: "Project B",
                subtitle: "Subtitle B",
                description: "Tuna Home pascal IP drive",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
                startDate: new Date("2023-03-30T22:25:14.377Z"),
                endDate: new Date("2023-09-01T07:20:50.526Z"),
                occupancy: 1800,
                title: "Project C",
                subtitle: "Subtitle C",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "b088e4ac-9911-426f-aef3-843d75e714c2",
                startDate: new Date("2023-10-28T10:08:22.986Z"),
                endDate: new Date("2023-10-30T12:30:30.150Z"),
                occupancy: 11111,
                title: "Project D",
                subtitle: "Subtitle D",
                description: "Garden heavy an software Metal",
                bgColor: "rgb(254,165,177)"
            }
        ]
    }
];
