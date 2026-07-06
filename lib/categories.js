export const categories = [
  { id: 1, nom: 'ÉLEVAGE', icone: 'cow', parentIdD: null },
  { id: 2, nom: 'INTRANTS', icone: 'seedling', parentIdD: null },
  { id: 6, nom: 'ÉQUIPEMENTS', icone: 'tractor', parentIdD: null },
  { id: 7, nom: 'AGRICULTURE', icone: 'fields', parentIdD: null },
  { id: 42, nom: 'TRANSFORMATION', icone: 'gear', parentIdD: null },
  { id: 43, nom: 'SERVICES', icone: 'wrench', parentIdD: null },
]

export function getCategoryIdByName(nom) {
  const cat = categories.find(c => c.nom === nom)
  return cat ? cat.id : null
}

export function getCategoryById(id) {
  return categories.find(c => c.id === Number(id))
}

export const regions = [
  { nom: 'Brazzaville', departements: ['Brazzaville'] },
  { nom: 'Pointe-Noire', departements: ['Pointe-Noire'] },
  { nom: 'Pool', departements: ['Pool'] },
  { nom: 'Bouenza', departements: ['Bouenza'] },
  { nom: 'Lékoumou', departements: ['Lékoumou'] },
  { nom: 'Niari', departements: ['Niari'] },
  { nom: 'Plateaux', departements: ['Plateaux'] },
  { nom: 'Cuvette', departements: ['Cuvette'] },
  { nom: 'Cuvette-Ouest', departements: ['Cuvette-Ouest'] },
  { nom: 'Sangha', departements: ['Sangha'] },
  { nom: 'Likouala', departements: ['Likouala'] },
]

export function isRootCategory(cat) {
  return cat.parentIdD === null
}

export function getRootCategories() {
  return categories.filter(c => isRootCategory(c))
}

export function getSubcategories(parentId) {
  return categories.filter(c => c.parentIdD === Number(parentId))
}

export function formatPrice(price) {
  if (price == null) return 'Prix sur demande'
  const formatted = Math.round(price).toLocaleString('fr-FR').replace(/\s/g, ' ')
  return `${formatted} FCFA`
}

export const DEPARTEMENTS = regions.flatMap(r => r.departements)

export function getRelativeTime(date) {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (hours < 1) return "À l'instant"
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem`
  return `Il y a ${Math.floor(days / 30)} mois`
}
