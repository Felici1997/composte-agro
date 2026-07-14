'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Joyride } from 'react-joyride'
import { supabase } from '@/lib/supabase/client'

const clientSteps = [
  {
    target: 'body',
    placement: 'center',
    title: 'Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Trouvez produits, materiel et services pres de chez vous.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Parcourir le catalogue',
    content: 'Explorez des milliers d\'annonces de produits et services agricoles. Utilisez la recherche et les filtres pour trouver ce qu\'il vous faut.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Creer une annonce',
    content: 'Publiez votre demande gratuitement en quelques clics depuis le bouton "Deposer une annonce".',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Suivre vos commandes',
    content: 'Retrouvez vos achats et suivez vos commandes depuis votre tableau de bord.',
  },
]

const vendeurSteps = [
  {
    target: 'body',
    placement: 'center',
    title: 'Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Vendez vos produits directement aux acheteurs.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Ajouter un produit',
    content: 'Creez votre catalogue en quelques clics : photo, prix, stock, localisation.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Gerer les commandes',
    content: 'Consultez et gerez les commandes de vos clients depuis votre tableau de bord.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Suivre vos ventes',
    content: 'Visualisez vos statistiques de vente et le nombre de vues de vos produits.',
  },
]

const prestataireSteps = [
  {
    target: 'body',
    placement: 'center',
    title: 'Bienvenue sur Composte',
    content: 'Plateforme agricole numero 1 au Congo. Proposez vos services aux agriculteurs.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Proposer un service',
    content: 'Creez votre carte de service : prestation, tarif, zone d\'intervention.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Gerer les missions',
    content: 'Suivez les demandes de service et gerez vos missions depuis le tableau de bord.',
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Suivre vos paiements',
    content: 'Consultez l\'historique de vos paiements et le suivi de vos prestations.',
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
      const timer = setTimeout(() => setRun(true), 600)
      return () => clearTimeout(timer)
    }
  }, [user])

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem('has_seen_onboarding')
      setKey(k => k + 1)
      setTimeout(() => setRun(true), 300)
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
      hideBackButton
      disableOverlayClose={false}
      locale={{
        last: 'Terminer',
        next: 'Suivant',
        skip: 'Passer',
      }}
      styles={{
        options: {
          primaryColor: '#73BF44',
          textColor: '#1e293b',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          width: 400,
          zIndex: 1000,
        },
        buttonNext: {
          backgroundColor: '#73BF44',
          color: '#fff',
          borderRadius: '0.75rem',
          padding: '8px 20px',
          fontSize: '14px',
          fontWeight: 600,
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 500,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltip: {
          borderRadius: '1rem',
          padding: '24px',
        },
        title: {
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '8px',
          color: '#0D4926',
        },
        content: {
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#475569',
        },
      }}
    />
  )
}
