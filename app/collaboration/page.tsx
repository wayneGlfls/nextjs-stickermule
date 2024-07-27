'use server';

import { AblyClient } from "../ui/collaboration/AblyPubSub";
import { fetchCustomers,fetchChatMessage } from "../lib/data";
import { ChatMessageTable } from "../lib/definitions";
import { getUIUser,auth } from "auth";


export default async function Page() {

    const chatdata : ChatMessageTable[] = await fetchChatMessage();
    //const user = getUser(auth());
    const session = await auth();
    const user = await getUIUser(session?.user?.email);
  return (<>
    <AblyClient messagehistory={chatdata} user={user}/>
    </>
  );
}

