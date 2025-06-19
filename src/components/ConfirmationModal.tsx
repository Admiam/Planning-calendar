import { Modal, Button, ListGroup } from 'react-bootstrap';
import type { Event as AppEvent } from '../store/useStore';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ConfirmationModalProps {
    show: boolean;
    toDelete: AppEvent | null;
    onHide: () => void;
    onConfirm: () => void;
    badgeName: (status: AppEvent['status']) => string;
}

export default function ConfirmationModal({
                                              show,
                                              toDelete,
                                              onHide,
                                              onConfirm,
                                              badgeName,
                                          }: ConfirmationModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Potvrďte smazání</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Opravdu chcete smazat tuto položku?
                <ListGroup variant="flush" className="mt-3">
                    <ListGroup.Item>
                        Název: <strong>{toDelete?.title}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Kód: <strong>{toDelete?.code}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Začátek: <strong>{toDelete ? format(toDelete.start, 'Pp', { locale: cs }) : ''}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Konec: <strong>{toDelete ? format(toDelete.end, 'Pp', { locale: cs }) : ''}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Stav: <strong>{toDelete ? badgeName(toDelete.status) : ''}</strong>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Zrušit
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Smazat
                </Button>
            </Modal.Footer>
        </Modal>
    );
}