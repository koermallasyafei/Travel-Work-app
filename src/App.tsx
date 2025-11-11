import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_DOT_STRING } from './constants';
import { MOCK_STAYS, MOCK_WORK_SPOTS, MOCK_COMMUNITY_EVENTS } from './mockData';
import type { Stay, WorkSpot, CommunityEvent, PlannerItem } from './types';

// --- Type Definitions ---
type Screen = 'Home' | 'FindStay' | 'WorkSpots' | 'Community' | 'Planner';

// --- Reusable Components ---

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface ErrorDisplayProps {
  message: string;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="p-4 m-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg max-w-full">
    <h3 className="font-bold mb-2">Graph Generation Failed</h3>
    <pre className="text-sm whitespace-pre-wrap font-mono break-all">{message}</pre>
  </div>
);

const WelcomePlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
     <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5,17.5m-2.5,0a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5,6.5m-2.5,0a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5,6.5m-2.5,0a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5,17.5m-2.5,0a2.5,2.5 0 1,0 5,0a2.5,2.5 0 1,0 -5,0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5,9.5l0,5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9,6.5l5,0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9,17.5l5,0" />
    </svg>
    <h2 className="text-xl font-semibold">Graph Output</h2>
    <p>The rendered graph will appear here.</p>
  </div>
);

// --- Interactive Demo Components ---

interface AddToPlannerButtonProps {
  onClick: () => void;
}
const AddToPlannerButton: React.FC<AddToPlannerButtonProps> = ({ onClick }) => {
    const [added, setAdded] = useState(false);
    const handleClick = () => {
        onClick();
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };
    return (
        <button 
          onClick={handleClick} 
          disabled={added}
          className={`w-full mt-4 px-4 py-2 font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            added 
            ? 'bg-emerald-500 text-white cursor-default' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
          }`}
        >
            {added ? 'Added ✓' : 'Add to Planner'}
        </button>
    );
};

const StayCard: React.FC<{ stay: Stay; onAddToPlanner: () => void }> = ({ stay, onAddToPlanner }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
    <img src={stay.imageUrl} alt={stay.name} className="w-full h-40 object-cover" />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-lg text-slate-200">{stay.name}</h3>
      <p className="text-sm text-slate-400 mb-3">{stay.city}</p>
      <div className="flex justify-between items-center text-sm text-slate-300 mt-auto">
        <span>💻 {stay.workspaceType}</span>
        <span className="font-semibold text-cyan-400">{stay.wifiSpeed} Mbps</span>
      </div>
       <div className="mt-3 text-right text-lg font-semibold text-slate-200">${stay.pricePerNight} <span className="text-xs font-normal text-slate-400">/ night</span></div>
       <AddToPlannerButton onClick={onAddToPlanner} />
    </div>
  </div>
);

const WorkSpotCard: React.FC<{ spot: WorkSpot; onAddToPlanner: () => void }> = ({ spot, onAddToPlanner }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col">
     <h3 className="font-bold text-lg text-slate-200">{spot.name}</h3>
      <p className="text-sm text-slate-400 mb-3">{spot.city}</p>
      <div className="flex justify-between items-center text-sm text-slate-300 mt-auto">
        <span>📶 Wi-Fi Speed</span>
        <span className="font-semibold text-cyan-400">{spot.wifiSpeed} Mbps</span>
      </div>
      <AddToPlannerButton onClick={onAddToPlanner} />
  </div>
);

const CommunityEventCard: React.FC<{ event: CommunityEvent; onAddToPlanner: () => void }> = ({ event, onAddToPlanner }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col">
     <h3 className="font-bold text-lg text-slate-200">{event.title}</h3>
      <p className="text-sm text-slate-400 mb-3">{event.city}</p>
      <div className="flex justify-between items-center text-sm text-slate-300 mt-auto">
        <span>🗓️ Date</span>
        <span className="font-semibold text-amber-400">{event.date}</span>
      </div>
      <AddToPlannerButton onClick={onAddToPlanner} />
  </div>
);

const PlannerItemCard: React.FC<{ item: PlannerItem }> = ({ item }) => {
    const renderDetails = () => {
        switch (item.type) {
            case 'Stay': return <p>City: {item.city} | Price: ${item.pricePerNight}/night</p>;
            case 'WorkSpot': return <p>City: {item.city} | Wi-Fi: {item.wifiSpeed} Mbps</p>;
            case 'Community': return <p>City: {item.city} | Date: {item.date}</p>;
            default: return null;
        }
    };
    const ICONS = { Stay: '🏡', WorkSpot: '💻', Community: '🧑‍🤝‍🧑' };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            {/* FIX: Use discriminated union `type` property to safely access `title` or `name`. */}
            <h3 className="font-bold text-md text-slate-200">{ICONS[item.type]} {item.type === 'Community' ? item.title : item.name}</h3>
            <p className="text-sm text-slate-400">{renderDetails()}</p>
        </div>
    )
}

// --- Main App Component ---

const App: React.FC = () => {
  const [dotInput, setDotInput] = useState<string>(INITIAL_DOT_STRING);
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [screen, setScreen] = useState<Screen>('Home');
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([]);

  // FIX: Refactor `addToPlanner` to accept a fully-formed `PlannerItem` object.
  // This makes the function type-safe and removes ambiguity.
  const addToPlanner = (item: PlannerItem) => {
    setPlannerItems(prev => [...prev, item]);
  };


  const generateGraph = useCallback(async (dot: string) => {
    setIsLoading(true);
    setError(null);
    setSvgOutput('');

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const Viz = (window as any).Viz;
      if (!Viz) {
        throw new Error('Viz.js library not found. Please check network connection or script tag in index.html.');
      }
      const viz = await Viz.instance();
      const svg = viz.renderString(dot);
      setSvgOutput(svg);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred during graph generation.');
      setSvgOutput('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    generateGraph(INITIAL_DOT_STRING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateClick = () => {
    if (dotInput.trim()) {
      generateGraph(dotInput);
    } else {
      setError("DOT input cannot be empty.");
    }
  };
  
  const renderScreen = () => {
    switch(screen) {
        case 'Home':
            return (
                <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">🏠 Welcome to the NomadSphere Demo</h3>
                    <p className="text-slate-400 mb-6">Use the tabs above to explore features and build your travel plan.</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => setScreen('FindStay')} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors">🏡 Find a Stay</button>
                        <button onClick={() => setScreen('WorkSpots')} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors">💻 Find Work Spots</button>
                    </div>
                </div>
            );
        case 'FindStay':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {/* FIX: Update call to `addToPlanner` to pass a valid `PlannerItem` object. */}
                    {MOCK_STAYS.map(stay => (
                        <StayCard key={stay.id} stay={stay} onAddToPlanner={() => addToPlanner({ ...stay, type: 'Stay' })} />
                    ))}
                </div>
            );
        case 'WorkSpots':
             return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {/* FIX: Update call to `addToPlanner` to pass a valid `PlannerItem` object. */}
                    {MOCK_WORK_SPOTS.map(spot => (
                        <WorkSpotCard key={spot.id} spot={spot} onAddToPlanner={() => addToPlanner({ ...spot, type: 'WorkSpot' })} />
                    ))}
                </div>
            );
        case 'Community':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    {/* FIX: Update call to `addToPlanner` to pass a valid `PlannerItem` object. */}
                    {MOCK_COMMUNITY_EVENTS.map(event => (
                        <CommunityEventCard key={event.id} event={event} onAddToPlanner={() => addToPlanner({ ...event, type: 'Community' })} />
                    ))}
                </div>
            );
        case 'Planner':
            return (
                <div className="p-6">
                    {plannerItems.length === 0 ? (
                        <p className="text-center text-slate-400">Your planner is empty. Add items from other tabs!</p>
                    ) : (
                        <div className="space-y-4 max-w-2xl mx-auto">
                            {plannerItems.map((item, index) => (
                                <PlannerItemCard key={`${item.id}-${index}`} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            );
        default:
            return null;
    }
  }
  
  interface TabButtonProps {
      label: string;
      icon: string;
      target: Screen;
  }
  const TabButton: React.FC<TabButtonProps> = ({ label, icon, target }) => (
    <button
      onClick={() => setScreen(target)}
      className={`px-4 py-2 text-sm md:text-base font-semibold border-b-2 transition-colors duration-200 flex items-center gap-2 ${
        screen === target
          ? 'border-indigo-400 text-indigo-300'
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
        <span>{icon}</span> {label}
    </button>
  );

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans flex flex-col">
      <header className="py-4 px-6 md:px-8 border-b border-slate-700 text-center flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          NomadSphere Concept Visualizer
        </h1>
        <p className="text-slate-400 mt-1">
          Visualizing user flows and data models for digital nomads.
        </p>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8 min-h-0">
        {/* Editor Panel */}
        <div className="flex flex-col rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden min-h-[400px] md:min-h-0">
          <div className="flex-shrink-0 p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-slate-300">DOT Input</h2>
             <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            >
              {isLoading ? 'Generating...' : 'Generate Graph'}
            </button>
          </div>
          <textarea
            value={dotInput}
            onChange={(e) => setDotInput(e.target.value)}
            placeholder="Enter your DOT graph definition here..."
            className="w-full h-full flex-grow p-4 bg-slate-900 text-slate-300 font-mono text-sm resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>

        {/* Viewer Panel */}
        <div className="flex flex-col rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden min-h-[400px] md:min-h-0">
           <h2 className="flex-shrink-0 p-3 bg-slate-800 border-b border-slate-700 text-lg font-semibold text-slate-300">
            Visual Output
           </h2>
          <div className="flex-grow flex items-center justify-center relative overflow-auto bg-slate-900 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]">
            {isLoading && <LoadingSpinner />}
            {error && !isLoading && <ErrorDisplay message={error} />}
            {!isLoading && !error && svgOutput && (
              <div
                className="w-full h-full p-4 flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
            )}
            {!isLoading && !error && !svgOutput && <WelcomePlaceholder />}
          </div>
        </div>
      </main>

      <section aria-labelledby="interactive-demo-title" className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 id="interactive-demo-title" className="text-xl md:text-2xl font-bold text-slate-200 mb-2">
            Interactive Demo
          </h2>
          <div className="border-b border-slate-700 mb-4">
              <nav className="flex -mb-px space-x-2 md:space-x-4" aria-label="Tabs">
                  <TabButton icon="🏠" label="Home" target="Home" />
                  <TabButton icon="🏡" label="Find Stay" target="FindStay" />
                  <TabButton icon="💻" label="Work Spots" target="WorkSpots" />
                  <TabButton icon="🧑‍🤝‍🧑" label="Community" target="Community" />
                  <TabButton icon="📅" label="Planner" target="Planner" />
              </nav>
          </div>
          <div className="bg-slate-800/30 rounded-lg min-h-[200px]">
            {renderScreen()}
          </div>
        </div>
      </section>
    </div>
  );
};
export default App;