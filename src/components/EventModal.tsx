// src/components/EventModal.tsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import type { SlotInfo } from 'react-big-calendar';
import type { Event } from '../store/useStore';
import { parse } from 'date-fns';
import {formatHourOnly} from "../utils/date.ts";

interface Props {
    // slotInfo: SlotInfo;
    initialStart: Date;
    initialEnd:   Date;
    events: Event[];
    currentEvent: Event | null;
    onSave: (
        orderId: string,
        oderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: 'new' | 'in-prep' | 'done'
    ) => void;
    onClose: () => void;
    isEditing?: boolean;
}

export default function EventModal({
                                       initialStart,
                                       initialEnd,
                                       events,
                                       currentEvent,
                                       onSave,
                                       onClose,
                                   }: Props) {
    const [parentId, setParentId] = useState<string>(currentEvent ? currentEvent?.parentId : 'none');
    const [orderName, setOrderName] = useState<string>(currentEvent ? currentEvent?.title : '');
    const [orderCode, setOrderCode] = useState<string>(currentEvent ? currentEvent?.code : '');
    const [start, setStart] = useState<Date>(initialStart);
    const [end, setEnd] = useState<Date>(initialEnd);
    const [status, setStatus] = useState<'new' | 'in-prep' | 'done'>(currentEvent ? currentEvent?.status : 'new');



    const handleStartChange = (value: string) => {
        const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
        parsed.setMinutes(0, 0, 0);
        setStart(parsed);
    };

    const handleEndChange = (value: string) => {
        const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
        parsed.setMinutes(0, 0, 0);
        setEnd(parsed);
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Přidat / upravit termín</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="orderSelect">
                        <Form.Label>Název zakázky</Form.Label>
                        <Form.Control
                            type="text"
                            value={orderName}
                            onChange={(e) => setOrderName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="orderSelect">
                        <Form.Label>Zakázka</Form.Label>
                        <Form.Select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                        >
                            <option key='' value='none'>
                                Nic
                            </option>
                            {events.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="orderSelect">
                        <Form.Label>Kód zakázky</Form.Label>
                        <Form.Control
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>Začátek</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            step={3600}
                            value={formatHourOnly(start)}
                            onChange={(e) => handleStartChange(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="endDate">
                        <Form.Label>Konec</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatHourOnly(end)}
                            onChange={(e) => handleEndChange(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="statusSelect">
                        <Form.Label>Stav</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <option value="new">Nová</option>
                            <option value="in-prep">V přípravě</option>
                            <option value="done">Hotová</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Zrušit
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onSave(parentId, orderName, orderCode, start, end, status)}
                >
                    Uložit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
