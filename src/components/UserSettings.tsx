
import React, { useState } from 'react';
import type { User } from '../types';
import { useUser } from '../contexts/UserContext';
import { crmService } from '../services/crmService';
import { useNotification } from '../contexts/NotificationContext';
import UserFormModal from './UserFormModal';

interface UserSettingsProps {
    currentUser: User;
    onUserChange: (userId: string) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ currentUser, onUserChange }) => {
    const { users, loading, refetchUsers } = useUser();
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await crmService.deleteUser(userId);
            addNotification('User deleted successfully', 'success');
            if (currentUser.id === userId) {
                onUserChange('user-1'); // Switch to admin if self-deleted
            }
            refetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            const message = error instanceof Error ? error.message : 'Could not delete user.';
            addNotification(message, 'error');
        }
    };

    const handleSaveUser = async (userData: Omit<User, 'id'>) => {
        try {
            if (userToEdit) {
                await crmService.updateUser({ ...userToEdit, ...userData });
                addNotification('User updated successfully', 'success');
            } else {
                await crmService.addUser(userData);
                addNotification('User added successfully', 'success');
            }
            refetchUsers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save user:', error);
            const message = error instanceof Error ? error.message : 'Could not save user.';
            addNotification(message, 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-gray">User Management</h1>
                <button
                    onClick={handleAddUser}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New User
                </button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-brand-gray">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.whatsapp?.number ? (
                                            <div className="flex items-center space-x-2">
                                                 <span className={`h-2.5 w-2.5 rounded-full ${user.whatsapp.enabled ? 'bg-green-500' : 'bg-gray-400'}`} title={user.whatsapp.enabled ? 'Active' : 'Inactive'}></span>
                                                <span>{user.whatsapp.number}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Not provided</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-sky-100 text-sky-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleEditUser(user)} className="text-brand-blue hover:text-sky-700">Edit</button>
                                        {user.id !== 'user-1' && (
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                <UserFormModal
                    userToEdit={userToEdit}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default UserSettings;