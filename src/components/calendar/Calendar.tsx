import {statusColor} from "../../constants.ts";
import CalendarComponent from "./CalendarComponent.tsx";

export default function Calendar() {

    const gridEvents = [
  { code: 'eventOne', start: new Date(2025,7,3), end: new Date(2025,7,3), title: 'Meeting', bgColor: statusColor["in-prep"] },
  { code: 'eventTwo', start: new Date(2023,7,1), end: new Date(2025,7,3), title: 'Single day', bgColor: statusColor["new"] }
];

    return (
        <div>
            <div className="d-flex row">

                <CalendarComponent year={2025} month={7} events={gridEvents} />;
            </div>
        </div>
    );
}
