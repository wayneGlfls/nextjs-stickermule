'use client';
import React, { useState, useRef, useEffect } from 'react';
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';
import { createChatMessage } from '@/app/lib/actions';

// Define the User type
interface User {
    id: string;
    email: string;
    name: string;
    image_url: string;
}
// Define the AblyMessage type
interface AblyMessage {
    name: string;
    data: string;
    image_url?: string;
}

interface AblyPubSubProps {
    messagehistory: AblyMessage[];
    user: User;
}

//const client = new Ably.Realtime({ key: 'B7e_xw.YPknJg:rwaLF8JQmwNzLuYZ4ugsglgl7J87OC3vmgxsk6EbRXc' });
const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

function AblyPubSub({ messagehistory, user }: AblyPubSubProps) {
    const [messages, setMessages] = useState<AblyMessage[]>(messagehistory);
    const [txt, setTxt] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const myMap = new Map<string, string>([
        ['Dave Norris', '/customers/lee-robinson.png'],
        ['John Smith', '/customers/delba-de-oliveira.png'],
        ['bruce lee', '/customers/evil-rabbit.png']
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    useConnectionStateListener('connected', () => {
        console.log('Connected to Ably!');
    });

    // Adjusted the callback type to match Ably.Message
    const { channel } = useChannel('get-started', (message: Ably.Message) => {
        // Type guard for Ably.Message
        if (message.data && typeof message.data === 'string') {
            const ablyMessage: AblyMessage = {
                name: message.name || '',
                data: message.data,
                image_url: myMap.get(message.name || '')
            };
            setMessages(prevMessages => [...prevMessages, ablyMessage]);
        }
    });

    const publishMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const messageString = formData.get('myInput') as string;

        if (messageString.trim()) {
            const message: AblyMessage = { name: user.name, data: messageString };
            const savedMessage = { user, data: messageString };

            channel.publish(message);
            createChatMessage(savedMessage)
                .then(() => console.log('Message saved'))
                .catch(err => console.log('Error: ' + err));

            setTxt('');
        }
    };

    const changeTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTxt(event.target.value);
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-gray-200 flex-1 overflow-y-scroll">
                <div className="px-4 py-2">
                    {messages.map((ele, i, array) => (
                        <React.Fragment key={i}>
                            {(i >= 1 && array[i - 1].name !== ele.name) || (i === 0) ? (
                                <div className="flex items-center mb-2">
                                    {ele.image_url && <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={ele.image_url} alt={ele.name} />}
                                    <div className="font-medium">{ele.name !== user.name ? ele.name : 'You'}</div>
                                </div>
                            ) : null}
                            <div className={`bg-${ele.name !== user.name ? 'white' : 'blue-500'} text-${ele.name !== user.name ? 'black' : 'white'} rounded-lg p-2 shadow mb-2 max-w-sm`}>
                                {ele.data}
                            </div>
                        </React.Fragment>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="bg-gray-100 px-4 py-2">
                <form className="flex items-center" method="post" onSubmit={publishMessage}>
                    <input name="myInput" autoComplete="off" onChange={changeTxt} value={txt} className="w-full border rounded-full py-2 px-4 mr-2" type="text" placeholder="Type your message..." />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">Send</button>
                </form>
            </div>
        </div>
    );
}

export function AblyClient({ messagehistory, user }: AblyPubSubProps) {
    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName="get-started">
                <AblyPubSub messagehistory={messagehistory} user={user} />
            </ChannelProvider>
        </AblyProvider>
    );
}
