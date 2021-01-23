import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AuthAPI from "../../api/auth";

export default function Message() {
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  const getContacts = async () => {
    let token = localStorage.getItem("_at");
    if (token) {
      const result = await AuthAPI.getContacts(token);
      setContacts(result.data);
    }
  }

  const goToDetailPage = (data) => {
    router.push({
      pathname: `/message/${data.id}`,
      query: {
        data: JSON.stringify(data)
      }
    })
  }

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container mx-auto">
      <div onClick={()=> router.push("/")} className="bg-wa text-white px-4 py-4 font-bold">
        WhatsApp
      </div>

      {contacts.map((data, idx) => {
        return (
          <div key={idx+"messageList"} onClick={()=> goToDetailPage(data)} className="flex flex-row ml-3 py-3 border-b border-wa-gray-light items-center">
            {data.photo ? (
              <img className="h-8 w-8 rounded-full mr-3" src={data.photo}  />
            ): (
              <div className="h-8 w-8 rounded-full mr-3 bg-gray-400"/>
            )}
            
            <div className="text-wa-gray font-bold"> {data.name}</div>
          </div>
        )
      })}
    </div>
  )
}
