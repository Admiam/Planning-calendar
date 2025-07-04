import React from 'react';
import type { GridStackOptions, GridStackWidget } from 'gridstack';
import {
    type ComponentDataType,
    GridStackProvider,
} from '../../lib';
import {CZECH_DAYS} from "../../constants.ts";
import type {CalendarComponentProps} from "../../types.ts";
import CalendarGrid from "./CalendarGrid.tsx";
import 'gridstack/dist/gridstack.min.css';
import './style.css';

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

const CalendarComponent: React.FC<CalendarComponentProps> = ({ year, month, events }) => {
    // calculate days
    const daysInMonth = new Date(year, month, 0).getDate();

    // map events to GridStackWidget[]
    const children: GridStackWidget[] = events.map(evt => {
        const startDay = evt.start.getDate();
        const endDay = evt.end.getDate();
        // x-index zero based
        return {
            id: evt.code,
            x: startDay - 1,
            y: 1,            // place below header row
            w: endDay - startDay + 1,
            h: 1,
            content: JSON.stringify({ name: 'Text', props: { content: evt.title, bgColor: evt.bgColor } } satisfies ComponentDataType<React.ComponentProps<typeof Text>>)
        };
    });

    // build initial grid options: one row header + one row events = 2 rows
    const initialOptions: GridStackOptions = {
        column: daysInMonth,
        cellHeight: 60,
        margin: 2,
        disableResize: false,
        disableDrag: true,
        float: false,
        children
    };

    return (
        <GridStackProvider initialOptions={initialOptions}>
            {/* Custom header row rendered outside of GridStack */}
            <div className="calendar-header border-2 border-bottom-2 border-dark p-2"
                 style={{ display: 'grid', gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const weekday = (new Date(year, month - 1, dayNum).getDay() + 6) % 7;
                    return (
                        <div key={dayNum} className="text-center font-semibold">
                            <div>{dayNum}</div>
                            <div style={{ fontSize: '0.75em' }}>{CZECH_DAYS[weekday]}</div>
                        </div>
                    );
                })}
            </div>
            <CalendarGrid daysInMonth={daysInMonth} year={year} month={month} />
        </GridStackProvider>
    );
};

export default CalendarComponent;