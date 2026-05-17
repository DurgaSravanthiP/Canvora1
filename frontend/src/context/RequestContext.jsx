import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';
import { useAuth } from './AuthContext';

const RequestContext = createContext();

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserRequests();
        }
    }, [isAuthenticated]);

    const fetchUserRequests = async () => {
        try {
            const { data } = await api.fetchRequests();
            setOutgoingRequests(data.outgoing);
            setIncomingRequests(data.incoming);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const sendRequest = async (artDetails) => {
        // This function might be redundant if components call api directly, 
        // but keeping it for context updates if needed.
        // For now, let components handle the create call and then we refresh list.
        await fetchUserRequests();
    };

    return (
        <RequestContext.Provider value={{ outgoingRequests, incomingRequests, sendRequest, fetchUserRequests }}>
            {children}
        </RequestContext.Provider>
    );
};
