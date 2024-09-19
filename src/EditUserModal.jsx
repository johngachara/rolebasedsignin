import { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
} from '@chakra-ui/react';

function EditUserModal({ isOpen, onClose, user, onUpdate }) {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        isAdmin: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                isAdmin: user.isAdmin || false,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = () => {
        onUpdate(user.id, formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Display Name</FormLabel>
                        <Input
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <Checkbox
                            name="isAdmin"
                            isChecked={formData.isAdmin}
                            onChange={handleChange}
                        >
                            Is Admin
                        </Checkbox>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditUserModal;