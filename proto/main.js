function foo(n1,n2)
{
 var t;
 if (n1 < n2)
 {
  t = n1
  n1 = n2
  n2 = t
 }
 var c = n1 + n2;
 return c;
}
class car {
 foo(n1,n2)
 {
  var t;
  if (n1 < n2)
  {
   t = n1
   n1 = n2
   n2 = t
  }
  var c = n1 + n2;
  return c;
 }
}

var a = new car();
console.log(a.foo(1, 2));