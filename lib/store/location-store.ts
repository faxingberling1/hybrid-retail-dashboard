import { create } from 'zustand'

interface LocationStore {
  address: string
  isLoading: boolean
  error: string | null
  setAddress: (address: string) => void
  fetchLocation: () => Promise<void>
}

export const useLocationStore = create<LocationStore>((set) => ({
  address: 'Select Location',
  isLoading: false,
  error: null,
  setAddress: (address) => set({ address }),
  fetchLocation: async () => {
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
      
      // Use OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      if (!response.ok) throw new Error('Failed to fetch address')
      
      const data = await response.json()
      
      // Extract a sensible short address (e.g., neighborhood + city, or road + city)
      const addressParts = data.address
      const shortAddress = addressParts.suburb || addressParts.neighbourhood || addressParts.road || addressParts.city || 'Current Location'
      const city = addressParts.city || addressParts.town || addressParts.village || ''
      
      const finalAddress = city ? `${shortAddress}, ${city}` : shortAddress

      set({ address: finalAddress, isLoading: false })
    } catch (error) {
      console.error('Error fetching location:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get location', 
        isLoading: false,
        address: 'Location Unavailable'
      })
    }
  }
}))
