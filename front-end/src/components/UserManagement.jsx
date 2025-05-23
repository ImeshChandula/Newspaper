import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/UserManagement.css';

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    action: null,
    type: 'info' // 'info', 'success', 'danger', 'confirm'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_USERS}/getAllUsers`, {
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

  const showConfirmModal = (title, message, actionCallback) => {
    setModalContent({
      title,
      message,
      action: actionCallback,
      type: 'confirm'
    });
    setShowModal(true);
  };

  const showSuccessModal = (title, message) => {
    setModalContent({
      title,
      message,
      action: null,
      type: 'success'
    });
    setShowModal(true);
  };

  const showErrorModal = (title, message) => {
    setModalContent({
      title,
      message,
      action: null,
      type: 'danger'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAction = () => {
    if (modalContent.action) {
      modalContent.action();
    }
    setShowModal(false);
  };

  const handlePromoteToAdmin = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_USERS}/promoteToAdmin/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
      showSuccessModal('Success', `User ${username} has been promoted to Admin successfully!`);
    } catch (err) {
      showErrorModal('Error', 'Failed to promote user to Admin.');
      console.error('Error promoting user to Admin:', err);
    }
  };

  const handlePromoteToSuperAdmin = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_USERS}/promoteToSuperAdmin/${username}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
      showSuccessModal('Success', `User ${username} has been promoted to Super Admin successfully!`);
    } catch (err) {
      showErrorModal('Error', 'Failed to promote user to Super Admin.');
      console.error('Error promoting user to Super Admin:', err);
    }
  };

  const handleDeleteUser = async (username) => {
    showConfirmModal(
      'Confirm Delete',
      `Are you sure you want to delete user ${username}?`,
      async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${process.env.REACT_APP_API_BASE_URL_USERS}/deleteUser/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          fetchUsers();
          showSuccessModal('Success', `User ${username} has been deleted successfully!`);
        } catch (err) {
          showErrorModal('Error', 'Failed to delete user.');
          console.error('Error deleting user:', err);
        }
      }
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-border text-black" role="status">
        <span className="visually-hidden text-black">Loading users...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="error-message alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-black">User Management</h2>

      {users.length === 0 ? (
        <div className="alert alert-info text-black" role="alert">
          No users found.
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm overflow-auto">
          <table className="table table-striped table-hover border border-black table-sm align-middle">
            <thead className="table-white">
              <tr>
                <th className='border border-black text-black'>Username</th>
                <th className='border border-black text-black'>Role</th>
                <th className='border border-black text-black'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className='bg-white text-black border border-black'>{user.username}</td>
                  <td className='bg-white border border-black'>
                    <span className={`role-badge ${user.role === 'super_admin' ? 'bg-danger' :
                      user.role === 'admin' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='bg-white border border-black'>
                    <div className="action-buttons">
                      {user.role !== 'admin' && user.role !== 'super_admin' && (
                        <button
                          onClick={() => handlePromoteToAdmin(user.username)}
                          className="btn btn-sm btn-outline-primary mx-2"
                          title="Promote to Admin"
                        >
                          Promote to Admin
                        </button>
                      )}
                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => handlePromoteToSuperAdmin(user.username)}
                          className="btn btn-sm btn-outline-warning mx-2"
                          title="Promote to Super Admin"
                        >
                          Promote to Super Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="btn btn-sm btn-outline-danger mx-2"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${modalContent.type === 'success' ? 'bg-success text-white' :
                modalContent.type === 'danger' ? 'bg-danger text-white' :
                  modalContent.type === 'confirm' ? 'bg-warning' : 'bg-primary text-white'
                }`}>
                <h5 className="modal-title">{modalContent.title}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>{modalContent.message}</p>
              </div>
              <div className="modal-footer">
                {modalContent.type === 'confirm' ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={handleConfirmAction}>Confirm</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement