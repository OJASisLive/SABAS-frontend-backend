import React, { useState, useEffect } from 'react';

const initialDrivers = JSON.parse(localStorage.getItem('drivers')) || [];
const initialBuses = ['BUS-101', 'BUS-102', 'BUS-103']; // Example buses

const initialStudents = [
  { id: 1, name: 'Alice', email: 'alice@example.com', phone: '1112223333', assignedBus: 'BUS-101', assignedDriverId: 1 },
  { id: 2, name: 'Bob', email: 'bob@example.com', phone: '4445556666', assignedBus: '', assignedDriverId: null },
];

const StudentPanel = () => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [drivers, setDrivers] = useState(initialDrivers);

  const [form, setForm] = useState({ id: null, name: '', email: '', phone: '', assignedBus: '', assignedDriverId: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Name, Email and Phone are required.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format.');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone must be 10 digits.');
      return false;
    }
    setError('');
    return true;
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!validateForm()) return;

    const newStudent = {
      ...form,
      id: Date.now(),
      assignedDriverId: form.assignedDriverId ? Number(form.assignedDriverId) : null,
    };
    setStudents([...students, newStudent]);
    setForm({ id: null, name: '', email: '', phone: '', assignedBus: '', assignedDriverId: '' });
  };

  const handleEdit = student => {
    setForm({
      ...student,
      assignedDriverId: student.assignedDriverId ? String(student.assignedDriverId) : '',
    });
    setIsEditing(true);
    setError('');
  };

  const handleUpdate = e => {
    e.preventDefault();
    if (!validateForm()) return;

    setStudents(students.map(s => (s.id === form.id ? { ...form, assignedDriverId: form.assignedDriverId ? Number(form.assignedDriverId) : null } : s)));
    setForm({ id: null, name: '', email: '', phone: '', assignedBus: '', assignedDriverId: '' });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', email: '', phone: '', assignedBus: '', assignedDriverId: '' });
    setIsEditing(false);
    setError('');
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
      if (isEditing && form.id === id) {
        handleCancel();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Student Management</h2>

      {/* Form */}
      <form onSubmit={isEditing ? handleUpdate : handleAdd} className="bg-gray-900 p-6 rounded-lg mb-10">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            name="assignedBus"
            value={form.assignedBus}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Assign Bus</option>
            {initialBuses.map(bus => (
              <option key={bus} value={bus}>
                {bus}
              </option>
            ))}
          </select>
          <select
            name="assignedDriverId"
            value={form.assignedDriverId}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Assign Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name} ({driver.busNumber})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-amber-400 transition-colors"
          >
            {isEditing ? 'Update Student' : 'Add Student'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-700 text-gray-300 px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Students List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="px-6 py-3 text-gray-300">Name</th>
              <th className="px-6 py-3 text-gray-300">Email</th>
              <th className="px-6 py-3 text-gray-300">Phone</th>
              <th className="px-6 py-3 text-gray-300">Bus</th>
              <th className="px-6 py-3 text-gray-300">Driver</th>
              <th className="px-6 py-3 text-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No students found. Please add some.
                </td>
              </tr>
            ) : (
              students.map(student => {
                const driver = drivers.find(d => d.id === student.assignedDriverId);
                return (
                  <tr
                    key={student.id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.phone}</td>
                    <td className="px-6 py-4">{student.assignedBus || '-'}</td>
                    <td className="px-6 py-4">{driver ? driver.name : '-'}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-amber-400 hover:text-amber-300 font-semibold"
                        aria-label={`Edit ${student.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-500 hover:text-red-400 font-semibold"
                        aria-label={`Delete ${student.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPanel;
