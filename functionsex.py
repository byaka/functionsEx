# -*- coding: utf-8 -*-
import string,sys,sha,zipfile,os,datetime,time,json
ucodes={'\\u0430': 'а','\\u0410': 'А','\\u0431': 'б','\\u0411': 'Б','\\u0432': 'в','\\u0412': 'В','\\u0433': 'г','\\u0413': 'Г','\\u0434': 'д','\\u0414': 'Д','\\u0435': 'е','\\u0415': 'Е','\\u0451': 'ё','\\u0401': 'Ё','\\u0436': 'ж','\\u0416': 'Ж','\\u0437': 'з','\\u0417': 'З','\\u0438': 'и','\\u0418': 'И','\\u0439': 'й','\\u0419': 'Й','\\u043a': 'к','\\u041a': 'К','\\u043b': 'л','\\u041b': 'Л','\\u043c': 'м','\\u041c': 'М','\\u043d': 'н','\\u041d': 'Н','\\u043e': 'о','\\u041e': 'О','\\u043f': 'п','\\u041f': 'П','\\u0440': 'р','\\u0420': 'Р','\\u0441': 'с','\\u0421': 'С','\\u0442': 'т','\\u0422': 'Т','\\u0443': 'у','\\u0423': 'У','\\u0444': 'ф','\\u0424': 'Ф','\\u0445': 'х','\\u0425': 'Х','\\u0446': 'ц','\\u0426': 'Ц','\\u0447': 'ч','\\u0427': 'Ч','\\u0448': 'ш','\\u0428': 'Ш','\\u0449': 'щ','\\u0429': 'Щ','\\u044a': 'ъ','\\u042a': 'Ъ','\\u044b': 'ы','\\u042b': 'Ы','\\u044c': 'ь','\\u042c': 'Ь','\\u044d': 'э','\\u042d': 'Э','\\u044e': 'ю','\\u042e': 'Ю','\\u044f': 'я','\\u042f': 'Я'}
getsett_i1=-1
getsett_i2=-1

class magicDict(dict):
#Реализация объектов-словарей, как в Javascript
   __getattr__=dict.__getitem__
   __setattr__=dict.__setitem__
   __delattr__=dict.__delitem__

def stwch_mark():
   stwch['value']=getms()
   return stwch['value']

def stwch_show(prnt=True,save=True):
   s=getms()
   if prnt: print s-stwch['value']
   if save: stwch['value']=s
   return s-stwch['value']

stwch=magicDict({'mark':stwch_mark,'value':None,'show':stwch_show})

def s2d(s,format):
   return datetime.datetime.fromtimestamp(time.mktime(time.strptime(s,format)))

def arrUnique(arr):
   if arr==None: return []
   tarr={}
   for e in arr: tarr[e]=0
   return tarr.keys()

def isArray(var):
   return isinstance(var,(list,tuple))

def udecode(text):
   for u in ucodes.keys(): text=text.replace(u,ucodes[u])
   return text

def reprEx(obj):
   return json.dumps(obj,separators=(',',':'),ensure_ascii=False).encode('utf-8')

def utime():
   return timenum(datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S'))

def unixtotime(unix,format='%H:%M:%S'):
   return time.strftime(format,time.localtime(int(unix)))

def numex(val):
   try: s=int(val)
   except:
      try: s=float(val)
      except: s=val
   return s

def getms():
   return round(time.clock()*1000)
   
def timeto(text,to='s'):
   tarr=text.split(':')
   if to=='s': s=int(tarr[0])*3600+int(tarr[1])*60+int(tarr[2])
   if to=='m': s=int(tarr[0])*60+int(tarr[1])+int(tarr[2])/60
   return s

def timenum(text,format='%d/%m/%Y %H:%M:%S'):
   t0=datetime.datetime.strptime(text,format)
   t1=time.mktime(t0.timetuple())
   return round(t1)

def clearconsole():
   if sys.platform=='win32': os.system('cls')
   else: os.system('clear')

def sha1(text):
    c=sha.new(text)
    s=c.hexdigest()
    return s

def getval(arr,key,clear=False):
   try: return arr[key]
   except:
      if clear==False: return None
      return ''

def findex(hsh,what,index=0,sep1='|',sep2='^'):
#ищет по всем вхождениям искомого в тексте особого формата (хеше)
   outarr=[]
   w=sep1+what+sep2
   l=len(w)
   ind=hsh.find(w,index)
   while ind!=-1:
      s=hsh.find(sep1,ind+l+1)
      outarr.append(hsh[ind+l:s])
      ind=hsh.find(w,ind+l+1)
   return outarr

def index(arr,val):
   try: arr.index(val)
   except: return -1

def fileget(path,method='r'):
   path=path.encode('cp1251')
   if os.path.isfile(path)==False: return None
   if zipfile.is_zipfile(path):
      c=zipfile.ZipFile(path,method)
      try:
         s=c.read('out.txt')
      except KeyError:
         error('reading zip file '+path)
      c.close()
   else:
      c=open(path,method)
      s=c.read()
      c.close()
   return s

def error(text,isexit=True):
    print 'ERROR: '+text
    if isexit==True: sys.exit(0)

def getsett(text,ss,si,es):
   global getsett_i1,getsett_i2
   if text==None: return None
   if ss==None: return None
   if es==None: return None
   text1=text.lower()
   ss=ss.lower()
   es=es.lower()
   if ss!='': getsett_i1=text1.find(ss,si)
   else: getsett_i1=si
   if getsett_i1==-1: return None
   if es!='': getsett_i2=text1.find(es,getsett_i1+len(ss))
   else: getsett_i2=len(text1)
   if getsett_i2==-1: return None
   return text[getsett_i1+len(ss):getsett_i2]

def strtodict(params,sep1,sep2):
    tarr1=params.split(sep1)
    tarr2={}
    for s in tarr1:
        s1=getsett(s,'',0,sep2)
        s2=getsett(s,sep2,0,'')
        if s1!=-1 and s2!=-1: tarr2[s1]=s2
    return tarr2

def arradd(arr,vals):
#добавляет в многомерный массив 'arr' значения из многомерного массива 'vals' синхронно
#если значения массива 'vals' сами являютсю массивами-их длинна дожна быть одинаковой
#они также добавятся синхронно
   if len(vals)!=len(arr): return None
   tarr1=arr[:]
   l0=None
   for i in xrange(len(vals)):
      if isarray(vals[i]):
         if l0==None: l0=len(vals[i])
         elif l0!=len(vals[i]): return None
         l0=len(vals[i])
         for j in xrange(l0): tarr1[i].append(vals[i][j])
      elif l0!=None: return None
      else: tarr1[i].append(vals[i])
   return tarr1

def arrtonum(arr,clean=False,sub=True):
   if isarray(arr)==False: return arr
   if len(arr)==0: return []
   tarr=[]
   for i in xrange(len(arr)):
      if sub and isarray(arr[i]): tarr.append(arrtonum(arr[i],clean,False))
      else:
         if clean:
            if arr[i]!='': tarr.append(numex(arr[i]))
         else:
            tarr.append(numex(arr[i]))
   return tarr

def splitex(val,s1=',',s2='.',totype=None):
   if val==None: return[]
   tarr1=val.split(s1)
   if s2!=None:
      for i in xrange(len(tarr1)):
         tarr2=tarr1[i].split(s2)
         if len(tarr2)>1: tarr1[i]=tarr2
   if totype=='num': tarr1=arrtonum(tarr1)
   return tarr1

def arrcreate(s1,s2,val):
   tarr=[]
   for i in xrange(s1):
      tarr.append([])
      for j in xrange(s2):
         tarr[i].append(val)
   return tarr

def arrcheck(arr):
   tarr=[]
   for s in arr:
      if s!='' and s!=None: tarr.append(s)
   return tarr

def diffdate(date1,date2,format):
   d1=s2d(date1,format)
   d2=s2d(date2,format)
   dd=d1-d2
   return dd.strftime("%d")

def todate(wait):
   if wait=='': return None
   wait=float(wait)
   s=datetime.datetime.now()+datetime.timedelta(seconds=3600*24*wait)
   return s.strftime('%d.%m.%Y')

def join(arr,sep1=',',sep2='.',fillnull=True):
   s=''
   for arri in arr:
      if isarray(arri): s+=join(arri,sep2)+sep1
      else:
         if fillnull and arri==None: s+=sep1
         else: s+=str(arri)+sep1
   return s[0:len(s)-1] if len(s)>0 else ''

def dict2arr(arr,keys):
   tarr0=[]
   for i in keys: tarr0.append(arr[i])
   return tarr0

def arr2dict(arr,keys):
   tarr0={}
   for i in xrange(len(keys)): tarr0[keys[i]]=arr[i]
   return tarr0















