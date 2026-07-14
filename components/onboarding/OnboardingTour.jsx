'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Joyride } from 'react-joyride'
import { supabase } from '@/lib/supabase/client'

const clientSteps = [
  {
    target: 'body',
    placement: 'center',
    title: '🌱 Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Trouvez produits, materiel et services pres de chez vous.',
  },
  {
    target: '[data-joyride="explore"]',
    placement: 'bottom',
    title: '🔍 Parcourir les annonces',
    content: 'Explorez des milliers d\'annonces de produits et services agricoles pres de chez vous.',
  },
  {
    target: '[data-joyride="create-ad"]',
    placement: 'bottom',
    title: '📝 Deposer une annonce',
    content: 'Publiez gratuitement votre demande en quelques clics pour toucher des milliers de vendeurs.',
  },
  {
    target: '[data-joyride="my-items"]',
    placement: 'bottom',
    title: '📋 Suivre vos annonces',
    content: 'Retrouvez et gerez toutes vos annonces depuis votre tableau de bord.',
  },
]

const vendeurSteps = [
  {
    target: 'body',
    placement: 'center',
    title: '🌱 Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Vendez vos produits directement aux acheteurs.',
  },
  {
    target: '[data-joyride="create-ad"]',
    placement: 'bottom',
    title: '📦 Ajouter un produit',
    content: 'Creez votre catalogue en quelques clics : photo, prix, stock et localisation.',
  },
  {
    target: '[data-joyride="my-items"]',
    placement: 'bottom',
    title: '📋 Gerer mes produits',
    content: 'Consultez et mettez a jour votre catalogue depuis votre tableau de bord.',
  },
  {
    target: '[data-joyride="explore"]',
    placement: 'bottom',
    title: '📊 Suivre le marche',
    content: 'Explorez les annonces pour suivre la concurrence et trouver de nouvelles opportunites.',
  },
]

const prestataireSteps = [
  {
    target: 'body',
    placement: 'center',
    title: '🌱 Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Proposez vos services aux agriculteurs.',
  },
  {
    target: '[data-joyride="create-ad"]',
    placement: 'bottom',
    title: '🔧 Creer un service',
    content: 'Creez votre carte de service : prestation, tarif, zone d\'intervention.',
  },
  {
    target: '[data-joyride="my-items"]',
    placement: 'bottom',
    title: '📋 Gerer mes services',
    content: 'Suivez les demandes de service et gerez vos prestations.',
  },
  {
    target: '[data-joyride="explore"]',
    placement: 'bottom',
    title: '📊 Decouvrir le marche',
    content: 'Parcourez les annonces pour trouver de nouveaux clients et partenaires.',
  },
]

export default function OnboardingTour() {
  const { user, profile } = useSelector(state => state.auth)
  const [run, setRun] = useState(false)
  const [key, setKey] = useState(0)
  const role = profile?.role || 'client'

  const steps = role === 'vendeur' ? vendeurSteps : role === 'prestataire' ? prestataireSteps : clientSteps

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
      continuous
      showSkipButton
      showProgress
      spotlightClicks
      hideBackButton={false}
      disableOverlayClose
      locale={{
        back: 'Précédent',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        skip: 'Passer',
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0,0,0,0.55)',
          primaryColor: '#73BF44',
          textColor: '#1e293b',
          spotlightShadow: '0 0 0 4px rgba(115,191,68,0.3)',
          width: 380,
          zIndex: 1000,
        },
        spotlight: {
          borderradius: 12,
        },
        tooltip: {
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        title: {
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
          color: '#0D4926',
        },
        content: {
          fontSize: 14,
          lineHeight: 1.6,
          color: '#475569',
          margin: 0,
        },
        buttonNext: {
          backgroundColor: '#73BF44',
          color: '#ffffff',
          borderRadius: 12,
          padding: '8px 20px',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        },
        buttonBack: {
          color: '#64748b',
          fontSize: 13,
          fontWeight: 500,
          padding: '8px 12px',
          marginRight: 4,
          borderRadius: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: 13,
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        },
        progress: {
          color: '#94a3b8',
          fontSize: 12,
          fontWeight: 600,
        },
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          arrow: {
            length: 12,
            spread: 20,
          },
        },
      }}
    />
  )
}
