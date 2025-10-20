'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }

    // Vérifier si l'application est déjà installée
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstalled();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA installée avec succès');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('L\'utilisateur a accepté l\'installation');
      } else {
        console.log('L\'utilisateur a refusé l\'installation');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    }
  };

  // Ne pas afficher le bouton si l'application est déjà installée
  if (isInstalled) {
    return null;
  }

  // Afficher le bouton d'installation si disponible
  if (isInstallable && deferredPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Installer l'application</p>
              <p className="text-xs opacity-90">Accédez rapidement depuis votre écran d'accueil</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Installer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un indicateur pour les navigateurs qui supportent PWA mais n'ont pas encore déclenché l'événement
  if ('serviceWorker' in navigator && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs">Application compatible hors ligne</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}