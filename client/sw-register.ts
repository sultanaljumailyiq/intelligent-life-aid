// PWA Service Worker auto-update helper
export async function initPWAUpdate() {
  try {
    const { registerSW } = await import('virtual:pwa-register');

    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Automatically update to the latest SW without prompting the user
        try { updateSW(); } catch {}
      },
      onOfflineReady() {
        // App is cached for offline use
      },
    });

    // Check for updates whenever the tab becomes visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        try { updateSW(); } catch {}
      }
    });

    // Reload the page when the new SW takes control to avoid stale UI
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  } catch (e) {
    // vite-plugin-pwa not configured; safely ignore
    console.debug('PWA register skipped:', e);
  }
}
