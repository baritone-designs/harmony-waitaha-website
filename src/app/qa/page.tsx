import { ScrollImage } from '@/app/qa/ScrollImage';
import QAHeader from './Header';

export default function QAHome() {
    return (
        <main>
            <QAHeader />
            <section id="home" className="flex h-screen flex-col justify-center overflow-x-hidden pl-10">
                <span className="text-7xl font-bold">
                    <span className="text-blue-qa drop-shadow-glow-light">Q</span>
                    uantum <br />
                    <span className="text-blue-qa drop-shadow-glow-light">A</span>
                    coustics
                </span>
                <ScrollImage />
            </section>
            <section id="about" className="h-screen" />
            <section id="upcoming" className="h-screen" />
            <section id="media" className="h-screen" />
            <section id="follow" className="h-screen" />
        </main>
    );
}
