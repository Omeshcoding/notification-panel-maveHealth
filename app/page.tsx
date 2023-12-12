'use client';
import React, { useEffect, useState } from 'react';
import NotificationCard from '@/components/NotificationCard';

// const notification = [
//   {
//     id: 'clpomy9970005a8or7calnm1h1',
//     user: {
//       id: 1,
//       first_name: 'Mark',
//       last_name: 'Webber',
//       profile_picture: 'https://api.multiavatar.com/1.svg',
//     },
//     event: ' reacted to your recent post',
//     action: {
//       title: 'My first tournament today!',
//       url: '#',
//     },
//     message: null,
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h2',
//     user: {
//       id: 2,
//       first_name: 'Angela',
//       last_name: 'Gray',
//       profile_picture: 'https://api.multiavatar.com/2.svg',
//     },
//     event: 'followed you',
//     action: {
//       title: null,
//       url: '#',
//     },
//     message: null,
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h3',
//     user: {
//       id: 3,
//       first_name: 'Jacob',
//       last_name: 'Thompson',
//       profile_picture: 'https://api.multiavatar.com/3.svg',
//     },
//     event: 'has joined your group',
//     action: {
//       title: 'Chess Club',
//       url: '#',
//     },
//     message: null,
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h4',
//     user: {
//       id: 4,
//       first_name: 'Rizky',
//       last_name: 'Hasanuddin',
//       profile_picture: 'https://api.multiavatar.com/4.svg',
//     },
//     event: 'sent you a private message',
//     action: {
//       title: null,
//       url: '#',
//     },
//     message:
//       "Hello, thanks for setting up the Chess Club. I've been a member fora few weeks now and I'm already having lots of fun and improving my game.",
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h5',
//     user: {
//       id: 5,
//       first_name: 'Kimberly',
//       last_name: 'Smith',
//       profile_picture: 'https://api.multiavatar.com/5.svg',
//     },
//     event: 'commented on your picture',
//     action: {
//       title: null,
//       url: '#',
//     },
//     message: null,
//     media: 'https://api.multiavatar.com/8.svg',
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h6',
//     user: {
//       id: 6,
//       first_name: 'Nathan',
//       last_name: 'Peterson',
//       profile_picture: 'https://api.multiavatar.com/6.svg',
//     },
//     event: 'reacted to your recent post',
//     action: {
//       title: '5 end-game strategies to increase your win rate',
//       url: '#',
//     },
//     message: null,
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
//   {
//     id: 'clpomy9970005a8or7calnm1h7',
//     user: {
//       id: 7,
//       first_name: 'Anna',
//       last_name: 'Kim',
//       profile_picture: 'https://api.multiavatar.com/5.svg',
//     },
//     event: 'left the group',
//     action: {
//       title: 'Chess Club',
//       url: '#',
//     },
//     message: null,
//     media: null,
//     created_at: '2023-11-28T04:09:02.491400',
//   },
// ];

type User = {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
};
type Action = {
  title: string | null;
  url: string;
};
interface NotificationType {
  id: string;
  user: User;
  event: string;
  action: Action | null;
  message: string | null;
  media: string | null;
  created_at: string;
}
export default function Home() {
  let [notification, setNotification] = useState<NotificationType[]>([]);
  const [count, setCount] = useState(0);
  const [activeMsg, setActiveMsg] = useState(true);
  const [isThrottled, setIsThrottled] = useState<boolean>(false);
  let token: string;

  const BASE_URL = 'https://notifications-server.fly.dev';
  const WEBSOCKET_BASE_URL = 'wss://notifications-server.fly.dev';
  const hiringSecret = process.env.NEXT_PUBLIC_HIRING_SECRET;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCount(0);
    setActiveMsg(false);
  };
  const fetchData = async () => {
    token = await fetch(`${BASE_URL}/api/token?hiring_secret=${hiringSecret}`)
      .then((response) => response.json())
      .then((data) => data.token);

    const socket = new WebSocket(
      `${WEBSOCKET_BASE_URL}/ws/notification/?token=${token}`
    );
    socket.onopen = function (event) {
      console.log('WebSocket connection opened:', event);
    };
    socket.onmessage = function (event) {
      const newNotification: NotificationType = JSON.parse(event.data);
      if (!isThrottled) {
        setIsThrottled(true);
        setTimeout(() => {
          setNotification((prevNotification: NotificationType[]) => [
            newNotification,
            ...prevNotification,
          ]);
          setIsThrottled(false);
        }, 5000);
      }
    };
    socket.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });
    return () => {
      socket.close();
    };
  };
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 3000);
    setCount(notification.length);
  }, [isThrottled]);
  return (
    <main className="w-full">
      <div className=" mt-2 md:my-16 mx-auto h-auto py-4 w-[95%] md:w-[80%] lg:w-[52%] rounded-2xl bg-white shadow-md shadow-black px-4 md:px-8 ">
        <div className="flex  py-9 justify-between items-center">
          <div className="flex gap-1 md:gap-3 items-center ">
            <h2 className="text-xl md:text-2xl font-bold">Notifications</h2>
            {count && (
              <span className="bg-[#0A2968] text-white px-3 py-[.10rem] text-sm rounded-md ">
                {count}
              </span>
            )}
          </div>
          <p
            className="text-[#747380] text-bold cursor-pointer"
            onClick={(e) => handleClick(e)}
          >
            Mark all as read
          </p>
        </div>
        <div className="py-4">
          {notification?.length === 0 ? (
            <h4 className="mx-auto text-center font-bold text-2xl border-red-600 border-2 w-[320px] py-2 text-[#747380] rounded-md">
              No New Notification
            </h4>
          ) : (
            notification?.map((item) => (
              <NotificationCard
                key={item.id}
                user={item.user}
                event={item.event}
                action={item.action}
                message={item.message}
                created_at={item.created_at}
                id={item.id}
                count={count}
                setCount={setCount}
                activeMsg={activeMsg}
                media={item.media}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
