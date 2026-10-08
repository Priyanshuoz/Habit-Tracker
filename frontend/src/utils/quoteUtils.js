// Curated collection of high-impact habit and consistency quotes
export const MOTIVATIONAL_QUOTES = [
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    tag: "Atomic Habits",
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (on Aristotle)",
    tag: "Consistency",
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    tag: "Growth",
  },
  {
    quote: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.",
    author: "Octavia Butler",
    tag: "Discipline",
  },
  {
    quote: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    author: "James Clear",
    tag: "Atomic Habits",
  },
  {
    quote: "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work—as a human being.'",
    author: "Marcus Aurelius",
    tag: "Meditations",
  },
  {
    quote: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock",
    tag: "Focus",
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
    tag: "Momentum",
  },
  {
    quote: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    tag: "Beginning",
  },
  {
    quote: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
    tag: "Progress",
  },
  {
    quote: "Champions don’t do extraordinary things. They do ordinary things, but they do them without thinking.",
    author: "Charles Duhigg",
    tag: "Power of Habit",
  },
  {
    quote: "It’s not what we do once in a while that shapes our lives. It’s what we do consistently.",
    author: "Tony Robbins",
    tag: "Routines",
  },
  {
    quote: "Drip hollows out the rock, not by force, but by falling often.",
    author: "Ovid",
    tag: "Patience",
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    tag: "Self-Control",
  },
];

// Returns a quote uniquely keyed to the current calendar day
export const getDailyQuote = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffDays = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
  const index = Math.abs((date.getFullYear() * 365 + diffDays) % MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};
