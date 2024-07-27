'use client'
import React, { useState, useRef, useEffect } from 'react';
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';
import { ChatMessageTable } from '@/app/lib/definitions';
import { createChatMessage } from '@/app/lib/actions';
import { getUser } from '@/app/lib/actions';
import { map } from 'zod';

// Connect to Ably using the AblyProvider component and your API key
const client = new Ably.Realtime({ key: 'B7e_xw.YPknJg:rwaLF8JQmwNzLuYZ4ugsglgl7J87OC3vmgxsk6EbRXc' });



export function AblyClient({messagehistory,user} :{messagehistory:any[],user:any}){

    function AblyPubSub({messagehistory} :{messagehistory:ChatMessageTable[]}) {   
        const [messages, setMessages] = useState<Ably.Message[]>(messagehistory);
        const [txt, setTxt] = useState("");
        const myMap = new Map<string, string>();


        const messagesEndRef = useRef<HTMLDivElement>(null);
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        useEffect(() => {scrollToBottom();}, [messages]);

        myMap.set('Dave Norris', '/customers/lee-robinson.png');
        myMap.set('John Smith', '/customers/delba-de-oliveira.png');
        myMap.set('bruce lee', '/customers/evil-rabbit.png');
    

    
        useConnectionStateListener('connected', () => {
            console.log('Connected to Ably!');
        });
    
        // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
        const { channel, ably } = useChannel('get-started', (message) => {
            console.log('Message '+JSON.stringify(message));
            setMessages((previousMessages) =>{message.image_url = myMap.get(message.name);return [...previousMessages, message] });
        });



        //getUser('bruce lee').then((user) => console.log('user is '+JSON.stringify(user)));
    
    

        function publishMessage(e: any) {
            // Prevent the browser from reloading the page
            e.preventDefault();
    
            // Read the form data
            const form = e.target;
            const formData = new FormData(form);
            const formJson = Object.fromEntries(formData.entries());   
            const messageString = formJson.myInput;
            if (messageString.trim() !== '') {
                const message = {name:user.name,data:messageString};
                const savedmessage = { user:user,data:messageString};

                channel.publish(message); 
                createChatMessage(savedmessage).then(()=>{console.log('message saved');}).catch(err=> console.log('err'+err));

            setTxt('');
            }
        }
    
        function changeTxt(event: any){
            setTxt(event.target.value);                
        } 

        return (
            // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
            <div className="h-screen flex flex-col">
                <div className="bg-gray-200 flex-1 overflow-y-scroll">
                    <div className="px-4 py-2">
                        {
                            messages?.map((ele, i, array) => (
                            <>
                                { (i>= 1 && array[i-1].name != ele.name) || (i == 0) ?
                                    <>
                                        <div className="flex items-center mb-2">
                                            {<img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={ele.image_url}></img>}
                                            {ele.name != user.name ? <div className="font-medium">{ele.name}</div> : <div className="font-medium">You</div>}
                                        </div>
                                    </>
                                    :
                                    <></>
                                }

                                
                                {ele.name !== user.name   ?
                                                        (<div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm">
                                                            {ele.data}
                                                        </div>)
                                                        :
                                                        (
                                                        <div className="bg-blue-500 text-white rounded-lg p-2 shadow mb-2 max-w-sm">
                                                            {ele.data}
                                                        </div>
                                                        )
                                
                                }
    
                            </>)
                            )
                        }
                         <div ref={messagesEndRef} />
                    </div>

                </div>
                <div className="bg-gray-100 px-4 py-2">
                        <form  className="flex items-center" method="post" onSubmit={publishMessage}>
                            <input name="myInput" autoComplete="off" onChange={changeTxt} value={txt} className="w-full border rounded-full py-2 px-4 mr-2" type="text" placeholder="Type your message..."/>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">Send</button>
                        </form>
                </div>
            </div>
        );
    }


    return (
    <AblyProvider client={client}>
        <ChannelProvider channelName="get-started">
            <AblyPubSub messagehistory={messagehistory}/>
        </ChannelProvider>
    </AblyProvider>)
}



