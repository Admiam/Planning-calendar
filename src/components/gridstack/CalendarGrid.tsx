import React from 'react';
import {
    type ComponentMap,
    GridStackRender,
    GridStackRenderProvider, useGridStackContext,
} from '../../lib';
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
const COMPONENT_MAP: ComponentMap = { Text };


const CalendarGrid: React.FC<{ daysInMonth: number; year: number; month: number }> = ({
                                                                                          daysInMonth,
                                                                                          year,
                                                                                          month
                                                                                      }) => {
    const { addWidget } = useGridStackContext();

    // click handler
    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const colWidth = rect.width / daysInMonth;
        const dayIndex = Math.floor(clickX / colWidth) + 1;
        const date = new Date(year, month - 1, dayIndex);
        const title = window.prompt(
            `New event on ${date.toLocaleDateString('cs-CZ')}: Enter title`
        );
        if (!title) return;

        addWidget(id => ({
            id,
            x: dayIndex - 1,
            y: 1,
            w: 1,
            h: 1,
            content: JSON.stringify({
                name: 'Text',
                props: { content: title, bgColor: '#0d6efd' }
            })
        }));
    };

    return (
        <div
            className="grid-stack calendar-grid"
            style={{
                '--cols': daysInMonth,
                '--row-height': '60px',
            } as React.CSSProperties}
            onClick={handleGridClick}
        >
            <GridStackRenderProvider>
                <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>
        </div>
    );
};

export default CalendarGrid;

