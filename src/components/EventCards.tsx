import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { useSchedulerStore, type Event as AppEvent } from '../store/useStore';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import {Button, ButtonGroup} from "react-bootstrap";import {useState} from "react";
import {FaPlus, FaMinus, FaEdit, FaTrash} from "react-icons/fa";
import type {SlotInfo} from "react-big-calendar";
import EventModal from "./EventModal.tsx";
import ConfirmationModal from "./ConfirmationModal.tsx";

interface TreeEvent extends AppEvent {
    children: TreeEvent[];
}

export default function EventCards() {
    const [currentEvent, setCurrentEvent] = useState<AppEvent | null>(null);
    const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [modalOpen, setModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete] = useState<AppEvent | null>(null);

    const events = useSchedulerStore(s => s.events);
    const updateEvent = useSchedulerStore((s) => s.updateEvent);
    const deleteEvent = useSchedulerStore((s) => s.deleteEvent);
    const confirmDelete = () => {
        if (toDelete) deleteEvent(toDelete.id);
        setShowConfirm(false);
        setToDelete(null);
    };

    const toggle = (id: string) => {
        const next = new Set(expanded);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpanded(next);
    };

    const nodeMap: Record<string, TreeEvent> = {};
    events.forEach(ev => {
        nodeMap[ev.id] = { ...ev, children: [] };
    });

    const roots: TreeEvent[] = [];
    events.forEach(ev => {
        const node = nodeMap[ev.id];
        if (ev.parentId && nodeMap[ev.parentId]) {
            nodeMap[ev.parentId].children.push(node);
        } else {
            roots.push(node);
        }
    });

    const handleUpdate = (
        parentId: string,
        orderName: string,
        orderCode: string,
        start: Date,
        end: Date,
        status: AppEvent['status']
    ) => {
        if (!currentEvent) return;
        updateEvent(currentEvent.id, parentId, orderName, orderCode, start, end, status);
        setModalOpen(false);
        setCurrentEvent(null)
    };

    const badgeVariant = (status: AppEvent['status']) => {
        switch (status) {
            case 'new':     return 'warning';
            case 'in-prep': return 'primary';
            case 'done':    return 'success';
        }
    };

    const badgeName = (status: AppEvent['status']) => {
        switch (status) {
            case 'new':     return 'NOVÁ';
            case 'in-prep': return 'V PŘÍPRAVĚ';
            case 'done':    return 'HOTOVÁ';
        }
    };

    const headerBgVariant = (status: AppEvent['status']) => {
        switch (status) {
            case 'new': return 'bg-warning-subtle';
            case 'in-prep': return 'bg-info-subtle';
            case 'done': return 'bg-success-subtle';
        }
    };

    const handleEdit = (node: TreeEvent) => {
        const appEv = node as AppEvent;
        setCurrentEvent(appEv);
        if (node.start && node.end) {
            const slot: SlotInfo = {
                start: node.start,
                end: node.end,
                slots: [node.start],
                action: 'select',
            };
            setSlotInfo(slot);
        }
        setModalOpen(true);
    };



    const renderNode = (node: TreeEvent, depth = 0) => (
        <div key={node.id} style={{ marginLeft: depth * 20, marginBottom: 8 }}>
            <Card border={badgeVariant(node.status)}>
                <Card.Header className={`d-flex justify-content-between align-items-center ${headerBgVariant(node.status)}`}>
                    <div className="d-flex align-items-center">
                        {node.children.length > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="me-2 p-0 text-black"
                                onClick={() => toggle(node.id)}
                            >
                                {expanded.has(node.id) ?
                                    <FaMinus /> :
                                    <FaPlus />}
                            </Button>
                        )}
                        <strong className="me-2">{node.code}</strong>
                        <span>{node.title}</span>
                    </div>
                    <Badge bg={badgeVariant(node.status)}>{badgeName(node.status)}</Badge>
                </Card.Header>
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <small>
                        {format(node.start, 'Pp', { locale: cs })} –{' '}
                        {format(node.end,   'Pp', { locale: cs })}
                    </small>

                    <ButtonGroup size="sm">
                        <Button variant="none" onClick={() => handleEdit(node)}><FaEdit className="text-primary" /></Button>
                        <Button variant="none" onClick={() => {
                            setToDelete(node)
                            setShowConfirm(true)
                        }}>
                            <FaTrash className="text-danger"/></Button>
                    </ButtonGroup>

                </Card.Body>
            </Card>
            {node.children.length > 0 && expanded.has(node.id) && (
                node.children.map(child => renderNode(child, depth + 1))
            )}
        </div>
    );

    return (
        <div className="overflow-auto" style={{ maxHeight: '100%' }}>
            {roots.length
                ? roots.map(root => renderNode(root))
                : <p className="text-muted">Žádné úkoly</p>}
            {modalOpen && slotInfo && (
                <EventModal
                    slotInfo={slotInfo}
                    events={events}
                    currentEvent={currentEvent}
                    onSave={handleUpdate}
                    onClose={() => setModalOpen(false)}
                />
            )}
            <ConfirmationModal
                show={showConfirm}
                toDelete={toDelete}
                onHide={() => {
                    setShowConfirm(false)
                }}
                onConfirm={confirmDelete}
                badgeName={badgeName}
            />
        </div>
    );
}
