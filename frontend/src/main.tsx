import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from './components/ui/tooltip';
import { App } from './app/App';
import './index.css';
const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:15_000,retry:1,refetchOnWindowFocus:false}}});
createRoot(document.getElementById('root')!).render(<StrictMode><QueryClientProvider client={queryClient}><TooltipProvider><BrowserRouter><App/></BrowserRouter></TooltipProvider></QueryClientProvider></StrictMode>);
