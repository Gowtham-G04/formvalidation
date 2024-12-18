import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const EmployeeForm = () => {
  const [form, setForm] = useState({ name: '', employeeId: '', email: '', phone: '', department: '', dateOfJoining: '', role: '' });
  const [employees, setEmployees] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    const today = new Date().toISOString().split('T')[0];
    if (!form.name) errs.name = 'Name is required';
    if (!/^[A-Za-z0-9]{1,10}$/.test(form.employeeId)) errs.employeeId = 'Employee ID (Alphanumeric, max 10 characters)';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits';
    if (!form.department) errs.department = 'Department is required';
    if (!form.dateOfJoining || form.dateOfJoining > today) errs.dateOfJoining = 'Date cannot be in the future';
    if (!form.role) errs.role = 'Role is required';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    try {
      const res = await axios.post('http://localhost:5000/api/employees', form);
      setMessage(res.data.message);
      alert('Employee added successfully!');
      setForm({ name: '', employeeId: '', email: '', phone: '', department: '', dateOfJoining: '', role: '' });
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding employee');
    }
  };

  const fetchEmployees = async () => {
    const { data } = await axios.get('http://localhost:5000/api/employees');
    setEmployees(data.employees);
    setShowDetails(!showDetails); 
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/api/employees/${id}`);
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div>
      <h1>Employee Management System</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        {errors.name && <div className="error-message">{errors.name}</div>}

        <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} />
        {errors.employeeId && <div className="error-message">{errors.employeeId}</div>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error-message">{errors.email}</div>}

        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <div className="error-message">{errors.phone}</div>}

        <select name="department" value={form.department} onChange={handleChange}>
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        {errors.department && <div className="error-message">{errors.department}</div>}

        <input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} />
        {errors.dateOfJoining && <div className="error-message">{errors.dateOfJoining}</div>}

        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
        {errors.role && <div className="error-message">{errors.role}</div>}

        <button type="submit">Submit</button>
        <button type="button" onClick={fetchEmployees}>Show Employee Details</button>
      </form>

      {message && <div className="success-message">{message}</div>}

      {showDetails && employees.length > 0 && (
        <div className="employee-list">
          <ul>
            {employees.map(emp => (
              <li key={emp.id}>
                {emp.name} - {emp.employeeId} - {emp.email}
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default EmployeeForm;