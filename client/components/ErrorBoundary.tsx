import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

// Simple error boundary to prevent white screens and show a friendly fallback
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Log error for diagnostics (visible in browser console tools)
    console.error("App crashed:", error, errorInfo);
  }

  handleReload = () => {
    // Clear potential bad SW cache then reload
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}));
      }).finally(() => window.location.reload());
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="min-h-screen grid place-items-center bg-background text-foreground p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
            <p className="text-sm opacity-80">
              نعتذر عن الإزعاج. جرّب إعادة تحميل الصفحة لإصلاح المشكلة.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
