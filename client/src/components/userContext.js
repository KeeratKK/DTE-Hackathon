import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

// Creating a new context for user data
export const UserContext = createContext({});

export function UserContextProvider({ children }) { 
    const [user, setUser] = useState(null);
    // State to hold the user data

    // Fetch user profile data if it's not already loaded
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({ data }) => {
                setUser(data);
            });
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
