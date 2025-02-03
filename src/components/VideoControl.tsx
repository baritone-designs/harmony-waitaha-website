'use client';

import React, { useState } from 'react';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';

export function VideoControl() {
    const [muted, setMuted] = useState(true);
    const handleToggleMute = () => setMuted((current) => !current);

    return (
        <div>
            <div className="absolute bottom-28 z-50 flex w-screen justify-center">
                <button
                    onClick={handleToggleMute}
                    className="flex flex-row items-center justify-center gap-2 rounded-full bg-black/60 p-5 text-white duration-200 hover:bg-black/90 hover:text-hw-blue"
                    type="button"
                >
                    {muted ? <MdVolumeOff size={25} /> : <MdVolumeUp size={25} />}
                    Listen to Us!
                </button>
            </div>
            <video autoPlay muted={muted} loop className="h-screen w-screen object-cover">
                <source src="/main.mp4" type="video/mp4" />
                <track default kind="captions" />
            </video>
        </div>
    );
}
