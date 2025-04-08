import axios from 'axios';

// Fyers API configuration
const FYERS_API_BASE_URL = 'https://api.fyers.in/api/v2';
const APP_ID = process.env.FYERS_APP_ID || '';
const APP_SECRET = process.env.FYERS_APP_SECRET || '';
const REDIRECT_URL = window.location.origin + '/auth-callback';

interface FyersTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface FyersQuote {
  symbol: string;
  ltp: number;
  change: number;
  change_percentage: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Service for interacting with the Fyers trading API
 */
class FyersService {
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  /**
   * Initialize the Fyers authentication flow
   * @returns URL to redirect the user for authentication
   */
  public getAuthUrl(): string {
    // Generate a random state for security
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('fyers_auth_state', state);
    
    // Construct the authentication URL
    const authUrl = `https://api.fyers.in/api/v2/generate-authcode?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&state=${state}`;
    
    return authUrl;
  }

  /**
   * Exchange authorization code for access token
   * @param code The authorization code from Fyers
   * @returns Promise resolving to the authentication result
   */
  public async getAccessToken(code: string): Promise<boolean> {
    try {
      const response = await axios.post<FyersTokenResponse>(`${FYERS_API_BASE_URL}/token`, {
        grant_type: 'authorization_code',
        code,
        client_id: APP_ID,
        client_secret: APP_SECRET,
        redirect_uri: REDIRECT_URL
      });
      
      this.accessToken = response.data.access_token;
      // Store token expiry time (current time + expires_in seconds)
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      // Save tokens to local storage
      localStorage.setItem('fyers_access_token', this.accessToken);
      localStorage.setItem('fyers_token_expiry', this.tokenExpiry.toString());
      localStorage.setItem('fyers_refresh_token', response.data.refresh_token);
      
      return true;
    } catch (error) {
      console.error('Failed to get access token from Fyers', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated with Fyers
   * @returns True if authenticated and token is valid
   */
  public isAuthenticated(): boolean {
    const savedToken = localStorage.getItem('fyers_access_token');
    const savedExpiry = localStorage.getItem('fyers_token_expiry');
    
    if (savedToken && savedExpiry) {
      this.accessToken = savedToken;
      this.tokenExpiry = parseInt(savedExpiry, 10);
      
      // Check if token is expired
      if (Date.now() < this.tokenExpiry) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get market quotes for symbols
   * @param symbols Array of symbols to get quotes for
   * @returns Promise resolving to quotes data
   */
  public async getQuotes(symbols: string[]): Promise<FyersQuote[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fyers');
    }
    
    try {
      const response = await axios.get(`${FYERS_API_BASE_URL}/quotes`, {
        params: { symbols: symbols.join(',') },
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      
      return response.data.d;
    } catch (error) {
      console.error('Failed to fetch quotes from Fyers', error);
      throw error;
    }
  }

  /**
   * Place an order on Fyers
   * @param orderData Order details
   * @returns Promise resolving to order response
   */
  public async placeOrder(orderData: any): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fyers');
    }
    
    try {
      const response = await axios.post(`${FYERS_API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to place order with Fyers', error);
      throw error;
    }
  }

  /**
   * Get user's positions
   * @returns Promise resolving to positions data
   */
  public async getPositions(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fyers');
    }
    
    try {
      const response = await axios.get(`${FYERS_API_BASE_URL}/positions`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch positions from Fyers', error);
      throw error;
    }
  }

  /**
   * Log out from Fyers
   */
  public logout(): void {
    localStorage.removeItem('fyers_access_token');
    localStorage.removeItem('fyers_token_expiry');
    localStorage.removeItem('fyers_refresh_token');
    localStorage.removeItem('fyers_auth_state');
    
    this.accessToken = '';
    this.tokenExpiry = 0;
  }
}

// Export as singleton
export const fyersService = new FyersService(); 