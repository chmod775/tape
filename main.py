from typing import List
import math

def GeneratePrimes(maxValue):
 if (maxValue < 2):
  return []
 primes = []
 primes.append(2)
 i = 3
 while (i <= maxValue):
  isPrime = True
  j = 2
  while (j <= math.sqrt(i)):
   if (i % j == 0):
    isPrime = False
    break
   j = j + 1
  if (isPrime == True):
   primes.append(i)
  i = i + 2
 return primes
print(GeneratePrimes(100))