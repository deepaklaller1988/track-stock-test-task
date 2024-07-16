import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const stockData = await getApi()
  const trendingData = await fetchTrendingStocks()
  return (
    <>
      <Dashboard stockData={stockData} trendingData={trendingData} />
    </>
  );
}

async function getApi() {
  try {
      const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
      const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
      const data = await response.json();

      // Sort data alphabetically by symbol
      data.sort((a:any, b:any) => a.symbol.localeCompare(b.symbol));

      // Get prices for the first 5 symbols (for demonstration)
      const symbolsToFetch = data.slice(0, 5).map((stock:any) => stock.symbol);
      const prices = await getStockPrices(symbolsToFetch);

      // Combine stock data with prices
      const finalData = data.slice(0, 5).map((stock:any, index:any) => ({
          ...stock,
          price: prices[index].c, // Assuming 'c' is the current price in the returned JSON
      }));

      return finalData;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
}

async function getStockPrices(symbols:any) {
  try {
      const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
      const requests = symbols.map((symbol:any) =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
              .then(response => response.json())
      );

      const prices = await Promise.all(requests);
      return prices;
  } catch (error) {
      console.error('Error fetching stock prices:', error);
      throw error;
  }
}

async function fetchTrendingStocks() {
  try {
    const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
    const response = await fetch(`https://finnhub.io/api/v1/calendar/earnings?token=${apiKey}`);
    const data = await response.json();

    // Get the first 5 symbols from the earnings calendar
    const symbolsToFetch = data.earningsCalendar.slice(0, 5).map((stock: any) => stock.symbol);
    
    // Fetch detailed stock data for these symbols
    const finalData = await getStockDetail(symbolsToFetch);

    return finalData;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
  }
}

// Function to fetch detailed stock data for an array of symbols
async function getStockDetail(symbols: string[]) {
  try {
    const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
    
    // Fetch all stock symbols from the exchange
    const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
    const data = await response.json();

    // Sort data alphabetically by symbol
    data.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));

    // Filter the data based on the provided symbols
    const filteredData = data.filter((stock: any) => symbols.includes(stock.symbol));

    // Fetch stock prices for the filtered symbols
    const prices = await getStockPrices(symbols);

    // Combine stock data with prices
    const finalData = filteredData.map((stock: any, index: number) => ({
      ...stock,
      price: prices[index], // Assuming 'c' is the current price in the returned JSON
    }));
    return finalData;
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
}