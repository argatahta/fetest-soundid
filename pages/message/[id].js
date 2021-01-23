import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import moment from "moment";

const socketUrl = "wss://test.tech.onesound.id/ws";

export default function MessageDetail() {
  const [user, setUser] = useState({});
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [userOnlineTime, setUserOnlinetime] = useState(moment().format());
  const [chatList, setChatList] = useState([]);
  const [chatListLength, setChatListLength] = useState(0);
  const [chat, setChat] = useState("");
  const [meId, setMeId] = useState("");

  const ws = useRef(null);
  const bottomRef = useRef();
  const router = useRouter();

  const onChange = (e) => {
    const { value, name } = e.target;
    if (name == "chat") setChat(value);
  }

  const onSend = () => {
    const body = {
      EventName: "message", // must be 'message'
      EventPayload: {
        userID: user.id, // user id selected for chat
        message: chat
      }
    }
    if (!ws.current) return;
    ws.current.send(JSON.stringify(body))
    const sendedObject = {
      from_id: meId,
      to_id: user.id,
      message: chat,
      time: moment().format()
    }
    let currentChatList = chatList
    currentChatList.push(sendedObject);
    setChatList(currentChatList)
    setChatListLength(currentChatList.length)
    setChat("")
    setTimeout(()=>{
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        });
    },200)
    console.log({currentChatList})
  }

  useEffect(() => {
    const queryData = router.query?.data ?? ""
    if(queryData) {
      const data = JSON.parse(queryData);
      setUser(data);
      let userData = localStorage.getItem("user_data");
      let userId = ""
      if (userData) {
        userData = JSON.parse(userData)
        userId = userData?.id ?? "";
        setMeId(userId)
      }
      ws.current = new WebSocket(`${socketUrl}/${userId}`);
      ws.current.onopen = () => console.log("ws opened");
      ws.current.onclose = () => console.log("ws closed");
      ws.current.onmessage = e => {
        const message = JSON.parse(e.data);
        if (message.eventName == "message response") {
          let currentChatList = chatList
          currentChatList.push(message.eventPayload);
          setChatList(currentChatList)
          setChatListLength(currentChatList.length)
          setTimeout(()=>{
            bottomRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
              });
          },200)
        }
        if (message.eventName == "join") {
          const isUserOnline = message.eventPayload.users.find((el) => el.user_id == data.id)
          if (!isUserOnline) setIsUserOnline(false)
          else {
            setIsUserOnline(true)
            setUserOnlinetime(moment().format())
          }
        }
        if (message.eventName == "disconnect") {
          setIsUserOnline(false)
        }
      };
  
      return () => {
        ws.current.close();
      };
    } else {
      router.back()
    }
    
  }, [])
  return (
    <div className="container mx-auto bg-gray-200 min-h-screen">

      {/* HEADER SECTION */}
      <div className="sticky w-full top-0 bg-wa text-white px-3 py-4 font-bold flex flex-row items-center justify-between ">
        <div className="flex flex-row items-center">
          <svg onClick={() => router.back()} className="h-5 w-5 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          {user.photo ? (
            <img className="h-9 w-9 rounded-full mr-3" src={user.photo} />
          ) : (
              <div className="h-9 w-9 rounded-full mr-3 bg-gray-400 text-black text-xs" />
            )}
          <div className="flex flex-col">
            <div className="font-bold text-white text-sm">{user.name} </div>
            {isUserOnline && (<span className="text-white text-xs font-light">online</span>
            )}
          </div>
        </div>

        <div className="flex flex-row">
          <svg className="h-5 w-5 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>

          <svg className="h-5 w-5 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>

          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>

        </div>
      </div>

      <div className="flex flex-col mt-2 pb-14">

        {chatList.length > 0 && chatList.map((el, idx) => {
          return (
            <div key={idx + "chatlist"} className={`${el.from_id == meId ? "bg-wa-chat ml-16 mr-4" : "bg-white mr-16 ml-4"} p-3 my-1 text-sm shadow rounded-md`}>
              <p className="break-words">{el.message}</p>
              <div className="float-right">
                <span className="float-left text-xs text-gray-400">{moment(el.time).format("HH:mm")}</span>
                {el.from_id == meId && (
                <svg className={`ml-1 float-right h-4 w-4 ${isUserOnline ? "text-blue-400" : moment(userOnlineTime).isSameOrBefore(moment(el.time)) ? "text-gray-400" : "text-blue-400" }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>)}

              </div>
            </div>
          )
        })}
        <div ref={bottomRef}/>

      </div>

      {/* FOOTER/INPUT SECTION */}

      <div className="fixed bottom-0 p-2 flex flex-row  w-full items-center">
        <div className="bg-white flex flex-row items-center border border-gray-200 shadow rounded-3xl p-2  w-full mr-3">

          <svg className="h-5 w-5 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#8D8E94">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input
            type='text'
            id="chat"
            name="chat"
            placeholder="Type a message"
            className="outline-none w-8/12 pr-2"
            value={chat}
            onChange={onChange}
          />
          <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#8D8E94">
            <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
          </svg>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#8D8E94">
            <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>

        {chat ? (
          <button onClick={onSend} className="rounded-full bg-wa-alt p-2 focus:outline-none">

            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>) : (
            <button className="rounded-full bg-wa-alt p-2 focus:outline-none">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}


      </div>

    </div>
  )
}
