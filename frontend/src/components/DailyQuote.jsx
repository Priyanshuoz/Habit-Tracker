import { useState, useEffect } from 'react';
import { Quote, Sparkles, RefreshCw } from 'lucide-react';

const FALLBACK_QUOTE = {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
};

const getInitialQuote = () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const cached = localStorage.getItem('daily_quote');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date === today && parsed.quote) {
                return { quote: parsed.quote, author: parsed.author };
            }
        }
    } catch {
        // Ignore JSON parse errors
    }
    return null;
};

const DailyQuote = () => {
    const [quoteData, setQuoteData] = useState(getInitialQuote);
    const [loading, setLoading] = useState(!quoteData);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://dummyjson.com/quotes/random');
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();

            if (data?.quote) {
                const newQuote = { quote: data.quote, author: data.author };
                setQuoteData(newQuote);

                // Cache today's quote in localStorage
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem(
                    'daily_quote',
                    JSON.stringify({ date: today, ...newQuote })
                );
            }
        } catch (err) {
            console.error('Failed to fetch quote from API', err);
            setQuoteData((prev) => prev || FALLBACK_QUOTE);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!quoteData) {
            fetchQuote();
        }
    }, [quoteData]);

    const displayQuote = quoteData || FALLBACK_QUOTE;

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-gray-900 to-purple-950/30 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 shadow-lg">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Quote className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            <span>Daily Spark</span>
                        </div>

                        {loading && !quoteData ? (
                            <div className="space-y-2 py-1 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-64 max-w-full" />
                                <div className="h-3 bg-gray-800/60 rounded w-28" />
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-200 italic leading-relaxed">
                                    "{displayQuote.quote}"
                                </p>
                                <p className="text-xs font-semibold text-gray-400">
                                    — {displayQuote.author}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Shuffle / Refresh quote button */}
                <button
                    onClick={() => fetchQuote(true)}
                    disabled={loading}
                    className="text-gray-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-lg transition cursor-pointer shrink-0 disabled:opacity-50"
                    title="Get a new quote"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default DailyQuote;
