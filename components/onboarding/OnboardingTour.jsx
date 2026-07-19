'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Joyride } from 'react-joyride'
import { supabase } from '@/lib/supabase/client'
import CustomTooltip from './CustomTooltip'

const makeSteps = (role, isMobile) => {
  const desktop = {
    client: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Trouvez produits, materiel et services pres de chez vous.' },
      { target: '[data-joyride="explore"]', placement: 'bottom', icon: '🔍', title: 'Parcourir les annonces', content: 'Des milliers d\'annonces de produits et services agricoles pres de chez vous.' },
      { target: '[data-joyride="create-ad"]', placement: 'bottom', icon: '📝', title: 'Deposer une annonce', content: 'Publiez gratuitement votre demande en quelques clics pour toucher des milliers de vendeurs.' },
      { target: '[data-joyride="my-items"]', placement: 'bottom', icon: '📋', title: 'Suivre vos annonces', content: 'Retrouvez et gerez toutes vos annonces depuis votre tableau de bord.' },
    ],
    vendeur: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Vendez vos produits directement aux acheteurs.' },
      { target: '[data-joyride="create-ad"]', placement: 'bottom', icon: '📦', title: 'Ajouter un produit', content: 'Creez votre catalogue en quelques clics : photo, prix, stock et localisation.' },
      { target: '[data-joyride="my-items"]', placement: 'bottom', icon: '📋', title: 'Gerer mes produits', content: 'Consultez et mettez a jour votre catalogue depuis votre tableau de bord.' },
      { target: '[data-joyride="explore"]', placement: 'bottom', icon: '📊', title: 'Suivre le marche', content: 'Explorez les annonces pour suivre la concurrence et trouver de nouvelles opportunites.' },
    ],
    prestataire: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Proposez vos services aux agriculteurs.' },
      { target: '[data-joyride="create-ad"]', placement: 'bottom', icon: '🔧', title: 'Creer un service', content: 'Creez votre carte de service : prestation, tarif, zone d\'intervention.' },
      { target: '[data-joyride="my-items"]', placement: 'bottom', icon: '📋', title: 'Gerer mes services', content: 'Suivez les demandes de service et gerez vos prestations.' },
      { target: '[data-joyride="explore"]', placement: 'bottom', icon: '📊', title: 'Decouvrir le marche', content: 'Parcourez les annonces pour trouver de nouveaux clients et partenaires.' },
    ],
  }

  const mobile = {
    client: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Trouvez produits, materiel et services pres de chez vous.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Ouvrez le menu', content: 'Appuyez ici pour acceder au menu et decouvrir toutes les fonctionnalites.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '🔍', title: 'Parcourir les annonces', content: 'Dans le menu, appuyez sur "Explorer" pour decouvrir des milliers d\'annonces.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📝', title: 'Deposer une annonce', content: 'Appuyez sur "Deposer une annonce" dans le menu pour publier gratuitement.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Suivre vos annonces', content: 'Retrouvez vos annonces depuis "Mes annonces" dans le menu.' },
    ],
    vendeur: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Vendez vos produits directement aux acheteurs.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Ouvrez le menu', content: 'Appuyez ici pour acceder au menu et decouvrir toutes les fonctionnalites.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📦', title: 'Ajouter un produit', content: 'Dans le menu, appuyez sur "Nouveau produit" pour creer votre catalogue.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Gerer mes produits', content: 'Appuyez sur "Mes produits" dans le menu pour gerer votre catalogue.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📊', title: 'Suivre le marche', content: 'Utilisez "Explorer" dans le menu pour trouver des opportunites.' },
    ],
    prestataire: [
      { target: 'body', placement: 'center', icon: '🌱', title: 'Bienvenue sur Composte', content: 'Plateforme agricole numero 1 au Congo. Proposez vos services aux agriculteurs.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Ouvrez le menu', content: 'Appuyez ici pour acceder au menu et decouvrir toutes les fonctionnalites.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '🔧', title: 'Creer un service', content: 'Dans le menu, appuyez sur "Nouveau service" pour creer votre carte.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📋', title: 'Gerer mes services', content: 'Appuyez sur "Mes services" dans le menu pour suivre vos prestations.' },
      { target: 'button[aria-label="Menu"]', placement: 'bottom', icon: '📊', title: 'Decouvrir le marche', content: 'Utilisez "Explorer" dans le menu pour trouver de nouveaux clients.' },
    ],
  }

  const raw = isMobile ? mobile[role] || mobile.client : desktop[role] || desktop.client
  const total = raw.length

  return raw.map((s, i) => ({
    ...s,
    hideOverlay: s.target === 'body',
    data: { icon: s.icon, total },
  }))
}

function useMedia(breakpoint) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setMatches(mq.matches)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return matches
}

export default function OnboardingTour() {
  const { user, profile } = useSelector(state => state.auth)
  const [run, setRun] = useState(false)
  const [key, setKey] = useState(0)
  const isMobile = useMedia(1023)
  const role = profile?.role || 'client'
  const steps = makeSteps(role, isMobile)

  useEffect(() => {
    if (!user) return
    const seen = localStorage.getItem('has_seen_onboarding')
    if (!seen) {
      const timer = setTimeout(() => setRun(true), 800)
      return () => clearTimeout(timer)
    }
  }, [user])

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem('has_seen_onboarding')
      setKey(k => k + 1)
      setTimeout(() => setRun(true), 400)
    }
    window.addEventListener('restart-tour', handler)
    return () => window.removeEventListener('restart-tour', handler)
  }, [])

  const handleCallback = useCallback(async (data) => {
    const { status } = data
    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem('has_seen_onboarding', 'true')
      setRun(false)
      try {
        await supabase.from('profiles').update({ has_seen_onboarding: true }).eq('id', user.id)
      } catch {}
    }
  }, [user])

  return (
    <Joyride
      key={key}
      steps={steps}
      run={run}
      callback={handleCallback}
      tooltipComponent={CustomTooltip}
      continuous
      scrollToFirstStep
      locale={{
        back: 'Précédent',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        nextWithProgress: 'Suivant ({current}/{total})',
        skip: 'Ne plus afficher',
      }}
      options={{
        arrowColor: '#ffffff',
        arrowSize: 14,
        arrowSpacing: 8,
        backgroundColor: '#ffffff',
        beaconSize: 28,
        overlayColor: 'rgba(13,73,38,0.55)',
        primaryColor: '#73BF44',
        showProgress: true,
        skipBeacon: true,
        spotlightPadding: 6,
        spotlightRadius: 12,
        width: isMobile ? '90vw' : 380,
        zIndex: 1000,
        overlayClickAction: false,
        dismissKeyAction: false,
        scrollDuration: 500,
        scrollOffset: 80,
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(13,73,38,0.55)',
          primaryColor: '#73BF44',
          textColor: '#1e293b',
          width: isMobile ? '90vw' : 380,
          zIndex: 1000,
          spotlightShadow: '0 0 0 4px rgba(115,191,68,0.25)',
        },
        spotlight: {
          stroke: '#73BF44',
          strokeWidth: 2,
          strokeOpacity: 0.4,
        },
        tooltip: {
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)',
        },
        tooltipContainer: {
          textAlign: 'center',
        },
        tooltipFooter: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        },
        floater: {
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
        },
      }}
      floatingOptions={{
        offset: 14,
        flipOptions: {
          padding: 16,
        },
      }}
    />
  )
}
