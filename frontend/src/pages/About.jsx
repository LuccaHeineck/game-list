import { useEffect } from "react";
import { Link } from "react-router-dom";

const About = () => {
    useEffect(() => {
        document.title = "About | Game Library";
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="min-h-[calc(100vh-5rem)] bg-[#09090b] text-white px-4 py-16 flex items-center justify-center">
            <div className="w-full max-w-3xl text-left">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold mb-4 select-none">
                    About Me
                </p>

                <div className="bg-zinc-900/45 border border-zinc-800/60 rounded-3xl px-6 py-10 md:px-10 md:py-12 shadow-2xl shadow-black/30 backdrop-blur-md">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                        Lucca Coutinho Heineck
                    </h1>

                    <p className="mt-5 text-lg text-zinc-300 leading-8">
                        I'm a software developer based in Brazil, passionate about games and creative projects.
                    </p>

                    <p className="mt-3 text-zinc-400 leading-7">
                        I created this project because I wanted to have a personal game list where I could track the games I was playing, rate them, and explore new titles. I hope this project can be useful for others who share the same passion for gaming and want to have a simple way to manage their game collection.
                    </p>

                    <div className="mt-8 flex justify-start">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-zinc-950 font-bold transition hover:bg-zinc-200 active:scale-95"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;