'use client'
import { Tractor, Beef, MapPin, Sprout, Apple, Wrench, Shovel, Cog, Wheat, Droplets, Warehouse, Truck } from 'lucide-react'

const iconMap = {
  tractor: Tractor,
  cow: Beef,
  fields: MapPin,
  seedling: Sprout,
  basket: Apple,
  wrench: Wrench,
  shovel: Shovel,
  gear: Cog,
  hay: Wheat,
  droplet: Droplets,
  barn: Warehouse,
  truck: Truck,
}

export function getCategoryIcon(icone) {
  return iconMap[icone] || Tractor
}
