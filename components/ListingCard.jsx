'use client'
import { ClipboardList, MapPin, User, Sprout, Calendar, Clock, ChevronRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, getRelativeTime, getCategoryById } from '@/lib/categories'

function getAdTitle(ad) { return ad.title || ad.titre || ad.nom || '' }
function getAdPrice(ad) { return ad.price ?? ad.prix_unitaire ?? ad.tarif_base ?? null }
function getAdCommune(ad) { return ad._commune || ad.localite || '' }
function getAdDepartement(ad) { return ad._departement || ad.departement || '' }
function getAdVendeur(ad) { return ad._profile?.nom_complet || 'Particulier' }
function getAdCreated(ad) { return ad.created_at || ad.createdAt || '' }

const ListingCard = ({ ad }) => {
  const cat = getCategoryById(ad.category_id)

  return (
    <Link href={`/ad/${ad.id}`} className="relative block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex">
        <div className="w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 shrink-0" />

        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 px-2.5 py-1 rounded-full shadow-sm">
                  <ClipboardList size={12} /> Demande client
                </span>
                {cat && (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{cat.nom}</span>
                )}
                {ad.is_pre_sale && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-[11px] font-semibold">
                    <Sprout size={11} /> Pré-vente
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">{getAdTitle(ad)}</h3>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-slate-500">
                {getAdPrice(ad) != null && (
                  <span className="text-lg font-bold text-emerald-600 tracking-tight">{formatPrice(getAdPrice(ad))}</span>
                )}
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" /> {getAdVendeur(ad)}
                </span>
                {(getAdCommune(ad) || getAdDepartement(ad)) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" /> {getAdCommune(ad) || getAdDepartement(ad)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> {getRelativeTime(getAdCreated(ad))}
                </span>
                {ad.harvest_date && (
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <Calendar size={13} /> Récolte : {new Date(ad.harvest_date).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-1.5 pt-1">
              <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 px-4 py-2 rounded-xl transition-all group-hover:shadow-sm">
                Voir <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <MessageCircle size={12} /> Contacter
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ListingCard
