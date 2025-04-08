import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/css/UserManagement.css';

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Assuming you store the auth token in localStorage
      const response = await axios.get('http://localhost:5000/api/users/getAllUsers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please check your permissions.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromoteToAdmin = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/users/promoteToAdmin/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh user list after successful promotion
      fetchUsers();
      alert(`User ${username} has been promoted to Admin successfully!`);
    } catch (err) {
      setError('Failed to promote user to Admin.');
      console.error('Error promoting user to Admin:', err);
    }
  };

  const handlePromoteToSuperAdmin = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/users/promoteToSuperAdmin/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh user list after successful promotion
      fetchUsers();
      alert(`User ${username} has been promoted to Super Admin successfully!`);
    } catch (err) {
      setError('Failed to promote user to Super Admin.');
      console.error('Error promoting user to Super Admin:', err);
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/deleteUser/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Refresh user list after successful deletion
        fetchUsers();
        alert(`User ${username} has been deleted successfully!`);
      } catch (err) {
        setError('Failed to delete user.');
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) return <div className="loading_users">Loading users...</div>;
  if (error) return <div className="loading_users_error">{error}</div>;

  return (
    <div className="user_container">
      <h2 className="user_heading">User Management</h2>
      
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="user">
          <table className="user_table">
            <thead className="user_table_head">
              <tr>
                <th className="user_table_head_data">Username</th>
                <th className="user_table_head_data">Role</th>
                <th className="user_table_head_data">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="user_table_row">
                  <td className="user_table_row_data">{user.username}</td>
                  <td className="user_table_row_data">{user.role}</td>
                  <td className="user_table_row_data_action">
                    {user.role !== 'admin' && user.role !== 'super_admin' && (
                      <button
                        onClick={() => handlePromoteToAdmin(user.username)}
                        className="promote_to_admin_button"
                      >
                        Promote to Admin
                      </button>
                    )}
                    {user.role !== 'super_admin' && (
                      <button
                        onClick={() => handlePromoteToSuperAdmin(user.username)}
                        className="promote_to_super_admin_button"
                      >
                        Promote to Super Admin
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      className="delete_user_button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserManagement