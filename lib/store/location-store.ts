import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Address {
  id: string
  label: string
  street: string
  city: string
  phone: string
  lat?: number
  lng?: number
}

interface LocationStore {
  // Saved addresses
  addresses: Address[]
  selectedAddressId: string | null
  
  // Current active display string (fallback or derived)
  address: string
  isLoading: boolean
  error: string | null
  
  // Actions
  addAddress: (addr: Omit<Address, 'id'>) => string
  updateAddress: (id: string, addr: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  selectAddress: (id: string) => void
  
  // Legacy/GPS function
  fetchLocation: () => Promise<void>
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedAddressId: null,
      address: 'Select Location',
      isLoading: false,
      error: null,
      
      addAddress: (addr) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newAddress: Address = { ...addr, id }
        
        set((state) => ({
          addresses: [...state.addresses, newAddress],
          // If it's the first address, auto-select it
          selectedAddressId: state.selectedAddressId || id,
          // Update display string if auto-selected
          address: !state.selectedAddressId ? `${newAddress.street}, ${newAddress.city}` : state.address
        }))
        
        return id
      },
      
      updateAddress: (id, addr) => {
        set((state) => {
          const updatedAddresses = state.addresses.map(a => 
            a.id === id ? { ...addr, id } : a
          )
          
          const isSelected = state.selectedAddressId === id
          return {
            addresses: updatedAddresses,
            address: isSelected ? `${addr.street}, ${addr.city}` : state.address
          }
        })
      },
      
      removeAddress: (id) => {
        set((state) => {
          const newAddresses = state.addresses.filter(a => a.id !== id)
          let newSelectedId = state.selectedAddressId
          let newAddressDisplay = state.address
          
          if (newSelectedId === id) {
            newSelectedId = newAddresses.length > 0 ? newAddresses[0].id : null
            newAddressDisplay = newAddresses.length > 0 ? `${newAddresses[0].street}, ${newAddresses[0].city}` : 'Select Location'
          }
          
          return {
            addresses: newAddresses,
            selectedAddressId: newSelectedId,
            address: newAddressDisplay
          }
        })
      },
      
      selectAddress: (id) => {
        set((state) => {
          const addr = state.addresses.find(a => a.id === id)
          if (addr) {
            return {
              selectedAddressId: id,
              address: `${addr.street}, ${addr.city}`
            }
          }
          return state
        })
      },

      fetchLocation: async () => {
        const state = get()
        // If we already have a selected address, no need to overwrite it with GPS by default
        if (state.selectedAddressId) {
          // Just ensure the display string is correct
          const addr = state.addresses.find(a => a.id === state.selectedAddressId)
          if (addr) {
            set({ address: `${addr.street}, ${addr.city}`, isLoading: false })
            return
          }
        }

        set({ isLoading: true, error: null })
        
        if (!navigator.geolocation) {
          set({ error: 'Geolocation is not supported by your browser', isLoading: false })
          return
        }

        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            })
          })

          const { latitude, longitude } = position.coords
          
          try {
            // Use OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            if (!response.ok) throw new Error('Failed to fetch address')
            
            const data = await response.json()
            
            if (data && data.address) {
              const addressParts = data.address
              const shortAddress = addressParts.suburb || addressParts.neighbourhood || addressParts.road || addressParts.city || 'Current Location'
              const city = addressParts.city || addressParts.town || addressParts.village || ''
              
              const finalAddress = city && shortAddress !== city ? `${shortAddress}, ${city}` : shortAddress

              set({ address: finalAddress, isLoading: false })
              return
            }
          } catch (geocodingError) {
            console.warn('Reverse geocoding failed, falling back to coordinates:', geocodingError)
          }

          // Fallback if reverse geocoding fails or returns no address
          set({ address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`, isLoading: false })

        } catch (error: any) {
          // Remove console.error to prevent Next.js dev overlay from showing up for expected user denials
          // console.warn('Location fetch failed:', error)
          
          let errorMessage = 'Failed to get location'
          if (error && error.code === 1) {
            errorMessage = 'Location permission denied'
          } else if (error && error.code === 2) {
            errorMessage = 'Location unavailable'
          } else if (error && error.code === 3) {
            errorMessage = 'Location request timed out'
          } else if (error?.message) {
            errorMessage = error.message
          }

          set({ 
            error: errorMessage, 
            isLoading: false,
            address: 'Location Unavailable'
          })
        }
      }
    }),
    {
      name: 'hybrid-retail-location',
    }
  )
)
