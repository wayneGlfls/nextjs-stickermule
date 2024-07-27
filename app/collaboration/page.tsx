'use server';

import { AblyClient } from "../ui/collaboration/AblyPubSub";
import { fetchCustomers, fetchChatMessage } from "../lib/data";
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
    const user: User = await getUIUser(session.user.email);

    return (
        <>
            <AblyClient messagehistory={chatdata} user={user} />
        </>
    );
}
