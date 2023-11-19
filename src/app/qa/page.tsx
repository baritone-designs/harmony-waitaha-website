import QAHeader from './Header';

export default function QAHome() {
    return (
        <main>
            <QAHeader />
            <section id="home" className="flex h-screen flex-col justify-center pl-10">
                <span className="text-7xl"><span className="text-blue-qa">Q</span>uantum <br /> <span className="text-blue-qa">A</span>coustics</span>
                <div id="home-image" />
            </section>
            <section id="about" className="h-screen" />
            <section id="upcoming" className="h-screen" />
            <section id="media" className="h-screen" />
            <section id="follow" className="h-screen" />
        </main>
    );
}
