import React, { useState } from 'react';
import { Mail, Phone, Home, CalendarDays } from 'lucide-react';
import './CSS/UserProfile.css';
import { useAuth } from '../context/AuthContext';  
import { db } from '../utils/firebase';  
import { doc, updateDoc } from 'firebase/firestore';  
import * as Yup from 'yup';  // Import Yup for validation
import { useFormik } from 'formik';  // Import Formik for handling form state

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: any;
}

// Yup Validation Schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const { setUser } = useAuth();  

  // Formik hook for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    },
    validationSchema,  // Apply Yup validation schema
    onSubmit: async (values) => {
      try {
        const userRef = doc(db, 'users', user.id);  // Get reference to the user document

        await updateDoc(userRef, {
          email: values.email,
          phone: values.phone,
          address: values.address,
        });

        // Update context or state if necessary
        setUser({ ...user, ...values });
        setShowPopup(false);  // Close the modal after update
      } catch (error) {
        alert('Error updating user data');
      }
    },
  });

  return (
    <div className="user-profile-container">
      {/* Profile */}
      <div className="profile-container">
        <div className="profile-icon-container">
          <Mail className="profile-icon" size={40} />
        </div>
        <h3 className="profile-name">{user.name || 'User'}</h3>
      </div>

      {/* Info */}
      <div className="user-info">
        <div className="info-item">
          <Mail size={20} />
          <span className="info-text">{user.email}</span>
        </div>
        {user.phone && (
          <div className="info-item">
            <Phone size={20} />
            <span className="info-text">{user.phone}</span>
          </div>
        )}
        {user.address && (
          <div className="info-item">
            <Home size={20} />
            <span className="info-text">{user.address}</span>
          </div>
        )}
        {user.createdAt && typeof user.createdAt !== 'string' && (
          <div className="info-item">
            <CalendarDays size={20} />
            <span className="info-text">
              Joined on{' '}
              {new Date(user.createdAt.seconds * 1000).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        <button className="update-info-button" onClick={() => setShowPopup(true)}>
          Update Info
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Update Info</h2>
            <form onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}

              {/* Phone Field */}
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="error">{formik.errors.phone}</div>
              ) : null}

              {/* Address Field */}
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="error">{formik.errors.address}</div>
              ) : null}

              <div className="popup-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
