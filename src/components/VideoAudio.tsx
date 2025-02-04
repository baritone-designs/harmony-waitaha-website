'use client';

import React, { useState } from 'react';
import { MdMusicOff, MdMusicNote } from 'react-icons/md';

interface VideoAudioProps {
    url: string;
}

export default function VideoAudio({ url }: VideoAudioProps) {
    const [muted, setMuted] = useState(true);
    const [hasAppeared, setHasAppeared] = useState(false);
    const [fade, setFade] = useState(false);

    const handleToggleMute = () => {
        setMuted((current) => !current);
    };

    return (
        <div>
            <div className="absolute bottom-28 z-50 flex w-screen justify-center">
                <button
                    className={`
                        ${hasAppeared && 'hidden opacity-0'} 
                        ${fade && 'animate-fade-out opacity-0 transition duration-200'} 
                        flex flex-row items-center justify-center gap-2 rounded-full bg-black/60 p-5 text-white duration-200 hover:bg-black/90 hover:text-hw-blue`}
                    onClick={() => {
                        setFade(true);
                        handleToggleMute();
                    }}
                    onAnimationEnd={() => {
                        setHasAppeared(true);
                    }}
                    type="button"
                >
                    <MdMusicNote size={25} />
                    Listen to Us!
                </button>
            </div>
            <video src={url} muted={muted} loop autoPlay className="h-screen w-screen object-cover">
                <track kind="captions" default />
            </video>
            <button
                onClick={handleToggleMute}
                type="button"
                className={`${muted && !hasAppeared ? 'hidden opacity-0' : 'animate-fade-in'} 
                    fixed bottom-5 right-5 z-50 flex flex-row items-center justify-center gap-2 rounded-full bg-black/60 p-5 text-white
                    transition duration-200 hover:bg-black/90 hover:text-hw-blue`}
            >
                {muted ? <MdMusicOff size={25} /> : <MdMusicNote size={25} />}
            </button>
        </div>
    );
}
