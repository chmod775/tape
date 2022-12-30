function GeneratePrimes(maxValue)
{
 if (maxValue < 2)
 {
  return [];
 }
 var primes = [];
 primes.push(2);
 for (var i = 3; i <= maxValue; i = i + 2)
 {
  var isPrime = true;
  for (var j = 2; j <= Math.sqrt(i); j = j + 1)
  {
   if (i % j == 0)
   {
    isPrime = false;
    break;
   }
  }
  if (isPrime == true)
  {
   primes.push(i);
  }
 }
 return primes;
}
var primes = GeneratePrimes(100)
for (let item of primes)
{
 console.log(item);
}