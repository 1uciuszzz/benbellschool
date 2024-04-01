export class TokenPayload {
  /**
   * The user's ID
   */
  sub: string;
  /**
   * The user's name
   */
  name: string;
  /**
   * Token issued at
   */
  iat: number;
  /**
   * Token expiry
   */
  exp: number;
  /**
   * Token audience
   */
  aud: string;
  /**
   * Token issuer
   */
  iss: string;
}
