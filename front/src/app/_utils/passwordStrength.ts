export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  if (password?.length >= 8) {
    strength += 25;
  } else {
    strength += (password?.length / 8) * 25;
  }

  if (/[a-z]/.test(password)) {
    strength += 15;
  }

  if (/[A-Z]/.test(password)) {
    strength += 15;
  }

  if (/\d/.test(password)) {
    strength += 25;
  }

  if (/[\W_]/.test(password)) {
    strength += 25;
  }

  return Math.max(0, Math.min(100, strength));
};
