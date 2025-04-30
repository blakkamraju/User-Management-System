import { useQuery } from '@tanstack/react-query';
import { db } from '../utils/firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define a User type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: any;
}

// Function to search users in Firestore
const searchUsers = async (searchTerm: string): Promise<User[]> => {
  // Reference to the users collection
  const usersRef = collection(db, 'users');

  // Query to search by name or email
  const q = query(
    usersRef,
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff')
  );

  const querySnapshot = await getDocs(q);

  // Map the query snapshot to an array of users
  const users: User[] = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    
    // Destructure userData and provide default values for missing properties
    const { name = '', email = '', phone = '', address = '', createdAt } = userData;

    users.push({
      id: doc.id,
      name,
      email,
      phone,
      address,
      createdAt,
    });
  });

  return users;
};

// Custom hook to search users
export const useSearchUsers = (searchTerm: string) => {
  return useQuery<User[], Error>({
    queryKey: ['search-users', searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: !!searchTerm.trim(), 
    staleTime: 60 * 1000, 
  });
};
