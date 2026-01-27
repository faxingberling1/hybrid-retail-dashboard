export class ValidationUtils {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Phone number validation (basic international format)
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }
  
  // IP address validation
  static isValidIpAddress(ip: string): boolean {
    // IPv4 with optional CIDR
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
    
    if (!ipv4Regex.test(ip)) return false
    
    // Check each octet
    const parts = ip.split('/')[0].split('.')
    return parts.every(part => {
      const num = parseInt(part, 10)
      return num >= 0 && num <= 255
    })
  }
  
  // Name validation
  static isValidName(name: string): { valid: boolean; message?: string } {
    if (!name.trim()) {
      return { valid: false, message: 'Name is required' }
    }
    
    if (name.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' }
    }
    
    if (name.length > 50) {
      return { valid: false, message: 'Name cannot exceed 50 characters' }
    }
    
    return { valid: true }
  }
  
  // Bio validation
  static isValidBio(bio: string): { valid: boolean; message?: string } {
    if (bio.length > 500) {
      return { valid: false, message: 'Bio cannot exceed 500 characters' }
    }
    
    return { valid: true }
  }
  
  // Session timeout validation
  static isValidSessionTimeout(timeout: number): { valid: boolean; message?: string } {
    if (timeout < 0) {
      return { valid: false, message: 'Session timeout cannot be negative' }
    }
    
    if (timeout > 1440) {
      return { valid: false, message: 'Session timeout cannot exceed 24 hours' }
    }
    
    return { valid: true }
  }
  
  // Password expiry validation
  static isValidPasswordExpiry(expiry: number): { valid: boolean; message?: string } {
    if (expiry < 0) {
      return { valid: false, message: 'Password expiry cannot be negative' }
    }
    
    if (expiry > 365) {
      return { valid: false, message: 'Password expiry cannot exceed 1 year' }
    }
    
    return { valid: true }
  }
  
  // Max login attempts validation
  static isValidMaxLoginAttempts(attempts: number): { valid: boolean; message?: string } {
    if (attempts < 1) {
      return { valid: false, message: 'Must be at least 1' }
    }
    
    if (attempts > 10) {
      return { valid: false, message: 'Cannot exceed 10' }
    }
    
    return { valid: true }
  }
  
  // Color validation
  static isValidHexColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  }
}

// Form field validation decorator
export function validateField(
  validator: (value: any) => { valid: boolean; message?: string },
  errorKey: string
) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = function(...args: any[]) {
      const value = args[0]
      const result = validator(value)
      
      if (!result.valid) {
        // If store has setError method
        if (this.setError) {
          this.setError(errorKey, result.message || 'Invalid value')
        }
        return false
      }
      
      // Clear error if valid
      if (this.setError && this.errors?.[errorKey]) {
        this.setError(errorKey, '')
      }
      
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}