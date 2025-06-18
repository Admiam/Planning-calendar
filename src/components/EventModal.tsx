// src/components/EventModal.tsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { SlotInfo } from 'react-big-calendar';
import type { Order } from '../store/useStore';

interface Props {
    slotInfo: SlotInfo;
    orders: Order[];
    onSave: (
        orderId: string,
        start: Date,
        end: Date,
        status: 'new' | 'in-prep' | 'done'
    ) => void;
    onClose: () => void;
}

export default function EventModal({
                                       slotInfo,
                                       orders,
                                       onSave,
                                       onClose,
                                   }: Props) {
    const [orderId, setOrderId] = useState<string>(orders[0]?.id || '');
    const [start, setStart] = useState<Date>(slotInfo.start);
    const [end, setEnd] = useState<Date>(slotInfo.end);
    const [status, setStatus] = useState<'new' | 'in-prep' | 'done'>('new');

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Přidat / upravit termín</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="orderSelect">
                        <Form.Label>Zakázka</Form.Label>
                        <Form.Select
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        >
                            {orders.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>Začátek</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={start.toISOString().substring(0, 16)}
                            onChange={(e) => setStart(new Date(e.target.value))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="endDate">
                        <Form.Label>Konec</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={end.toISOString().substring(0, 16)}
                            onChange={(e) => setEnd(new Date(e.target.value))}
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
                    onClick={() => onSave(orderId, start, end, status)}
                >
                    Uložit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
