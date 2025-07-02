import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import './ManageUsers.css';

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [updatedName, setUpdatedName] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { token }
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
        headers: { token }
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setUpdatedName(user.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${backendUrl}/api/admin/users/${editUser._id}`, {
        name: updatedName
      }, {
        headers: { token }
      });
      toast.success("User updated");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div className="user-management">
      <h3>Manage Users</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td data-label="Name">
                {editUser?._id === user._id ? (
                  <input
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Is Admin">{user.isAdmin ? 'Yes' : 'No'}</td>
              <td data-label="Actions">
                {editUser?._id === user._id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
