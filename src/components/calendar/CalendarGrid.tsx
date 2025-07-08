import React, {useState} from 'react';
import {
    type ComponentMap,
    GridStackRender,
    GridStackRenderProvider, useGridStackContext,
} from '../../lib';
import 'gridstack/dist/gridstack.min.css';
import EventModal from "../EventModal.tsx";
import type {Event} from "../../types.ts";
import {useSchedulerStore} from "../../store/useStore.ts";
import {statusColor} from "../../constants.ts";
// import './style.css';


function Text({ content, bgColor }: { content: string, bgColor: string }) {
    return <div className="w-full h-full d-flex align-items-center p-1 rounded-2 text-light"
                style={{background: bgColor,}}
                title={content}
            >
                <div className="m-1" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {content}
                </div>
            </div>;
}
const COMPONENT_MAP: ComponentMap = { Text };


const CalendarGrid: React.FC<{ daysInMonth: number; year: number; month: number }> = ({
                                                                                          daysInMonth,
                                                                                          year,
                                                                                          month
                                                                                      }) => {
    const [slotRange, setSlotRange] = useState<{ start: Date; end: Date } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { addWidget } = useGridStackContext();
    const events = useSchedulerStore((s) => s.events);
    const addEvent = useSchedulerStore((s) => s.addEvent);


    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalOpen) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const colWidth = rect.width / daysInMonth;
        const dayIndex = Math.floor(clickX / colWidth) + 1;
        const startDate = new Date(year, month - 1, dayIndex);
        const endDate   = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        setSlotRange({ start: startDate, end: endDate });
        setModalOpen(true)

        // const title = window.prompt(
        //     `New event on ${date.toLocaleDateString('cs-CZ')}: Enter title`
        // );
        // if (!title) return;

    };

    const handleSave = (
        parentId: string,
        title: string,
        code: string,
        start: Date,
        end: Date,
        status: Event['status']
    ) => {
        addEvent(parentId, title, code, start, end, status);
        setModalOpen(false);
        addWidget(id => ({
            id,
            x: start.getDate() - 1,
            y: 1,
            w: 1,
            h: 1,
            content: JSON.stringify({
                name: 'Text',
                props: { content: title, bgColor: statusColor[status] }
            })
        }));
    };

    return (
        <div className="calendar-wrapper"
             style={{
                 position: 'relative',
             }}>
            <div
                className="grid-lines position-absolute z-2 top-0 start-0 end-0 bottom-0 "
                style={{
                    pointerEvents: 'none',
                    boxSizing: 'border-box',
                    boxShadow: 'inset -1px 0 0 #ccc, inset 0 -1px 0 #ccc'
                }}
            >
                {/* vertical lines */}
                {Array.from({ length: daysInMonth }).map((_, i) => (
                    <div
                        key={`v-${i}`}
                        style={{
                            position: 'absolute',
                            top:      0,
                            bottom:   '0',
                            left:     `${(i / daysInMonth) * 100}%`,
                            width:    '1px',
                            background: '#ccc',
                        }}
                    />
                ))}

                {/* single horizontal line*/}
                <div
                    style={{
                        position: 'absolute',
                        left:     0,
                        right:    0,
                        top:      '60px',
                        height:   '1px',
                        background: '#ccc',
                    }}
                />
            </div>
            <div
                onClick={handleGridClick}
            >
                <GridStackRenderProvider>
                    <GridStackRender componentMap={COMPONENT_MAP} />
                </GridStackRenderProvider>
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
        </div>
    );
};



export default CalendarGrid;

