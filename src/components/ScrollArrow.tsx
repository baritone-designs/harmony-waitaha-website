'use client';

import { MdKeyboardArrowDown } from 'react-icons/md';
import React, { useState } from 'react';

export function ScrollArrow() {
    const [hide, setHide] = useState(false);
    const [fade, setFade] = useState(false);
    return (
        <div className="absolute bottom-5 z-10 flex h-12 w-screen animate-fade-in justify-center">
            <a
                href="#about"
                className={`${hide && 'hidden opacity-0'} ${fade && 'animate-fade-out opacity-0 transition duration-200'}`}
                onClick={() => {
                    setFade(true);
                }}
                onAnimationEnd={() => {
                    setHide(true);
                }}
            >
                <MdKeyboardArrowDown size={500} className="h-full w-full animate-bounce" />
            </a>
        </div>
    );
}
