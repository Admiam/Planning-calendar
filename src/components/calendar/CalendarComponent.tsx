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
import {cellHeight} from "../../constants.ts";

function Text({ content, bgColor }: { content: string, bgColor: string }) {
    return <div className="w-full h-full z-3 d-flex align-items-center p-1 rounded-2 text-light"
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

const CalendarComponent: React.FC<CalendarComponentProps> = ({ year: initialYear, month: initialMonth, events }) => {
     // lift year/month into local state so we can change them
    const [year,  setYear]  = React.useState(initialYear);
    const [month, setMonth] = React.useState(initialMonth);
    // whenever year/month changes, recalc
    const daysInMonth = new Date(year, month, 0).getDate();
    // compute month start/end in JS Dates
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd   = new Date(year, month - 1, daysInMonth, 23, 59, 59);
// **FILTERED** events: only those that overlap [monthStart..monthEnd]
    const visibleEvents = events.filter(evt =>
        // event.start <= monthEnd AND event.end >= monthStart
        evt.start <= monthEnd && evt.end >= monthStart
    );

    const children: GridStackWidget[] = visibleEvents.map((evt, idx) => {
        const s = Math.max(evt.start.getDate(), 1);
        const e = Math.min(evt.end.getDate(), daysInMonth);
        return {
            id: evt.code,
            x: s - 1,
            y: idx,
            w: e - s + 1,
            h: 1,
            content: JSON.stringify({
                name: 'Text',
                props: { content: evt.title, bgColor: evt.bgColor }
            } satisfies ComponentDataType<React.ComponentProps<typeof Text>>)
        };
    });

    const initialOptions: GridStackOptions = {
        column: daysInMonth,
        cellHeight,
        margin: 2,
        disableResize: false,
        disableDrag: true,
        float: true,
        minRow: events.length,
        children
    };

    return (
        <GridStackProvider initialOptions={initialOptions}>
            <div className="d-flex align-items-stretch">

                {/* ← Labels column */}
                <div className="d-flex flex-column labels-col">
                    <div className="fw-bold ps-3 pt-1" style={{ height: cellHeight }}>
                        Kód
                    </div>
                    {visibleEvents.map((evt) => (
                        <div
                            key={evt.code}
                            className="px-3 border-bottom border-light-subtle text-nowrap overflow-hidden "
                            style={{
                                height: cellHeight,
                                lineHeight: `${cellHeight}px`,
                            }}
                        >
                            {evt.code} | {evt.title}
                        </div>
                    ))}
                </div>

                {/* ← Calendar column */}
                <div className="flex-grow-1">
                    <div className="grid-scroll"
                         style={{
                             overflowX: 'auto',
                             minWidth: `${daysInMonth * 120}`,     // force scroll width
                    }}>
                        <div className="d-flex justify-content-center align-items-center" style={{
                                height: cellHeight/2 + 'px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                boxSizing: 'border-box',
                                boxShadow: 'inset 0 1px 0 #ccc, inset 1px 0 0 #ccc, inset -1px 0 0 #ccc'
                            }} >
                                <button
                                    className="btn btn-sm  me-2"
                                    onClick={() => {
                                        const prev = new Date(year, month - 2, 1);
                                        setYear(prev.getFullYear());
                                        setMonth(prev.getMonth() + 1);
                                    }}
                                >◀</button>
                                {/* current month name */}
                                {new Intl.DateTimeFormat('cs-CZ', { month: 'long' }).format(new Date(year, month - 1))} {year}
                                <button
                                    className="btn btn-sm ms-2"
                                    onClick={() => {
                                        const next = new Date(year, month, 1);
                                        setYear(next.getFullYear());
                                        setMonth(next.getMonth() + 1);
                                    }}
                                >▶</button>
                            </div>
                            <div
                                className="calendar-header"
                                style={{
                                    /* — dynamic variables — */
                                    '--cols': daysInMonth,   // how many days this month
                                    '--cell-w': '120px',     // width you want per day column

                                    /* — layout — */
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(var(--cols), 1fr)',   // 1 fr per column
                                    minWidth: 'calc(var(--cols) * var(--cell-w))',     // force scroll width

                                    /* — sticky header look — */
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                    background: '#fff',
                                    borderBottom: '1px solid #ccc',
                                    boxSizing: 'border-box',
                                    boxShadow: 'inset 0 0 0 1px #ccc',
                                } as React.CSSProperties}
                            >
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const weekday = (new Date(year, month - 1, dayNum).getDay() + 6) % 7;
                                    return (
                                        <div key={i} className="text-center p-2" >
                                            <div>{dayNum}</div>
                                            <div style={{ fontSize: '0.75em' }}>{CZECH_DAYS[weekday]}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* the grid itself */}
                            <CalendarGrid daysInMonth={daysInMonth} year={year} month={month} />
                    </div>
                </div>
            </div>
        </GridStackProvider>
    );
};

export default CalendarComponent;