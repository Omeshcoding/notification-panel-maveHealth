'use client';
import React, { useState } from 'react';

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

type Notification = {
  id: string;
  user: User;
  event: string;
  action: Action | null;
  message: string | null;
  media: string | null;
  created_at: string;
  count: number;
  activeMsg: boolean;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const NotificationCard = ({
  id,
  user,
  event,
  action,
  message,
  media,
  created_at,
  setCount,
  count,
  activeMsg,
}: Notification) => {
  const [activeCard, setActiveCard] = useState(true);
  const handleSingleItem = (messageId: string) => {
    if (id === messageId) {
      setActiveCard(false);
      return setCount(count - 1);
    }
  };

  const createdTime = (time: string) => {
    const currentDate = new Date();
    const postDate = new Date(time);

    const timeDifference = currentDate.getTime() - postDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const timeCreated = createdTime(created_at);

  return (
    <>
      <div
        className={`flex gap-4 items-center px-2 bg-[#e9e9f7] ${
          !activeMsg || !activeCard ? 'bg-transparent' : 'bg-[#e9e9f7]'
        }  rounded-lg mb-4 sm:py-4 py-1 cursor-pointer`}
        onClick={() => handleSingleItem(id)}
      >
        <img
          src={user.profile_picture}
          alt="mark"
          className="w-[20%] sm:w-[10%] "
        />
        <div className="relative flex flex-col py-1">
          <div className="flex items-center w-[100%]">
            <div className="flex flex-row items-center">
              <p className="text-[#5e6778]">
                <span className="font-bold text-black hover:text-[#0a317b]">{`${user?.first_name} ${user?.last_name} `}</span>
                {event}{' '}
                <span className="text-[#0a317b] hover:text-[#2354af]  font-bold hover-text-[#eee]">
                  {action?.title}
                </span>{' '}
                <span
                  className={`w-3 h-3 inline-block ${
                    !activeMsg || !activeCard
                      ? 'bg-transparent'
                      : ' bg-orange-600'
                  } z-10 rounded-full`}
                ></span>{' '}
              </p>
            </div>
          </div>
          <p className="text-[#939dae]">{timeCreated}</p>
        </div>
        {media && (
          <img
            src={media}
            alt="mark"
            className="w-[20%] sm:w-[9%] rounded-xl  ml-auto mr-4"
          />
        )}
      </div>
      {message && (
        <p className="text-[#5e6778] hover:bg-[#bac2cf] border-2 border-[#dde7ee] drop-shadow-sm  px-4 ml-20 mb-4 w-[80%] py-4 md:py-6   top-0 rounded-md">
          {message}
        </p>
      )}
    </>
  );
};

export default NotificationCard;
