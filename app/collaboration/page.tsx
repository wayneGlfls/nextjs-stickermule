'use server';

import { AblyClient } from "../ui/collaboration/AblyPubSub";
import { fetchChatMessage } from "../lib/data";
import { ChatMessageTable } from "../lib/definitions";
import { getUIUser, auth } from "auth";

// Define the User type
interface User {
    id: string;
    email: string;
    name: string;
    image_url: string;
}

export default async function Page() {
    // Fetch chat messages
    const chatdata: ChatMessageTable[] = await fetchChatMessage();

    // Authenticate the user and get user details
    const session = await auth();

    // Check if session and session.user are defined
    if (!session?.user?.email) {
        // Handle the case where session or session.user.email is not available
        return <div>Error: Unable to authenticate user</div>;
    }

    const user = await getUIUser(session.user.email);

    // Check if user is defined
    if (!user) {
        // Handle the case where user is not found
        return <div>Error: User not found</div>;
    }

    return (
        <>
            <AblyClient messagehistory={chatdata} user={user} />
        </>
    );
}
