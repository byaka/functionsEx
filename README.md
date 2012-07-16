#**Some useful functions.**

###For Python:


###For javaScript:
1. **`base64encode(str)`** *convert string(or for example IMAGE) to base64*;
2. **`randomEx(mult,vals,pref,suf)`** *create a random value in 0..mult, not in array(vals) and in format pref+random_value+suf*;
3. **`cloneMe(obj)`** *return a full clone of object (can't clone functions!)*;
4. **`Array.inOf(val,from)`** *return index of val in 1..array.length or 0 if not found*;
5. **`Array.average(mode)`** *return arithmetic or geometric (if mode=true) average of elements*;
6. **`Array.max()`** *return max element*;
7. **`Array.min()`** *return min element*;
8. **`Array.inObj(key,val)`** *work with array of objects. return index in 0..array.length-1 of key:val*;
9. **`Array.del(ind)`** *delete element by index*;
10. **`Array.delex(val)`** *delete element by value*;
11. **`String.capital()`** *return capitalized string*;
12. **`isArray(o), isFunction(o), isObject(o), isString(o)`** *check for specified type*;
13. **`String.get(pref,end,from)`** *return pattern by format pref+pattenr+suf*;
14. **`getms()`** *return current date and time in milliseconds*;
15. **`Array.unique()`** *return array without repeating of elements*;
16. **`reRound(val,to,asfloat)`** *return corrected value in -to..to and rounded if asfloat!=true*;
16. **`reAngle(val,to,asfloat)`** *return corrected angle in 1..360*;
17. **`getChecked(obj,whatreturn)`** *work with array or jquery's object. return [whatreturn] of [checked] object*;