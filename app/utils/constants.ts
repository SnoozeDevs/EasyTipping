//* Sign up and login error messages
export const NO_EMAIL_ENTERED = 'Please enter a valid email address'
export const NO_PASSWORD_ENTERED = 'Please enter a valid password'
export const INCORRECT_PASSWORD = 'Incorrect password, please try again.'
export const EMAIL_ALREADY_IN_USE = 'Email is already being used.'
export const WEAK_PASSWORD = 'Password is too weak'
export const EMAIL_INVALID = 'Invalid email address, please try again.'


export const isEmailValid = (email: string) => {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return validRegex.test(email)
}