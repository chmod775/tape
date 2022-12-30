List<Int32> GeneratePrimes(Int32 maxValue)
{
 if (maxValue < 2)
 {
  return new List<Int32>(){};
 }
 List<Int32> primes = new List<Int32>(){};
 primes.Add(2);
 for (Int32 i = 3; i <= maxValue; i = i + 2)
 {
  bool isPrime = true;
  for (Int32 j = 2; j <= Math.Sqrt(i); j = j + 1)
  {
   if (i % j == 0)
   {
    isPrime = false;
    break;
   }
  }
  if (isPrime == true)
  {
   primes.Add(i);
  }
 }
 return primes;
}
List<Int32> primes = GeneratePrimes(100)
foreach (var item of primes)
{
 Console.Write(item);
}