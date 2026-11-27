import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Command, Eye, EyeOff, Search, Sparkles, X } from 'lucide-react';
import { quickRoutes } from '@/lib/night-guide-model';

const ToolsContext = createContext({ openQuick: () => {} });
const imagePreferenceKey = 'iwsn.images-hidden.session';

export function NightTools({ children, onGuide }: { children: React.ReactNode; onGuide: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false), [query, setQuery] = useState('');
  const [hidden, setHidden] = useState(false), [notice, setNotice] = useState('');
  const [preferenceReady, setPreferenceReady] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const guideRequested = useRef(false);
  const openQuick = () => { opener.current = document.activeElement as HTMLElement; setQuery(''); setOpen(true); };
  useEffect(() => { setOpen(false); }, [router.asPath]);
  useEffect(() => {
    try { setHidden(sessionStorage.getItem(imagePreferenceKey) === '1'); } catch { /* Usable without storage. */ }
    setPreferenceReady(true);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        if (!open && document.querySelector('[role="dialog"]')) return;
        event.preventDefault();
        if (!open) opener.current = document.activeElement as HTMLElement;
        setQuery(''); setOpen(current => !current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    if (!preferenceReady) return;
    document.body.dataset.nightImagesHidden = String(hidden);
    return () => { delete document.body.dataset.nightImagesHidden; };
  }, [hidden, preferenceReady]);
  const toggleImages = () => {
    const next = !hidden; setHidden(next);
    try { sessionStorage.setItem(imagePreferenceKey, next ? '1' : '0'); setNotice(next ? 'Bilder sind in diesem Tab ausgeblendet.' : 'Bilder werden wieder angezeigt.'); }
    catch { setNotice(next ? 'Bilder ausgeblendet. Die Einstellung gilt bis zum Neuladen.' : 'Bilder werden wieder angezeigt.'); }
  };
  const routes = quickRoutes(query);
  return <ToolsContext.Provider value={{ openQuick }}>
    {hidden && <div className="night-discreet-notice" role="status"><EyeOff size={16} aria-hidden="true" /><span>Bilder in diesem Tab ausgeblendet</span><button type="button" onClick={toggleImages}>Wieder anzeigen</button></div>}
    {children}
    <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="night-dialog-overlay night-command-overlay" /><Dialog.Content className="night-dialog night-command-dialog" onCloseAutoFocus={event => {
      event.preventDefault();
      if (opener.current?.isConnected) opener.current.focus();
      if (guideRequested.current) { guideRequested.current = false; onGuide(); }
    }}>
      <Dialog.Close className="night-icon-button night-dialog-close" aria-label="Schnellzugriff schliessen"><X /></Dialog.Close>
      <p className="night-kicker"><Command size={15} aria-hidden="true" /> Direkt zu deinem nächsten Schritt</p>
      <Dialog.Title>Weniger suchen.<br />Mehr entdecken.</Dialog.Title>
      <Dialog.Description>Ein Ziel berühren. Oder die Navigation optional durchsuchen.</Dialog.Description>
      <button type="button" className="night-command-guide" onClick={() => { guideRequested.current = true; setOpen(false); }}><Sparkles size={23} /><span><strong>Meinen Einstieg finden</strong><small>Region → Bereich → Rahmen</small></span><ArrowRight size={19} /></button>
      <details className="night-command-search"><summary><Search size={16} /> Navigation durchsuchen <span>optional</span></summary><label className="sr-only" htmlFor="night-command-query">Navigation durchsuchen</label><input id="night-command-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Zum Beispiel Merkliste" maxLength={80} autoComplete="off" /></details>
      <nav className="night-command-grid" aria-label="Schnellzugriff">{routes.map(route => <Link key={route.href} href={route.href}><span><strong>{route.label}</strong><small>{route.detail}</small></span><ArrowRight size={17} aria-hidden="true" /></Link>)}</nav>
      {!routes.length && <p role="status" className="night-note">Kein Navigationsziel gefunden. <button className="night-text-button" onClick={() => setQuery('')}>Alle Ziele anzeigen</button></p>}
      <div className="night-image-control"><button type="button" className="night-image-toggle" aria-pressed={hidden} onClick={toggleImages}>{hidden ? <EyeOff size={20} /> : <Eye size={20} />}<span><strong>{hidden ? 'Bilder ausgeblendet' : 'Bilder ausblenden'}</strong><small>Nur die Darstellung in diesem Tab</small></span><span className="night-toggle-track" aria-hidden="true"><span /></span></button><p className="night-note">Texte, Browserverlauf und Netzwerkzugriffe bleiben unverändert.</p>{notice && <p className="night-note" role="status">{notice}</p>}</div>
      <div className="night-command-hint"><span><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> öffnet den Schnellzugriff</span><span><kbd>Esc</kbd> schliesst</span></div>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </ToolsContext.Provider>;
}

export function QuickActionsButton({ children = 'Schnellzugriff', iconOnly = false }: { children?: React.ReactNode; iconOnly?: boolean }) {
  const { openQuick } = useContext(ToolsContext);
  return <button type="button" className={iconOnly ? 'night-icon-button night-command-trigger' : 'night-button-secondary'} onClick={openQuick} aria-label={iconOnly ? 'Schnellzugriff öffnen' : undefined} aria-keyshortcuts="Control+k Meta+k"><Command size={19} aria-hidden="true" />{!iconOnly && children}</button>;
}
