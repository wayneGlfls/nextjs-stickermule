'use server';

import { AblyClient } from "../ui/collaboration/AblyPubSub";
import { fetchChatMessage } from "../lib/data";
import { getUIUser, auth, signOut } from "auth";
import { redirect } from 'next/navigation'

export default async function Page() {
    // Fetch chat messages
    const chatdata = await fetchChatMessage();

    // Authenticate the user and get user details
    const session = await auth();

    // Check if session and session.user are defined
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await getUIUser(session.user.email);

    // Check if user is defined
    if (!user) {
        // Handle the case where user is not found
        return <div>Error: User not found, Please contact your System Admin</div>;
    }

    return (
        <>
            <AblyClient messagehistory={chatdata} user={user} />
        </>
    );
}
