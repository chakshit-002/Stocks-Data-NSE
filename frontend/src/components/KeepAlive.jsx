import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Ya jo bhi library tu use kar raha ho

const KeepAlive = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', ''); // Health check root par hota hai

    const pingServer = async (isInitial = false) => {
        if (isInitial) {
            // Site khulte hi user ko bata do ki thoda wait karein
            toast.loading("Server is starting up... Might take 1-2 mins.", {
                id: 'wakeup-toast',
                duration: 6000
            });
        }

        try {
            const res = await axios.get(`${backendUrl}/`);
            if (res.status === 200) {
                if (isInitial) {
                    toast.success("Server is Ready!", { id: 'wakeup-toast' });
                }
                console.log("Backend is awake!");
            }
        } catch (error) {
            console.error("Wake up call failed:", error.message);
            // Agar error aata hai toh matlab server abhi boot ho raha hai
        }
    };

    useEffect(() => {
        // 1. Pehla call site khulte hi
        pingServer(true);

        // 2. Har 5 minute (300,000 ms) mein call karega
        const interval = setInterval(() => {
            pingServer(false);
        }, 5 * 60 * 1000); 

        return () => clearInterval(interval); // Cleanup when site closes
    }, []);

    return null; // Ye UI mein kuch nahi dikhayega, bas background mein chalega
};

export default KeepAlive;