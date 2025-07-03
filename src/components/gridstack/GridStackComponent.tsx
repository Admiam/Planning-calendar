import {type ComponentProps, useState} from 'react';
import type {GridStackOptions} from "gridstack";
import {
    type ComponentDataType,
    type ComponentMap,
    GridStackProvider,
    GridStackRender,
    GridStackRenderProvider,
    useGridStackContext,
} from "../../lib";
import 'gridstack/dist/gridstack.min.css';
import './style.css'

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
    { c: 1, w: 700 },
    { c: 3, w: 850 },
    { c: 6, w: 950 },
    { c: 8, w: 1100 },
];

function Text({ content }: { content: string }) {
    return <div className="w-full h-full">{content}</div>;
}

const COMPONENT_MAP: ComponentMap = {
    Text,
    // ... other components here
};

// ! Content must be json string like this:
// { name: "Text", props: { content: "Item 1" } }
const gridOptions: GridStackOptions = {
    acceptWidgets: true,
    columnOpts: {
        breakpointForWindow: true,
        breakpoints: BREAKPOINTS,
        layout: "moveScale",
        columnMax: 12,
    },
    margin: 8,
    cellHeight: CELL_HEIGHT,
    subGridOpts: {
        acceptWidgets: true,
        columnOpts: {
            breakpoints: BREAKPOINTS,
            layout: "moveScale",
        },
        margin: 8,
        minRow: 2,
        cellHeight: CELL_HEIGHT,
    },
    children: [
        {
            id: "item1",
            h: 2,
            w: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
                name: "Text",
                props: { content: "Item 1" },
            } satisfies ComponentDataType<ComponentProps<typeof Text>>), // if need type check
        },
        {
            id: "item2",
            h: 2,
            w: 2,
            x: 2,
            y: 0,
            content: JSON.stringify({
                name: "Text",
                props: { content: "Item 2" },
            }),
        }
        ]
};



const GridStackComponent= () => {
    const [initialOptions] = useState(gridOptions);

    return (
        <GridStackProvider initialOptions={initialOptions}>
            <Toolbar />

            <GridStackRenderProvider>
                <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>

        </GridStackProvider>
    );
};

export default GridStackComponent;

function Toolbar() {
    const { addWidget, addSubGrid } = useGridStackContext();

    return (
        <div
            style={{
                border: "1px solid gray",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
            }}
        >
            <button
                onClick={() => {
                    addWidget((id) => ({
                        w: 2,
                        h: 2,
                        x: 0,
                        y: 0,
                        content: JSON.stringify({
                            name: "Text",
                            props: { content: id },
                        }),
                    }));
                }}
            >
                Add Text (2x2)
            </button>

            <button
                onClick={() => {
                    addSubGrid((id, withWidget) => ({
                        h: 5,
                        noResize: false,
                        sizeToContent: true,
                        subGridOpts: {
                            acceptWidgets: true,
                            columnOpts: { breakpoints: BREAKPOINTS, layout: "moveScale" },
                            margin: 8,
                            minRow: 2,
                            cellHeight: CELL_HEIGHT,
                            children: [
                                withWidget({
                                    h: 1,
                                    locked: true,
                                    noMove: true,
                                    noResize: true,
                                    w: 12,
                                    x: 0,
                                    y: 0,
                                    content: JSON.stringify({
                                        name: "Text",
                                        props: { content: "Sub Grid 1 Title" + id },
                                    }),
                                }),
                            ],
                        },
                        w: 12,
                        x: 0,
                        y: 0,
                    }));
                }}
            >
                Add Sub Grid (12x1)
            </button>
        </div>
    );
}

