const INSECURE_DEFAULT = 'your-secret-key-change-in-production';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret === INSECURE_DEFAULT) {
      throw new Error(
        'JWT_SECRET must be set to a strong, unique value in production'
      );
    }
    return secret;
  }
  return secret || INSECURE_DEFAULT;
}
