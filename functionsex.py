# -*- coding: utf-8 -*-
import string,sys,sha,zipfile,os,datetime,time,json,hmac,hashlib,math,random
import logging as log
log.basicConfig(format=u'%(levelname)s: [%(asctime)s] %(message)s',level=log.DEBUG)
import typehack
#with typehack we can add methods to build-in classes, as in JS!
#see code.google.com/p/typehack/source/browse/doc/readme.txt
from struct import Struct
from operator import xor
from itertools import izip,izip_longest,starmap
true=True
false=False
none=None
ucodes={'\\u0430': 'а','\\u0410': 'А','\\u0431': 'б','\\u0411': 'Б','\\u0432': 'в','\\u0412': 'В','\\u0433': 'г','\\u0413': 'Г','\\u0434': 'д','\\u0414': 'Д','\\u0435': 'е','\\u0415': 'Е','\\u0451': 'ё','\\u0401': 'Ё','\\u0436': 'ж','\\u0416': 'Ж','\\u0437': 'з','\\u0417': 'З','\\u0438': 'и','\\u0418': 'И','\\u0439': 'й','\\u0419': 'Й','\\u043a': 'к','\\u041a': 'К','\\u043b': 'л','\\u041b': 'Л','\\u043c': 'м','\\u041c': 'М','\\u043d': 'н','\\u041d': 'Н','\\u043e': 'о','\\u041e': 'О','\\u043f': 'п','\\u041f': 'П','\\u0440': 'р','\\u0420': 'Р','\\u0441': 'с','\\u0421': 'С','\\u0442': 'т','\\u0422': 'Т','\\u0443': 'у','\\u0423': 'У','\\u0444': 'ф','\\u0424': 'Ф','\\u0445': 'х','\\u0425': 'Х','\\u0446': 'ц','\\u0426': 'Ц','\\u0447': 'ч','\\u0427': 'Ч','\\u0448': 'ш','\\u0428': 'Ш','\\u0449': 'щ','\\u0429': 'Щ','\\u044a': 'ъ','\\u042a': 'Ъ','\\u044b': 'ы','\\u042b': 'Ы','\\u044c': 'ь','\\u042c': 'Ь','\\u044d': 'э','\\u042d': 'Э','\\u044e': 'ю','\\u042e': 'Ю','\\u044f': 'я','\\u042f': 'Я'}

#===================================
def logD(val): log.debug(val)
def logI(val): log.info(val)
def logE(val): log.error(val)

def pbkdf2(data,salt,iterations=1000,keylen=6,hashfunc=None):
   return pbkdf2_bin(data,salt,iterations,keylen,hashfunc).encode('hex')

def pbkdf2_bin(data,salt,iterations=1000,keylen=32,hashfunc=None):
   hashfunc=hashfunc or hashlib.sha1
   mac=hmac.new(data,None,hashfunc)
   _pack_int=Struct('>I').pack
   def _pseudorandom(x,mac=mac):
      h=mac.copy()
      h.update(x)
      return map(ord,h.digest())
   buf=[]
   for block in xrange(1,-(-keylen // mac.digest_size)+1):
      rv=u=_pseudorandom(salt+_pack_int(block))
      for i in xrange(iterations-1):
         u=_pseudorandom(''.join(map(chr,u)))
         rv=starmap(xor,izip(rv,u))
      buf.extend(rv)
   return ''.join(map(chr,buf))[:keylen]
#===================================
def pointCheck(A,B,C):
#check, if point C is on left side (>0) or right side(<0) from AB or belong AB (=0)
   return (B[0]-A[0])*(C[1]-B[1])-(B[1]-A[1])*(C[0]-B[0])

def intersectCheck(A,B,C,D):
   s1=pointCheck(A,B,C)*pointCheck(A,B,D)
   s2=pointCheck(C,D,A)*pointCheck(C,D,B)
   return [s1<=0 and s2<=0,s1,s2]

def reRound(val,to=None,asfloat=True):
   to=to or 100
   if(abs(val)<to): return val
   s=val/to
   s=(s-math.floor(s))*to
   if(not(asfloat)): s=round(s)
   return s

def reAngle(val):
   val=reRound(val,360)
   if(val<=0): val+=360
   return val
#===================================
def stopwatchMark(name='default'):
   stopwatch['value'][name]=getms()
   return stopwatch['value'][name]

def stopwatchShow(name='default',prnt=True,save=True):
   s=getms()
   v=stopwatch['value'][name]
   if prnt: print s-v
   if save: stopwatch['value'][name]=s
   return s-v
#===================================
def length(obj):
   return len(obj)
str.length=length
list.length=length

def isArray(var): 
   return isinstance(var,(list))

def isDict(var): 
   return isinstance(var,(dict))

def isSet(var): 
   return isinstance(var,(set))

def reprEx(obj):
   return json.dumps(obj,separators=(',',':'),ensure_ascii=False).encode('utf-8')

def numEX(val):
#convert string to integer. if fail, convert to float. if fail return original
   try: s=int(val)
   except:
      try: s=float(val)
      except: s=val
   return s

def getms():
#return time and date in miliseconds(UNIXTIME)
   return int(round(time.time()*1000))
   
def timeTo(text,to='s'):
#convert timestamp to $to(seconds,minutes)
   tarr=text.split(':')
   if to=='s': s=int(tarr[0])*3600+int(tarr[1])*60+int(tarr[2])
   if to=='m': s=int(tarr[0])*60+int(tarr[1])+int(tarr[2])/60
   return s

def dateComp(date1,date2,format):
#compare to dates in $format
   d1=s2d(date1,format)
   d2=s2d(date2,format)
   dd=d1-d2
   return dd.strftime("%d")

def dateIncress(wait):
#incress date by given seconds
   if wait=='': return None
   wait=float(wait)
   s=datetime.datetime.now()+datetime.timedelta(seconds=3600*24*wait)
   return s.strftime('%d.%m.%Y')

def timeNum(text,format='%d/%m/%Y %H:%M:%S'):
#convert string to time
   t0=datetime.datetime.strptime(text,format)
   t1=time.mktime(t0.timetuple())
   return round(t1)

def consoleClear():
#clear console outpur (linux,windows)
   if sys.platform=='win32': os.system('cls')
   else: os.system('clear')

def sha1(text):
#wrapper for sha1,return string
   c=sha.new(text)
   s=c.hexdigest()
   return s

def fileGet(path,method='r'):
#get content from file,using $method and if file is ZIP, read file $method in this archive
   path=path.encode('cp1251')
   if os.path.isfile(path)==False: return None
   if zipfile.is_zipfile(path):
      c=zipfile.ZipFile(path,method)
      try:
         s=c.read(method)
      except KeyError:
         error('reading zip file '+path+':'+method)
      c.close()
   else:
      c=open(path,method)
      s=c.read()
      c.close()
   return s

def error(text,exit=True,pause=False):
   print 'ERROR: '+text
   if pause: raw_input()
   if exit: sys.exit(0)

def grouper(n,obj,fill=None):
#group items by n(ABCDEFG --> ABC DEF Gxx)
   args=[iter(obj)]*n
   return izip_longest(fill=fill,*args)
#===================================
def strGet(text,pref='',suf='',index=0):
#return pattern by format pref+pattenr+suf
   if(text==''): return ''
   text1=text.lower()
   pref=pref.lower()
   suf=suf.lower()
   if pref!='': i1=text1.find(pref,index)
   else: i1=index
   if i1==-1: return None
   if suf!='': i2=text1.find(suf,i1+len(pref))
   else: i2=len(text1)
   if i2==-1: return None
   return text[i1+len(pref):i2]
str.get=strGet

def strToDict(text,sep1='=',sep2=' '):
#create dict{key:val} from string"key$sep1val$sep2"
   tarr1=text.split(sep2)
   tarr2={}
   for s in tarr1:
      s1=strGet(s,'',sep1)
      s2=strGet(s,sep1)
      if s1!=-1 and s2!=-1: tarr2[s1]=s2
   return tarr2
str.toDict=strToDict

def strUniDecode(text):
#decode unicode's things for russian,use map
   for u in ucodes.keys(): text=text.replace(u,ucodes[u])
   return text #.decode('unicode_escape')
str.uniDecode=strUniDecode

def strEscDecode(text):
#decode esc(\n,\t) things
   return repr(text).decode('string_escape')
str.escDecode=strEscDecode

def strSplitEX(text,s1=',',s2='.',totype=None):
#split string to 2 dimensions array and optional convert elements to $type
   if text==None: return[]
   tarr1=text.split(s1)
   if s2!=None:
      for i in xrange(len(tarr1)):
         tarr2=tarr1[i].split(s2)
         if len(tarr2)>1: tarr1[i]=tarr2
   if totype=='num': tarr1=arrToNum(tarr1)
   return tarr1
str.splitEX=strSplitEX

#===================================
def arrAdd(arr,vals):
#добавляет в многомерный массив 'arr' значения из многомерного массива 'vals' синхронно
#если значения массива 'vals' сами являютсю массивами-их длинна дожна быть одинаковой
#они также добавятся синхронно
   if len(vals)!=len(arr): return None
   tarr1=arr[:]
   l0=None
   for i in xrange(len(vals)):
      if isArray(vals[i]):
         if l0==None: l0=len(vals[i])
         elif l0!=len(vals[i]): return None
         l0=len(vals[i])
         for j in xrange(l0): tarr1[i].append(vals[i][j])
      elif l0!=None: return None
      else: tarr1[i].append(vals[i])
   return tarr1
list.add=arrAdd

def arrCreate(s1=2,s2=2,val=None):
#create 2 dimensions array, filled with $val
   tarr=[]
   for i in xrange(s1):
      tarr.append([])
      for j in xrange(s2):
         tarr[i].append(val)
   return tarr

def arrToDict(arr,keys):
#convert array and $keys to dict
   tarr0={}
   for i in xrange(len(keys)): tarr0[keys[i]]=arr[i]
   return tarr0
list.toDict=arrToDict

def arrJoin(arr,sep1=',',sep2='.',fillnull=True):
#join 2 dimensoins array
   s=''
   for arri in arr:
      if isArray(arri): s+=arrJoin(arri,sep2)+sep1
      else:
         if fillnull and arri==None: s+=sep1
         else: s+=str(arri)+sep1
   return s[0:len(s)-1] if len(s)>0 else ''
list.join=arrJoin

def arrClean(arr):
#clear array from empty elements
   tarr=[]
   for s in arr:
      if s!='' and s!=None: tarr.append(s)
   return tarr
list.clean=arrClean

def arrToNum(arr,clean=False,sub=True):
#convert elements to num. if $sub==true,convert subarrays too.
   if isArray(arr)==False: return arr
   if len(arr)==0: return []
   tarr=[]
   for i in xrange(len(arr)):
      if sub and isArray(arr[i]): tarr.append(arrToNum(arr[i],clean,False))
      else:
         if clean:
            if arr[i]!='': tarr.append(numEX(arr[i]))
         else:
            tarr.append(numEX(arr[i]))
   return tarr
list.toNum=arrToNum

def arrGet(arr,key,clear=False):
#get val by key from object(list,dict), and None(or '') if key not exist
   try: return arr[key]
   except:
      if clear==False: return None
      return ''
list.get=arrGet

def arrUnique(arr):
#unique elements of array
   if arr==None: return []
   tarr={}
   for e in arr: tarr[e]=0
   return tarr.keys()
list.unique=arrUnique

def dictToArr(arr,keys):
#convert dict to array and sort items by $keys
   tarr0=[]
   for i in keys: tarr0.append(arr[i])
   return tarr0
dict.toArray=dictToArr

#===================================
class magicDict(dict):
#Реализация объектов-словарей, как в Javascript
   __getattr__=dict.__getitem__
   __setattr__=dict.__setitem__
   __delattr__=dict.__delitem__

def dictToMagic(o,sub=false):
   if(sub):
      for oi in o:
         if(isDict(o[oi])): o[oi]=dictToMagic(o[oi],true)
   return magicDict(o)
dict.toMagic=dictToMagic

stopwatch=magicDict({'mark':stopwatchMark,'values':{'default':None},'show':stopwatchShow})
#===================================
class counterEx():
   val=0
   def _i(self,val=1):
      a=self.val
      self.val+=val
      return a
   def i(self,val=1):
      self.val+=val
      return self.val
   def _d(self,val=1):
      a=self.val
      self.val-=val
      return a
   def d(self,val=1):
      self.val-=val
      return self.val

if(__name__=='__main__'): raw_input()











