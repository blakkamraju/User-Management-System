import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../utils/firebase'; 


const db = getFirestore(app);

// Utility function to save user data to Firestore
export const saveUserDataToFirestore = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      address: userData.address,
      createdAt: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true };
  } catch (e) {
    console.error('Error adding document: ', e);
    return { success: false, message: 'Error saving user data to Firebase.' };
  }
};
