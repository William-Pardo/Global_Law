import React, { useState, useEffect } from 'react';
import type { User, Role, WhatsappContact } from '../types';

interface UserFormModalProps {
    userToEdit: User | null;
    onClose: () => void;
    onSave: (userData: Omit<User, 'id'>) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ userToEdit, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('Advisor');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [whatsappEnabled, setWhatsappEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setRole(userToEdit.role);
            setEmail(userToEdit.email);
            setWhatsappNumber(userToEdit.whatsapp?.number || '');
            setWhatsappEnabled(userToEdit.whatsapp?.enabled || false);
        } else {
            // Reset for new user
            setName('');
            setRole('Advisor');
            setEmail('');
            setWhatsappNumber('');
            setWhatsappEnabled(false);
        }
    }, [userToEdit]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim() || !email.trim()) return;

        setIsSubmitting(true);
        const userData: Omit<User, 'id'> = {
            name,
            email,
            role,
        };

        if (whatsappNumber.trim()) {
            userData.whatsapp = {
                number: whatsappNumber.trim(),
                enabled: whatsappEnabled
            };
        }

        await onSave(userData);
        setIsSubmitting(false);
    };

    const isMainAdmin = userToEdit?.id === 'user-1';
    
    const canEnableWhatsapp = whatsappNumber.trim() !== '';

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-brand-gray mb-6">
                            {userToEdit ? 'Edit User' : 'Add New User'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-brand-gray text-white placeholder-gray-300"
                                    required
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-brand-gray text-white placeholder-gray-300"
                                    required
                                    placeholder="user@example.com"
                                />
                            </div>
                             <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={e => setRole(e.target.value as Role)}
                                    disabled={isMainAdmin}
                                    className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm disabled:bg-gray-500 disabled:text-gray-400 disabled:cursor-not-allowed bg-brand-gray text-white"
                                >
                                    <option value="Advisor">Advisor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                {isMainAdmin && <p className="text-xs text-gray-500 mt-1">The main admin role cannot be changed.</p>}
                            </div>

                             <div className="pt-2 border-t">
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp Contact (Optional)</label>
                                <p className="text-xs text-gray-500 mb-2">Used for sending client tracking notifications.</p>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="tel"
                                        id="whatsapp"
                                        value={whatsappNumber}
                                        onChange={e => setWhatsappNumber(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-brand-gray text-white placeholder-gray-300"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <div className="flex items-center space-x-2 mt-1">
                                         <label htmlFor="whatsapp-enabled" className="text-sm font-medium text-gray-700">
                                            Enable:
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => canEnableWhatsapp && setWhatsappEnabled(!whatsappEnabled)}
                                            id="whatsapp-enabled"
                                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue ${canEnableWhatsapp ? (whatsappEnabled ? 'bg-brand-blue' : 'bg-gray-200') : 'bg-gray-200 cursor-not-allowed'}`}
                                            aria-pressed={whatsappEnabled}
                                            disabled={!canEnableWhatsapp}
                                        >
                                            <span className="sr-only">Enable WhatsApp notifications</span>
                                            <span aria-hidden="true" className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${whatsappEnabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                        </button>
                                    </div>
                                </div>
                                {!canEnableWhatsapp && <p className="text-xs text-gray-500 mt-1">Enter a number to enable notifications.</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim() || !email.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Saving...' : 'Save User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;