import React, { useState } from 'react';
import { Play, Star, ChevronRight, ChevronLeft } from 'lucide-react';

const Hero = () => {
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const dates = [
        { day: 'MON', date: '28' },
        { day: 'TUE', date: '29' },
        { day: 'WED', date: '30' },
        { day: 'THU', date: '31' },
    ];

    const times = ['11:45', '12:15', '13:00', '14:45', '16:30'];

    return (
        <div className="relative w-full overflow-hidden mb-12">
            {/* Background Image with Gradient Overlay */}
            <div className="relative h-[85vh] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                    style={{
                        backgroundImage: 'url("https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg")', // Dune Background
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="flex flex-col md:flex-row items-center gap-12 w-full mt-16">

                        {/* Poster Card - Floating Effect */}
                        <div className="hidden md:block w-72 shrink-0 transform hover:scale-105 transition-transform duration-500 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group relative">
                            <img
                                src="https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
                                alt="Dune Part Two Poster"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="w-6 h-6 ml-1 fill-current" />
                                </button>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left z-10">
                            <div className="flex items-center gap-4 text-gray-400 text-sm font-medium tracking-widest uppercase mb-4 justify-center md:justify-start">
                                <span>2024</span>
                                <span className="w-1 h-1 rounded-full bg-red-600" />
                                <span>Sci-Fi</span>
                                <span className="w-1 h-1 rounded-full bg-red-600" />
                                <span>Action</span>
                                <span className="w-1 h-1 rounded-full bg-red-600" />
                                <span>3h 15m</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
                                DUNE: <span className="text-red-600">PART TWO</span>
                            </h1>

                            <div className="flex items-center gap-6 mb-8 justify-center md:justify-start">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-white font-bold">4.8</span>
                                    <span className="text-gray-400 text-sm">(2.4k votes)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-xs font-bold border border-gray-500 px-1 rounded">IMDb</span>
                                    <span className="font-bold">9.1</span>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg mb-8 max-w-2xl leading-relaxed font-light mx-auto md:mx-0">
                                Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe...
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                <button className="px-8 py-4 bg-red-600 text-white rounded-full font-bold uppercase tracking-wider hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(220,38,38,0.3)] flex items-center gap-2 group">
                                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                    Watch Trailer
                                </button>
                                <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2">
                                    More Info
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Booking Bar */}
            <div className="relative -mt-24 z-20 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-[#12141c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Date Selector */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Choose Date</span>
                                <div className="flex gap-2">
                                    <button className="p-1 hover:text-white text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white text-gray-500"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                {dates.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(index)}
                                        className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl transition-all border ${selectedDate === index
                                            ? 'bg-red-600/20 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-xs font-bold mb-1">{item.day}</span>
                                        <span className="text-2xl font-black">{item.date}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                        {/* Time Selector */}
                        <div className="flex-1 w-full">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">Available Times</span>
                            <div className="flex flex-wrap gap-3">
                                {times.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-6 py-3 rounded-lg text-sm font-bold border transition-all ${selectedTime === time
                                            ? 'bg-white text-black border-white scale-105'
                                            : 'bg-transparent border-white/20 text-gray-300 hover:border-white/50'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Book Button */}
                        <div className="w-full lg:w-auto">
                            <button className="w-full lg:w-48 h-16 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center">
                                <span>Buy Ticket</span>
                                <span className="text-[10px] opacity-70 font-normal normal-case">Best seats available</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
