import React, { useState, useMemo, useEffect } from 'react';
// Import icons from lucide-react
import { Smile, Frown, Angry, Laugh, Annoyed, Waves, Activity, Music, Newspaper, Video, Filter, X } from 'lucide-react'; // Added Filter, X icons

// --- Mock Data ---
// Simulates content fetched from APIs, tagged with moods.
const mockContent = [
  // Happy
  { id: 'h1', type: 'music', title: 'Upbeat Pop Playlist', source: 'Spotify', url: '#', moods: ['happy', 'energetic'] },
  { id: 'h2', type: 'video', title: 'Funny Cat Compilation', source: 'YouTube', url: '#', moods: ['happy', 'laugh'] },
  { id: 'h3', type: 'article', title: 'Good News Stories from Around the World', source: 'Positive News', url: '#', moods: ['happy', 'calm'] },
  { id: 'h4', type: 'music', title: 'Feel Good Indie Mix', source: 'SoundCloud', url: '#', moods: ['happy'] },

  // Sad
  { id: 's1', type: 'music', title: 'Melancholic Piano Pieces', source: 'Apple Music', url: '#', moods: ['sad', 'calm'] },
  { id: 's2', type: 'article', title: 'Finding Comfort in Difficult Times', source: 'Psychology Today', url: '#', moods: ['sad', 'calm'] },
  { id: 's3', type: 'video', title: 'Rainy Day Window Scene (10 Hours)', source: 'YouTube', url: '#', moods: ['sad', 'calm'] },
  { id: 's4', type: 'music', title: 'Lo-fi Hip Hop Radio - Beats to Relax/Study to', source: 'YouTube', url: '#', moods: ['sad', 'calm', 'focused'] },

  // Energetic
  { id: 'e1', type: 'music', title: 'Workout Beats Playlist', source: 'Spotify', url: '#', moods: ['energetic', 'happy'] },
  { id: 'e2', type: 'video', title: 'High-Intensity Interval Training Routine', source: 'FitnessBlender', url: '#', moods: ['energetic'] },
  { id: 'e3', type: 'article', title: 'Boost Your Morning Energy Levels', source: 'Healthline', url: '#', moods: ['energetic', 'focused'] },
  { id: 'e4', type: 'music', title: 'Electronic Dance Music Hits', source: 'Beatport', url: '#', moods: ['energetic'] },

  // Calm
  { id: 'c1', type: 'music', title: 'Ambient Soundscapes for Relaxation', source: 'Bandcamp', url: '#', moods: ['calm', 'focused'] },
  { id: 'c2', type: 'video', title: 'Guided Meditation for Stress Relief', source: 'Calm App', url: '#', moods: ['calm', 'sad'] },
  { id: 'c3', type: 'article', title: 'The Benefits of Mindfulness Meditation', source: 'Mindful.org', url: '#', moods: ['calm', 'focused'] },
  { id: 'c4', type: 'music', title: 'Nature Sounds: Gentle Rain', source: 'Spotify', url: '#', moods: ['calm', 'sad'] },

  // Focused
  { id: 'f1', type: 'music', title: 'Classical Music for Studying', source: 'YouTube', url: '#', moods: ['focused', 'calm'] },
  { id: 'f2', type: 'article', title: 'Techniques to Improve Concentration', source: 'Verywell Mind', url: '#', moods: ['focused'] },
  { id: 'f3', type: 'music', title: 'Alpha Wave Binaural Beats', source: 'SoundCloud', url: '#', moods: ['focused', 'calm'] },
  { id: 'f4', type: 'video', title: 'Deep Work Music Mix', source: 'YouTube', url: '#', moods: ['focused'] },

  // Angry/Annoyed (Content to help calm down or vent)
  { id: 'a1', type: 'music', title: 'Heavy Metal Power Hour', source: 'Spotify', url: '#', moods: ['angry', 'annoyed', 'energetic'] }, // Venting
  { id: 'a2', type: 'article', title: 'Healthy Ways to Express Anger', source: 'Psychology Today', url: '#', moods: ['angry', 'annoyed', 'calm'] }, // Calming
  { id: 'a3', type: 'video', title: 'Stress Ball DIY Tutorial', source: 'YouTube', url: '#', moods: ['angry', 'annoyed'] }, // Distraction/Coping
  { id: 'a4', type: 'music', title: 'Soothing Sounds for Anger Management', source: 'Calm Radio', url: '#', moods: ['angry', 'annoyed', 'calm'] }, // Calming
];

// --- Helper Components (using Tailwind classes directly) ---
// These components mimic the structure of shadcn/ui components but use Tailwind directly.

const Card = ({ children, className = '', ...props }) => (
  // Card container with Tailwind styling for background, border, shadow, and rounded corners.
  <div
    className={`rounded-xl border border-purple-600/50 bg-purple-800/30 text-purple-100 shadow flex flex-col transform transition-transform duration-300 hover:scale-105 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }) => (
  // Card header section with padding.
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', as = 'h3', ...props }) => {
  // Card title component, defaulting to h3. Uses Tailwind for font styling.
  const Tag = as;
  return (
    <Tag className={`font-semibold leading-none tracking-tight flex items-center gap-2 text-lg text-white ${className}`} {...props}>
      {children}
    </Tag>
  );
};

const CardDescription = ({ children, className = '', ...props }) => (
  // Card description text with Tailwind styling.
  <p className={`text-sm text-purple-300 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  // Main content area of the card with padding. Added flex-grow to allow content to expand.
  <div className={`p-6 pt-0 flex-grow ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  // Card footer section with padding.
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Basic Button component using Tailwind classes for styling different variants.
const Button = ({ children, className = '', variant = 'link', size = 'default', ...props }) => {
  // Base styles for the button.
  const baseStyle = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50';

  // Variant styles using Tailwind classes.
  const variants = {
    default: 'bg-purple-600 text-white shadow hover:bg-purple-700/90',
    destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700/90',
    outline: 'border border-purple-500 bg-transparent shadow-sm hover:bg-purple-500/20 hover:text-purple-100',
    secondary: 'bg-purple-500/10 text-purple-200 shadow-sm hover:bg-purple-500/20',
    ghost: 'hover:bg-purple-500/20 hover:text-purple-100',
    link: 'text-pink-400 underline-offset-4 hover:underline hover:text-pink-300',
  };

  // Size styles using Tailwind classes.
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Main Application Component ---
function App() {
  // State for the currently selected mood (e.g., 'happy', 'sad')
  const [selectedMood, setSelectedMood] = useState(null);
  // State to manage the visibility of content for transitions
  const [contentVisible, setContentVisible] = useState(false);
  // State for the content type filter ('all', 'music', 'video', 'article')
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  // Available moods with names, icons, Tailwind color classes, and background gradients
  const moods = [
    { name: 'happy', Icon: Laugh, color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500', gradient: 'from-yellow-900 via-purple-900 to-gray-900' },
    { name: 'sad', Icon: Frown, color: 'bg-blue-400', hoverColor: 'hover:bg-blue-500', gradient: 'from-blue-900 via-gray-800 to-gray-900' },
    { name: 'energetic', Icon: Activity, color: 'bg-orange-400', hoverColor: 'hover:bg-orange-500', gradient: 'from-orange-800 via-red-900 to-purple-900' },
    { name: 'calm', Icon: Waves, color: 'bg-green-400', hoverColor: 'hover:bg-green-500', gradient: 'from-green-900 via-teal-900 to-gray-900' },
    { name: 'focused', Icon: Newspaper, color: 'bg-purple-400', hoverColor: 'hover:bg-purple-500', gradient: 'from-purple-900 via-indigo-900 to-gray-900' },
    { name: 'annoyed', Icon: Annoyed, color: 'bg-red-400', hoverColor: 'hover:bg-red-500', gradient: 'from-red-900 via-gray-800 to-gray-900' },
  ];

  // Define content types for filtering
  const contentTypes = ['all', 'music', 'video', 'article'];

  // Memoized calculation: Filters mock content based on selected mood AND content type filter.
  // Runs only when selectedMood or contentTypeFilter changes.
  const recommendedContent = useMemo(() => {
    if (!selectedMood) return [];
    // First filter by mood
    const moodFiltered = mockContent.filter(item => item.moods.includes(selectedMood));
    // Then filter by content type (if filter is not 'all')
    if (contentTypeFilter === 'all') {
      return moodFiltered;
    }
    return moodFiltered.filter(item => item.type === contentTypeFilter);
  }, [selectedMood, contentTypeFilter]); // Dependencies: selectedMood, contentTypeFilter

  // Handles mood selection: updates state, resets content filter, triggers transitions.
  const handleMoodSelect = (moodName) => {
    setContentVisible(false); // Start fade-out
    // Short delay allows fade-out before content update and fade-in
    setTimeout(() => {
      setSelectedMood(moodName);
      setContentTypeFilter('all'); // Reset content filter when mood changes
      setContentVisible(true); // Start fade-in
    }, 150); // Transition timing
  };

  // Returns the appropriate icon component based on content type.
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'music': return <Music className="h-4 w-4 text-pink-500" />;
      case 'video': return <Video className="h-4 w-4 text-red-500" />;
      case 'article': return <Newspaper className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  // Effect to ensure content becomes visible if a mood is selected.
   useEffect(() => {
    // If a mood is selected, ensure content area is set to visible.
    if (selectedMood) {
      setContentVisible(true);
    }
   }, [selectedMood]); // Dependency array ensures this runs when selectedMood changes.

   // Get the current background gradient based on the selected mood
   const currentGradient = useMemo(() => {
     const mood = moods.find(m => m.name === selectedMood);
     return mood ? mood.gradient : 'from-gray-900 via-purple-900 to-gray-900'; // Default gradient
   }, [selectedMood]);


  return (
    // Main container with dynamic gradient background, padding, and font settings.
    // Added transition for potential color smoothing (gradient transition might be instant).
    <div className={`min-h-screen bg-gradient-to-br ${currentGradient} text-white font-sans p-4 md:p-8 transition-colors duration-500 ease-in-out`}>

      {/* Header Section */}
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
          MoodMix
        </h1>
        <p className="text-lg md:text-xl text-purple-200">
          Tune Your Content to Your Emotions
        </p>
      </header>

      {/* Mood Selector Section */}
      <section className="mb-6 md:mb-8"> {/* Reduced margin bottom */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-purple-300">How are you feeling?</h2>
        {/* Flex container for mood buttons */}
        <div className="flex justify-center items-center gap-3 md:gap-6 flex-wrap">
          {moods.map(({ name, Icon, color, hoverColor }) => (
            <button
              key={name}
              onClick={() => handleMoodSelect(name)}
              aria-label={`Select ${name} mood`}
              // Styling for mood buttons: padding, rounded, colors, transitions, focus ring, and selected state highlight.
              className={`
                p-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white
                ${color} ${hoverColor}
                ${selectedMood === name ? 'ring-2 ring-white scale-110 shadow-lg' : 'shadow-md'}
              `}
            >
              <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </button>
          ))}
        </div>
      </section>

      {/* Content Type Filter Section - Appears only when a mood is selected */}
      {selectedMood && (
        <section className="mb-8 md:mb-12 text-center">
          <h3 className="text-lg font-medium text-purple-300 mb-3 flex items-center justify-center gap-2">
             <Filter className="h-5 w-5" /> Filter Content Type:
          </h3>
          <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
            {contentTypes.map((type) => (
              <Button
                key={type}
                variant={contentTypeFilter === type ? 'default' : 'outline'} // Highlight active filter
                size="sm"
                onClick={() => setContentTypeFilter(type)}
                className="capitalize" // Capitalize button text
              >
                {type === 'all' ? <X className="h-4 w-4 mr-1"/> : getContentTypeIcon(type)} {/* Show icon or 'X' for all */}
                {type}
              </Button>
            ))}
          </div>
        </section>
      )}


      {/* Content Display Section */}
      <section className="container mx-auto max-w-4xl">
        {/* Grid container for content cards. */}
        {/* The 'key' combines mood and filter to ensure transitions on filter change too. */}
        {/* Inline styles manage the fade/slide transition based on 'contentVisible' state. */}
        <div
           key={`${selectedMood}-${contentTypeFilter}`} // Force re-render on mood OR filter change
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
           style={{
               // Apply opacity and transform based on visibility state
               opacity: contentVisible ? 1 : 0,
               transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
               // Define the transition effect
               transition: `opacity ${contentVisible ? 300 : 150}ms ease-out, transform ${contentVisible ? 300 : 150}ms ease-out`
            }}
        >
          {/* Conditional rendering: Show message if mood is selected but no content matches the filter */}
          {selectedMood && recommendedContent.length === 0 && contentVisible && (
            <p className="col-span-full text-center text-purple-300 text-lg">
                No {contentTypeFilter !== 'all' ? contentTypeFilter : ''} content found for '{selectedMood}'.
                {contentTypeFilter !== 'all' && <button className="text-pink-400 underline ml-2" onClick={() => setContentTypeFilter('all')}>Show all</button>}
            </p>
          )}

          {/* Map through recommended (and filtered) content and render Card components */}
          {recommendedContent.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  {/* Display content type icon and title */}
                  {getContentTypeIcon(item.type)}
                  {item.title}
                </CardTitle>
                <CardDescription>{item.source}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder description */}
                <p className="text-sm text-purple-200">Content related to the '{selectedMood}' mood.</p>
              </CardContent>
              <CardFooter>
                {/* Button to view content (opens link in new tab) */}
                <Button
                  variant="link"
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')} // Added security attributes
                >
                  View Content
                </Button>
                {/* Placeholder comment for future 'Like' button */}
                {/* Future Feature: Add Like/Save button here */}
              </CardFooter>
            </Card>
          ))}
        </div>
         {/* Conditional rendering: Show initial prompt if no mood is selected */}
         {!selectedMood && (
            <p className="text-center text-purple-300 text-lg pt-10 animate-pulse">Select a mood above to see curated content!</p>
         )}
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-12 text-purple-400 text-sm">
        MoodMix Hackathon Project
      </footer>
    </div>
  );
}

// Export the main component for use in the application.
export default App;
