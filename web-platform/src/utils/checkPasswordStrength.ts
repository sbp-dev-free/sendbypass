export const checkPasswordStrength = (password: string): string => {
  if (password?.length < 8) {
    return "Weak";
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCriteria = [
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;

  if (strengthCriteria === 4) {
    return "Very Strong";
  }
  if (strengthCriteria === 3) {
    return "Strong";
  }
  if (strengthCriteria === 2) {
    return "Moderate";
  }

  return "Weak";
};
