import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in Figment Studio:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-10 text-center font-display">
                    <div className="max-w-xl space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <span className="material-symbols-outlined text-4xl">warning</span>
                        </div>
                        <h1 className="text-4xl text-white font-black uppercase tracking-tighter">System Malfunction</h1>
                        <p className="text-zinc-400">
                            We encountered a critical runtime error while rendering this view. Our engineering team has been notified.
                        </p>
                        <div className="pt-8">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                            >
                                Reload Studio
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // @ts-ignore
        return this.props.children;
    }
}

export default ErrorBoundary;
