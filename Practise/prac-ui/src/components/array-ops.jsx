const stocks = [
    {symbol: 'NTPC' , price: 360, change: 2.5},
    {symbol: 'SBI' , price: 756, change: -0.5},
    {symbol: 'HDFC' , price: 970, change: -1.2},
    {symbol: 'APL APOLLO' , price: 240, change: 1.6}
]

// 1. Filter this array to display stocks that returned positive for the day 
const positiveStocks = stocks.filter(stock=> stock.change >0 ) ; 
// Logic : if(stock.change >0) -- true - the stock stays in positiveStocks array, else its ignored

positiveStocks.forEach(s=> console.log(`${s.symbol} -- ${s.change}`))

// 2. Sort in ASC and DESC Order 
// Tip: while sorting, never alter the original array : make a clone and then sort 

const asc_order_stocks = [...stocks].sort((s1,s2) => s1.price - s2.price)
//[...stocks] - clone of stocks 

asc_order_stocks.forEach(s=> console.log(s)); 
console.log("-----------------------------------")
const desc_order_stocks = [...stocks].sort((s1,s2) => s2.price - s1.price)
desc_order_stocks.forEach(s=> console.log(s)); 

// 3. Search / Find 
// Find weather a given object is available in the given array 
console.log("-----------------------------------")

const sname = 'SBI'
const stockObj =  stocks.find(s=> s.symbol == sname); 
console.log(stockObj == undefined? "Stock not found" : stockObj)