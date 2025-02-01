'use client';

import React, { useState } from 'react';

export function VideoControl() {
    const [muted, setMuted] = useState(true);
    const handleToggleMute = () => setMuted((current) => !current);

    return (
        <div>
            <button onClick={handleToggleMute} className="absolute left-40 top-40 z-50 text-black" type="button">
                {muted ? 'Unmute' : 'Mute'}
            </button>
            <video autoPlay muted={muted} loop className="size-full object-cover">
                <source src="/main.mp4" type="video/mp4" />
                <track default kind="captions" />
            </video>
        </div>
    );
}
