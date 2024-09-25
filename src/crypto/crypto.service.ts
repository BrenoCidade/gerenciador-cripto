import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptoService {
  async getCryptoPrice(symbol: string): Promise<number> {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    return response.data[symbol]?.usd || 0;
  }
}