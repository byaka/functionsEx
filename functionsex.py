# -*- coding: utf-8 -*-
import string, sys, traceback, zipfile, os, datetime, time, hmac, hashlib, math, random, re, copy, urllib2, urllib, types, decimal, inspect, subprocess, collections, _ctypes, ctypes, imp, shutil, itertools, functools, timeit, code, binascii, tempfile, errno, calendar, signal, atexit, platform  # noqa: E501, F401
try:
   import simplejson as json
except ImportError: import json
try:
   import cPickle as pickle
except ImportError: import pickle
try:
   import ujson
except ImportError: ujson=json
import os.path
from urlparse import *
from urllib import urlencode
from decimal import *

import difflib
from struct import Struct
from operator import xor
from itertools import izip, izip_longest, starmap, imap, chain, combinations, permutations  # noqa: E501, F401
from numbers import Number
from collections import Set, Mapping, deque, defaultdict, Counter, OrderedDict, namedtuple  # noqa: E501, F401

import smtplib, email
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email.MIMEImage import MIMEImage
from email.mime.audio import MIMEAudio
from email.mime.application import MIMEApplication
from email import encoders

# import typehack
# with typehack we can add methods to build-in classes, like in JS!
#? see code.google.com/p/typehack/source/browse/doc/readme.txt

timetime=time.time
datetime_now=datetime.datetime.now

mysqlEscaper=None  # библиотека pymysql блокирует патчинг через gevent, лучше импортирвоать ее на месте

global PY_V
PY_V=float(sys.version[:3])

global true, false, none, null, Null, NULL, INFINITY, infinity, Infinity

true=True
false=False
none=None

class NullUnique(object):
   def __str__(self):
      return 'Null(unique)'
NULL=Null=null=NullUnique()

INFINITY=Infinity=infinity=float('Inf')

noneStr=[None, '', "u'none'", '"none"', 'u"none"', "'none'", "u'None'", '"None"', 'u"None"', "'None'", 'none', 'None']
translitTable={u'а':'a', u'б':'b', u'в':'v', u'г':'g', u'д':'d', u'е':'e', u'ё':'e', u'ж':'zh', u'з':'z', u'и':'i', u'й':'y', u'к':'k', u'л':'l', u'м':'m', u'н':'n', u'о':'o', u'п':'p', u'р':'r', u'с':'s', u'т':'t', u'у':'u', u'ф':'f', u'х':'kh', u'ц':'ts', u'ч':'ch', u'ш':'sh', u'щ':'shch', u'ы':'y', u'ь':"'", u'ъ':"'", u'э':'e', u'ю':'yu', u'я':'ya'}  # noqa: E501
uLetters=['A','a','b','B', 'C','c', 'D','d', 'E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','U','u','R','r','S','s','T','t','V','v','W','w','X','x','Y','y','Z','z']  # noqa: E501
uLettersRu=[u'А', u'а', u'Б', u'б', u'В', u'в', u'Г', u'г', u'Д', u'д', u'Е', u'е', u'Ё', u'ё', u'Ж', u'ж', u'З', u'з', u'И', u'и', u'Й', u'й', u'К', u'к', u'Л', u'л', u'М', u'м', u'Н', u'н', u'О', u'о', u'П', u'п', u'Р', u'р', u'С', u'с', u'Т', u'т', u'У', u'у', u'Ф', u'ф', u'Х', u'х', u'Ц', u'ц', u'Ч', u'ч', u'Ш', u'ш', u'Щ', u'щ', u'Ъ', u'ъ', u'Ы', u'ы', u'Ь', u'ь', u'Э', u'э', u'Ю', u'ю', u'Я', u'я']  # noqa: E501
uPunctuations=[',','.',';',':','!','?']
uSpecials=['"',"'",'<','>','@','#','$','%','^','&','*','(',')','-','_','+','=','[',']','{','}','~','`','|']
uDash=['‐', '−', '‒', '–', '—', '―', '-']
uSpaces=[' ']
uDigits=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

ucodes={'\\u0430': 'а','\\u0410': 'А','\\u0431': 'б','\\u0411': 'Б','\\u0432': 'в','\\u0412': 'В','\\u0433': 'г','\\u0413': 'Г','\\u0434': 'д','\\u0414': 'Д','\\u0435': 'е','\\u0415': 'Е','\\u0451': 'ё','\\u0401': 'Ё','\\u0436': 'ж','\\u0416': 'Ж','\\u0437': 'з','\\u0417': 'З','\\u0438': 'и','\\u0418': 'И','\\u0439': 'й','\\u0419': 'Й','\\u043a': 'к','\\u041a': 'К','\\u043b': 'л','\\u041b': 'Л','\\u043c': 'м','\\u041c': 'М','\\u043d': 'н','\\u041d': 'Н','\\u043e': 'о','\\u041e': 'О','\\u043f': 'п','\\u041f': 'П','\\u0440': 'р','\\u0420': 'Р','\\u0441': 'с','\\u0421': 'С','\\u0442': 'т','\\u0422': 'Т','\\u0443': 'у','\\u0423': 'У','\\u0444': 'ф','\\u0424': 'Ф','\\u0445': 'х','\\u0425': 'Х','\\u0446': 'ц','\\u0426': 'Ц','\\u0447': 'ч','\\u0427': 'Ч','\\u0448': 'ш','\\u0428': 'Ш','\\u0449': 'щ','\\u0429': 'Щ','\\u044a': 'ъ','\\u042a': 'Ъ','\\u044b': 'ы','\\u042b': 'Ы','\\u044c': 'ь','\\u042c': 'Ь','\\u044d': 'э','\\u042d': 'Э','\\u044e': 'ю','\\u042e': 'Ю','\\u044f': 'я','\\u042f': 'Я'}  # noqa: E501
usymbols=uLetters+uPunctuations+uSpecials
####
uCodes=ucodes
uSymbols=usymbols

allColors=['alicemblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkochid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dodgerblue','firebrick','floralwhite','forestgreen','fushsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','honeydew','hotpink','indiandred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','ligtblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightscyblue','lightslategray','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','mahogany','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','medium','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orengered','orchid','palegoldenrod','palegreen','paleturquose','palevioletred','papayawhop','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquose','violet','wheat','white','whitesmoke','yellow','yellowgreen']
# uCodes={}
for s in uSymbols:
   c=str(hex(ord(s)))[2:]
   while len(c)<4: c='0'+c
   c='\\u'+c
   uCodes[c]=s

regExp_parseFloat=re.compile(r"-{0,1}[0-9]+([.]{0,1}[0-9]*)", re.U)
regExp_specialSymbols0=re.compile(r"[\W_]", re.U)
regExp_lettersReplace0=re.compile(r"[А-Яа-я]", re.U)
regExp_hex=re.compile(r"^[a-f0-9]*$", re.U)
regExp_htmlEncoding=re.compile(r'<meta .*?charset="?([\w-]*).*?>', re.U)
regExp_isEmail=re.compile(r'^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', re.U)
# regExp_isURL=re.compile(r'((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)', re.U)
regExp_isPassword=re.compile(r'^[\w_]{6,18}$', re.U)
regExp_anySymbol=re.compile(r'.{1}', re.U)
regExp_anyText=re.compile(r'.*', re.U)
regExp_anyWord=re.compile(r'[a-zA-Zа-яёА-ЯЁ0-9_\-]+', re.U)

_deprecatedWarningShowed={}

def deprecated(f):
   """
   Decorator for deprecated functions. Shows detailed message and writes to log (but only one time per call).
   """
   def tmp(*args, **kwargs):
      try:
         module, line, name, _=traceback.extract_stack()[-2]
         msg='>> DEPRECATED function "%s:%s()" called from %s:%s <<'%(getScriptName(f=f.func_code.co_filename, withExt=True), f.__name__, module, line)
         if msg not in _deprecatedWarningShowed:
            _deprecatedWarningShowed[msg]=None
            try:
               p='%s/functionsex_deprecatedCalls.txt'%getScriptPath(f=__file__)
               m='%s:%s <- %s:%s\n'%(f.func_code.co_filename, f.__name__, module, name)
               fileAppend(p, m)
            except Exception, e:
               print '! Cant log deprecated call to "%s": %s'%(p, e)
            if consoleIsTerminal():
               msg=consoleColor.bold+consoleColor.warning+msg+consoleColor.end
            print msg
      except Exception, e:
         print '! You call deprecated function, but decorator failed:', e
      return f(*args, **kwargs)
   return tmp
#===================================
def ClassFactory(base, extend, fixPrivateAttrs=True):
   """ Возвращает новый класс, являющийся суб-классом от `base` и цепочки `extend`. """
   extend=(base,)+tuple(extend) if extend else ()
   name='_'.join(cls.__name__ for cls in extend)
   extend=tuple(reversed(extend))
   attrs={}
   if fixPrivateAttrs:
      # фиксит специфичный для питона подход к приватным атрибутам, добавляя поддержку специальных приватные атрибуты, начинающиеся на `___` (например self.___test). к ним можно получить доступ из любого суб-класс, но не извне
      #~ оверхед для обычных приватных атрибутов отсутствует, для новых он порядка x10, такчто не стоит использовать их в критичных по скорости участках
      #? одна из потенциальных оптимизаций: отказ от замыканий `bases`, `name`, `nCache` но пока неясно как это лучше сделать
      bases=[('_%s___'%cls.__name__, len(cls.__name__)+4) for cls in extend]
      objSetM=object.__setattr__
      objGetM=object.__getattribute__
      objDelM=object.__delattr__
      nCache={}
      def tFunc_setattr(self, key, val):
         if key in nCache: key=nCache[key]
         elif '___' in key:
            for s, l in bases:
               if key[:l]!=s: continue
               k=key
               key='_'+name+'___'+key[l:]
               nCache[k]=key
               break
         return objSetM(self, key, val)
      def tFunc_getattr(self, key):
         key2=None
         if key in nCache: key2=nCache[key]
         elif '___' in key:
            for s, l in bases:
               if key[:l]!=s: continue
               key2='_'+name+'___'+key[l:]
               nCache[key]=key2
               break
         if key2:
            return objGetM(self, key2)
         else:
            raise AttributeError("'%s' object has no attribute '%s'"%(name, key))
      def tFunc_delattr(self, key):
         if key in nCache: key=nCache[key]
         elif '___' in key:
            for s, l in bases:
               if key[:l]!=s: continue
               k=key
               key='_'+name+'___'+key[l:]
               nCache[k]=key
               break
         return objDelM(self, key)
      attrs['__getattr__']=tFunc_getattr
      attrs['__setattr__']=tFunc_setattr
      attrs['__delattr__']=tFunc_delattr
   cls=type(name, extend, attrs)
   return cls
#===================================
# https://stackoverflow.com/a/40784706
# class Circularlist(object):
#    def __init__(self, size):
#       self.index = 0
#       self.size = size
#       self._data = []

#    def append(self, value):
#       if len(self._data) == self.size:
#          self._data[self.index] = value
#       else:
#          self._data.append(value)
#       self.index = (self.index + 1) % self.size

#    def __getitem__(self, key):
#       """Get element by index, relative to the current index"""
#       if len(self._data) == self.size:
#          return(self._data[(key + self.index) % self.size])
#       else:
#          return(self._data[key])

#    def __repr__(self):
#       return self._data.__repr__() + ' (' + str(len(self._data))+' items)'
#===================================
class Singleton(type):
   _instances={}
   def __call__(cls, *args, **kwargs):
      if cls not in cls._instances:
         cls._instances[cls]=super(Singleton, cls).__call__(*args, **kwargs)
      #? this allows to call `__init__` each time when class requested, but not sure how to add this configurable
      # else:
      #    cls._instances[cls].__init__(*args, **kwargs)
      return cls._instances[cls]

if PY_V<2.7:
   class deque2(collections.deque):
      """
      This class add support of <maxlen> for old deque in python2.6.
      Thx to Muhammad Alkarouri.
      http://stackoverflow.com/a/4020363
      """
      def __init__(self, iterable=(), maxlen=None):
         collections.deque.__init__(self, iterable, maxlen)
         self._maxlen=maxlen

      @property
      def maxlen(self):
         return self._maxlen
else:
   deque2=collections.deque

class CaseInsensitiveDict(dict):
   @classmethod
   def _k(cls, key):
      return key.lower() if isinstance(key, basestring) else key

   def __init__(self, *args, **kwargs):
      super(CaseInsensitiveDict, self).__init__(*args, **kwargs)
      self._convert_keys()
   def __getitem__(self, key):
      return super(CaseInsensitiveDict, self).__getitem__(self.__class__._k(key))
   def __setitem__(self, key, value):
      super(CaseInsensitiveDict, self).__setitem__(self.__class__._k(key), value)
   def __delitem__(self, key):
      return super(CaseInsensitiveDict, self).__delitem__(self.__class__._k(key))
   def __contains__(self, key):
      return super(CaseInsensitiveDict, self).__contains__(self.__class__._k(key))
   def has_key(self, key):
      return super(CaseInsensitiveDict, self).has_key(self.__class__._k(key))
   def pop(self, key, *args, **kwargs):
      return super(CaseInsensitiveDict, self).pop(self.__class__._k(key), *args, **kwargs)
   def get(self, key, *args, **kwargs):
      return super(CaseInsensitiveDict, self).get(self.__class__._k(key), *args, **kwargs)
   def setdefault(self, key, *args, **kwargs):
      return super(CaseInsensitiveDict, self).setdefault(self.__class__._k(key), *args, **kwargs)
   def update(self, E={}, **F):
      super(CaseInsensitiveDict, self).update(self.__class__(E))
      super(CaseInsensitiveDict, self).update(self.__class__(**F))
   def _convert_keys(self):
      for k in list(self.keys()):
         v = super(CaseInsensitiveDict, self).pop(k)
         self.__setitem__(k, v)

class MagicDict(dict):
   """
   Get and set values like in Javascript (dict.<key>).
   """
   def __getattr__(self, k):
      if k[:2]=='__': raise AttributeError(k)  #for support PICKLE protocol and correct isFunction() check
      return self.__getitem__(k)

   # __getattr__=dict.__getitem__
   __setattr__=dict.__setitem__
   __delattr__=dict.__delitem__
   __reduce__=dict.__reduce__
magicDict=MagicDict

class MagicDictCold(MagicDict):
   """
   Extended MagicDict, that allow freezing.
   """
   def __getattr__(self, k):
      if k=='__frozen': return object.__getattribute__(self, '__frozen')
      return MagicDict.__getattr__(self, k)

   def __freeze(self):
      object.__setattr__(self, '__frozen', True)

   def __unfreeze(self):
      object.__setattr__(self, '__frozen', False)

   def __setattr__(self, k, v):
      if getattr(self, '__frozen', None): raise RuntimeError('Frozen')
      MagicDict.__setattr__(self, k, v)

   def __setitem__(self, k, v):
      if getattr(self, '__frozen', None): raise RuntimeError('Frozen')
      MagicDict.__setitem__(self, k, v)

   def __delattr__(self, k):
      if getattr(self, '__frozen', None): raise RuntimeError('Frozen')
      MagicDict.__delattr__(self, k)

   def __delitem__(self, k):
      if getattr(self, '__frozen', None): raise RuntimeError('Frozen')
      MagicDict.__delitem__(self, k)
magicDictCold=MagicDictCold

def dict2magic(o, recursive=False):
   if recursive:
      if isArray(o) or isDict(o) or isSet(o) or isTuple(o):
         for i in (o if isDict(o) else xrange(len(o))):
            o[i]=dict2magic(o[i], recursive=True)
         if isDict(o): o=MagicDict(o)
   elif isDict(o):
      o=MagicDict(o)
   return o
dictToMagic=dict2magic
#===================================
class TemporaryDirectory(object):
   """Context manager for tempfile.mkdtemp() so it's usable with "with" statement."""
   def __enter__(self):
      self.name = tempfile.mkdtemp()
      return self.name

   def __exit__(self, *err):
      try:
         shutil.rmtree(self.name)
      except OSError as e:
         # Reraise unless ENOENT: No such file or directory
         if e.errno!=errno.ENOENT: raise getErrorRaw()
#===================================
def get_free_disk_bytes(dirname):
   """Return folder/drive free space in bytes."""
   # https://stackoverflow.com/a/2372171
   if platform.system().lower().startswith('win'):
      free_bytes = ctypes.c_ulonglong(0)
      ctypes.windll.kernel32.GetDiskFreeSpaceExW(ctypes.c_wchar_p(dirname), None, None, ctypes.pointer(free_bytes))
      return free_bytes.value
   else:
      st = os.statvfs(dirname)
      return st.f_bavail * st.f_frsize
#===================================

def parseCLI(argv=None, actionCaseSensitive=True, argCaseSensitive=False, argDefVal=None, argShortConv=None, smartType=True):
   """
   Parse CLI arguments.

   Format:
      <action> -key=value -key -key
   """
   if argv is None:
      argv=sys.argv
   if not argCaseSensitive:
      if argDefVal:
         argDefVal=dict((k.lower(), v) for k,v in argDefVal.iteritems())
      if argShortConv:
         argShortConv=dict((k.lower(), v.lower()) for k,v in argShortConv.iteritems())
   args={} if argCaseSensitive else CaseInsensitiveDict({})
   action=None
   err=RuntimeError('Incorrect arguments format, please use next: action -k1 -k2=value --key3 --key4=value')
   for i, s in enumerate(argv):
      if not i: continue  #script
      if i==1:
         # action
         if s.startswith('-'): raise err
         action=s if actionCaseSensitive else s.lower()
      elif s.startswith('-'):
         # arguments
         if '=' in s:
            s, v=s.split('=', 1)
            if not v: v=None
         else: v=None
         if not argCaseSensitive: s=s.lower()
         if not s.startswith('--'):
            k=s[1:]
            if argShortConv and k in argShortConv: k=argShortConv[k]
         else: k=s[2:]
         if v is None and argDefVal and k in argDefVal: v=argDefVal[k]
         elif smartType and isString(v):
            if v.lower() in ('true',): v=True
            elif v.lower() in ('false',): v=False
            else: v=numEx(v)
         args[k]=v
      else: raise err
   return action, args

def callIgnoreErrors(method, args=None, kwargs=None, ignoreErr=None, limit=5, sleepTime=lambda i:(1<<(i*2))/1000.0, logMethod=None, sleepMethod=None):
   # вызывает переданную функцию, отслеживая ошибки. в случае возникновения ошибки из переданного сиска типов, вызывает функцию повторно, делаю паузу между вызовами. количество попыток может быть лимитировано, пауза между ними может меняться (поумолчанию растет экспоненциально). весь процесс логируется. в случае успеха вернет результат работы функции.
   logMethod=logMethod if isFunction(logMethod) else False
   sleepMethod=sleepMethod if isFunction(sleepMethod) else False
   if not ignoreErr:
      ignoreErr=(None,)
   elif ignoreErr is True:
      ignoreErr=(Exception,)
   args=args or []
   kwargs=kwargs or {}
   _methodStr=str(method)
   _sleepTime=sleepTime if isNum(sleepTime) else None
   errI=0
   while True:
      if limit and errI>limit:
         s='Max attempts reached while call %s'%(_methodStr)
         if logMethod: logMethod(1, s)
         raise ValueError(s)
      if errI:
         if sleepMethod and sleepTime:
            s=_sleepTime or sleepTime(errI)
            if logMethod:
               logMethod(3, 'Attempt [%s] to call'%errI, _methodStr, 'with sleep(%s)'%s)
            sleepMethod(s)
         else:
            if logMethod:
               logMethod(3, 'Attempt [%s] to call'%errI, _methodStr)
      #
      try:
         return method(*args, **kwargs)
      except ignoreErr:
         if not errI and not limit:  # show warning only 1 time
            if logMethod: logMethod(2, 'No limit setted while call', _methodStr, 'this can cause infinity loop')
         errI+=1
      except Exception, e:
         if logMethod: logMethod(1, 'Unknown error while call %s: %s'%(_methodStr, getErrorInfo()))
         raise e

def bind(f, defaultsUpdate=None, globalsUpdate=None, name=None):
   """
   Returns new function, similar as <f>, but with redefined default keyword-arguments values and updated globals.

   It have similar use-cases like `functools.partial()`, but executing few times faster (with cost of longer initialisation) and also faster than original function, if you pass alot args.

   :param func f:
   :param str name:
   :param dict globalsUpdate: Update global-env for new function, but only for this function, so not modify real globals
   :param dict defaultsUpdate: Update default keyword-arguments
   """
   p={
      'name':name or f.func_name+'_BINDED',
      'code':f.func_code,
      'globals':f.func_globals,
      'argdefs':f.func_defaults,
      'closure':f.func_closure
   }
   if globalsUpdate:
      p['globals']=p['globals'].copy()
      p['globals'].update(globalsUpdate)
   if defaultsUpdate:
      _args=inspect.getargs(f.func_code)[0]
      _defsL=len(p['argdefs'])
      _offset=len(_args)-_defsL
      p['argdefs']=list(p['argdefs'])
      for i in xrange(_defsL):
         k=_args[i+_offset]
         if k in defaultsUpdate:
            p['argdefs'][i]=defaultsUpdate[k]
      p['argdefs']=tuple(p['argdefs'])
   f2=types.FunctionType(**p)
   f2.__dict__=f.__dict__
   f2.__module__=f.__module__
   f2.__doc__=f.__doc__
   if isinstance(f, types.MethodType):
      f2=types.MethodType(f2, f.im_self, f.im_class)
   return f2

class ErrorHandler(object):
   __metaclass__=Singleton

   def __init__(self, cb=None, passErrorObjectToCB=False):
      self.cb=cb or self.cbDefault
      self.passErrorObjectToCB=passErrorObjectToCB
      sys.excepthook=self.__hook

   def __hook(self, *errObj):
      if issubclass(errObj[0], KeyboardInterrupt):
         return sys.__excepthook__(*errObj)
      if self.passErrorObjectToCB:
         self.cb(errObj)
      else:
         errStr=''.join(traceback.format_exception(*errObj))
         self.cb(errStr)

   @classmethod
   def cbDefault(cls, err):
      isTerm=consoleIsTerminal()
      if isTerm:
         err=consoleColor.bold+consoleColor.red+err+consoleColor.end
      print err
      if isTerm:
         r=raw_input('Programm paused, press any key to exit\nOr type "dbg" for starting debugger\n')
         if r and r.lower()=='dbg':
            import pdb; pdb.pm()
         sys.exit(1)

   @classmethod
   def disable(cls):
      sys.excepthook=sys.__excepthook__

def selfInfo(step=-2):
   module, line, name, code=traceback.extract_stack()[step]
   return MagicDict({'module':module, 'line':line, 'name':name, 'path':getScriptPath()})

def getScriptPath(full=False, real=True, f=None):
   """
   This method return path of current script. If <full> is False return only path, else return path and file name.

   :param bool full:
   :return str:
   """
   f=f or sys.argv[0]
   if full:
      return os.path.realpath(f) if real else f
   else:
      return os.path.dirname(os.path.realpath(f) if real else f)

def getScriptName(withExt=False, f=None):
   """
   This method return name of current script. If <withExt> is True return name with extention.

   :param bool withExt:
   :return str:
   """
   f=f or sys.argv[0]
   if withExt:
      return os.path.basename(f)
   else:
      return os.path.splitext(os.path.basename(f))[0]

def iterSubClasses(cls):
   if not isinstance(cls, type):
      raise TypeError('iterSubClasses() works only for new-style Classes')
   seen=set()
   tArr1=[cls]
   while tArr1:
      now=tArr1.pop()
      try:
         tArr2=now.__subclasses__()
      except TypeError:  #fails only when cls is type
         tArr2=now.__subclasses__(now)
      for o in tArr2:
         if o not in seen:
            tArr1.append(o)
            seen.add(o)
            yield o
#===================================
def getHtml(url, tryEncode=True, followRedirect=True):
   class NoRedirection(urllib2.HTTPErrorProcessor):
      def http_response(self, request, response):
         code, msg, hdrs = response.code, response.msg, response.info()
         return response
      https_response = http_response
   if followRedirect:
      opener=urllib2.build_opener()
   else:
      opener=urllib2.build_opener(NoRedirection)
   try:
      page=opener.open(url)
      pageHtml=page.read()
   except:
      opener.close()
      return None
   if tryEncode:
      try:
         charset = re.findall('charset=(.*?)$', page.info()['Content-Type'])[0].lower()
         if charset != 'utf-8': pageHtml = pageHtml.decode(charset) #решаем проблему с кодировками
      except: pass
      pageHtml = strUniEncode(pageHtml)
   opener.close()
   return pageHtml

def getSize(obj):
   return sys.getsizeof(obj)

def getHtml2(url, followRedirect=True, headers={}, proxie=None, type='get', timeout=15, returnOnlyData=True, checkHtml=False, logHeadersBefore=False, auth=False, base64Auth=False, data={}, tryForceEncoding=False, forceEncoding=False, cookies=False, silent=False, raiseErrors=False):  # noqa
   # print url, data
   import requests
   # from requests.auth import HTTPBasicAuth
   # from requests.auth import HTTPDigestAuth
   try: #работаем с кириллическими доменами
      if re.findall('[а-яА-Я]',url) != []:
         urlArr=urlparse(url.decode('utf-8'))
         import idna
         urlDomain=idna.encode(urlArr.netloc)#.decode('utf-8')
         url=url.replace(urlArr.netloc.encode('utf-8'),urlDomain)
   except: pass  # noqa
   if proxie and len(proxie):
      if isArray(proxie):
         proxie={'http':'http://%s:%s@%s'%(arrGet(proxie,1) or '', arrGet(proxie,2) or '', proxie[0])}
      else:
         proxie={'http':'http://%s'%(proxie)}
   if base64Auth:
      import base64
      base64string = base64.encodestring('%s:%s' % (base64Auth[0], base64Auth[1]))[:-1]
      headers={"Authorization":"Basic %s" % base64string}
   if checkHtml:  #! Опять женя какуюто херню наворотил, поправить на рекурсивный вызов
      r=requests.head(url, allow_redirects=followRedirect, headers=headers, timeout=timeout, proxies=proxie)
      # if r.status_code != 200:
      #    return magicDict({'status':r.status_code})
      try: contentType=r.headers['content-type'].split(';')[0]
      except: contentType='text/html'  # noqa
      if contentType!='text/html':
         return magicDict({'status':r.status_code, 'contentType':contentType})
   if auth:
      if isArray(auth):
         auth=(auth[0], auth[1])
      else:
         auth=('BuberStats','76d3ca8d538bc44bd5a5aa0c316ff428')
   else: auth=None
   # select request's method
   args={'allow_redirects':followRedirect, 'headers':headers, 'timeout':timeout, 'proxies':proxie, 'stream':logHeadersBefore, 'auth':auth, 'cookies':cookies}
   if type in ('get', 'post', 'head'):
      m=getattr(requests, type)
      if type=='post': args['data']=data
   else:
      raise NotImplementedError('! GetHtml2 not provide "%s" request method'%type)
   # send request
   try:
      # r=requests.get(url, allow_redirects=followRedirect, headers=headers, timeout=timeout, proxies=proxie, stream=logHeadersBefore, auth=auth, cookies=cookies)
      # r=requests.post(url, data=data, allow_redirects=followRedirect, headers=headers, timeout=timeout, proxies=proxie, stream=logHeadersBefore, auth=auth, cookies=cookies)
      r=m(url, **args)
      if logHeadersBefore: print_r(dict(r.headers))
   except Exception, e:
      if not silent:
         print '!!! GetHtml2 error:', e
      if raiseErrors: raise e
      return None if returnOnlyData else magicDict({'data':None, 'status':e, 'url':url, 'response':None})
   try:
      contentType=r.headers['content-type'].split(';')[0]
   except: contentType=None  # noqa

   text=r.text
   if forceEncoding or (tryForceEncoding and (r.encoding=='ISO-8859-1' or not r.encoding)):
      #ISO-8859-1 проставляется, если сервер не отдал кодировку
      try:
         if r.apparent_encoding:
            enc=r.apparent_encoding
         else:  #ищем кодировку в теле ответа
            enc=regExp_htmlEncoding.search(text).group(1)
         r.encoding=enc
         text=r.text  #перекодируем ответ в правильной кодировке
      except: pass  # noqa
   if returnOnlyData: return text
   else:
      headersArr=dict(r.headers)
      try: cookieArr=dict(r.cookies)
      except Exception, e:
         print '! GetHtml2 cant extract cookies: %s. Headers: %s'%(e, headersArr)
         cookieArr={}
      enc=r.encoding.lower() if r.encoding else None
      enc2=r.apparent_encoding.lower() if r.apparent_encoding else None
      return magicDict({'data':text, 'encoding':enc, 'encoding2':enc2, 'status':r.status_code, 'contentType':contentType, 'response':r, 'url':r.url, 'cookies':cookieArr, 'headers':headersArr})
#===================================
def pbkdf2hmac(data, salt, iterations=10000, hashfunc='sha256', keylen=None):
   #wrapper for pbkdf2hmac
   try:
      c=hashlib.pbkdf2_hmac(hashfunc, data, salt, iterations, dklen=keylen)
   except UnicodeEncodeError:
      c=hashlib.pbkdf2_hmac(hashfunc, data, salt, iterations, dklen=keylen)
   return binascii.hexlify(c)

@deprecated
def pbkdf2(data, salt, iterations=1000, keylen=6, hashfunc=None):
   return pbkdf2_bin(data, salt, iterations, keylen, hashfunc).encode('hex')

def pbkdf2_bin(data, salt, iterations=1000, keylen=32, hashfunc=None):
   hashfunc=hashfunc or hashlib.sha256
   mac=hmac.new(data, None, hashfunc)
   _pack_int=Struct('>I').pack
   def _pseudorandom(x, mac=mac):
      h=mac.copy()
      h.update(x)
      return map(ord, h.digest())
   buf=[]
   for block in xrange(1, -(-keylen // mac.digest_size)+1):
      rv=u=_pseudorandom(salt+_pack_int(block))
      for i in xrange(iterations-1):
         u=_pseudorandom(''.join(map(chr, u)))
         rv=starmap(xor, izip(rv, u))
      buf.extend(rv)
   return ''.join(map(chr, buf))[:keylen]

def aesEncrypt(data, password, enc="utf-8"):
   cmd=('openssl', 'enc', '-base64', '-e', '-aes-256-cbc', '-nosalt', '-pass', 'pass:%s'%password)
   res=runExternal(cmd, data=data, enc=enc)
   res=res[:-1]  #returned data ended with linebreak
   return res

def aesDecrypt(data, password, enc="utf-8"):
   cmd=('openssl', 'enc', '-base64', '-d', '-aes-256-cbc', '-nosalt', '-pass', 'pass:%s'%password)
   res=runExternal(cmd, data=data, enc=enc)
   res=res[:-1]  #returned data ended with linebreak
   return res

def sha1(text):
   #wrapper for sha1
   try: c=hashlib.sha1(text)
   except UnicodeEncodeError: c=hashlib.sha1(strUniDecode(text))
   return c.hexdigest()

def sha224(text):
   #wrapper for sha224
   try: c=hashlib.sha224(text)
   except UnicodeEncodeError: c=hashlib.sha224(strUniDecode(text))
   return c.hexdigest()

#? look at this implementation https://github.com/BIDS/sha256
def sha256(text):
   #wrapper for sha256
   try: c=hashlib.sha256(text)
   except UnicodeEncodeError: c=hashlib.sha256(strUniDecode(text))
   return c.hexdigest()

def sha384(text):
   #wrapper for sha384
   try: c=hashlib.sha384(text)
   except UnicodeEncodeError: c=hashlib.sha384(strUniDecode(text))
   return c.hexdigest()

def sha512(text):
   #wrapper for sha512
   try: c=hashlib.sha512(text)
   except UnicodeEncodeError: c=hashlib.sha512(strUniDecode(text))
   return c.hexdigest()

def md5(text):
   #wrapper for md5
   try: c=hashlib.md5(text)
   except UnicodeEncodeError: c=hashlib.md5(strUniDecode(text))
   return c.hexdigest()
#===================================
def randomEx_default_soLong(mult, vals, pref, suf, i):
   if i>100:
      raise OverflowError('randomeEx generating so long (%s attempts)'%i)
   print '!! randomEx: generating value so long for (%s, %s, %s), attempt %s to incress range'%(pref, mult, suf, i)
   if randomEx_default_soLong.sleepMethod:
      randomEx_default_soLong.sleepMethod(0.1)
   return mult*2
randomEx_default_soLong.sleepMethod=None

def randomEx(mult=None, vals=None, pref='', suf='', soLong=0.01, cbSoLong=None):
   """
   This method generate random value from 0 to <mult> and add prefix and suffix.
   Also has protection against the repeating values and against recurrence (long generation).

   :param int|None mult: If None, 'sys.maxint' will be used.
   :param list|dict|str vals: Blacklist of generated data.
   :param str pref: Prefix.
   :param str suf: Suffix.
   :param int soLong: Max time in seconds for generating.
   :param func cbSoLong: This function will called if generating so long. It can return new <mult>. If return None, generating will be aborted.
   :return str: None if some problems or aborted.
   """
   mult=mult or sys.maxint
   soLong=soLong*1000  # to ms
   if cbSoLong is None:
      cbSoLong=randomEx_default_soLong
   vals=vals or {}
   s=None
   toStr=isString(pref) and isString(suf)
   soLong_i=0
   mytime=getms()
   while not s or s in vals:
      s=int(random.random()*mult)
      if toStr:
         s=pref+str(s)+suf
      # defence frome freeze
      if (getms()-mytime)>soLong:
         soLong_i+=1
         mytime=getms()
         if isFunction(cbSoLong):
            mult=cbSoLong(mult, vals, pref, suf, soLong_i)
            if mult is not None: continue
         return None
   return s

def everyWithEvery(arr, func, onlyIndex=False):
   for i1 in xrange(len(arr)):
      for i2 in xrange(len(arr)):
         if i1==i2: continue
         s=func(i1 if onlyIndex else arr[i1], i2 if onlyIndex else arr[i2])
         if s is False: return False
   return True
EveryWithEvery=everyWithEvery #для обратной совместимости

def intINstr(data, specialAs=None):
   # проверяет строку, чего в ней больше - букв или цифр
   try: data=data.decode('utf-8')
   except: pass
   data=data.replace(' ', '')
   if specialAs is None:
      data=regExp_specialSymbols0.sub('',data)
   elif isString(specialAs):
      data=regExp_specialSymbols0.sub('a',data)
   else:
      data=regExp_specialSymbols0.sub('0',data)
   if not len(data): return None
   data=regExp_lettersReplace0.sub('a', data)
   try:
      float(data)
      return 'int'
   except: pass
   s=sorted(data, key=lambda i: i in uDigits)
   i=len(s)/2
   if not(len(s)%2) and i<len(s)-1: i=i+1
   if s[i] in uDigits: r='iws'
   elif s[-1] in uDigits: r='swi'
   else: r='str'
   return r

def parseFloatEx(s):
   v=regExp_parseFloat.search(s)
   if not v: return 0
   return float(v.group(0))
#===================================
def pointCheck(A,B,C):
   #check, if point C is on left side (>0) or right side(<0) from AB or belong AB (=0)
   return (B[0]-A[0])*(C[1]-B[1])-(B[1]-A[1])*(C[0]-B[0])

def intersectCheck(A,B,C,D):
   s1=pointCheck(A,B,C)*pointCheck(A,B,D)
   s2=pointCheck(C,D,A)*pointCheck(C,D,B)
   return [s1<=0 and s2<=0,s1,s2]

def reRound(val, to=100, asFloat=True):
   if(abs(val)<to): return val
   s=val/to
   s=(s-math.floor(s))*to
   if not asFloat: s=int(s)
   return s

def reAngle(val):
   val=reRound(val, 360)
   if val<=0: val+=360
   return val
#===================================
def timeitMe(f, n=100, m=None):
   if m is None:
      m=3 if n>1 else 1
   _m=float(m)
   tArr1=tuple(s/_m for s in timeit.repeat(f, number=m, repeat=n))
   s='<%s> %i*%i repeats: min=%s, mid=%s, max=%s'
   print s%(f.__name__, m, n, time2human(min(tArr1), inMS=False), time2human(arrMedian(tArr1), inMS=False), time2human(max(tArr1), inMS=False))

def stopwatchMark(name='default', clear=False, wait=False, inMS=True):
   if name not in stopwatch['values'] or clear: stopwatch['values'][name]=[]
   stopwatch['values'][name].append(getms(inMS))
   if wait: stopwatch['values'][name].append(None)

def stopwatchShow(name='default', save=True, wait=False, andPrint='%s = %s', inMS=True):
   s=getms(inMS)
   vals=stopwatch['values'][name]
   v=0.0
   for i in xrange(1, len(vals)):
      if vals[i] is None or vals[i-1] is None: continue
      v+=vals[i]-vals[i-1]
   v+=s-vals[-1] if vals[-1] is not None else 0
   # print v
   if save: stopwatchMark(name=name, wait=wait, inMS=inMS)
   if andPrint and isString(andPrint): print andPrint%(name, v)
   return v

def stopwatchShowAll(includeDefault=False, andPrint='%s = %s', printSorted=True):
   v={}
   for k in stopwatch['values'].iterkeys():
      if not includeDefault and k=='default': continue
      v[k]=stopwatchShow(name=k, save=False, andPrint=False)
   stopwatch['values']={'default':[]}
   if isString(andPrint):
      for k in sorted(v.keys(), key=lambda k: v[k], reverse=True):
         print andPrint%(k, v[k])
   return v

global stopwatch
stopwatch=magicDict({
   'mark':stopwatchMark,
   'values':{'default':[]},
   'show':stopwatchShow,
   'showAll':stopwatchShowAll
})
#===================================
def isGenerator(var):
   return isinstance(var, types.GeneratorType)
isGen=isGenerator

def isFunction(var):
   return callable(var)  #respecting bugbear rule
   # return hasattr(var, '__call__')  #respecting bugbear rule
isFunc=isFunction

def isIterable(var):
   return isinstance(var, collections.Iterable)
isIter=isIterable

def isClass(var):
   return isinstance(var, (type, types.ClassType, types.TypeType))

def isInstance(var):
   #? work only with old-styled classes
   return isinstance(var, types.InstanceType)

def isModule(var):
   return isinstance(var, types.ModuleType)

def isModuleBuiltin(var):
   return imp.is_builtin(var)
   # imp.find_module(var)==imp.C_BUILTIN
   # return isModule(var) and getattr(var, '__name__', '') in sys.builtin_module_names

def isString(var):
   return isinstance(var, (str, unicode))
isStr=isString

def isBool(var):
   return isinstance(var, bool)

def isNum(var):
   return (var is not True) and (var is not False) and isinstance(var, (int, float, long, complex, decimal.Decimal))

def isFloat(var):
   return isinstance(var, (float, decimal.Decimal))

def isInt(var):
   return (var is not True) and (var is not False) and isinstance(var, int)

def isList(var):
   return isinstance(var, list)
isArray=isList

def isTuple(var):
   return isinstance(var, tuple)

def isDict(var):
   return isinstance(var, dict)
isObject=isDict

def isSet(var):
   return isinstance(var, set)

def findObjectById(s):
   """ Try to find python object by given id(object). """
   # return _ctypes.PyObj_FromPtr(s)
   return ctypes.cast(s, ctypes.py_object).value
getObjectById=findObjectById

try:  # Python 2
   _getsize_zeroDepth=(basestring, Number, xrange, bytearray)
   _getsize_iteritems='iteritems'
except NameError:  # Python 3
   _getsize_zeroDepth=(str, bytes, Number, range, bytearray)
   _getsize_iteritems='items'

def getsize(obj_0, seen=None):
   """Recursively iterate to sum size of object & members."""
   if not isSet(seen): seen=set()
   def inner(obj, _seen):
      obj_id=id(obj)
      if obj_id in _seen:
         return 0
      _seen.add(obj_id)
      size=sys.getsizeof(obj)
      if isinstance(obj, _getsize_zeroDepth):
         pass # bypass remaining control flow and return
      elif isinstance(obj, (tuple, list, Set, deque)):
         size+=sum(inner(i, _seen) for i in obj)
      elif isinstance(obj, Mapping) or hasattr(obj, _getsize_iteritems):
         try:
            tArr=getattr(obj, _getsize_iteritems)()
         except TypeError:
            tArr=()
         size+=sum(inner(k, _seen)+inner(v, _seen) for k, v in tArr)
      # Check for custom object instances - may subclass above too
      if hasattr(obj, '__dict__'):
         size+=inner(vars(obj), _seen)
      if hasattr(obj, '__slots__'):  # can have __slots__ with __dict__
         size+=sum(inner(getattr(obj, s), _seen) for s in obj.__slots__ if hasattr(obj, s))
      return size
   return inner(obj_0, seen)
#===================================
def json2generator(data, arrayKey=None):
   """
   Функция конвертирует переданный json в генератор. Это позволяет избежать утечки памяти на огромных обьемах данных. Может выдать генератор только для массива (неважно какой вложенности и сложности). arrayKey должен указывать на массив, может быть цепочкой (key1.key2)
   """
   from ijson import common
   from cStringIO import StringIO
   #? yajl2 беккенд работает значительно быстрее, но на первый сервак так и не удалось его установить, пишет "Yajl shared object cannot be found"
   try: import ijson.backends.yajl2_cffi as ijson
   except ImportError:
      try: from ijson.backends import yajl2 as ijson
      except ImportError:
         try: from ijson.backends import yajl as ijson
         except ImportError: from ijson.backends import python as ijson
   try: f=StringIO(data)
   except Exception: f=StringIO(data.encode('utf-8'))
   def _fixJSON(event):
      # функция исправляет "фичу" декодинга, Которая пытается все цифровые типы привести к decimal()
      if event[1]=='number':
         return (event[0], event[1], float(event[2]) if math.modf(event[2])[0] else int(event[2]))
      else: return event
   events=imap(_fixJSON, ijson.parse(f))
   g=common.items(events, (arrayKey+'.item' if arrayKey else 'item'))
   # g=ijson.items(f, (arrayKey+'.item' if arrayKey else 'item'))
   return g

def reprEx(obj, indent=None, toUtf8=True, sortKeys=True):
   def _fixJSON(o):
      if isinstance(o, decimal.Decimal): return str(o)  #fix Decimal conversion
      if isinstance(o, (datetime.datetime, datetime.date, datetime.time)): return o.isoformat() #fix DateTime conversion
   try:
      s=json.dumps(obj, indent=indent, separators=(',',':'), ensure_ascii=False, sort_keys=sortKeys, default=_fixJSON)
   except Exception:
      try: s=json.dumps(obj, indent=indent, separators=(',',':'), ensure_ascii=True, sort_keys=sortKeys, default=_fixJSON)
      except Exception as e:
         print '!!! reprEx', e
         return None
   if toUtf8:
      try: s=s.encode('utf-8')
      except Exception: pass
   return s

def numEx(val, forceFloat=False):
   #convert string to integer. if fail, convert to float. if fail return original
   if isString(val): val=val.strip()
   if forceFloat:
      try: return float(val)
      except Exception: return val
   try: return int(val)
   except Exception:
      try: return float(val)
      except Exception: return val
intEx=numEx

def prepDataMYSQL(data):
   """
   Функция для пред-обработки данных перед записью в базу
   """
   global mysqlEscaper
   if mysqlEscaper is None:
      try:
         import pymysql as mysqlEscaper
      except ImportError:
         import MySQLdb as mysqlEscaper
   if not isString(data):
      data=reprEx(data)
   data=mysqlEscaper.escape_string(data)
   try:data=data.decode('utf-8')
   except Exception: pass
   return data

def uLower(s):
   try: s=s.decode('utf-8').lower().encode('utf-8')
   except Exception: s=s.lower()
   return s

def uUpper(s):
   try: s=s.decode('utf-8').upper().encode('utf-8')
   except Exception: s=s.upper()
   return s

def strEx(val):
   if isString(val): return val
   try: return str(val)
   except Exception:
      try: return reprEx(val)
      except Exception: return val

@deprecated
def str2dict(text, sep1='=', sep2=' '):
   #create dict{key:val} from string"key(sep1)val(sep2)"
   tArr1=text.split(sep2)
   tArr2={}
   for s in tArr1:
      if not s: continue
      s1=strGet(s, '', sep1, default=s)
      s2=strGet(s, sep1, default='')
      if s1: tArr2[s1]=s2
   return tArr2

def size2human(num, suffix='B'):
   for unit in ['','Ki','Mi','Gi','Ti','Pi','Ei','Zi']:
      if abs(num)<1024.0:
         return "%3.1f%s%s"%(num, unit, suffix)
      num/=1024.0
   return "%.1f%s%s"%(num, 'Yi', suffix)

def getms(inMS=False):
   #return time and date in miliseconds(UNIXTIME) or seconds
   if inMS: return round(time.time()*1000.0, 0)
   else: return int(time.time())

def time2human(val, inMS=True):
   if not inMS: val=val*1000.0
   d=24*60*60*1000.0
   h=60*60*1000.0
   m=60*1000.0
   s=1000.0
   ms=1
   mks=0.001
   ns=0.000001
   if not val: val='0'
   elif val>=d: val='%.2fd'%(val/d)
   elif val>=h: val='%.2fh'%(val/h)
   elif val>=m: val='%.1fm'%(val/m)
   elif val>=s: val='%.1fs'%(val/s)
   elif val>=ms: val='%.0fms'%(val/ms)
   elif val>=mks: val='%.0fmks'%(val/mks)
   else: val='%.0fns'%(val/ns)
   return val

def dateComp(date, datewith=None, f='%d/%m/%Y %H:%M:%S'):
   #compare two dates in specific format
   if datewith is None:
      date1=datetime.datetime.now().strftime(f)
      date2=date
   else:
      date1=date
      date2=datewith
   date1=timeNum(date1, f) if not isNum(date1) else date1
   date2=timeNum(date2, f) if not isNum(date2) else date2
   dd=date1-date2
   return dd
dateDiff=dateComp

def dateAddMonth(date=None, n=1):
   date=date or datetime.datetime.now()
   new_year=date.year
   new_month=date.month+n
   if new_month>12:
      new_year+=1
      new_month-=12
   last_day_of_month=calendar.monthrange(new_year, new_month)[1]
   new_day=min(date.day, last_day_of_month)
   return date.replace(year=new_year, month=new_month, day=new_day)

def dateIncress(wait, f='%d.%m.%Y'):
   #incress date by given seconds
   if not wait: return None
   s=wait*3600.0*24.0
   s=datetime.datetime.now()+datetime.timedelta(seconds=s)
   return s.strftime(f)

def timeNum(text, f='%d/%m/%Y %H:%M:%S'):
   #convert string to time
   t0=datetime.datetime.strptime(text, f)
   t1=time.mktime(t0.timetuple())
   return round(t1)
#===================================
# import code, readline, atexit, os

# class HistoryConsole(code.InteractiveConsole):
#    def __init__(self, locals=None, filename="<console>", histfile=os.path.expanduser("~/.console-history")):
#       code.InteractiveConsole.__init__(self, locals, filename)
#       self.init_history(histfile)

#    def init_history(self, histfile):
#       readline.parse_and_bind("tab: complete")
#       if hasattr(readline, "read_history_file"):
#          try:
#             readline.read_history_file(histfile)
#          except IOError:
#             pass
#          atexit.register(self.save_history, histfile)

#    def save_history(self, histfile):
#       readline.set_history_length(1000)
#       readline.write_history_file(histfile)

global consoleColor
consoleColor=MagicDict({
   # predefined colors
   'fail':'\x1b[91m',
   'ok':'\x1b[92m',
   'warning':'\x1b[93m',
   'okblue':'\x1b[94m',
   'header':'\x1b[95m',
   # colors
   'black':'\x1b[30m',
   'red':'\x1b[31m',
   'green':'\x1b[32m',
   'yellow':'\x1b[33m',
   'blue':'\x1b[34m',
   'magenta':'\x1b[35m',
   'cyan':'\x1b[36m',
   'white':'\x1b[37m',
   # background colors
   'bgblack':'\x1b[40m',
   'bgred':'\x1b[41m',
   'bggreen':'\x1b[42m',
   'bgyellow':'\x1b[43m',
   'bgblue':'\x1b[44m',
   'bgmagenta':'\x1b[45m',
   'bgcyan':'\x1b[46m',
   'bgwhite':'\x1b[47m',
   # specials
   'light':'\x1b[2m',
   'bold':'\x1b[1m',
   'inverse':'\x1b[7m',
   'underline':'\x1b[4m',
   'clearLast':'\x1b[F\x1b[K',
   'end':'\x1b[0m'
})

def consoleInteract(scope=None, msg=None):
   if not consoleIsTerminal():
      raise RuntimeError('Must be TTY')
   scope=(scope or {}).copy()
   def tFunc():
      raise SystemExit
   scope['exit']=tFunc
   try:
      if msg is None:
         # w=consoleSize()[0]
         msg=''
         # msg+='#'*w
         msg+='-'*48
         msg+='\n'+'Interactive session, for return back use `exit()`' #.center(w, '-')
         # msg+='#'*w
         msg=consoleColor.magenta+consoleColor.bold+msg+consoleColor.end
      code.interact(banner=msg, local=scope)
   except SystemExit: pass

def consoleSize():
   if not sys.stdout.isatty():
      return INFINITY, INFINITY
   import fcntl, termios, struct
   h, w, hp, wp=struct.unpack('HHHH', fcntl.ioctl(sys.stdout.fileno(), termios.TIOCGWINSZ, struct.pack('HHHH', 0, 0, 0, 0)))
   return w, h

def consoleClear():
   #clear console outpur (linux,windows)
   if sys.platform=='win32': os.system('cls')
   else: os.system('clear')

def consoleIsTerminal():
   return sys.stdout.isatty()

def consoleRepair():
   # https://stackoverflow.com/a/24780259/5360266
   os.system('stty sane')

global console
console=magicDict({
   'interact':consoleInteract,
   'clear':consoleClear,
   'inTerm':consoleIsTerminal,
   'color':consoleColor,
   'repair':consoleRepair,
   'size':consoleSize,
   'width':lambda: consoleSize()[0],
   'height':lambda: consoleSize()[1],
})

#===================================
@deprecated
def cmd(command, path=None, enc="utf-8"):
   return runExternal(command, path=path, enc=enc, data=None)

def runExternal(command, path=None, enc="utf-8", data=None):
   process=subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=path)
   if isString(data):
      data=data.encode(enc)+'\n'
   out, err=process.communicate(input=data)
   if err:
      try: err=err.decode(enc)
      except UnicodeDecodeError: pass
   r=process.poll()
   if r:
      raise RuntimeError("Process %s has returned error-code %s: %s"%(' '.join(command), r, err))
   if out:
      try: out=out.decode(enc)
      except UnicodeDecodeError: pass
   return out
#===================================
def isURL(url):
   if not url or not isStr(url): return False
   try:
      r=urlparse(urljoin(url, '/'))
      return r.scheme and r.netloc and r.path and ('.' in r.netloc)
   except Exception:
      return False

def cropURL(t):
   if(t[:7]=='http://'): t=t[7:]
   if(t[:8]=='https://'): t=t[8:]
   if(t[:4]=='www.'): t=t[4:]
   return t

def rebuildURL(url, cb):
   #чиним адрес, чтобы парсить адреса без scheme
   for s in ['//', 'http://', 'https://', 'ftp://']:
      if url.startswith(s): break
   else: url='//'+url if(url.startswith('/') or '.' in strGet(url, '', '/')) else '///'+url
   #парсим
   scheme, netloc, path, query, fragment=urlsplit(url)
   if 'netloc' in cb:
      netloc=cb['netloc'](netloc) if isFunction(cb['netloc']) else cb['netloc']
   if 'path' in cb:
      path=cb['path'](path) if isFunction(cb['path']) else cb['path']
   if 'scheme' in cb:
      scheme=cb['scheme'](scheme) if isFunction(cb['scheme']) else cb['scheme']
   if 'fragment' in cb:
      if isFunction(cb['fragment']):
         fragment=parse_qs(fragment)
         tArr1={}
         for k, v in fragment.iteritems():
            if isFunction(cb['fragment']): s=cb['fragment'](k, v)
            elif isDict(cb['fragment']): s=oGet(cb['fragment'], k, v)
            else: s=cb['fragment']
            if s is not False: tArr1[k]=s
         try: fragment=urlencode(tArr1, doseq=True)
         except: fragment=''
      else: fragment=cb['fragment']
   if 'query' in cb:
      if isFunction(cb['query']) or isDict(cb['query']):
         query=parse_qs(query)
         tArr1={}
         for k, v in query.iteritems():
            if isFunction(cb['query']): s=cb['query'](k, v)
            elif isDict(cb['query']): s=oGet(cb['query'], k, v)
            else: s=cb['query']
            if s is not False: tArr1[k]=s
         try: query=urlencode(tArr1, doseq=True)
         except: query=''
      else: query=cb['query']
   return urlunsplit((scheme, netloc, path, query, fragment))
#===================================
def pathList(path, fullPath=True, alsoFiles=True, alsoDirs=False, recursive=False, filter=None, isBlacklist=True, cb=None, _result=None, _prefix=None):
   #list sub-files and sub-dirs for specific path
   #! нужна версия, отдающая генератор на основе os.walk
   res=[] if _result is None else _result
   for f in os.listdir(path):
      fp=os.path.join(path, f)
      if filter:
         if isFunction(filter):
            if filter(fp, f) is False: continue
         elif isBlacklist and f in filter: continue
         elif not isBlacklist and f not in filter: continue
      #
      if isFunction(cb): fp, f=cb(fp, f)
      if not os.path.isfile(fp):
         if recursive:
            pathList(fp, fullPath=fullPath, alsoFiles=alsoFiles, alsoDirs=alsoDirs, recursive=True, filter=filter, cb=cb, _result=res, _prefix='' if fullPath else f+'/')
         if not alsoDirs: continue
      elif not alsoFiles: continue
      s=fp if fullPath else f
      if _prefix and isString(_prefix): s=_prefix+s
      res.append(s)
      # yield (fp if fullPath else f)
   return res

def folderClear(path, alsoFiles=True, alsoDirs=False, silent=True, filter=None, isBlacklist=True):
   for f in os.listdir(path):
      fp=os.path.join(path, f)
      try:
         if alsoFiles and os.path.isfile(fp):
            if isFunction(filter):
               if filter(fp, f, True) is False: continue
            elif isBlacklist and f in filter: continue
            elif not isBlacklist and f not in filter: continue
            os.unlink(fp)
         if alsoDirs and os.path.isdir(fp):
            if isFunction(filter):
               if filter(fp, f, False) is False: continue
            elif isBlacklist and f in filter: continue
            elif not isBlacklist and f not in filter: continue
            #! это удалит все внутренности папки, а нам нужно пройтись фильтром
            if os.path.islink(fp):
               os.unlink(fp)
            else:
               shutil.rmtree(fp)
      except Exception:
         if not silent: raise
         print getErrorInfo(fallback=True)

def zipGet(fName, filterByName=None, forceTry=False, password=None, silent=True):
   z=zipfile.ZipFile(fName, mode='r')
   isOk=True
   isSingle=False
   if filterByName is None:
      filterByName=z.namelist()
   elif isString(filterByName):
      filterByName=(filterByName,)
      isSingle=True
   res={}
   for n in filterByName:
      try: res[n]=z.read(n, password)
      except Exception, e:
         if not silent:
            try: z.close()
            except Exception: pass
            raise e
         print '! Cant read file "%s" from zip "%s": %s'%(n, fName, e)
         isOk=False
         if not forceTry: break
   try: z.close()
   except Exception, e:
      if not silent: raise
      print '! Cant close zip "%s": %s'%(fName, e)
      isOk=False
   if forceTry: return res.values()[0] if isSingle else res
   else:
      return (res.values()[0] if isSingle else res) if isOk else False

def isZipCompressionSupported(returnConst=False):
   # check, if compression supported by OS
   try:
      import zlib  # noqa
      return zipfile.ZIP_DEFLATED if returnConst else True
   except Exception:
      return zipfile.ZIP_STORED if returnConst else False

def zipWrite(fName, data, mode='w', forceCompression=True, silent=True):
   if not isDict(data):
      raise ValueError('data must be a dict with <name>:<content>')
   isOk=True
   if forceCompression and not isZipCompressionSupported():
      raise RuntimeError('Compression not supported by OS')
   z=zipfile.ZipFile(fName, mode=mode, compression=isZipCompressionSupported(returnConst=True))
   for n, d in data.iteritems():
      isRaw=False
      if isinstance(d, tuple) and len(d)==2 and d[0]==open: isRaw, d=True, d[1]
      elif not isString(d): d=repr(d)
      try:
         z.write(d, n) if isRaw else z.writestr(n, d)
      except Exception, e:
         if not silent:
            try: z.close()
            except Exception: pass
            raise e
         print '! Cant write file "%s" to zip "%s": %s'%(n, fName, e)
         isOk=False
         break
   try: z.close()
   except Exception, e:
      if not silent: raise
      print '! Cant close zip "%s": %s'%(fName, e)
      isOk=False
   return isOk

def fileGet(fName, mode='r', silent=True, buffer=-1):
   fName=fName.encode('cp1251')
   if not os.path.isfile(fName): return None
   try:
      with open(fName, mode, buffer) as f: s=f.read()
   except Exception, e:
      if not silent: raise
      print '! Cant get file "%s": %s'%(fName, e)
      s=None
   return s

def fileWrite(fName, text, mode='w', silent=False, buffer=-1):
   try:
      with open(fName, mode, buffer) as f: f.write(text)
   except Exception, e:
      if not silent: raise
      print '! Cant write file "%s"(%s): %s'%(fName, mode, e)

def fileAppend(fName, text, mode='a', silent=False, buffer=-1):
   return fileWrite(fName, text, mode=mode, silent=silent, buffer=buffer)

def getErrorRaw():
   return sys.exc_info()

def getErrorInfo(fallback=False, raw=False):
   """
   This method return info about last exception.

   :return str:
   """
   if not fallback and not raw:
      return traceback.format_exc()
   tArr=inspect.trace()[-1]
   fileName=getScriptName(f=tArr[1])
   lineNo=tArr[2]
   _, eObj, eTB=sys.exc_info()
   if raw:
      res=(fileName, lineNo, eObj, eTB)
   else:
      res='%s:%s > %s'%(fileName, lineNo, eObj)
   sys.exc_clear()
   return res

#===================================
def clearTypography(data):
   tMap={
      u' ':' ',
      u'«':'"',
      u'»':'"',
      ' ':' ',
      '«':'"',
      '»':'"',
      u'\u0301':''  #ударение над буквой
   }
   for k, v in tMap.iteritems():
      try:
         if k in data:
            data=data.replace(k, v)
      except: pass  # noqa
   return data

def strIsUpBegin(str):
   # проверяет, является ли первая найденная буква слова заглавной. игнорирует остальные символы в начале слова
   return bool(sum([int(s.isupper()) for s in str if s in uLetters]))

def strGet(text, pref='', suf='', index=0, default='', returnOnlyStr=True, caseSensitive=False):
   # return pattern by format pref+pattenr+suf
   if not text:
      if returnOnlyStr: return default
      else: return -1, -1, default
   if caseSensitive:
      text1=text.lower()
      pref=pref.lower()
      suf=suf.lower()
   else: text1=text
   if pref:
      i1=text1.find(pref,index)
   else:
      i1=index
   if i1==-1:
      if returnOnlyStr: return default
      else: return -1, -1, default
   if suf:
      i2=text1.find(suf,i1+len(pref))
   else:
      i2=len(text1)
   if i2==-1:
      if returnOnlyStr: return default
      else: return i1, -1, default
   s=text[i1+len(pref):i2]
   if returnOnlyStr: return s
   else:
      return i1+len(pref), i2, s
###str.get=strGet

def decode_utf8(text):
   """ Returns the given string as a unicode string (if possible). """
   if isinstance(text, str):
      for encoding in (("utf-8",), ("windows-1252",), ("utf-8", "ignore")):
         try:
            return text.decode(*encoding)
         except: pass
      return text
   return unicode(text)

def encode_utf8(text):
   """ Returns the given string as a Python byte string (if possible). """
   if isinstance(text, unicode):
      try:
         return text.encode("utf-8")
      except:
         return text
   return str(text)

def strUniDecode(text, alsoU=True):
   #decode unicode's things for russian,use map
   try:
      text=text.encode('utf-8').replace('°', ' ')
   except: pass
   if alsoU:
      try:
         text=str(text).replace('\\u0075', 'u').replace('\\u0055', 'U')
      except: pass
   try:
      for f, to in ucodes.iteritems():
         text=str(text).replace(f, to)
   except: pass
   return text
###str.uniDecode=strUniDecode

def strUniEncode(text, alsoU=True):
   #encode unicode's things for russian,use map
   if alsoU:
      try:
         text=str(text).replace('u', '\\u0075').replace('U', '\\u0055')
      except: pass
   try:
      for to,f in ucodes.iteritems():
         text=text.replace(f, to)
   except: pass
   return text
###str.uniEncode=strUniEncode

def print_r(arr, pref=''):
   try:
      from decimal import Decimal
      if isDict(arr):
         for k in arr:
            if isDict(arr[k]):
               for kk in arr[k]:
                  if isinstance(arr[k][kk], (datetime.date, datetime.datetime)): arr[k][kk]=str(arr[k][kk])
                  if isinstance(arr[k][kk], (int, float, long, Decimal)): arr[k][kk]=str(arr[k][kk])
            else:
               if isinstance(arr[k], (datetime.date, datetime.datetime)): arr[k]=str(arr[k])
               if isinstance(arr[k], (int, float, long, Decimal)): arr[k]=str(arr[k])
      print pref, strUniDecode(reprEx(arr,2))
   except:
      print 'ERROR in print_r'

def print_rd(arr,pref=''):
   print_r(arr, pref)
   sys.exit(0)

def printTable(table):
   col_width = [max(len(x) for x in col) for col in zip(*table)]
   for i, line in enumerate(table):
      s="| " + " | ".join("{:{}}".format(x, col_width[i]) for i, x in enumerate(line)) + " |"
      if not i: print '-'*len(s)
      print s
      if not i or i==len(table)-1: print '-'*len(s)

#===================================
"""
Collection of methods for working with Generators, which respects `yield .. send ..` ability.
"""

def gExtend(prepend, g, append=None):
   _gType=types.GeneratorType
   _iType=collections.Iterable
   if not isinstance(g, _gType):
      raise TypeError('Wrong type, second arg must be Generator')
   if isinstance(prepend, _gType): gPrepend=prepend
   elif isinstance(prepend, _iType): gPrepend=g
   else:
      raise TypeError('Wrong type, first arg must be Generator or Iterable')
   if append is None: gAppend=None
   elif isinstance(append, _gType): gAppend=append
   elif isinstance(append, _iType): gAppend=None
   else:
      raise TypeError('Wrong type, arg `append` must be Generator or Iterable')
   for v in prepend:
      extCmd=(yield v)
      if extCmd is not None:
         yield  # this allows to use our generator inside `for .. in ..` without skipping on `send`
         gPrepend.send(extCmd)
   #
   for v in g:
      extCmd=(yield v)
      if extCmd is not None:
         yield  # this allows to use our generator inside `for .. in ..` without skipping on `send`
         g.send(extCmd)
   #
   if append is not None:
      for v in prepend:
         extCmd=(yield v)
         if extCmd is not None:
            yield  # this allows to use our generator inside `for .. in ..` without skipping on `send`
            if gAppend is not None:
               gAppend.send(extCmd)

def gCheck(g):
   try:
      return gExtend((next(g),), g)
   except StopIteration:
      return ()

def gChain(*gens):
   for g in gens:
      isGen=isinstance(g, types.GeneratorType)
      for o in g:
         extCmd=(yield o)
         if extCmd is not None:
            yield  # this allows to use our generator inside `for .. in ..` without skipping on `send`
            if isGen:
               g.send(extCmd)

#===================================
def arrFind(arr, v, default=-1):
   """аналог str.find() для массивов"""
   if isGenerator(arr): arr=list(arr)
   try:
      return arr.index(v)
   except ValueError: return default

def arrEjectionClean3(arr, delicacy=1.03, returnEjections=False, returnIndex=False, sortKey=None, allowSort=True):
   """чистит цифровую выборку от выбросов, используя робастный подход по соседним значениям"""
   #! этот метод считает выбросом значение, отличающееся от предыдущего более чем на (предыдущее * <delicacy>). такой подход применим только в узком круге задач. Метод нужно оставить, но не использовать его в качестве дефолтного.
   arrMap=range(len(arr))
   if(allowSort):
      # в нормальных условия метод работает корректно только для отсортированных массивов
      arrMap=sorted(arrMap, key=sortKey, reverse=False)
   out=[]
   last=None
   delicacy=float(delicacy)
   for i in arrMap:
      e=arr[i]
      # if last is not None: print '..', last, e, e-last, delicacy*last
      if last is None and e==0:
         if not returnEjections: out.append(i)
         continue
      elif last is not None and (e-last>delicacy*last):
         if returnEjections: out.append(i)
         continue
      if not returnEjections: out.append(i)
      last=e
   if returnIndex: out=[i for i in xrange(len(arr)) if i in out]
   else: out=[arr[i] for i in xrange(len(arr)) if i in out]
   return out

def arrEjectionClean(arr, allowSort=True, sortKey=None, robustMultiplier=0.9, returnEjections=False):
   """чистит цифровую выборку от выбросов, используя дефолтный подход"""
   print '='*71, '\n', '!! used DEFAULT robust method, that working only with specific cases !!', '\n', '='*71
   return arrEjectionClean3(arr=arr, allowSort=allowSort, returnEjections=returnEjections, sortKey=sortKey, delicacy=robustMultiplier, returnIndex=False)

def arrCreateIndexMap(arr, sort=True, key=None, reverse=False):
   """ Create indexed and sorted (optionally) map. Also supports dicts. """
   if sort:
      if isFunction(key):
         def tFunc(i):
            return key(arr[i])
      else:
         def tFunc(i):
            return arr[i]
      arrMap=arr if isDict(arr) else range(len(arr))
      arrMap=sorted(arrMap, key=tFunc, reverse=reverse)
   elif isFunction(key):
      arrMap=arr if isDict(arr) else xrange(len(arr))
      arrMap=[key(arr[i]) for i in arrMap]
   else:
      arrMap=arr.keys() if isDict(arr) else range(len(arr))
   return arrMap

def arrMedian(arr, arrMap=None, key=None):
   """
   Find median. Also supports dicts.

   :Example:

   >>> arrMedian([1, 5, 6, 7, 9, 12, 15, 19, 20, 2, 3, 30, 35])
   9.0
   >>> arrMedian([1, 1, 3, 5, 7, 9, 10, 14, 18])
   7.0
   >>> arrMedian([0, 1, 2, 3, 4, 5, 6, 7, 8])
   4.0
   """
   if not len(arr): return 0
   elif len(arr)==1:
      if isDict(arr):
         return key(arr.values()[0]) if isFunction(key) else arr.values()[0]
      else:
         return key(arr[0]) if isFunction(key) else arr[0]
   if not arrMap:
      arrMap=arrCreateIndexMap(arr, key=key)
   if len(arrMap)%2:
      i1=arrMap[len(arrMap)/2]
      median=key(arr[i1]) if isFunction(key) else arr[i1]
   else:
      i1=arrMap[(len(arrMap)-1)/2]
      i2=arrMap[(len(arrMap)-1)/2+1]
      median=(key(arr[i1])+key(arr[i2]))/2.0 if isFunction(key) else (arr[i1]+arr[i2])/2.0
   return median

def arrQuartiles(arr, arrMap=None, method=1, key=None, median=None):
   """
   Find quartiles. Also supports dicts.
   This function know about this quartile-methods:
      1. Method by Moore and McCabe's, also used in TI-85 calculator.
      2. Classical method, also known as "Tukey's hinges". In common cases it use values from original set, not create new.
      3. Mean between  method[1] and method[2].

   :param int method: Set method for find quartiles.

   :Example:

   >>> arrQuartiles([1, 5, 6, 7, 9, 12, 15, 19, 20], method=1)
   (5.5, 9, 17.0)
   >>> arrQuartiles([1, 5, 6, 7, 9, 12, 15, 19, 20], method=2)
   (6, 9, 15)
   >>> arrQuartiles([1, 5, 6, 7, 9, 12, 15, 19, 20], method=3)
   (5.75, 9, 16.0)
   >>> arrQuartiles([1, 1, 3, 5, 7, 9, 10, 14, 18], method=1)
   (2.0, 7, 12.0)
   >>> arrQuartiles([1, 1, 3, 5, 7, 9, 10, 14, 18], method=2)
   (3, 7, 10)
   >>> arrQuartiles([1, 1, 3, 5, 7, 9, 10, 14, 18], method=3)
   (2.5, 7, 11.0)
   """
   if method not in (1, 2, 3):
      raise ValueError('Unknown method: %s'%method)
   if not arr: return (0, 0, 0)
   elif len(arr)==1:
      #? что лучше отдавать
      if isDict(arr):
         r=key(arr.values()[0]) if isFunction(key) else arr.values()[0]
      else:
         r=key(arr[0]) if isFunction(key) else arr[0]
      return (0, r, r+1)
   if not arrMap:
      arrMap=arrCreateIndexMap(arr, key=key)
   if median is None:
      median=arrMedian(arr, arrMap, key=key)
   def getHalve(isLow=True, includeM=False):
      tArr=[]
      for i in arrMap:
         v=key(arr[i]) if isFunction(key) else arr[i]
         if isLow and (v<=median if includeM else v<median): tArr.append(v)
         elif not isLow and (v>=median if includeM else v>median): tArr.append(v)
      tArrMap=range(len(tArr))
      return tArr, tArrMap
   if method in (1, 2):  #methods "Moore and McCabe's" and "Tukey's hinges"
      tHalveL, tHalveL_arrMap=getHalve(True, method==2)
      tHalveH, tHalveH_arrMap=getHalve(False, method==2)
      qL=arrMedian(tHalveL, tHalveL_arrMap)
      qH=arrMedian(tHalveH, tHalveH_arrMap)
   elif method==3:  #mean between  method[1] and method[2]
      tHalveL1, tHalveL1_arrMap=getHalve(True, False)
      tHalveH1, tHalveH1_arrMap=getHalve(False, False)
      qL1=arrMedian(tHalveL1, tHalveL1_arrMap)
      qH1=arrMedian(tHalveH1, tHalveH1_arrMap)
      tHalveL2, tHalveL2_arrMap=getHalve(True, True)
      tHalveH2, tHalveH2_arrMap=getHalve(False, True)
      qL2=arrMedian(tHalveL2, tHalveL2_arrMap)
      qH2=arrMedian(tHalveH2, tHalveH2_arrMap)
      qL=(qL1+qL2)/2.0
      qH=(qH1+qH2)/2.0
   return qL, median, qH

def arrTrimean(arr, arrMap=None, key=None, median=None):
   """
   Find Tukey's trimean. Also supports dicts.

   :Example:

   >>> arrTrimean([1, 5, 6, 7, 9, 12, 15, 19, 20])
   9.75
   >>> arrTrimean([1, 1, 3, 5, 7, 9, 10, 14, 18])
   6.75
   >>> arrTrimean([0, 1, 2, 3, 4, 5, 6, 7, 8])
   4.0
   """
   if not len(arr): return 0
   elif len(arr)==1:
      if isDict(arr):
         return key(arr.values()[0]) if isFunction(key) else arr.values()[0]
      else:
         return key(arr[0]) if isFunction(key) else arr[0]
   if not arrMap:
      arrMap=arrCreateIndexMap(arr, key=key)
   q1, m, q3=arrQuartiles(arr, arrMap, method=2, key=key, median=median)
   trimean=(q1+2.0*m+q3)/4.0
   return trimean

def arrMode(arr, rank=0, key=None, returnIndex=False):
   """ Find mode of specific rank. Also supports dicts. """
   if not len(arr):
      return -1 if returnIndex else 0
   elif len(arr)==1:
      if isDict(arr):
         return arr.keys()[0] if returnIndex else (key(arr.values()[0]) if isFunction(key) else arr.values()[0])
      else:
         return 0 if returnIndex else (key(arr[0]) if isFunction(key) else arr[0])
   arrMap={}
   for i, v in (arr.iteritems() if isDict(arr) else enumerate(arr)):
      if isFunction(key): v=key(v)
      if v not in arrMap: arrMap[v]=[]
      arrMap[v].append(i)
   kMap=arrMap.keys()
   if rank>=len(kMap):
      return [] if returnIndex else None
   kMap=sorted(kMap, key=lambda s: len(arrMap[s]), reverse=True)
   k=kMap[rank]
   return arrMap[k] if returnIndex else k

def arrEjectionClean2(arr, delicacy=0.51, returnEjections=False, returnIndex=False, useTrimean=False):
   """чистит цифровую выборку от выбросов, используя робастный подход по медиане или тримеане"""
   out=[]
   if useTrimean: median=arrTrimean(arr)
   else: median=arrMedian(arr)
   medianM=abs(float(delicacy)*median)
   for i in range(len(arr)):
      if abs(median-arr[i])>medianM:
         if not returnEjections: continue
         else:
            out.append(i if returnIndex else arr[i])
            continue
      if not returnEjections: out.append(i if returnIndex else arr[i])
   return out

def arrAverage(arr, robust=False):
   if robust: arr=arrEjectionClean2(arr)
   if not len(arr): return 0  #защита от деления на ноль
   return sum(arr)/float(len(arr))

def arrMax(arr, key=None, returnIndex=False):
   """позволяет использовать key при поиске максимума"""
   #! добавить поддержку работы со словарем как arrMedian
   if not len(arr):
      return -1 if returnIndex else None  #minimum possible number, so any other bigger
   elif len(arr)==1:
      return 0 if returnIndex else (key(arr[0]) if isFunction(key) else arr[0])
   else:
      if isFunction(key):
         arr=(key(s) for s in arr)
      if returnIndex:
         return arrFind(arr, max(arr), -1)
      else:
         return max(arr)

def arrMin(arr, key=None, returnIndex=False):
   """позволяет использовать key при поиске минимума"""
   if not len(arr):
      return -1 if returnIndex else None  #maximum possible number, so any other smaller
   elif len(arr)==1:
      return 0 if returnIndex else (key(arr[0]) if isFunction(key) else arr[0])
   else:
      if isFunction(key):
         arr=(key(s) for s in arr)
      if returnIndex:
         return arrFind(arr, min(arr), -1)
      else:
         return min(arr)

@deprecated
def arrUnique(arr, key=None):
   #unique elements of array
   if not(arr): return []
   tArr1=arr
   if isFunction(key):
      tArr1=(key(s) for s in tArr1)
   tArr1=set(tArr1)
   tArr1=list(tArr1)
   return tArr1
###list.unique=arrUnique

def setsSymDifference(*objs):
   # calc symmetric-difference between MULTIPLE sets
   # this equivalent for `(o1|o2|o3).difference((o1&o2),(o2&o3), (o1&o3))`
   r=objs[0].union(*objs[1:])
   r.difference_update(*(o1&o2 for o1,o2 in combinations(objs, 2)))
   return r

def oGet(o, key, default=None):
   #get val by key from object(list,dict), or return <default> if key not exist
   try: return o[key]
   except (KeyError, IndexError): return default
arrGet=oGet
###list.get=arrGet

@deprecated
def arrDelta(arr, key=None):
#находим дельту между двумя каждыми соседними элементами
   #элементы должны быть числами
   dArr=[]
   tArr=sorted(arr, key=key, reverse=True)
   for i in xrange(1,len(tArr)):
      v1=float(key(tArr[i-1]) if key else tArr[i-1])
      v2=float(key(tArr[i]) if key else tArr[i])
      dArr.append(v1-v2)
   return dArr
###list.delta=arrDelta

def arrClear(arr):
   arr*=0
   return arr
arrClean=arrClear

@deprecated
def arrCreate(s1=2, s2=2, val=None):
   #create 2 dimensions array, filled with $val
   tArr=[]
   for i in xrange(s1):
      if s2 in [0, None]:
         tArr.append(val)
      else:
         tArr.append([])
         for j in xrange(s2):
            tArr[i].append(val)
   return tArr

def arrSplit(arr, pair=2, returnList=False):
   # very fast implementation for splitting list to pairs ([1,2,3,4] > [(1, 2), (3,4)])
   #! partially-duplicate of grouper()
   arr=izip(*[iter(arr)]*pair)
   if returnList: arr=list(arr)
   return arr

def grouper(n, obj, fill=None):
   # group items by n (ABCDEFG --> ABC DEF Gxx if n=3)
   args=[iter(obj)]*n
   return izip_longest(fill=fill,*args)

def dictMerge(o, withO, changed=None, changedType='key', modify=True, recursive=True):
   """ Another dict.update that supports recursive updating and store diff. """
   if not isDict(o) or not isDict(withO): raise TypeError('Need dicts')
   params={
      'cb':None,
      'modify':modify,
      'allowOrderOptimization':False,
      'recursive':recursive,
      'changedCB':None,
      'changedCBPassValues':False,
      'changedCBRecursive':False,
   }
   if changed in (None, False):
      params['allowOrderOptimization']=True
   elif changedType in ('new', 'old'):
      assert isinstance(changed, dict), 'For collecting changes-diff you must pass dict'
      def tFunc(k, vNew, vOld):
         ooo=changed
         if isinstance(k, list):
            k, kChain=k[-1], k[:-1]
            for kk in kChain:
               if kk not in ooo or not isinstance(ooo[kk], dict): ooo[kk]={}
               ooo=ooo[kk]
         ooo[k]=vOld if changedType=='old' else vNew
      params['changedCB']=tFunc
      params['changedCBPassValues']=2
      params['changedCBRecursive']=True
   elif changedType=='key':
      if isinstance(changed, dict):
         params['changedCB']=changed.__setitem__
         params['changedCBPassValues']=1
      elif isinstance(changed, list):
         params['changedCB']=changed.append
      elif isinstance(changed, set):
         params['changedCB']=changed.add
   return dictMergeEx(o, withO, **params)

dictUpdate=dictMerge

def dictMergeEx(oMain, other, cb=None, cbArgs=(), cbPassKey=False, cbMap=None, cbSwapValues=False, cbSkipIfNewKey=True, modify=True, recursive=True, allowOrderOptimization=False, filterKeys=None, isBlacklist=True, changedCB=None, changedCBRecursive=False, changedCBPassValues=False, __recursiveChain=None):
   emptyValue=NULL
   #
   _changedCB_inplaceType=None
   if isinstance(changedCB, dict): _changedCB_inplaceType='d'
   elif isinstance(changedCB, list): _changedCB_inplaceType='l'
   elif isinstance(changedCB, set): _changedCB_inplaceType='s'
   if _changedCB_inplaceType is not None and changedCBRecursive:
      raise NotImplementedError('Optimisation `changedCB_inplaceType` not implemented for recursive merging')
   if isinstance(other, dict): other=(other,)
   if not modify:
      if allowOrderOptimization:
         i2=None
         l2=len(oMain)
         for i, o in enumerate(other):
            if o is None: continue
            l=len(o)
            if l>l2:
               l2=l
               i2=i
         if i2 is not None:
            oMain, o=other[i], oMain
            other=other[:i]+(o,)+other[i+1:]
      #
      if filterKeys is None:
         oMain=oMain.copy()
      elif isBlacklist:
         oMain={k:v for k, v in oMain.iteritems() if k not in filterKeys}
      else:
         oMain={k:oMain[k] for k in filterKeys if k in oMain}
   #
   for o in other:
      if o is None: continue
      for k, v in o.iteritems():
         if filterKeys is not None and (k in filterKeys if isBlacklist else k not in filterKeys): continue
         #
         if k not in oMain and cbSkipIfNewKey:
            oMain[k]=vNew=v
            vOld=None
         else:
            vOld=oMain[k] if k in oMain else emptyValue
            if vOld is v: continue
            elif recursive and vOld is not emptyValue and isinstance(vOld, dict) and isinstance(v, dict):
               rc=(__recursiveChain+(k,) if __recursiveChain else (k,)) if changedCB and changedCBRecursive else None
               dictMergeEx(vOld, v, cb=cb, cbArgs=cbArgs, cbPassKey=cbPassKey, cbMap=cbMap, cbSwapValues=cbSwapValues, cbSkipIfNewKey=cbSkipIfNewKey, modify=True, recursive=True, changedCB=(changedCB if changedCB and changedCBRecursive else None), changedCBRecursive=changedCBRecursive, allowOrderOptimization=allowOrderOptimization, filterKeys=filterKeys, isBlacklist=isBlacklist, changedCBPassValues=changedCBPassValues, __recursiveChain=rc)
               continue
            else:
               _cb=cb if (not cbMap or k not in cbMap) else cbMap[k]
               if _cb is not None:
                  if cbPassKey:
                     vNew=_cb(k, vOld, v, *cbArgs) if cbSwapValues else _cb(k, v, vOld, *cbArgs)
                  else:
                     vNew=_cb(vOld, v, *cbArgs) if cbSwapValues else _cb(v, vOld, *cbArgs)
                  if vNew is vOld: continue
               else: vNew=v
               oMain[k]=vNew
         #
         if _changedCB_inplaceType is None and changedCB is not None:
            if not changedCBPassValues: changedCB(k)
            elif changedCBPassValues==2:
               changedCB((__recursiveChain+(k,) if __recursiveChain else k), vNew, vOld)
            else: changedCB(k, vNew)
         elif _changedCB_inplaceType=='d':
            changedCB[k]=vOld if changedCBPassValues==2 else vNew
         elif _changedCB_inplaceType=='l': changedCB.append(k)
         elif _changedCB_inplaceType=='s': changedCB.add(k)
   return oMain

def dictFilter(o, keys, allowModify=False):
   if len(keys)<=len(o)*0.5:
      if not allowModify: o=o.copy()
      for k in keys:
         if k in o: del o[k]
      return o
   else:
      if PY_V<2.7:
         return dict((k, v) for k, v in o.iteritems() if k not in keys)
      else:
         return {k: v for k, v in o.iteritems() if k not in keys}
dictExclude=dictFilter

@deprecated
def inOf(o, v):
   if isArray(o):
      try:
         return o.index(v)+1
      except: return False
   else:
      try:
         return (v in o)
      except: return False
#===================================
def sendmail(**p):
   p=magicDict(p)
   _login=p.get('login', p.get('user', ''))
   _password=p.get('password', p.get('passwd', ''))
   assert _login and _password
   msg=email.MIMEMultipart.MIMEMultipart()
   msg['From']=p.get('from', _login)
   # regExp_splitEmail=re.compile("[,\s]", re.U)
   # msg['To']=email.Utils.COMMASPACE.join(regExp_splitEmail.split(p.to) if isString(p.to) else p.to)
   # msg['To']= p.to.split(',') if isString(p.to) else p.to
   if isString(p.to):
      p.to=p.to.split(',')
   msg['Subject']=p.get('subject', p.get('title', ''))
   # attach body
   # msg.attach(MIMEText(p.get('body', p.get('text', '')), p.get('mime', 'plain'), "utf-8"))
   msg.attach(MIMEText(p.get('body', p.get('text', '')), p.get('mime', 'html'), "utf-8"))
   # attach other
   #http://stackoverflow.com/a/11921241/5360266
   #https://gist.github.com/vjo/4119185
   typeMap={
      'img':MIMEImage, 'image':MIMEImage, 'png':{'o':MIMEImage, 'm':'png'}, 'jpg':{'o':MIMEImage, 'm':'jpg'}, 'jpeg':{'o':MIMEImage, 'm':'jpeg'},
      'audio':MIMEAudio, 'sound':MIMEAudio, 'mp3':{'o':MIMEAudio, 'm':'mp3'}, 'wav':{'o':MIMEAudio, 'm':'wav'},
      'pdf':{'o':MIMEApplication, 'm':'pdf'},
      'xlsx':{'o':MIMEApplication,'m':'xlsx'}
   }
   cids=[]
   for o in p.get('xlsx', ()):
      part = MIMEBase('application', "octet-stream")
      part.set_payload(open(o['path'], "rb").read())
      encoders.encode_base64(part)
      part.add_header('Content-Disposition', 'attachment; filename='+o['name'])
      msg.attach(part)
   for o in p.get('attach') or ():
      cid=''
      name=''
      if isDict(o):
         oo=typeMap.get(o.get('type', ''), MIMEApplication)
         a=oo['o'](o['data'], oo['m']) if isDict(oo) else oo(o['data'])
         cid=o.get('cid', randomEx(None, cids, '<', '>'))
         name=o.get('name', '')
      else:  # binary data
         a=MIMEApplication(o)
         cid=randomEx(None, cids, '<', '>')
      # if no cid, client like MAil.app (only one?) don't show the attachment
      if not isString(cid): cid='<%s>'%cid
      if not cid.startswith('<'): cid='<%s'%cid
      if not cid.endswith('>'): cid='%s>'%cid
      cids.append(cid)
      a.add_header('Content-ID', cid)
      if name:
         a.add_header('Content-Disposition', 'attachment', filename=name)
         a.add_header('Content-Disposition', 'inline', filename=name)
      msg.attach(a)
   # sending
   isSSL=p.get('isSSL', p.get('ssl', False))
   if isSSL:
      server=smtplib.SMTP_SSL(p.server, p.get('port', 465))
   else:
      server=smtplib.SMTP(p.server, p.get('port', 587))
   server.ehlo()
   if not isSSL:
      server.starttls()
      server.ehlo()
   server.login(_login, _password)
   server.sendmail(msg['From'], p.to, msg.as_string())
   server.close()
   return True

def gmailSend(login, password, to, text, subject='', attach=None):
   return sendmail(isSSL=True, server='smtp.gmail.com', login=login, password=password, to=to, subject=subject, text=text, attach=attach)

def yaSend(login, password, to, text, subject='', attach=None):
   return sendmail(isSSL=True, server='smtp.yandex.ru', login=login, password=password, to=to, subject=subject, text=text, attach=attach)

global gmail
gmail=magicDict({'send':gmailSend})
#===================================
# usage example
# createSSLTunnel(6117, 6017, sslCert='/home/sslCert/screendesk_io.chained.crt', sslKey='/home/sslCert/screendesk_io.key') or sys.exit(0)

def createSSLTunnel(port_https, port_http, sslCert='', sslKey='', stunnel_configPath='/home/sslCert/', stunnel_exec='stunnel4', stunnel_configSample='/home/sslCert/stunnel_sample.conf', stunnel_sslAllow='all', stunnel_sslOptions='-NO_SSLv2 -NO_SSLv3', stunnel_logLevel=4, stunnel_logFile='/home/python/logs/stunnel_%s_%s-%s.log', name=None):
   print 'Creating tunnel (HTTPS:%s --> HTTP:%s)..'%(port_https, port_http)
   name=name or os.path.splitext(os.path.basename(sys.argv[0]))[0]
   configSample=fileGet(stunnel_configSample)
   stunnel_sslOptions='\n'.join(['options = '+s for s in stunnel_sslOptions.split(' ') if s])
   config={'name':name, 'logLevel':stunnel_logLevel, 'sslAllow':stunnel_sslAllow, 'sslOptions':stunnel_sslOptions, 'sslCert':sslCert, 'sslKey':sslKey, 'portHttps':port_https, 'portHttp':port_http}
   config=configSample%config
   configPath=stunnel_configPath+('stunnel_%s_%s-%s.conf'%(name, port_https, port_http))
   logPath=stunnel_logFile%(name, port_https, port_http)
   fileWrite(configPath, config)
   process=subprocess.Popen([stunnel_exec, configPath], stderr=open(logPath, "w"))
   time.sleep(1)
   if process.poll():  #error
      s=fileGet(logPath)
      s='[!] '+strGet(s, '[!]', '')
      print '!!! ERROR creating tunnel\n', s
      return False
   #
   def closeSSLTunnel():
      # try: os.system('pkill -f "%s %s"'%(stunnel_exec, configPath))
      # except: pass  # noqa
      try:
         process.terminate()
         time.sleep(1)
         process.kill()
      except Exception: pass
   atexit.register(closeSSLTunnel)
   #
   def tFunc(sigId, stack, self_close=closeSSLTunnel, old=None):
      self_close()
      if old is not None:
         old(sigId, stack)
      sys.exit(0)
   for s in (signal.SIGTERM, signal.SIGINT):
      old=signal.getsignal(s)
      if not isFunction(old): old=None
      signal.signal(s, bind(tFunc, {'old':old}))
   # def checkSSLTunnel():
   #    badPatterns=['Connection rejected: too many clients']
   #    while True:
   #       time.sleep(3)
   #       #! Здесь нужно проверять лог на наличие критических ошибок
   #       stunnelLog=fileGet(logPath)
   # thread_checkSSLTunnel=threading.Thread(target=checkSSLTunnel).start()
   return process
#===================================
def intersectWord(s, arr):
   s=s.lower()
   arr=[a.lower() for a in arr]
   out=difflib.get_close_matches(s, arr)
   return out

def wordImpulse(wordE, word, returnMax=False):
   #находим рейтинг схождения двух символьных последовательностей
   #!нужно обрабатывать окончания
   if not len(word) or not len(wordE): return None
   #определяем все исключающие последовательность, одинаковые для обоис псоледовательностей
   iParams={}
   for i1 in xrange(len(wordE)):
      iParams[i1]={'index':None, 'len':None, 'indexE':i1}
      iArr=xrange(len(word))
      for m in xrange(len(wordE)-i1+1):
         iArr2=[i2 for i2 in iArr if wordE[i1:i1+m+1]==word[i2:i2+m+1]]
         if not len(iArr2): break
         iArr=iArr2
      iParams[i1]['index']=iArr[0]
      iParams[i1]['len']=m
   #сама длинная является опорной
   best=iParams[sorted(range(len(wordE)), key=lambda x:(iParams[x]['len'],len(word)-iParams[x]['index']), reverse=True)[0]]
   rate={0.9:best['len']+1, 0.7:0, 0.3:0}
   if best['index']==0: rate[0.9]+=1
   elif best['index']==1: rate[0.7]+=1
   elif best['index']>=2: rate[0.3]+=1
   #далее проверяем оставшиеся символы
   i1=best['index']+best['len']
   i2=best['indexE']+best['len']
   while i2<len(wordE)-best['indexE']-best['len']:
      rate[0.9]+=0 if iParams[i2]['len']<=1 else iParams[i2]['len']
      if iParams[i2]['index']-i1==0: rate[0.9]+=1
      elif iParams[i2]['index']-i1==1: rate[0.7]+=1
      elif iParams[i2]['index']-i1>=2: rate[0.3]+=1
      i1=iParams[i2]['len']+iParams[i2]['index'] if iParams[i2]['len']>0 else 1+iParams[i2]['index']
      i2=iParams[i2]['len']+iParams[i2]['indexE'] if iParams[i2]['len']>0 else 1+iParams[i2]['indexE']
   rating=2**sum([k*v for k,v in rate.items()])
   maxR=2**(len(wordE)+1)
   if not returnMax: return rating
   else: return rating, maxR

def wordCompare(wordE=None, word=None, onlyReturnMaxLen=False, nearMap=None, caseSensitive=False):
   # сравнивает 2 строки с учетом таблици замен
   nearMap=nearMap if isDict(nearMap) else {u'сч=щ':0.3 ,u'т=д':0.3, u'ъ=ь':0.1, u'г=к':0.3}
   maxN=0
   if nearMap:
      #автоматически создаем обратные соответствия, нужны для ускорения поиска
      nearMap.update(dict([('%s=%s'%tuple(k.split('=')[::-1]), v) for k,v in nearMap.items()]))
      maxN=max([max([len(s) for s in k.split('=')]) for k in nearMap.keys()])
   if onlyReturnMaxLen: return maxN
   if not caseSensitive:
      wordE=wordE.lower()
      word=word.lower()
   rating=0
   maxRating=0
   l1=1
   l2=1
   while l1<=len(wordE):
      w1=wordE[:l1]
      w2=word[:l2]
      # print w1,w2
      maxRating+=1
      if w1[-1]==w2[-1]: rating+=1 #прямое сравнение
      elif maxN>0:
         #сравнение через таблицу замен
         for tl1 in range(maxN+1)[::-1]:
            if l1-1+tl1>len(wordE): continue
            for tl2 in range(maxN+1)[::-1]:
               if l2-1+tl2>len(word): continue
               s=u'%s=%s'%(wordE[l1-1:l1-1+tl1], word[l2-1:l2-1+tl2])
               # print '+'*7, s
               if s not in nearMap: continue # or wordE[:l1-1]!=word[:l2-1]
               # print '-'*7, wordE[:l1-1],word[:l2-1]
               # print '!'*10
               rating+=(1-nearMap[s]) #преобразуем штраф в баллы
               break
            if tl2>0 and tl1>0:
               l1+=(tl1-1)
               l2+=(tl2-1)
               break
         if tl1==0 or tl2==0: return False, rating, maxRating
      else: return False, rating, maxRating
      l1+=1
      if l2<=len(word): l2+=1
   return True, rating, maxRating

def wordMatchPart(wordE, word, nearMap=None, partParamsExternal={}, caseSensitive=False):
   partParams=partParamsExternal or {}
   # благодаря функции сравнения тпепрь нужно просто пройтись по всем кусочкам
   i1=0
   l1=1
   l2=1
   i2=0
   rating=0
   lastOk=None
   while i1<len(wordE):
      w1=wordE[i1:i1+l1]
      w2=word[i2:i2+l2]
      # print w1, w2
      isOk, r, mr=wordCompare(w1, w2, nearMap=nearMap, caseSensitive=caseSensitive)
      if isOk:
         #совпали, берем на букву больше
         l1+=1
         l2+=1
         rating=r
         lastOk=magicDict({'index1':i1, 'index2':i2, 'len1':l1-1, 'len2':l2-1, 'text1':w1, 'text2':w2, 'rating':rating, 'maxRating':mr})
         # print '   +++'
         if (i1+l1>len(wordE)) and (i2+l2>len(word)):
            try: lastOk
            except: break
            if lastOk and lastOk.rating: partParams['%s:%s'%(lastOk.index1,lastOk.len1)]=lastOk
            break
      else:
         if i2+l2<len(word): l2+=1
         elif i2+1<len(word):
            l2=l1
            i2+=1
         else:
            try:
               if lastOk and lastOk.rating: partParams['%s:%s'%(lastOk.index1,lastOk.len1)]=lastOk
            except: pass
            if i1+l1<len(wordE):
               l1+=1
               i2=0
               l2=1
            elif i1+1<len(wordE):
               i1+=1
               l1=1
               i2=0
               l2=1
            else: break
            rating=0
            lastOk=None
   if not len(partParams.values()):
      return magicDict({'index1':0, 'index2':0, 'len1':0, 'len2':0, 'text1':'', 'text2':'', 'rating':0, 'maxRating':0})
   elif len(partParams.values())==1: return partParams.values()[0]
   else: return sorted(partParams.values(), key=lambda x:x['rating'])[-1]

def wordImpulse2(wordE, word, returnMax=False, nearMap=None, caseSensitive=False):
   #находим импульс, необходимый для превращения одного слова в другое
   partParams={}
   bestPart=wordMatchPart(wordE, word, nearMap=nearMap, partParamsExternal=partParams, caseSensitive=caseSensitive)
   #!какаято хрень с форматом
   print_r(bestPart)
   #найдена максимальная последовательность
   finalRating=0.0
   leftPartE=wordE[:int(bestPart.index1)][::-1] #! Здесь было ':'
   # leftPart=word[:int(bestPart.index2)][::-1]
   rightPartE=wordE[int(bestPart.index1)+int(bestPart.len1):]
   # rightPart=word[int(bestPart.index2)+int(bestPart.len2):]
   #ищем совпадения в оставшихся частях слов
   # print leftPartE, leftPart, rightPartE, rightPart
   i1=0
   l1=1
   lastOk=False
   while i1<len(rightPartE):
      # print '%s:%s'%(i1+int(bestPart['index1'])+int(bestPart['len1']),l1)
      if '%s:%s'%(i1+int(bestPart.index1)+int(bestPart.len1),l1) not in partParams:
         if l1>=wordCompare(onlyReturnMaxLen=True): #длинна проверяемого сегмента меньше максимальной в таблице замен
            if l1-1>0 and lastOk:
               #проверяемый сегмент не прошел проверку, однако прошел ее ранее при меньшей длинне
               print '!', wordE[i1+int(bestPart.index1)+int(bestPart.len1):i1+int(bestPart.index1)+int(bestPart.len1)+l1-1]
               finalRating+=partParams['%s:%s'%(i1+int(bestPart.index1)+int(bestPart.len1),l1-1)].rating
            #к следующему сегменту
            i1+=1
            l1=1
            lastOk=False
         else: l1+=1 #увеличиваем длинну проверяемого сегмента
      else: #сегмент прошел проверку
         lastOk=True
         l1+=1
   """
   нужно переписать основу подсчета рейтинга.
   он должен считать не похожесть, а расличия.
   найденная лучшая часть это 0+коэффициент_ошибок_по_таблице_замен
   дальше влево от нее за каждую
   """
   return finalRating
   # print_r(partParams)
#===================================
def levenshtein2(a, b):
   #find the Levenshtein's distance
   #! Алгоритм из википедии, нужно проверить
   n, m = len(a), len(b)
   if n > m:
      # Make sure n <= m, to use O(min(n,m)) space
      a, b = b, a
      n, m = m, n
   current_row = range(n+1) # Keep current and previous row, not entire matrix
   for i in range(1, m+1):
      previous_row, current_row = current_row, [i]+[0]*n
      for j in range(1,n+1):
         add, delete, change = previous_row[j]+1, current_row[j-1]+1, previous_row[j-1]
         if a[j-1] != b[i-1]: change += 1
         current_row[j] = min(add, delete, change)
   return current_row[n]

def levenshtein(s1, s2, ignoreCaseAndStrip=True):
   #find the Levenshtein's distance
   #! Пока используется упрощенная имплементация из стандартного модуля
   if ignoreCaseAndStrip:
      s1=s1.lower().strip()
      s2=s2.lower().strip()
   rate=1-difflib.SequenceMatcher(None, s1, s2).ratio()
   return rate
#===================================

if(__name__=='__main__'):
   tArr1=[
      [1, 5, 6, 7, 9, 12, 15, 19, 20],
      [1, 1, 3, 5, 7, 9, 10, 14, 18],
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
   ]
   for o in tArr1:
      # print('%s  q1:%s, q2:%s, q3:%s, q4:%s, q5:%s, q6:%s;'%(o, m.quartiles(o, scheme=1), m.quartiles(o, scheme=2), m.quartiles(o, scheme=3), m.quartiles(o, scheme=4), m.quartiles(o, scheme=5), m.quartiles(o, scheme=6)))
      print '%s  q1:%s, q2:%s, q3:%s;'%(o, arrQuartiles(o, method=1), arrQuartiles(o, method=2), arrQuartiles(o, method=3))
      # print '%s  median: %s, trimean: %s;'%(o, arrMedian(o), arrTrimean(o))
   sys.exit(0)
   # print gmail.send('byaka.life@gmail.com', '35921514', 'byaka.life@gmail.com', 'this is a test message', 'Test'), sys.exit(0)
   # print arrEjectionClean2([10, 20, 0, 0.11, 1.12, 0.22, 0.31, 1.24, 0.51, 0.72], returnIndex=False, returnEjections=False, useTrimean=True), sys.exit(0)
   # print intersectWord('b-common__list_font_bold', ['prof-on-board__road-icon_type_join'])
   # print wordMatchPart('b-common__list_font_bold', 'prof-on-board__road-icon_type_join', nearMap={}, caseSensitive=True)
   sys.exit(0)
   # print wordImpulse2(u'щет', u'счед')
   # print wordImpulse2(u'подьезжал', u'съездил')
