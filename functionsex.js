window.functionsEx=window.functionsEx|| new String('fex');
/****************************************/
/**************functionsEx***************/
/***/functionsEx.version=1.71;/**********/
/****************************************/
/*********Copyright 2018, BYaka**********/
/*******Email: byaka.life@gmail.com******/
/*********Licensed with Apache2**********/
/****************************************/
/*
   Поддерживается механизм изберательного импорта библиотеки.
      Переменная functionsEx.import задает белый список импортируемых сущностей (по умолчанию {'vars':true, 'funcs':true, 'proto':true}).
      Переменная functionsEx.scope задает область видимости импортируемых сущностей (по умолчанию window).
      В случае, если в переданном scope уже присутствует импортируемое имя, бибилиотека распознает это и либо подменит имя на fex_<name>, либо пропустит импорт данного имени
*/
functionsEx['import']=functionsEx['import']|| (functionsEx['import']===false? false: true);
functionsEx['scope']=functionsEx['scope']|| (functionsEx['scope']===null? null: window);
//! github.com/jkroso/equals
/*============================================================*/
functionsEx.vars=functionsEx.vars|| {};
functionsEx.funcs=functionsEx.funcs|| {};
functionsEx.proto_str=functionsEx.proto_str|| {};
functionsEx.proto_arr=functionsEx.proto_arr|| {};
functionsEx.proto_obj=functionsEx.proto_obj|| {};
functionsEx.proto_obj2=functionsEx.proto_obj2|| {};
functionsEx.proto_num=functionsEx.proto_num|| {};
functionsEx.proto_bool=functionsEx.proto_bool|| {};
/*============================================================*/
functionsEx.vars.None=undefined; //совместимость с питоном
functionsEx.vars.True=true; //совместимость с питоном
functionsEx.vars.False=false; //совместимость с питоном
functionsEx.vars.rad2deg=180/Math.PI; //умножить для перевода радиан в градусы
functionsEx.vars.deg2rad=Math.PI/180; //умножить для перевода градусов в радианы
/*============================================================*/
functionsEx.vars.re_isEmail=new RegExp('^([a-zA-Z0-9_\\.\\-\\+])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$');
functionsEx.vars.re_isURL=new RegExp('((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)');
functionsEx.vars.re_isSite=functionsEx.vars.re_isURL; // /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/;
functionsEx.vars.re_isPassword=new RegExp('^[\\w_]{6,18}$');
functionsEx.vars.re_anySymbol=new RegExp('.{1}');
functionsEx.vars.re_anyText=new RegExp('.*');
functionsEx.vars.re_anyWord=new RegExp('[a-zA-Zа-яёА-ЯЁ0-9_\\-]+');
functionsEx.vars.re_float=new RegExp('-{0,1}[0-9]+([.]{0,1}[0-9]*)');
/*============================================================*/

//реализация коллбека одиночного и дабл клика
/*
if(!$(this).data('clicked')){
   $(this).data('clicked',true);
   var ths=this;
   $(this).data('timer',setTimeout(function(){
      //single click
  }, 200));
}else{
   window.getSelection().removeAllRanges();
   clearTimeout($(this).data('timer'));
   $(this).data('clicked',false);
   //double click
}
*/
/*============================================================*/
//! check benchmark jsperf.com/a-typeof-versus-constructor-comparison/13
functionsEx.funcs.isNaN=function(o){return o!==o}

functionsEx.funcs.isNull=function(o){
   if(o===null || o===undefined) return true;
   return false;
}

functionsEx.funcs.isEmpty=function(o){
   if(o===null || o===undefined || o==='' || o===0) return true;
   else if(o.length===0) return true;
   else if(isObject(o)) return functionsEx.proto_obj.keys(o).length===0;
   return false;
}

functionsEx.funcs.isTypedArray=function(o){
   // return functionsEx.proto_arr.inOf(['[object Uint8Array]', '[object Int8Array]', '[object Uint16Array]', '[object Int16Array]', '[object Uint32Array]', '[object Int32Array]', '[object Float32Array]', '[object Float64Array]'], Object.prototype.toString.call(o));
   if(!o) return false;
   var constructor=o.constructor;
   return constructor===Uint8Array || constructor===Int8Array || constructor===Uint16Array || constructor===Int16Array || constructor===Uint32Array || constructor===Int32Array || constructor===Float32Array || constructor===Float64Array;
}

functionsEx.funcs.isArray=function(o){
   // return o && Object.prototype.toString.call(o)==='[object Array]';
   return o && o.constructor===Array;
}

functionsEx.funcs.isHtmlArray=function(o){
   // if(!o) return false;
   // var t=Object.prototype.toString.call(o);
   // return (t==='[object HTMLCollection]' || t==='[object NodeList]');
   return o && (o.constructor===HTMLCollection || o.constructor===NodeList);
}

functionsEx.funcs.isArgs=function(o){
   return o && (Object.prototype.toString.call(o)==='[object Arguments]' || functionsEx.funcs.isFunction(o.callee)/*IE fix*/);
}

functionsEx.funcs.isArrayEx=function(o){
   return o && (functionsEx.funcs.isArray(o) || functionsEx.funcs.isTypedArray(o) || functionsEx.funcs.isHtmlArray(o));
}

functionsEx.funcs.isFunction=function(o){
   return o && typeof(o)==='function';
}

functionsEx.funcs.isFunctionEx=function(o, namespc, returnFunc){
   if(!o) return false;
   if(functionsEx.funcs.isFunction(o)) return (returnFunc? o: true);
   else{
      namespc=namespc|| window;
      var nn=false;
      namespc=functionsEx.funcs.isArray(namespc)? namespc: [namespc];
      functionsEx.funcs.forMe(namespc, function(n){
         n=n|| window;
         if(functionsEx.funcs.isFunction(n[o])){
            nn=n;
            return (returnFunc? null: false);
         }
      })
      return (returnFunc? nn[o]: nn);
   }
}

functionsEx.funcs.isFunctionNative=function(o){
   if(!o) return false;
   return !!o && (typeof o).toLowerCase()=='function' && (o===Function.prototype || functionsEx.funcs.isFunctionNative.re_checkNative.test(''+o));
}
functionsEx.funcs.isFunctionNative.re_checkNative=/^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i;

functionsEx.funcs.isString=function(o){
   // return Object.prototype.toString.call(o)=='[object String]';
   return !functionsEx.funcs.isNull(o) && o.constructor===String;
}

functionsEx.funcs.isRegExp=function(o){
   // return o && Object.prototype.toString.call(o)==='[object RegExp]';
   return o && o.constructor===RegExp;
}

functionsEx.funcs.isObject=function(o){
   if(!o) return false;
   var t=Object.prototype.toString.call(o);
   return (t==='[object Object]' || t==='[object global]' || t==='[object Window]');
   //! проверка ниже работает намного быстрее, но не позволяет корректно обработать некоторые типы. например $().constructor вернет фунцию jquery, а не Object.
   // return o!=null && (o.constructor===Object || o.constructor===Window);
}

functionsEx.funcs.isNumber=function(o){
   // return Object.prototype.toString.call(o)==='[object Number]';
   return !functionsEx.funcs.isNull(o) && o.constructor===Number;
}

functionsEx.funcs.isJquery=function(o){
   return o && o.jquery && (functionsEx.funcs.isArray(o) || functionsEx.funcs.isObject(o));
}

functionsEx.funcs.isObjectOfArray=function(o){
   if(!o) return false;
   if(!functionsEx.funcs.isObject(o)) return false;
   var tArr1=functionsEx.proto_obj.keys(o);
   if(!tArr1.length) return false;
   return !functionsEx.funcs.forMe(tArr1, function(k){return functionsEx.funcs.isArray(o[k])});
}

functionsEx.funcs.isArrayOfObject=function(o){
   if(!o) return false;
   if(!functionsEx.funcs.isArray(o) || !o.length) return false;
   return !functionsEx.funcs.forMe(o, function(v){return functionsEx.funcs.isObject(v)});
}

functionsEx.funcs.isDOM=function(o){
   if(!o) return false;
   try{//Using W3 DOM2 (works for FF, Opera and Chrome)
      return o instanceof HTMLElement;
   }catch(e){ //Browsers not supporting W3 DOM2 don't have HTMLElement and an exception is thrown. Testing some properties that all elements have. (works on IE7)
      return typeof(o)==="object" && o.nodeType===1 && o.style!=null && typeof(o.style)==="object" && o.ownerDocument && typeof(o.ownerDocument)==="object";
   }
}
/*============================================================*/
// window.print=null; //отключаем стандартный метод вывода на печать
functionsEx.funcs.print=function(){
   functionsEx.funcs.prindAndSave.apply(null, arguments);
}
functionsEx.funcs.printOnly=function(){
   //обертка над cosole.log()
   var args=functionsEx.funcs.forMe(arguments, function(objs2, i){
      return 'objs['+i+']';
   }, null, true)
   if(!window.console){
      window.console={log:function(){}};
      alert('Caution: window.console not exist!');
   }
   fn='window.console.log(args)';
   fn=new Function('objs', fn.replace('args', args.join(',')));
   fn(arguments);
}
functionsEx.funcs.prindAndSave=function(){
   //обертка над console.log(), дополнительно сохраняет все значения в print.val[]
   functionsEx.funcs.print.val=functionsEx.funcs.forMe(arguments, function(o, i){
      return o;
   },null, true)
   functionsEx.funcs.printOnly.apply(null, arguments);
}
/*============================================================*/
functionsEx.funcs.assert=function(cond){
   if(cond) return;
   functionsEx.funcs.printOnly.apply(null, arguments);
   if(functionsEx.funcs.assert.useDebugger) debugger;
   throw 'Assertion error';
}
/*============================================================*/
functionsEx.funcs.translit=function(text, en2ru, map){
   en2ru=en2ru===true? true: false;
   var ru=map&&map.ru? map.ru: "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь";
   var en=map&&map.en? map.en: "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `";
   if(functionsEx.funcs.isString(ru)) ru=ru.split(/ +/g);
   if(functionsEx.funcs.isString(en)) en=en.split(/ +/g);
   functionsEx.funcs.forMe(ru, function(s, i){
      text=text.split(en2ru? en[i]: ru[i]).join(en2ru? ru[i]: en[i]);
      text=text.split(en2ru? en[i].toUpperCase(): ru[i].toUpperCase()).join(en2ru? ru[i].toUpperCase(): en[i].toUpperCase());
   })
   return text;
}

functionsEx.funcs.untranslit=function(text, map){
   return functionsEx.funcs.translit(text, true, map)
}
/*============================================================*/
functionsEx.funcs.hex2rgb=function(hex, likeArray){
   var l=parseInt(hex.replace(/^#/, ""), 16);
   var rgb={
      r:(l >>> 16) & 0xff,
      g:(l >>> 8) & 0xff,
      b:l & 0xff
   };
   if(likeArray) rgb=[rgb.r, rgb.g, rgb.b];
   return rgb;
}

functionsEx.funcs.component2hex=function(c){
   var hex=c.toString(16);
   return (hex.length==1)? '0'+hex: hex;
}

functionsEx.funcs.rgb2hex=function(rgb){
   return "#"+functionsEx.funcs.component2hex(rgb[0])+functionsEx.funcs.component2hex(rgb[1])+functionsEx.funcs.component2hex(rgb[2]);
}

functionsEx.funcs.gradient=function(color2, color1, weight, likeArray){
//==создает цвет между двумя переданными по заданному смещению
   if(isString(color1))
      color1=functionsEx.funcs.hex2rgb(color1, true);
   if(isString(color2))
      color2=functionsEx.funcs.hex2rgb(color2, true);
   var p=weight;
   var w=p*2-1;
   var w1=(w/1+1)/2;
   var w2=1-w1;
   var rgb=[
      Math.round(color1[0]*w1+color2[0]*w2),
      Math.round(color1[1]*w1+color2[1]*w2),
      Math.round(color1[2]*w1+color2[2]*w2)
   ];
   return likeArray? rgb: functionsEx.funcs.rgb2hex(rgb);
}
/*============================================================*/
functionsEx.funcs.stopwatchMark=function(p){
   p=p|| {};
   name=p.name|| 'default';
   clear=p.clear|| false;
   wait=p.wait|| false;
   if(!functionsEx.vars.stopwatch['values'][name] || clear) functionsEx.vars.stopwatch['values'][name]=[];
   var mytime=functionsEx.funcs.getms(true, true);
   functionsEx.vars.stopwatch['values'][name].push(mytime);
   if(wait)
      functionsEx.vars.stopwatch['values'][name].push(null);
}

functionsEx.funcs.stopwatchShow=function(p){
   p=p|| {};
   name=p.name|| 'default';
   save=p.save|| false;
   wait=p.wait|| false;
   andPrint=p.andPrint===false? false: '%s = %s/%s';
   inMS=p.inMS===false? false: true;
   var vals=functionsEx.vars.stopwatch['values'][name];
   var v=0;
   var count=0;
   functionsEx.funcs.forMe(vals.length, function(i){
      if(!i) return;
      if(vals[i]===null || vals[i-1]===null) return;
      v+=vals[i]-vals[i-1];
      count+=1;
   })
   var mytime=functionsEx.funcs.getms(true, true);
   v+=(vals[vals.length-1]!==null? mytime-vals[vals.length-1]: 0);
   if(!inMS)
      v=functionsEx.funcs.parseIntFast(v/1000);
   count+=(vals[vals.length-1]!==null? 1: 0);
   if(save) functionsEx.funcs.stopwatchMark({name:name, wait:wait});
   if(andPrint && functionsEx.funcs.isString(andPrint))
      functionsEx.funcs.print('STOPWATCH:', functionsEx.proto_str.format(andPrint, name, v, count));
   return [v, count];
}

functionsEx.funcs.stopwatchShowAll=function(p){
   p=p|| {};
   includeDefault=p.includeDefault|| false;
   andPrint=p.andPrint===false? false: '%s = %s/%s';
   printSorted=p.printSorted===false? false: true;
   inMS=p.inMS===false? false: true;
   clear=p.clear|| false;
   var v={};
   functionsEx.funcs.forMe(functionsEx.vars.stopwatch['values'], function(k){
      if(!includeDefault && k=='default') return;
      v[k]=functionsEx.funcs.stopwatchShow({name:k, andPrint:false, inMS:inMS});
   })
   if(clear) functionsEx.vars.stopwatch['values']={'default':[]};
   if(functionsEx.funcs.isString(andPrint))
      functionsEx.funcs.forMe((printSorted? functionsEx.proto_obj.keys(v).sort(function(k1, k2){return v[k1][0]-v[k2][0]}).reverse(): v), function(k){
         functionsEx.funcs.print('STOPWATCH:', functionsEx.proto_str.format(andPrint, k, v[k][0], v[k][1]));
      })
   return v;
}

functionsEx.vars.stopwatch={'mark':functionsEx.funcs.stopwatchMark, 'show':functionsEx.funcs.stopwatchShow, 'showAll':functionsEx.funcs.stopwatchShowAll, 'values':{'default':[]}};
/*============================================================*/
/* crossbrowser Object.watch() implementation | (c) GIL LOPES BUENO, github.com/melanke/Watch.JS | 2012-08-18*/
//! Добавить поддержку IE6-8, смотри github.com/wburningham/Watch.JS/blob/master/src/watch.js
functionsEx.proto_obj._watch=functionsEx.proto_obj._watch|| Object.watch|| undefined;
functionsEx.proto_obj.watch=function(o, prop, handler, forceAccessors){
   //forceAccessors заставляет использовать метод getter/setter даже если доступен object.observe
   forceAccessors=forceAccessors===false? false: true;
   var oldval=o[prop], newval=oldval;
   var getter=function(){return newval};
   var setter=function(val){
      oldval=newval;
      newval=val;
      if(o['__unwatch__'] || oldval===newval) return newval;
      else{ //если коллбек возвращает значение, оно присвоится в качестве нового
         var s=handler.call(o, prop, oldval, newval);
         return newval=functionsEx.funcs.isNull(s)? newval: s;
      }
   }
   var isConst=!delete o[prop];
   if(!isConst){//can't watch constants
      //! похоже Object.observer окончательно удален из стандартов
      // try{
      //    if(forceAccessors) throw new Error();
      //    throw new Error(); //! сейчас использование Object.observe выключено, ибо нужно протестить, одинаково ли работает посравнению с аксцессорами. Кроме того стандарт еще не утвержден и сейчас поддерживается только в хроме
      //    Object.observe(o, function(changes){
      //       changes.forEach(function(change){
      //          if(functionsEx.proto_arr.inOf(['add'], change.type)) return;
      //          if(change.name===prop) setter(change.object[change.name]);
      //       })
      //    });
      //    o[prop]=newval;
      // }catch(e1){
         //! Использование try-catch чильно замедляет алгоритм
         if(Object.defineProperty){
            Object.defineProperty(o, prop, {get:getter, set:setter, enumerable:true, configurable:true});
         }else if(Object.prototype.__defineGetter__){
            Object.prototype.__defineGetter__.call(o, prop, getter);
            Object.prototype.__defineSetter__.call(o, prop, setter);
         }else{
            functionsEx.funcs.print('!!! Cant define setter|getter', o, prop);
            o[prop]=oldval;
            return false;
         }
      // }
   }else{
      functionsEx.funcs.print('!! Cant watch constants', o, prop);
      return false;
   }
   return true;
}

functionsEx.proto_obj._unwatch=functionsEx.proto_obj._unwatch|| Object.unwatch|| undefined;
functionsEx.proto_obj.unwatch=function(o, prop){
   var val=o[prop];
   delete o[prop]; //remove accessors
   o[prop]=val;
}
/*============================================================*/
functionsEx.proto_obj._keys=functionsEx.proto_obj._keys|| Object.keys|| undefined;
functionsEx.proto_obj.keys=function(o, allowNative){
//==возвращает массив ключей обьекта
   if(functionsEx.funcs.isNull(o)) return [];
   allowNative=allowNative===false? false: true;
   if(allowNative && functionsEx.proto_obj._keys && functionsEx.proto_obj._keys!==functionsEx.proto_obj.keys && functionsEx.funcs.isFunctionNative(functionsEx.proto_obj._keys)){
      return functionsEx.proto_obj._keys(o);
   }
   if(functionsEx.funcs.isObject(o))
      return functionsEx.funcs.forMe(o, function(v, k){return k}, true, true);
   else{
      //если передан обьект String(), то forMe обработает его как строку и не извлечет ключи
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
      var hasOwnProperty=Object.prototype.hasOwnProperty;
      var hasDontEnumBug=!({toString:null}).propertyIsEnumerable('toString');
      var dontEnums=['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'], dontEnumsLength=dontEnums.length;
      var tArr=[], k, i;
      for(k in o){
         if (hasOwnProperty.call(o, k)) tArr.push(k);
      }
      if(hasDontEnumBug){
         for(i=0; i<dontEnumsLength; i++){
          if(hasOwnProperty.call(obj, dontEnums[i])) tArr.push(dontEnums[i]);
        }
      }
      return tArr;
   }
}

functionsEx.proto_obj.values=function(o){
//==возвращает массив значений обьекта
   return functionsEx.funcs.forMe(o,function(v, k){return v}, true, true);
}

functionsEx.proto_obj._assign=functionsEx.proto_obj._assign|| Object.assign|| undefined;
functionsEx.proto_obj.assign=function(o){
//==возвращает мутацию обьекта
   if(!functionsEx.funcs.isObject(o)){
      functionsEx.funcs.print('!! Argument not a Object', o);
      return {};
   }
   if(functionsEx.proto_obj._assign && functionsEx.proto_obj._assign!==functionsEx.proto_obj.assign && functionsEx.funcs.isFunctionNative(functionsEx.proto_obj._assign)){
      return functionsEx.proto_obj._assign.apply(window, arguments);
   }
   var res=o;
   functionsEx.funcs.forMe(arguments, function(o2, i){
      if(!i || !o2) return;
      if(!functionsEx.funcs.isObject(o2))
         return functionsEx.funcs.print('!! Argument not a Object', o2);
      functionsEx.funcs.forMe(o2, function(k, v){res[k]=v});
   })
   return res;
}
functionsEx.proto_obj.merge=functionsEx.proto_obj.assign;

functionsEx.proto_obj.get=function(o, k, def){
   if(o[k]!==undefined) return o[k];
   else return def;
}

functionsEx.proto_obj.sort=function(o, f, reverse){
//==сортирует обьект
   var keys=functionsEx.proto_obj.keys(o).sort(f);
   if(reverse) keys.reverse();
   var oSorted={};
   functionsEx.funcs.forMe(keys, function(k){
      oSorted[k]=o[k];
   })
   return oSorted;
}

functionsEx.proto_obj.clear=function(o){
//==опустошает обьект, не теряя ссылку
   functionsEx.funcs.forMe(functionsEx.proto_obj.keys(o), function(key){
      delete o[key];
   })
}

functionsEx.proto_obj.byIndex=function(o, i, def){
   var tArr1=functionsEx.proto_obj.keys(o);
   if(!tArr1.length) return def;
   if(functionsEx.funcs.isArray(i)){
      res=functionsEx.funcs.forMe(i, function(ii){
         var k=tArr1[ii];
         return (!k || !o[k]? def: o[k]);
      }, null, true)
      return res;
   }else{
      var k=tArr1[i];
      return (!k || !o[k]? def: o[k]);
   }
}

functionsEx.proto_obj.make=function(key, val){
//==создает обьект из переданных ключей и значений
   var s={};
   var _keyIsArr=functionsEx.funcs.isArray(key);
   var _valIsArr=functionsEx.funcs.isArray(val);
   if(!_valIsArr && !_keyIsArr) s[key]=val;
   else if(_keyIsArr && !val){ //особый случай, похож на python, на вход подается массив массивов [key, val]
      functionsEx.funcs.forMe(key, function(tArr, i){
         if(!functionsEx.funcs.isArray(tArr) || tArr.length!==2) return;
         s[tArr[0]]=tArr[1];
      })
   }else if(_keyIsArr){ //сихнронное заполнение
      functionsEx.funcs.forMe(key, function(k, i){
         if(val==='[]') s[k]=[];
         else s[k]=_valIsArr? val[i]: val;
      })
   }else if(_valIsArr){ //особый случай, формируется массив обьектов
      s=functionsEx.funcs.forMe(val, function(v){
         var ss={}; ss[key]=v;
         return ss;
      }, null, true)
   }
   return s;
}

functionsEx.proto_obj.update=function(o1, o2){ //!перевести на Object.assign
//==рекурсивно обновляет обьект в соответствии с переданным
   if(!functionsEx.funcs.isObject(o2) || !functionsEx.funcs.isObject(o1)) return null;
   functionsEx.funcs.forMe(o2, function(k, v){
      if(functionsEx.funcs.isObject(v) && functionsEx.funcs.isObject(o1[k]))
         functionsEx.proto_obj.update(o1[k], v);
      else o1[k]=v;
   })
   return o1;
}

functionsEx.proto_obj.inObj=function(obj, key, val, returnAsObj, eq, eqErr, onlyOne, formatAsObj){
//==из обьекта обьектов возвращает ключ или ссылку если key==val
   //для проверки по множеству условий key==null, val={key1:val1, key2:val2}
   var out=formatAsObj? {}: [];
   eq=eq|| '==';
   onlyOne=onlyOne===false? false: true;
   functionsEx.funcs.forMe(obj, function(k, d){
      if(d==undefined || !functionsEx.funcs.isObject(d)) return;
      if(!functionsEx.funcs.isObject(val)){
         if(functionsEx.funcs.eqMe(d[key], val, eq, eqErr)){
            if(!formatAsObj) out.push(returnAsObj? d: k);
            else out[k]=d;
            if(onlyOne) return false;
         }
      }else if(functionsEx.funcs.isObject(val)){
         //! Добавить распознавание eq как префикс ключа
         var isOk=!functionsEx.funcs.forMe(val, function(k, v){
            return Boolean(functionsEx.funcs.eqMe(d[k], v, eq, eqErr));
         });
         if(isOk){
            if(!formatAsObj) out.push(returnAsObj? d: k);
            else out[k]=d;
            if(onlyOne) return false;
         }
      }
   })
   return formatAsObj? out: (onlyOne? (out.length? out[0]: undefined): out);
}

functionsEx.proto_obj.inObjAll=function(obj, key, val, returnAsObj, eq, eqErr, formatAsObj){
//==обертка для "вернуть все"
   return functionsEx.proto_obj.inObj(obj, key, val, returnAsObj, eq, eqErr, false, formatAsObj);
}

functionsEx.proto_obj.inObjEx=function(obj, what, returnAsObj, eq, eqErr, onlyOne, formatAsObj){
//==обертка для "множество условий"
   if(!functionsEx.funcs.isObject(what) || functionsEx.proto_obj.keys(what).length==0)
      return onlyOne? undefined: [];
   return functionsEx.proto_obj.inObj(obj, null, what, returnAsObj, eq, eqErr, onlyOne, formatAsObj);
}
/*============================================================*/
functionsEx.funcs.max=function(){return Math.max.apply(Math, arguments);}

functionsEx.funcs.min=function(){return Math.min.apply(Math, arguments);}

functionsEx.funcs.round=function(s, d){
   if(functionsEx.funcs.isString(s)) s=functionsEx.funcs.parseFloatEx(s);
   if(!functionsEx.funcs.isNumber(s)) return s;
   s=s.toFixed(d);
   if(d!==0 && !functionsEx.funcs.isNull(d)) s=parseFloat(s);
   else s=parseInt(s);
   return s;
}

functionsEx.funcs.randomColor=function(){
   var letters='0123456789ABCDEF'.split('');
   var color='#';
   functionsEx.funcs.forMe(6, function(){
      color+=letters[functionsEx.funcs.round(Math.random()*15)];
   });
   return color;
}

functionsEx.funcs.random=function(min, max){
   if(!arguments.length) return Math.random();
   else if(arguments.length==1){
      max=min;
      min=0;
   }
   var s=Math.random()*(max-min)+min;
   return s;
}

functionsEx.funcs.randomEx=function(mult, vals, pref, suf){
//==создает случайное строковое значение по схеме pref+0..mult+suf, не встречающееся в vals
   pref=pref ||'';
   suf=suf ||'';
   mult=mult|| 65536;
   var s=pref+functionsEx.funcs.parseIntFast(Math.random()*mult)+suf;
   if(!vals) return s;
   else{
      while(true){
         if(functionsEx.funcs.isArray(vals) && !functionsEx.proto_arr.inOf(vals, s)) break;
         else if(functionsEx.funcs.isFunction(vals) && !vals(s)) break;
         else if(functionsEx.funcs.isObject(vals) && vals[s]===undefined) break;
         s=pref+functionsEx.funcs.parseIntFast(Math.random()*mult)+suf;
      }
   }
   return s;
}

functionsEx.funcs.funcName=function(f, namespc){
//==возвращает имя функции
   if(functionsEx.funcs.isFunction(f))
      return f.name|| f.caller.name|| functionsEx.proto_str.get(f.toString(), 'function ', '(');
   else if(functionsEx.funcs.isString(f) && functionsEx.funcs.isFunctionEx(f, namespc|| null)) return f;
   else return undefined;
}

functionsEx.funcs.callMe=function(func, args, namespc, argsAsArray){
//==вызов функции по имени, переданному в виде строки
   if(!func) return;
   namespc=namespc|| window;
   if(functionsEx.funcs.isFunction(func)){
      if(argsAsArray) return func.apply(null, args);
      else return func.call(null, args);
   }else if(functionsEx.funcs.isFunction(namespc[func])){
      if(argsAsArray) return namespc[func].apply(null, args);
      else return namespc[func].call(null, args);
   }
}

functionsEx.funcs.cloneMe=function(o, keep, only, keepFunctions){
//==клонирует обьект
   //метод работает быстро, только если все параметры выставлены в False
   keepFunctions=keepFunctions===false? false: true;
   if(!o) return '';
   if(!only && !keep && !keepFunctions) var tout=JSON.parse(JSON.stringify(o));
   else{
      if(functionsEx.funcs.isArray(o)) var tout=[];
      else if(functionsEx.funcs.isObject(o)) var tout={};
      else return;
      functionsEx.funcs.forMe(o, function(val, key){
         if(functionsEx.funcs.isFunction(val) && keepFunctions) tout[key]=val;
         else if(keep && functionsEx.proto_arr.inOf(keep, key)) tout[key]=val;
         else if(keep ||((only && functionsEx.proto_arr.inOf(only, key)) || !only)) {
            if(functionsEx.funcs.isObject(val) || functionsEx.funcs.isArray(val)) tout[key]=JSON.parse(JSON.stringify(val));
            else if(functionsEx.funcs.isFunction(val)) return;
            else tout[key]=val;
         }
      }, true)
   }
   return tout;
}

functionsEx.funcs.forMe=function(o, callback, sameorder, returnReturned, context){
//==обход всех элементов переданного обьекта|массива|строки|числа|jquery|arguments
   //при returnReturned===1 не игнорируются null, undefined
   var returnReturned=returnReturned ||false;
   if(!o)
      return returnReturned? []: undefined;
   var sameorder=sameorder ||false;
   var returned=[];
   var breaked=false;
   context=context|| this;
   var type=Object.prototype.toString.call(o);
   //type checking
   if(o===true || type==='[object Function]'){
      var oIsF=functionsEx.funcs.isFunction(o);
      while(oIsF? o(): true){
         var r=callback.call(context, o);
         if(!returnReturned && r===false){breaked=true;break;}
         else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
      }
   }else if(type==='[object Number]'){
      for(var i=0, l=o; i<l; i++){
         var r=callback.call(context, i,o);
         if(!returnReturned && r===false){breaked=true;break;}
         else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
      }
   }else if(type==='[object String]' || type==='[object Array]' || type==='[object Uint8Array]' || type==='[object Int8Array]' || type==='[object Uint16Array]' || type==='[object Int16Array]' || type==='[object Uint32Array]' || type==='[object Int32Array]' || type==='[object Float32Array]' || type==='[object Float64Array]' || type==='[object HTMLCollection]' || type==='[object NodeList]' || type==='[object Arguments]' || typeof(o.callee)==='function'){
      //! Есть проблема для "неправильных" массивов jsperf.com/array-for-if-many-empty
      for(var i=0, l=o.length; i<l; i++){
         if(o[i]!==undefined) var r=callback.call(context, o[i], i, o);
         else continue;
         if(o.length!==l) l=o.length;
         if(!returnReturned && r===false){breaked=true;break;}
         else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
      }
   }else if(o.jquery!==undefined){
      for(var i=0, l=o.length; i<l; i++){
         if(o[i]!==undefined) var r=callback.call(context, window.jQuery(o[i]), i, o);
         else continue;
         if(!returnReturned && r===false){breaked=true;break;}
         else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
      }
   }else if(type==='[object Object]' || type==='[object global]'){
      if(functionsEx.proto_obj._keys && functionsEx.proto_obj._keys!==functionsEx.proto_obj.keys && functionsEx.funcs.isFunctionNative(functionsEx.proto_obj._keys)){
         //если браузер поддерживает нативную Object.keys(), такой способ быстрее
         var tArr0=functionsEx.proto_obj._keys(o);
         for(var ii=0, l=tArr0.length; ii<l; ii++){
            var i=tArr0[ii];
            if(i===undefined || o[i]===undefined) continue;
            else if(!sameorder) var r=callback.call(context, i, o[i], o);
            else if(sameorder) var r=callback.call(context, o[i], i, o);
            if(!returnReturned && r===false){breaked=true;break;}
            else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
         }
      }else{
         for(i in o){
            //! if(!Object.getOwnPropertyDescriptor(o, i) || !Object.getOwnPropertyDescriptor(o, i).enumerable) continue
            if(!hasOwnProperty.call(o, i)) continue;
            else if(o[i]===undefined) continue;
            else if(!sameorder) var r=callback.call(context, i, o[i], o);
            else if(sameorder) var r=callback.call(context, o[i], i, o);
            if(!returnReturned && r===false){breaked=true;break;}
            else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
         }
      }
   }else if(o.length){ //для чегото, похожего на массив, но не являющегося им по факту и провалившего отсальные проверки
      for(var i=0, l=o.length; i<l; i++){
         if(o[i]!==undefined) var r=callback.call(context, o[i],i,o);
         else continue;
         if(o.length!==l) l=o.length;
         if(!returnReturned && r===false){breaked=true;break;}
         else if(returnReturned && (returnReturned===1 || !functionsEx.funcs.isNull(r))) returned.push(r);
      }
   }else{
      return console.log('!!! functionsEx:forMe unsupported object of type', type, o);
   }
   return (returnReturned===true || returnReturned===1)? returned: breaked;
}

functionsEx.funcs.prepData=function(data, andLinebreak, andSpace){
//==подготавливает данные для записи в DOM обьект
   if(!data) return '';
   var s=data;
   if(!functionsEx.funcs.isString(s)) s=JSON.stringify(data);
   s=s.replace(/\'/g,'&#39;').replace(/\"/g,'&#34;').replace(/\</g,'&#60;').replace(/\>/g,'&#62;');
   if(andLinebreak)
      s=s.replace(/\n/g, '<br>');
   if(andSpace)
      s=s.replace(/[\t ]/g, '&nbsp;');
   return s;
}

functionsEx.funcs.getms=function(inMS, highRes){
   inMS=inMS===false? false: true;
   var s=null;
   //get
   if(highRes && window.perfomance && window.perfomance.now) s=window.performance.now();
   else if(Date.now) s=Date.now();
   else s=new Date().getTime();
   //convert
   if(inMS) return s;
   else
      return functionsEx.funcs.parseIntFast(s/1000);
}

functionsEx.funcs.eqMe=function(x, y, as, err){
//==возвращает реультат сравнения x и y по паттерну as.
   //паттерны сравнения: (==|!= строгое сравнение), (>=|!<|<=|!> больше/меньше или равно), (>>|>|<<|< больше или меньше), (%%|!% вхождение подстроки), ($$|!$ вхождение подстроки как слова (слева и справа должны быть НЕ буквы или цифры))
   //err это погрешность, которой можно пренебречь при сравнении, и подефолту она равна 0.
   //для (%%|!%|$$|!$) это флаг, отключить ли регистрозависимость символов и подефолту он ВКЛЮЧЕН.
   //для (%%|!%|$$|!$) проверяется вхождение Y в X, тоесть выражение будет (Y in X), а не наоборот.
   var res=undefined;
   err=err===undefined?undefined:err;
   as=as ||'==';
   if(err && (as=='==' || as=='!=')){ //сравнение чисел с погрешностью
      x=functionsEx.funcs.parseFloatEx(x);
      y=functionsEx.funcs.parseFloatEx(y);
      if(!functionsEx.funcs.isArray(err)){
         if(as=='==') res=(Math.abs(y-x)<=err);
         else if(as=='!=') res=(Math.abs(y-x)>err);
      }else{
         if(as=='==') res=((y-x>=0 && y-x<=err[0]) || (x-y>=0 && x-y<=err[1]));
         else if(as=='!=') res=(Math.abs(y-x)>err);
      }
   }else if(functionsEx.proto_arr.inOf(['%%','!%'], as)){ //сравнение вхождения
      x=err!==false ? String(x).toLowerCase() : String(x);
      y=err!==false ? String(y).toLowerCase() : String(y);
      if(as=='%%') res=functionsEx.proto_str.inOf(x, y)!=undefined;
      else if(as=='!%') res=functionsEx.proto_str.inOf(x, y)==undefined;
   }else if(functionsEx.proto_arr.inOf(['$$','!$'], as)){ //сравнение вхождения как слова
      x=err!==false ? String(x).toLowerCase() : String(x);
      y=err!==false ? String(y).toLowerCase() : String(y);
      var p1=RegExp('[^a-zA-Z0-9а-яёА-ЯЁ_]'+y+'[^a-zA-Z0-9а-яёА-ЯЁ_]');
      var p2=RegExp('^'+y+'[^a-zA-Z0-9а-яёА-ЯЁ_]');
      var p3=RegExp('[^a-zA-Z0-9а-яёА-ЯЁ_]'+y+'$');
      if(as=='$$')
         res=(x.search(p1)!==-1 || x.search(p2)!==-1 || x.search(p3)!==-1);
      else if(as=='!$')
         res=(x.search(p1)===-1 && x.search(p2)===-1 && x.search(p3)===-1);
   }else{ //обычные сравнения
      if(Boolean(Number(x))) x=Number(x); else x=String(x).toLowerCase(); //!/[^0-9,.]+/.test(x)
      if(Boolean(Number(y))) y=Number(y); else y=String(y).toLowerCase();
      if(as=='==') res=(x==y);
      else if(as=='!=') res=(x!=y);
      else if(as=='<=' || as=='!>') res=(x<=y);
      else if(as=='>=' || as=='!<') res=(x>=y);
      else if(as=='<<' || as=='<') res=(x<y);
      else if(as=='>>' || as=='>') res=(x>y);
   }
   return res;
}

functionsEx.funcs.roundBy=function(val, by){
//==округление до разряда или числа
   by=by||100;
   if(Math.abs(val)<by) return by;
   var s=val/by;
   s=Math.floor(s)*by;
   return s;
}

functionsEx.funcs.reRound=function(val, to, asfloat){
//==рециклинг числа до заданного максимума
   to=to||100;
   if(Math.abs(val)<to) return val;
   var s=val/to;
   s=(s-Math.floor(s))*to;
   if(!asfloat) s=Math.round(s);
   return s;
}

functionsEx.funcs.parseFloatEx=function(s){
//==извлечение числа из строки
   if(functionsEx.funcs.isNumber(s)) return s;
   var v=functionsEx.vars.re_float.exec(s);
   if(v===null) return 0;
   return Number(v[0]);
}

functionsEx.funcs.parseIntFast=function(s){
//==очень быстрое извлечение целой части из строки, для чисел используется фоллбек
   if(functionsEx.funcs.isNumber(s)) return Math.floor(s);
   return s>>0;
}

functionsEx.funcs.reAngle=function(val){
//==рециклинг угла
   if(functionsEx.funcs.isString(val)) val=parseFloat(val);
   val=functionsEx.funcs.reRound(val,360,true);
   if(val<=0) val+=360;
   return val;
}

functionsEx.funcs.animationReady=(function(){
   return window.requestAnimationFrame.bind(window) ||
      window.webkitRequestAnimationFrame.bind(window) ||
      window.mozRequestAnimationFrame.bind(window) ||
      window.oRequestAnimationFrame.bind(window) ||
      window.msRequestAnimationFrame.bind(window) ||
      function(callback, element){window.setTimeout(callback, 1000/60)};
})();

functionsEx.funcs.domReady=function(cb){
//вызовет cb() когда дом-дерево будет подгружено, даже если в фоне грузятся левые ресурсы типа скриптов вконтакта или картинок
   var s=document.readyState;
   if(s=='interactive' || s=='loaded' || s=='complete') return cb();
   var __timerIdForDOMReady=setInterval(function(){
      var s=document.readyState;
      if(!(s=='interactive' || s=='loaded' || s=='complete')) return;
      clearInterval(__timerIdForDOMReady);
      cb();
   }, 100)
}

functionsEx.funcs.getCookie=function(name){
//считываем cookie по имени
   if(!name) return undefined;
   name=name.replace(functionsEx.funcs.getCookie.re_replace, '\\$1');
   var r=new RegExp('(?:^|; )'+name+'=([^;]*)');
   var s=document.cookie.match(r);
   return s? decodeURIComponent(s[1]): undefined;
}
functionsEx.funcs.getCookie.re_replace=/([\.$?*|{}\(\)\[\]\\\/\+^])/g;

functionsEx.funcs.getXPath=function(a){
//генерируем Xpatch для элемента
   for(var d=document.getElementsByTagName("*"),b=[];a&&1==a.nodeType;a=a.parentNode)if(a.hasAttribute("id")){for(var e=0,c=0;c<d.length&&!(d[c].hasAttribute("id")&&d[c].id==a.id&&e++,1<e);c++);if(1==e){
      b.unshift('id("'+a.getAttribute("id")+'")');
      b=b.join("/");
      return b;
   }
   b.unshift(a.localName.toLowerCase()+'[@id="'+a.getAttribute("id")+'"]')}else if(a.hasAttribute("class"))b.unshift(a.localName.toLowerCase()+'[@class="'+a.getAttribute("class")+'"]');else{i=1;for(sib=a.previousSibling;sib;sib=sib.previousSibling)sib.localName==a.localName&&i++;b.unshift(a.localName.toLowerCase()+"["+i+"]")}
   b=b.length? "/"+b.join("/"): null;
   return b;
}

functionsEx.funcs.getCSSPath=function(a){
//генерируем CSS-selector для элемента
   for(var e="",f=[],b,c,d;a;){b=a.nodeName.toLowerCase();c=a.id?"#"+a.id:!1;d=a.className?"."+a.className.replace(/\s+/g,"."):"";b=c?b+c+d:d?b+d:b;f.unshift(b);if(c)break;a=a.parentNode!==document?a.parentNode:!1}for(a=0;a<f.length;a++)e+=" "+f[a];
   e=e.replace(/^[ \t]+|[ \t]+$/, "")
   return e;
}

functionsEx.funcs.isSSL=function(url){
   var p='';
   if(url)
      p=functionsEx.funcs.parseURL2(url).protocol+':';
   else
      p=window.top.location.protocol|| window.self.location.protocol;
   return p==='https:'? true: false;
}

functionsEx.funcs.inIframe=function(){
//определяем, запущено ли внутри Iframe
   try{
      return window.self!=window.top || window.top.location!=window.self.location;
   }catch(e){
      return true;
   }
}

functionsEx.funcs.inPrivateMode=function(cb){
//пытаемся определить, включен ли Incognito (private) mode
   //! RequestFileSystem поддерживается только в Chrome
   //! Данный метод может перестать работать в новых версиях
   var fs=window.RequestFileSystem || window.webkitRequestFileSystem;
   if(!fs) //RequestFileSystem not supported
      return cb(null);
   fs(window.TEMPORARY, 100, function(fs){
      cb(false);
   }, function(err){
      cb(true);
   });
}

functionsEx.funcs.documentReady=function(cb){
//кроссбраузерная реализация onLoad с обходом ошибок загрузки ресурсов
   window[addEventListener? 'addEventListener': 'attachEvent'](addEventListener? 'load': 'onload', cb);
}

functionsEx.funcs.ajaxMe=function(url, cb, method, data, headers, sync){
//нативная реализация ajax
   var req=undefined;
   data=data|| null;
   sync=sync|| false;
   if(sync) functionsEx.funcs.print('!!! Sync=True for AJAX is depricated');
   cb=cb|| null;
   headers=headers|| {};
   method=(method|| 'get').toUpperCase();
   if(window.XMLHttpRequest) req=new XMLHttpRequest();
   else req=new ActiveXObject("Microsoft.XMLHTTP");
   if(!req) return;
   req.open(method, url);
   // req.timeout=10000;
   functionsEx.funcs.forMe(headers, function(hK, hV){req.setRequestHeader(hK, hV)});
   req.onreadystatechange=function(e){
      if(req.readyState!==4) return;
      if(cb && functionsEx.funcs.isFunction(cb))
         cb(req.responseText, req.status, req, {'url':url, 'cb':cb, 'method':method, 'data':data, 'headers':headers, 'sync':sync});
      req.abort(); //! добавил для теста
   };
   req.send(data);
}

functionsEx.funcs.jsonpMe=function(url, cb, data, method, sync, cbKey, noEncodeData){
   data=data|| {};
   sync=sync|| false;
   method=method? '/'+method: ''; //используется в качестве окончания к URL, нужен для некоторых реализаций
   cb=cb|| '';
   cbKey=cbKey|| 'jsonp';
   //подготавливаем callback
   if(cbKey){
      var cbName=functionsEx.funcs.randomEx(144000, functionsEx.proto_obj.keys(window), 'jsonpCallback_');
      var cbKeyVal=functionsEx.proto_str.format('%s=%s', cbKey, cbName);
      window[cbName]=function(){
         delete window[cbName];
         if(cb && functionsEx.funcs.isFunction(cb)) cb.apply(this, arguments);
      };
   }
   //подготавливаем url
   data=functionsEx.funcs.forMe(data, function(k, v){
      return k+'='+(noEncodeData? v: encodeURI(v))
   }, null, true).join('&');
   var needLastSlash=functionsEx.proto_str.last(url)=='/';
   url=functionsEx.proto_str.last(url)=='/'? url.slice(0, -1): url;
   url=functionsEx.proto_str.format('%(url)s%(method)s%(lastSlash)s?%(data)s&%(cbKeyVal)s', {'url':url, 'method':method, 'data':data, 'cbKeyVal':cbKeyVal, 'lastSlash':(needLastSlash? '/': '')});
   //инициируем запрос
   var tFunc0=function(){
      if(this.readyState && this.readyState=="loading") return; //IEfix
      setTimeout(function(){
         document.getElementsByTagName('head')[0].removeChild(script);
      }, 1000);
   }
   var script=document.createElement('script');
   script.type='text/javascript';
   script.async=!sync;
   script.onload=script.onerror=script.onreadystatechange=tFunc0;
   script.charset='utf-8';
   script.src=url;
   document.getElementsByTagName('head')[0].appendChild(script);
}

functionsEx.funcs.corsMe=function(url, cb, xpath, format){
   format=format|| 'json';
   xpath=xpath|| '*';
   url_esc=encodeURI(url)
   url_esc=url_esc.split('%20').join('%2B');
   functionsEx.funcs.jsonpMe('https://query.yahooapis.com/v1/public/yql', function(data){
      //! here need to implement error checking
      if(isFunction(cb)) cb(data, url);
   }, {
      q:functionsEx.proto_str.format('select * from htmlstring where url="%s" and xpath="%s"', url_esc, xpath),
      format:format,
      env:encodeURI('store://datatables.org/alltableswithkeys'),
   }, '', false, 'callback', true);
}

//? почемуто эти два метода находятся не в прототипе массива
functionsEx.funcs.sorted=function(arr, key){
//==возвращает отсортированный массив не изменяя исходный
   if(!functionsEx.funcs.isArrayEx(arr)) return arr;
   var tArr=functionsEx.funcs.cloneMe(arr);
   return tArr.sort(key);
}
functionsEx.funcs.arrSorted=functionsEx.funcs.sorted; //для совместимости

functionsEx.funcs.intersect=function(){
//==поиск пересчений массивов
   //http://goo.gl/g4A6Q
   var a,b,c,d,e,f,g=[],h={},i;i=arguments.length-1;d=arguments[0].length;c=0;for(a=0;a<=i;a++){e=arguments[a].length;if(e<d){c=a;d=e}}for(a=0;a<=i;a++){e=a===c?0:a||c;f=arguments[e].length;for(var j=0;j<f;j++){var k=arguments[e][j];if(h[k]===a-1){if(a===i){g.push(k);h[k]=0}else{h[k]=a}}else if(a===0){h[k]=0}}}return g
}
functionsEx.funcs.arrIntersect=functionsEx.funcs.intersect; //для совместимости
/*============================================================*/
functionsEx.proto_arr.median=function(o, ignoreNull){
//==ищет медиану
   var values=functionsEx.funcs.cloneMe(o);
   if(ignoreNull) values=functionsEx.funcs.forMe(values, function(v){if(v!=0) return v}, null, true);
   values.sort(function(a,b){return a-b});
   var half=Math.floor(values.length/2);
   if(values.length%2) return values[half];
   else return (values[half+1]+values[half])/2;
}

functionsEx.proto_arr.and=function(o, falsePattern){
//==вычисляет AND массива
   falsePattern=falsePattern|| ['', null, undefined, false, '0', 0];
   if(functionsEx.proto_arr.inOf(falsePattern, undefined) && functionsEx.proto_arr.inOf(o, undefined)) var r=false; // forMe() пропускате значения undefined
   else
      var r=!functionsEx.funcs.forMe(o, function(v){if(functionsEx.proto_arr.inOf(falsePattern, v)) return false});
   return r;
}

functionsEx.proto_arr.or=function(o, falsePattern){
//==вычисляет OR массива
   falsePattern=falsePattern|| ['', null, undefined, false, '0', 0];
   var r=functionsEx.funcs.forMe(o, function(v){if(!functionsEx.proto_arr.inOf(falsePattern, v)) return false});
   return r;
}

functionsEx.proto_arr.ejectionClean=function(o, delicacy, returnEjections, returnIndex, ignoreNull){
//==чистит цифровую выборку от выбросов, используя робастный подход по медиане
   delicacy=delicacy|| 0.51;
   returnEjections=returnEjections|| false;
   returnIndex=returnIndex|| false;
   var out=[];
   var median=functionsEx.proto_arr.median(o, ignoreNull), medianM=delicacy*median;
   functionsEx.funcs.forMe(o, function(v, i){
      if(Math.abs(median-v)>medianM){
         if(!returnEjections) return;
         else return out.push(returnIndex? i: v);
      }
      if(!returnEjections) out.push(returnIndex? i: v);
   });
   return out
}

functionsEx.proto_arr.ejectionClean2=function(o, delicacy, returnEjections, returnIndex, sortKey, allowSort){
//==чистит цифровую выборку от выбросов, используя робастный подход по соседним значениям
   //! Изза сортировки и специфики самый первый элемент не распознается как выброс,а наоборот все распознаются относительно него например [25, 70, 60, 80, 90] очевидно что здесь выброс это 25
   sortKey=sortKey|| null;
   delicacy=delicacy|| 1.03;
   returnEjections=returnEjections|| false;
   returnIndex=returnIndex|| false;
   var arr=o;
   var out=[];
   var arrMap=functionsEx.funcs.forMe(arr.length, function(i){return i}, null, true);
   if(allowSort!==false) //в нормальных условия метод работает корректно только для отсортированных массивов
      arrMap.sort(function(x, y){return functionsEx.funcs.isFunction(sortKey)? sortKey(arr[x], arr[y]): (arr[x]-arr[y])});
   var last=null;
   functionsEx.funcs.forMe(arrMap, function(i){
      var e=arr[i];
      if(last===null && e===0){
         if(!returnEjections) out.push(i);
         return;
      }else if(last!==null && (e-last>delicacy*last)){
         if(returnEjections) out.push(i);
         return;
      }
      if(!returnEjections) out.push(i);
      last=e;
   })
   out=functionsEx.funcs.forMe(arr, function(v, i){if(functionsEx.proto_arr.inOf(out, i)) return (returnIndex? i: v)}, null, true);
   return out;
}

functionsEx.proto_arr.compare=function(o, array){
//==сравнение двух массивов, поддерживаются вложенные массивы
   if(!functionsEx.funcs.isArray(array)) return false;
   if(o.length!=array.length) return false;
   var eq=!functionsEx.funcs.forMe(o, function(v, i){
      if(functionsEx.funcs.isArray(v) && functionsEx.funcs.isArray(array[i])){
         if(!functionsEx.proto_arr.compare(v, array[i])) return false;
      }
      else if(v!=array[i]) return false;
    });
    return eq;
}

functionsEx.proto_arr.fromObj=function(o, key){
//==извлекаем значения ключей из массива обьектов
   var tarr=[];
   functionsEx.funcs.forMe(o, function(oo){
      if(oo[key]) tarr.push(oo[key]);
   })
   return tarr;
}

functionsEx.proto_arr.last=function(o){
//==извлекает последний элемент массива, не удаляя его
   return o[o.length-1];
}

functionsEx.proto_arr.pushEx=function(o, v, max){
//==позволяет делать массивы ограниченной длинны
   if(max && o.length>=max)
      o.splice(0, o.length-max+1);
   return o.push(v);
}

functionsEx.proto_arr.get=function(o, i, def){
   if(o.length>i) return o[i];
   else return def;
}

functionsEx.proto_arr.inOf=function(o, val, from){
//==в отличии от indexOf возвращает 0 если не найдено, иначе index+1
   if(!o || !o.indexOf) return 0;
   from=from||0;
   if(Array.prototype.indexOf) var i=o.indexOf(val,from);
   else
      var i=functionsEx.funcs.ie_arrIndexOf(o, val, from);
   if(i===-1) return undefined;
   return i+1;
}

functionsEx.proto_arr.average=function(o, mode){
//==среднее арифметическое или геометрическое элементов массива
   if(!mode) var s=0;
   else var s=1;
   functionsEx.funcs.forMe(o, function(ss, i){
      if(!mode) s=s+functionsEx.funcs.parseFloatEx(ss);
      else s=s*functionsEx.funcs.parseFloatEx(ss);
   })
   return (s/o.length);
}

functionsEx.proto_arr.max=function(o){return Math.max.apply(Math,o)}

functionsEx.proto_arr.min=function(o){return Math.min.apply(Math,o)}

functionsEx.proto_arr.inObj=function(o, key, val, returnAsObj, startIndex, eq, eqErr, onlyOne){
//==из массива обьектов возвращает индекс+1 или ссылку если key==val
   //для проверки по множеству условий key==null, val={key1:val1, key2:val2}
   onlyOne=onlyOne===false? false: true;
   startIndex=startIndex ||0;
   eq=eq|| '==';
   var out=[];
   if(startIndex>=o.length) return onlyOne? undefined: [];
   functionsEx.funcs.forMe(o, function(d, i){
      if(i<startIndex || !d || !functionsEx.funcs.isObject(d)) return;
      if(!functionsEx.funcs.isObject(val)){
         // console.log('%%', d, key)
         if(functionsEx.funcs.eqMe(d[key], val, eq, eqErr)){
            out.push(returnAsObj? d: i+1);
            if(onlyOne) return false;
         }
      }else if(functionsEx.funcs.isObject(val)){
         //! Добавить распознавание eq как префикс ключа
         var isOk=!functionsEx.funcs.forMe(val, function(k, v){
            return Boolean(functionsEx.funcs.eqMe(d[k], v, eq, eqErr));
         });
         if(isOk){
            out.push(returnAsObj? d: i+1);
            if(onlyOne) return false;
         }
      }
   })
   return onlyOne? (out.length? out[0]: undefined): out;
}

functionsEx.proto_arr.inObjAll=function(o, key, val, returnAsObj, startIndex, eq, eqErr){
//==обертка для "вернуть все"
   return functionsEx.proto_arr.inObj(o, key, val, returnAsObj, startIndex, eq, eqErr, false);
}

functionsEx.proto_arr.inObjEx=function(o, what, returnAsObj, startIndex, eq, eqErr, onlyOne){
//==обертка для "множество условий"
   if(!functionsEx.funcs.isObject(what) || functionsEx.proto_obj.keys(what).length==0)
      return onlyOne? undefined: [];
   return functionsEx.proto_arr.inObj(o, null, what, returnAsObj, startIndex, eq, eqErr, onlyOne);
}

functionsEx.proto_arr.del=function(o, ind){
//==удаляет элемент по индесу
   if(ind!==-1) o.splice(ind, 1);
   return o;
}

functionsEx.proto_arr.delex=function(o, val){
//==удаляет элемент по значению
   var i=o.indexOf(val);
   if(i!==-1) functionsEx.proto_arr.del(o, i);
   return o;
}

functionsEx.proto_arr.erase=function(o){
   while(o.length) functionsEx.proto_arr.del(o, 0);
   return o;
}

functionsEx.proto_arr.clear=function(o, also){
//==чистим массив от пустышек
   also=also|| null;
   var clearPattern=['', null, undefined].concat(functionsEx.funcs.isArray(also)? also: [also]);
   var tArr0=functionsEx.funcs.forMe(o, function(v, i){
      if(functionsEx.proto_arr.inOf(clearPattern, v) || functionsEx.funcs.isNaN(v)) return;
      return v;
   }, null, true);
   return tArr0;
}

functionsEx.proto_arr.unique=function(o){
//==чистит массив от дубликатов
   var tArr1={}, tArr2=[];
   functionsEx.funcs.forMe(o, function(v, i){
      if(tArr1[v]===undefined){
         tArr2.push(v);
         tArr1[v]=1;
      }
   })
   return tArr2;
}

functionsEx.proto_arr.sum=function(o){
//==суммирует элементы массива
   if (o.length==0) return 0
   return o.reduce(function(a, b){return a+b});
   // var c=0;
   // functionsEx.funcs.forMe(o, function(v, i){c+=v});
   // return c;
}

functionsEx.proto_arr.toNum=function(o){
   var tArr=functionsEx.funcs.forMe(o, function(v, i){return functionsEx.funcs.parseFloatEx(v)}, null, true);
   return tArr;
}
/*============================================================*/
// if(window.NodeList && !NodeList.prototype.byAttr){
//    NodeList.prototype.byAttr=function(key,val){
//       for(var i=0,l=this.length;i<l;i++){
//          if(this[i][key]==val) return this[i];
//       }
//       return undefined;
//    }
// }
/*============================================================*/
functionsEx.proto_bool.bool=function(o){
//==заглушка
   return o;
}
/*============================================================*/
functionsEx.proto_str.escape=function(o, secure){
//==экранирует спецсимволы
   //безопасное экранирование позволяет после вставить результат в innerHtml
   //.replace(/./gm, function(s){return "&#"+s.charCodeAt(0)+";"});
   var map={
      '%':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;',
      '/':'&#x2F;',
      '{':'&#123;',
      '}':'&#125;',
      '[':'&#91;',
      ']':'&#93;',
      ' ':'&#32;',
      '\n':'<br>' //'&#10;'
   };
   var s=o;
   if(functionsEx.funcs.isArray(secure) || functionsEx.funcs.isString(secure)) functionsEx.funcs.forMe(secure, function(k){
      if(map[k]===undefined) return;
      s=s.replace(new RegExp('\\'+k, 'g'), map[k]);
   })
   else if(secure) functionsEx.funcs.forMe(map, function(k, v){
      s=s.replace(new RegExp('\\'+k, 'g'), v);
   })
   else s=s.replace(/[-\[\]{}()*+?.,\\^$|#\s\<\>\/]/g, "\\$&");
   return s;
}

functionsEx.proto_str.unBOM=function(o){
   return o.replace(/\ufeff/g, '');
}

functionsEx.proto_str.last=function(o){
//==извлекает последний элемент строки, не удаляя его
   return o[o.length-1];
}

functionsEx.proto_str.repeat=function(o, n){
   return new Array(n+1).join(o);
}

functionsEx.proto_str.trim=function(o, s, fromL, fromR){
   s=s||' ';
   fromL=fromL===false? false: true;
   fromR=fromR===false? false: true;
   var o2=o;
   if(fromL) o2=o2.replace(new RegExp('^'+s+'+'), '');
   if(fromR) o2=o2.replace(new RegExp(s+'+$'), '');
   return o2;
}

functionsEx.proto_str.ltrim=function(o, s){
   s=s||' ';
   return functionsEx.proto_str.trim(o, s, true, false);
}

functionsEx.proto_str.rtrim=function(o, s){
   s=s||' ';
   return functionsEx.proto_str.trim(o, s, false, true);
}

functionsEx.proto_str.hashCode=function(o){
   return functionsEx.funcs.murmurhash3_32_gc(o, 6802145);
}

functionsEx.proto_str.hashCode2=function(o){
   //http://goo.gl/lY5ww
   var s=0;
   functionsEx.funcs.forMe(o, function(v){
      s=((s<<5)-s)+v.charCodeAt(0);
      s=s&s; // Convert to 32bit integer
   })
   return s;
}

functionsEx.proto_str.inOf=function(o, val, from){
//==в отличии от indexOf возвращает 0 если не найдено, иначе index+1
   from=from||0;
   var i=o.indexOf(val,from);
   if(i==-1) return undefined;
   return i+1;
}

functionsEx.proto_str.capital=function(o, onlyUp){
//==возвращает текст с большой буквы
   return o.slice(0,1).toUpperCase()+(onlyUp? o.slice(1): o.slice(1).toLowerCase());
}

functionsEx.proto_str.splice=function(o, start, length){
//==здесь планировался аналог splice массива, но для строк
   //! недоделан
   return o.slice(start, length);
}

functionsEx.proto_str.prepData=function(o){
   return functionsEx.funcs.prepData(o);
}

functionsEx.proto_str.bool=function(o, patterns){
//==превращает строку в булево
   patterns=patterns||['true','1','yes','checked'];
   if(functionsEx.proto_arr.inOf(patterns, o.toLowerCase())) return true;
   else return false;
}

functionsEx.proto_str.get=function(o, pref, suf, from, greedy){
//==return pattern by format pref+pattenr+suf
   if(!o) return '';
   var i1=0, i2=0, text=o.toLowerCase();
   if(pref && functionsEx.funcs.isString(pref)) pref=pref.toLowerCase();
   if(suf && functionsEx.funcs.isString(suf)) suf=suf.toLowerCase();
   from=from||0;
   if(pref) i1=text.indexOf(pref, from);
   else i1=from;
   if(i1==-1) return '';
   if(suf){
      if(greedy) i2=text.lastIndexOf(suf);
      else i2=text.indexOf(suf, i1+pref.length);
   }else i2=text.length;
   if(i2==-1) return '';
   return o.slice(i1+pref.length, i2);
}

functionsEx.proto_str.toBase64=function(o){
   if(window.btoa) return btoa(o);//native implementation
   var base64EncodeChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var out,i,len;var c1,c2,c3;len=o.length;i=0;out='';while(i<len){c1=o.charCodeAt(i++)&0xff;if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt((c1&0x3)<<4);out+='==';break;}c2=o.charCodeAt(i++);if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt((c2&0xF)<<2);out+='=';break;}c3=o.charCodeAt(i++);out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));out+=base64EncodeChars.charAt(c3&0x3F);}return out;
}

functionsEx.proto_str.base64ToBytes=function(o){
   var h=o,a,c,b,f,e,d,g,k,l=[62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-2,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
   g=l.length;c=Array(4*((g+2)/3|0));f=a=d=e=0;for(k=h.length;f<k;++f)if(b=(h.charCodeAt(f)&255)-43,!(0>b||b>=g||(b=l[b],0>b)))switch(d){case 0:a=(b&63)<<2;++d;break;case 1:a|=(b&48)>>4;c[e++]=a;a=(b&15)<<4;++d;break;case 2:a|=(b&60)>>2;c[e++]=a;a=(b&3)<<6;++d;break;case 3:a|=b&63,c[e++]=a,d=0}c.length=e;return c;
}

functionsEx.proto_str.baseName=function(o, cropExt){
   var s=o.split('\\').pop().split('/').pop();
   if(cropExt) s=s.substr(0, s.lastIndexOf('.')) || s;
   return s;
}

functionsEx.proto_str.hostName=function(o){
   var matches=o.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
   if (matches)return matches[1];
   else return '';
}
/*============================================================*/
functionsEx.funcs.controlClear=function(){
   var objs=$('.controlGenerated');
   functionsEx.funcs.forMe(objs, function(o){
      if(!o.attr('parent')) return;
      oo=$(functionsEx.proto_arr.last(o.attr('parent').split(' '))); //! Нужно идти по всему пути, а не только по последнему
      if(!oo.length || (oo[0].tagName=='OPTION' && !oo.prop('selected'))){
         if(!functionsEx.proto_arr.inOf([undefined, null, ''], o.attr('wrap')))
            o.parents(o.attr('wrap')).remove();
         else if(!functionsEx.proto_arr.inOf([undefined, null, ''], o.attr('wrapId')))
            o.parents('#'+o.attr('wrapId')).remove();
         o.remove();
      }
   })
}

functionsEx.funcs.controlGenerator=function(o, parent){
   if(!o) return '';
   if(functionsEx.funcs.isString(o)) return o;
   if(functionsEx.funcs.isArray(o)){
      return functionsEx.funcs.forMe(o, function(oo){
         return functionsEx.funcs.controlGenerator(oo, parent);
      }, null, true).join('');
   }
   if(functionsEx.funcs.isObject(o) && !o.type){
      return functionsEx.funcs.forMe(o, function(oo, content){
         var ooObj={'content':content};
         var type=functionsEx.proto_str.get(oo, '', ' ') || oo;
         if(functionsEx.proto_str.inOf(type, '.') || functionsEx.proto_str.inOf(type, '#')){
            //указан класс или айди
            ooObj.id=functionsEx.proto_str.get(type, '#', '.') || functionsEx.proto_str.get(type, '#', '') || '';
            var classes=functionsEx.proto_str.get(type, '.', '#') || functionsEx.proto_str.get(type, '.', '') || '';
            ooObj['class']=classes.split('.').join(' ').trim();
            ooObj.type=(type.match(/^\w+/)||[])[0]
         }else ooObj.type=type; //только тип
         functionsEx.funcs.forMe((functionsEx.proto_str.get(oo, ' ', '')||'').split(' '), function(s){//достаем параметры
            if(functionsEx.proto_str.get(s, '', '=')) ooObj[functionsEx.proto_str.get(s, '', '=')]=functionsEx.proto_str.get(s, '=', '');
         })
         return functionsEx.funcs.controlGenerator(ooObj, parent);
      }, null, true).join('');
   }
   //! Сейчас чтобы controlClear() корректно работал, необходимо указывать селектор или id враппера. Этот процесс должен быть автоматическим
   var wrap=o.wrap|| '%(html)s';
   if(o.wrapReplace) wrap=functionsEx.proto_str.format(wrap, o.wrapReplace);
   var html='';
   var parent=parent|| '';
   var content='';
   var generator=o.generator? functionsEx.funcs.prepData(o.generator): '';
   if(o.type=='select'){
      var html2='';
      if(functionsEx.funcs.isArray(o.value) || functionsEx.funcs.isObject(o.value)){
         html2=functionsEx.funcs.forMe(o.value, function(v, k){
            return functionsEx.funcs.controlGenerator({type:'option', id:k, value:k, name:k, content:v}, parent+' '+(o.id?'#'+o.id:''));
         }, true, true).join('');
      }
      html="<select style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' %(multi)s size='%(size)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s'>"+html2+"%(content)s</select>";
   }else if(o.type=='option'){
      html="<option style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s %(selected)s %(disabled)s name='%(name)s' value='%(value)s'>%(content)s</option>";
   }else if(o.type=='li'){
      html="<li style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</li>";
   }else if(o.type=='ul'){
      var html2='';
      if(functionsEx.funcs.isArray(o.value) || functionsEx.funcs.isObject(o.value)){
         html2=functionsEx.funcs.forMe(o.value, function(v, k){
            return functionsEx.funcs.controlGenerator({type:'li', id:k, content:v}, parent+' '+(o.id?'#'+o.id:''));
         }, true, true).join('');
      }
      html="<ul style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>"+html2+"%(content)s</ul>";
   }else if(o.type=='ol'){
      var html2='';
      if(functionsEx.funcs.isArray(o.value) || functionsEx.funcs.isObject(o.value)){
         html2=functionsEx.funcs.forMe(o.value, function(v, k){
            return functionsEx.funcs.controlGenerator({type:'li', id:k, content:v}, parent+' '+(o.id?'#'+o.id:''));
         }, true, true).join('');
      }
      html="<ol style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>"+html2+"%(content)s</ol>";
   }else if(o.type=='span'){
      html="%(beforeContent)s<span style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</span>%(afterContent)s";
   }else if(o.type=='table'){
      html="%(beforeContent)s<table style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</table>%(afterContent)s";
   }else if(o.type=='tr'){
      html="%(beforeContent)s<tr style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</tr>%(afterContent)s";
   }else if(o.type=='td'){
      html="%(beforeContent)s<td style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</td>%(afterContent)s";
   }else if(o.type=='th'){
      html="%(beforeContent)s<th style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</th>%(afterContent)s";
   }else if(o.type=='h1'){
      html="%(beforeContent)s<h1 style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</h1>%(afterContent)s";
   }else if(o.type=='h2'){
      html="%(beforeContent)s<h2 style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</h2>%(afterContent)s";
   }else if(o.type=='h3'){
      html="%(beforeContent)s<h3 style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</h3>%(afterContent)s";
   }else if(o.type=='h4'){
      html="%(beforeContent)s<h4 style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</h4>%(afterContent)s";
   }else if(o.type=='h5'){
      html="%(beforeContent)s<h5 style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</h5>%(afterContent)s";
   }else if(o.type=='a'){
      html="%(beforeContent)s<a style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' target='%(target)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s href='%(value)s'>%(content)s</a>%(afterContent)s";
   }else if(o.type=='div'){
      html="%(beforeContent)s<div style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</div>%(afterContent)s";
   }else if(o.type=='p'){
      html="%(beforeContent)s<p style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</p>%(afterContent)s";
   }else if(o.type=='pre'){
      html="%(beforeContent)s<pre style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</pre>%(afterContent)s";
   }else if(o.type=='code'){
      html="%(beforeContent)s<code style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</code>%(afterContent)s";
   }else if(o.type=='label'){
      html="%(beforeContent)s<label style='%(style)s' for='%(for)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</label>%(afterContent)s";
   }else if(o.type=='input'){
      html="%(beforeContent)s<input style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' title='%(title)s' id='%(id)s' type='text' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' maxlength='%(maxlength)s' placeholder='%(placeholder)s'>%(afterContent)s";
   }else if(o.type=='password'){
      html="%(beforeContent)s<input style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' title='%(title)s' id='%(id)s' type='password' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' maxlength='%(maxlength)s' placeholder='%(placeholder)s'>%(afterContent)s";
   }else if(functionsEx.proto_arr.inOf(['hidden', 'inputhidden'], o.type)){
      html="<input style='%(style)s' parent='%(parent)s' type='hidden' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' maxlength='%(maxlength)s' placeholder='%(placeholder)s'>";
   }else if(functionsEx.proto_arr.inOf(['number', 'inputnumber'], o.type)){
      html="%(beforeContent)s<input style='%(style)s' type='number'step='%(step)s' min='%(min)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' maxlength='%(maxlength)s' placeholder='%(placeholder)s'>%(afterContent)s";
   }else if(o.type=='textarea'){
      html="%(beforeContent)s<textarea style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' maxlength='%(maxlength)s' placeholder='%(placeholder)s'>%(value)s%(content)s</textarea>%(afterContent)s";
   }else if(o.type=='checkbox'){
      html="%(beforeContent)s<input style='%(style)s' type='checkbox' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' %(checked)s title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s'>%(afterContent)s";
   }else if(o.type=='radio'){
      html="%(beforeContent)s<input style='%(style)s' type='radio' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' value='%(value)s' %(checked)s title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s'>%(afterContent)s";
   }else if(o.type=='file'){
      html="%(beforeContent)s<input style='%(style)s' type='file' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' %(value)s title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s'>%(afterContent)s";
   }else if(o.type=='inputcompare'){ //! Женя опять наворотил какуюто хуйню //!!тебе блядь мешает что-ли?? нахуй комментить?? ты кстати тоже женя!!!
      html="<span class='add-on'><select class='span1' name='%(name)sCompare'><option>=</option><option>></option><option><</option></select></span><input style='%(style)s' type='number' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' %(value)s title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s name='%(name)s' placeholder='%(placeholder)s'><span class='add-on'><select class='span4' name='%(name)sUnit'><option value='ed'>единиц</option><option value='percent'>отличается от других на X процентов</option></select></span>";
   }else if(o.type=='legend'){
      html="<legend style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</legend>";
   }else if(o.type=='button'){
      html="<button style='%(style)s' parent='%(parent)s' wrapId='%(wrapId)s' wrap='%(wrap)s' generator='%(generator)s' title='%(title)s' id='%(id)s' class='controlGenerated %(class)s' %(_data_)s>%(content)s</button>";
   }else return '';
   if(functionsEx.funcs.isArray(o.content) || functionsEx.funcs.isObject(o.content))
      content=functionsEx.funcs.controlGenerator(o.content, parent+' '+(o.id?'#'+o.id:''));
   else content=o.content|| content;
   //экранирование кавычек
   functionsEx.funcs.forMe(['id', 'class', 'title', 'name', 'for', 'value', 'style', 'parent'], function(s){
      if(o[s] && functionsEx.funcs.isString(o[s])) o[s]=o[s].replace(/'/g, '&#39;').replace(/"/g, '&#34;');
   })
   var _data_='';
   if(o['_'] && functionsEx.funcs.isObject(o._)){
      //additional attrs
      _data_=forMe(o._, function(k, v){
         return functionsEx.proto_str.format('%s="%s"', k, functionsEx.funcs.prepData(v));
      }, null, true).join(' ');
   }
   var tArr={
      id:o.id||'', 'class':o['class']||'', title:o.title||'', target:o.target||'', helpblock:o.helpblock||'', helpinline:o.helpinline||'', afterContent:o.afterContent||'', beforeContent:o.beforeContent||'', currency:o.currency||'', placeholder:o.placeholder||'', maxlength:o.maxlength||'', name:o.name||'', 'for':o['for']||'', style:o.style||'', value:o.value||'', wrapId:o.wrapId||'', wrap:o.wrapSelector||'',
      checked:((o.selected || o.checked)? 'checked': ''),
      selected:((o.selected || o.checked)? 'selected': ''),
      disabled:(o.disabled? 'disabled': ''),
      min:(o.min!==undefined? o.min: ''),
      max:(o.max!==undefined? o.max: ''),
      step:o.step||'any',
      multi:(o.multi? 'multiple': ''),
      size:(o.size|| 1),
      content:content, generator:generator, parent:parent,
      _data_:_data_
   };
   html=functionsEx.proto_str.formatClean(html, tArr);
   html=functionsEx.proto_str.format(wrap, {'html':html});
   return html;
}
/*============================================================*/
functionsEx.funcs.lHash=function(){
   return functionsEx.funcs.parseURL(true, false).params;
}

functionsEx.funcs.lHash.set=function(name, val, clearOld){
   var parr={}
   if(!clearOld) parr=functionsEx.funcs.lHash.get()||{};
   if(!functionsEx.funcs.isArray(name)) name=[name];
   if(!functionsEx.funcs.isArray(val)) val=[val];
   functionsEx.funcs.forMe(name, function(k,i){parr[name[i]]=val[i];});
   var sarr=[];
   functionsEx.funcs.forMe(parr, function(key, val){if(key && val) sarr.push(key+'='+val)});
   window.location.hash=sarr.join('&');
   return parr;
}

functionsEx.funcs.lHash.get=function(name){
   var parr=functionsEx.funcs.parseURL(true, false).params;
   if(!functionsEx.proto_obj.keys(parr).length || !name) return (functionsEx.funcs.isArray(name) || !name? parr: null);
   if(functionsEx.funcs.isArray(name)){
      var tarr={};
      functionsEx.funcs.forMe(name, function(k){tarr[k]=parr[k]});
      return tarr;
   }else return parr[name];
}

functionsEx.funcs.parseURL2=function(url, includeHash, includeNonHash){
//парсит переданный url или собственный url страници, преобразуя hash и search в один обьект
   url=url|| window.top.location.href|| window.self.location.href;
   // console.log('>', url)
   includeHash=(includeHash===false)? false: true;
   includeNonHash=(includeNonHash===false)? false: true;
   var match=url.match(functionsEx.funcs.parseURL2.re_parse);
   if(!match) return {};
   var res={
      'url':url,
      'params':{},
      'scheme':match[1].replace(':', ''),
      'netloc':match[3],
      'path':match[5],
      'port':match[4]
   };
   var tFunc=function(ss){
      if(!ss) return;
      else if(functionsEx.proto_str.get(ss, '','='))
         res.params[functionsEx.proto_str.get(ss, '','=')]=functionsEx.proto_str.get(ss, '=');
      else
         res.params[ss]='';
   }
   if(includeNonHash)
      functionsEx.funcs.forMe(functionsEx.proto_str.get(String(match[6]), '?').split('&'), tFunc);
   if(includeHash)
      functionsEx.funcs.forMe(functionsEx.proto_str.get(String(match[7]), '#').split('&'), tFunc);
   return res;
}
functionsEx.funcs.parseURL2.re_parse=new RegExp([
   '^(https?:)//', //protocol
   '(([^:/?#]*)(?::([0-9]+))?)', //host (hostname and port)
   '(/[^?#]*)', //pathname
   '(\\?[^#]*|)', //search
   '(#.*|)$' //hash
].join(''));


functionsEx.funcs.parseURL=function(includeHash, includeNonHash){
//парсит собственный url страници средствами браузера, преобразуя hash и search в один обьект
   includeHash=(includeHash===false)? false: true;
   includeNonHash=(includeNonHash===false)? false: true;
   var tArr1={};
   if(includeNonHash){
      s=window.location.search;
      functionsEx.funcs.forMe(functionsEx.proto_str.get(String(s), '?').split('&'), function(ss){
         if(!ss) return;
         else if(functionsEx.proto_str.get(ss, '','='))
            tArr1[functionsEx.proto_str.get(ss, '','=')]=functionsEx.proto_str.get(ss, '=');
         else
            tArr1[ss]='';
      });
   }
   if(includeHash){
      s=window.location.hash;
      functionsEx.funcs.forMe(functionsEx.proto_str.get(String(s), '#').split('&'), function(ss){
         if(!ss) return;
         else if(functionsEx.proto_str.get(ss, '','='))
            tArr1[functionsEx.proto_str.get(ss, '','=')]=functionsEx.proto_str.get(ss, '=');
         else
            tArr1[ss]='';
      });
   }
   var res={
      'url':window.location.href,
      'params':tArr1,
      'scheme':window.location.protocol.replace(':', ''),
      'netloc':window.location.hostname,
      'path':window.location.pathname
   }
   return res;
}
/*============================================================*/
functionsEx.funcs.fileSave=function(what, name, isContent){
//==инициализирует диалог сохранения
   isContent=isContent||false;
   name=name||'';
   if(functionsEx.funcs.isString(isContent)) what=isContent;
   var link=document.createElement('a'), event=document.createEvent('MouseEvents');
   if(Blob){ //==new way
      //символ \ufeff это BOM
      if(isContent) what=URL.createObjectURL(new Blob(["\ufeff", what], {type: 'text/plain'}));
   }else{ //==old way
      if(isContent) what=functionsEx.proto_str.format("data:text;charset=utf-8,%s", encodeURIComponent(what));
   }
   link.setAttribute('href',what);
   link.setAttribute('download',name);
   link.setAttribute('target', '_blank');
   document.body.appendChild(link)
   event.initMouseEvent('click',true,true,window,1,0,0,0,0,false,false,false,false,0,null);
   link.dispatchEvent(event);
}

functionsEx.funcs.fileLoad=function(callback, asText){
//==инициализирует диалог открытия файла
   asText=asText===false? false: true;
   var dialog=document.createElement('input'), event=document.createEvent('MouseEvents');
   dialog.setAttribute('type', 'file');
   $(dialog).change(function(e){
      var file=e.target.files[0];
      var fileName=functionsEx.proto_str.get(e.target.files[0].name, '','.');
      var fileExt=functionsEx.proto_str.get(e.target.files[0].name, '.','');
      if(!asText) callback(file, fileName, fileExt);
      else{
         var fr=new FileReader();
         fr.onload=function(){callback(this.result, fileName, fileExt)};
         fr.onerror=function(){alert('error reading!')};
         fr.readAsText(file);
      }
   });
   event.initMouseEvent('click',true,true,window,1,0,0,0,0,false,false,false,false,0,null);
   dialog.dispatchEvent(event);
}
/*============================================================*/
functionsEx.funcs.lStorage=function(){
   if(typeof(localStorage)=='undefined') return false;
   var all=localStorage.getItem('!all!');
   if(all==undefined){
      localStorage.setItem('!all!',JSON.stringify({'key':[],'type':[]}));
      return {'key':[],'type':[]};
   }
   return JSON.parse(all);
}

functionsEx.funcs.lStorage.set=function(key, val, type){
   type=type||'string';
   if(typeof(localStorage)=='undefined') return false;
   var all=functionsEx.funcs.lStorage(),i=all.key.indexOf(key);
   if(all==false) return false;
   if(!functionsEx.funcs.isString(val)) val=JSON.stringify(val);
   try{
      localStorage.setItem(key,val);
   }catch(e){
      if(e==QUOTA_EXCEEDED_ERR) return false;
   }
   if(i!==-1) all.type[i]=type;
   else{
      all.key.push(key);
      all.type.push(type);
   }
   localStorage.setItem('!all!',JSON.stringify(all));
   return true;
}

functionsEx.funcs.lStorage.get=function(key, parse){
   if(typeof(localStorage)=='undefined') return false;
   var all=functionsEx.funcs.lStorage(),i=all.key.indexOf(key);
   if(all==false || i==-1) return false;
   var v=localStorage.getItem(key);
   if(parse && all.type[i]!=='string') v=JSON.parse(v);
   return v;
}
/*============================================================*/
functionsEx.funcs.clearHtml=function(html, obj){
//==очистка от тегов
   var keepObj=false;
   if(functionsEx.funcs.isNull(obj)) obj=document.createElement('span');
   else if(functionsEx.funcs.isString(obj)) obj=document.createElement(obj);
   else keepObj=true;
   if(!keepObj) document.body.appendChild(obj);
   var jqObj=$(obj);
   jqObj.html(html);
   text=jqObj.text();
   if(keepObj) jqObj.html('');
   else document.body.removeChild(obj);
   return text;
}

functionsEx.funcs.textSize=function(text, className, obj, sizeName){
//==размер текста в пекселях, как если бы он был обернут в указанный тэг с указанными стилями
   var keepObj=false;
   if(functionsEx.funcs.isNull(obj)) obj=document.createElement('span');
   else if(functionsEx.funcs.isString(obj)) obj=document.createElement(obj);
   else keepObj=true;
   if(!keepObj) document.body.appendChild(obj);
   var jqObj=$(obj);
   if(className) jqObj.removeClass().addClass(className);
   jqObj.html(text);
   sizeName=sizeName || ['width0','width1','width2','width3','height0','height1','height2','height3'];
   sizeName=functionsEx.funcs.isString(sizeName)? [sizeName]: sizeName;
   var size={};
   functionsEx.funcs.forMe(sizeName, function(sn){
      var v=0;
      if(sn=='width3') v=functionsEx.funcs.parseIntFast(jqObj.outerWidth(true));
      else if(sn=='width2') v=functionsEx.funcs.parseIntFast(jqObj.outerWidth());
      else if(sn=='width1') v=functionsEx.funcs.parseIntFast(jqObj.innerWidth());
      else if(sn=='width0') v=functionsEx.funcs.parseIntFast(jqObj.width());
      else if(sn=='height3') v=functionsEx.funcs.parseIntFast(jqObj.outerHeight(true));
      else if(sn=='height2') v=functionsEx.funcs.parseIntFast(jqObj.outerHeight());
      else if(sn=='height1') v=functionsEx.funcs.parseIntFast(jqObj.innerHeight());
      else if(sn=='height0') v=functionsEx.funcs.parseIntFast(jqObj.height());
      size[sn]=v;
   });
   if(keepObj) jqObj.html('');
   else document.body.removeChild(obj);
   return size;
}

functionsEx.funcs.getDOMSource=function(root){
   functionsEx.vars.stopwatch.mark({name:'getDOMSource', wait:false, inMS:true});
   root=root|| document.documentElement;
   var domClone=root.cloneNode(true);
   // dump inputs
   var elemArr=domClone.getElementsByTagName('input');
   for(var i=0, l=elemArr.length; i<l; i++){
      var o=elemArr[i];
      if(o.type=='checkbox' || o.type=='radio'){
         if(o.checked) o.setAttribute('checked', true);
         else o.removeAttribute('checked');
      }else
         o.setAttribute('value', o.value);
   }
   // dump selects
   var elemArr=domClone.getElementsByTagName('select');
   for(var i=0, l=elemArr.length; i<l; i++){
      var o=elemArr[i];
      var tArr1=o.options;
      for(var i2=0, l2=tArr1.length; i2<l2; i2++){
         if(tArr1[i2].selected)
            tArr1[i2].setAttribute('selected', true);
         else tArr1[i2].removeAttribute('selected');
      }
   }
   //
   var s=(domClone.outerHTML|| domClone.innerHTML);
   // var s=(document.documentElement.outerHTML|| document.documentElement.innerHTML);
   // var s=new XMLSerializer().serializeToString(document);
   functionsEx.vars.stopwatch.mark({name:'getDOMSource', wait:true, inMS:true});
   return s;
}

functionsEx.funcs.viewportSize=function(){
   if(!functionsEx.funcs.viewportSize.env){
      var w, d, e, b;
      functionsEx.funcs.viewportSize.env={};
      functionsEx.funcs.viewportSize.env.w=w=window;
      functionsEx.funcs.viewportSize.env.d=d=document;
      functionsEx.funcs.viewportSize.env.e=e=d.documentElement;
      functionsEx.funcs.viewportSize.env.b=b=d.getElementsByTagName('body')[0];
   }else{
      var w=functionsEx.funcs.viewportSize.env.w;
      var d=functionsEx.funcs.viewportSize.env.d;
      var e=functionsEx.funcs.viewportSize.env.e;
      var b=functionsEx.funcs.viewportSize.env.b;
   }
   var x = w.innerWidth || e.clientWidth || b.clientWidth;
   var y = w.innerHeight|| e.clientHeight|| b.clientHeight;
   return [x, y];
}

functionsEx.funcs.viewportScroll=function(){
   if(!functionsEx.funcs.viewportScroll.env){
      functionsEx.funcs.viewportScroll.env={
         'fromWindow':typeof(window.pageYOffset)=='number',
         'fromDoc':(document.documentElement && document.documentElement.scrollTop),
      };
   }
   if(functionsEx.funcs.viewportScroll.env.fromDoc)
      var tArr1=[document.documentElement.scrollLeft, document.documentElement.scrollTop];
   else if(functionsEx.funcs.viewportScroll.env.fromWindow)
      var tArr1=[window.pageXOffset, window.pageYOffset];
   else{
      functionsEx.funcs.printOnly('[FEX]: Cant get viewport scroll');
      return [-1, -1];
   }
   tArr1[0]=Math.floor(tArr1[0]);
   tArr1[1]=Math.floor(tArr1[1]);
   return tArr1;
}

//http://stackoverflow.com/a/7544757
functionsEx.funcs.url2abs=function(url){
   if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
      return url; //Url is already absolute
   var base_url = location.href.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";
   if(url.substring(0,2) == "//")
      return location.protocol + url;
   else if(url.charAt(0) == "/")
      return location.protocol + "//" + location.host + url;
   else if(url.substring(0,2) == "./")
      url = "." + url;
   else if(/^\s*$/.test(url))
      return ""; //Empty = Return nothing
   else url = "../" + url;

   url = base_url + url;
   var i=0;
   while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

   /* Escape certain characters to prevent XSS */
   url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22").replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
   return url;
}

functionsEx.funcs.html2abs=function(html){
   functionsEx.vars.stopwatch.mark({name:'html2abs', wait:false, inMS:true});
   var att = "[^-a-z0-9:._]";
   var entityEnd = "(?:;|(?!\\d))";
   var ents = {" ":"(?:\\s|&nbsp;?|&#0*32"+entityEnd+"|&#x0*20"+entityEnd+")",
      "(":"(?:\\(|&#0*40"+entityEnd+"|&#x0*28"+entityEnd+")",
      ")":"(?:\\)|&#0*41"+entityEnd+"|&#x0*29"+entityEnd+")",
      ".":"(?:\\.|&#0*46"+entityEnd+"|&#x0*2e"+entityEnd+")"
   };
   var charMap = {};
   var s = ents[" "]+"*"; //Short-hand for common use
   var any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
   function ae(string){
      var all_chars_lowercase = string.toLowerCase();
      if(ents[string]) return ents[string];
      var all_chars_uppercase = string.toUpperCase();
      var RE_res = "";
      for(var i=0; i<string.length; i++){
         var char_lowercase = all_chars_lowercase.charAt(i);
         if(charMap[char_lowercase]){
            RE_res += charMap[char_lowercase];
            continue;
         }
         var char_uppercase = all_chars_uppercase.charAt(i);
         var RE_sub = [char_lowercase];
         RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
         RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
         if(char_lowercase != char_uppercase){
            /* Note: RE ignorecase flag has already been activated */
            RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);
            RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
         }
         RE_sub = "(?:" + RE_sub.join("|") + ")";
         RE_res += (charMap[char_lowercase] = RE_sub);
      }
      return(ents[string] = RE_res);
   }
   function by(match, group1, group2, group3){
      /* Note that this function can also be used to remove links:
       * return group1 + "javascript://" + group3; */
      return group1 + functionsEx.funcs.url2abs(group2) + group3;
   }
   var slashRE = new RegExp(ae("/"), 'g');
   var dotRE = new RegExp(ae("."), 'g');
   function by2(match, group1, group2, group3){
      /*Note that this function can also be used to remove links:
       * return group1 + "javascript://" + group3; */
      group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
      return group1 + functionsEx.funcs.url2abs(group2) + group3;
   }
   function cr(selector, attribute, marker, delimiter, end){
      if(typeof selector == "string") selector = new RegExp(selector, "gi");
      attribute = att + attribute;
      marker = typeof marker == "string" ? marker : "\\s*=\\s*";
      delimiter = typeof delimiter == "string" ? delimiter : "";
      end = typeof end == "string" ? "?)("+end : ")(";
      var re1 = new RegExp('('+attribute+marker+'")([^"'+delimiter+']+'+end+')', 'gi');
      var re2 = new RegExp("("+attribute+marker+"')([^'"+delimiter+"]+"+end+")", 'gi');
      var re3 = new RegExp('('+attribute+marker+')([^"\'][^\\s>'+delimiter+']*'+end+')', 'gi');
      html = html.replace(selector, function(match){
         return match.replace(re1, by).replace(re2, by).replace(re3, by);
      });
   }
   function cri(selector, attribute, front, flags, delimiter, end){
      if(typeof selector == "string") selector = new RegExp(selector, "gi");
      attribute = att + attribute;
      flags = typeof flags == "string" ? flags : "gi";
      var re1 = new RegExp('('+attribute+'\\s*=\\s*")([^"]*)', 'gi');
      var re2 = new RegExp("("+attribute+"\\s*=\\s*')([^']+)", 'gi');
      var at1 = new RegExp('('+front+')([^"]+)(")', flags);
      var at2 = new RegExp("("+front+")([^']+)(')", flags);
      if(typeof delimiter == "string"){
         end = typeof end == "string" ? end : "";
         var at3 = new RegExp("("+front+")([^\"'][^"+delimiter+"]*" + (end?"?)("+end+")":")()"), flags);
         var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2).replace(at3, by2)};
      } else {
         var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2)};
      }
      html = html.replace(selector, function(match){
         return match.replace(re1, handleAttr).replace(re2, handleAttr);
      });
   }

   /* <meta http-equiv=refresh content="  ; url= " > */
   cri("<meta"+any+att+"http-equiv\\s*=\\s*(?:\""+ae("refresh")+"\""+any+">|'"+ae("refresh")+"'"+any+">|"+ae("refresh")+"(?:"+ae(" ")+any+">|>))", "content", ae("url")+s+ae("=")+s, "i");

   cr("<"+any+att+"href\\s*="+any+">", "href"); /* Linked elements */
   cr("<"+any+att+"src\\s*="+any+">", "src"); /* Embedded elements */

   cr("<object"+any+att+"data\\s*="+any+">", "data"); /* <object data= > */
   cr("<applet"+any+att+"codebase\\s*="+any+">", "codebase"); /* <applet codebase= > */

   /* <param name=movie value= >*/
   cr("<param"+any+att+"name\\s*=\\s*(?:\""+ae("movie")+"\""+any+">|'"+ae("movie")+"'"+any+">|"+ae("movie")+"(?:"+ae(" ")+any+">|>))", "value");

   cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)"); /* <style> */
   cri("<"+any+att+"style\\s*="+any+">", "style", ae("url")+s+ae("(")+s, 0, s+ae(")"), ae(")")); /*< style=" url(...) " > */
   functionsEx.vars.stopwatch.mark({name:'html2abs', wait:true, inMS:true});
   return html;
}

/*============================================================*/
//http://goo.gl/fCAsYA
functionsEx.funcs.murmurhash3_32_gc=function(c,g){var e,f,a,b,d;e=c.length&3;f=c.length-e;a=g;for(d=0;d<f;)b=c.charCodeAt(d)&255|(c.charCodeAt(++d)&255)<<8|(c.charCodeAt(++d)&255)<<16|(c.charCodeAt(++d)&255)<<24,++d,b=3432918353*(b&65535)+((3432918353*(b>>>16)&65535)<<16)&4294967295,b=b<<15|b>>>17,b=461845907*(b&65535)+((461845907*(b>>>16)&65535)<<16)&4294967295,a^=b,a=a<<13|a>>>19,a=5*(a&65535)+((5*(a>>>16)&65535)<<16)&4294967295,a=(a&65535)+27492+(((a>>>16)+58964&65535)<<16);b=0;switch(e){case 3:b^=(c.charCodeAt(d+2)&255)<<16;case 2:b^=(c.charCodeAt(d+1)&255)<<8;case 1:b^=c.charCodeAt(d)&255,b=3432918353*(b&65535)+((3432918353*(b>>>16)&65535)<<16)&4294967295,b=b<<15|b>>>17,a^=461845907*(b&65535)+((461845907*(b>>>16)&65535)<<16)&4294967295}a^=c.length;a^=a>>>16;a=2246822507*(a&65535)+((2246822507*(a>>>16)&65535)<<16)&4294967295;a^=a>>>13;a=3266489909*(a&65535)+((3266489909*(a>>>16)&65535)<<16)&4294967295;return(a^a>>>16)>>>0};
/*============================================================*/
functionsEx.vars.easing={easeInQuad:function(t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(t,b,c,d){return -c*(t/=d)*(t-2)+b;},easeInOutQuad:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return -c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return -c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(t,b,c,d){return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(t,b,c,d){return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(t,b,c,d){if((t/=d/2)<1)return -c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}else var s=p/(2*Math.PI)*Math.asin(c/a);return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(t,b,c,d){return c-functionsEx.vars.easing.easeOutBounce(d-t,0,c,d)+b;},easeOutBounce:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(t,b,c,d){if(t<d/2)return functionsEx.vars.easing.easeInBounce(t*2,0,c,d)*.5+b;return functionsEx.vars.easing.easeOutBounce(t*2-d,0,c,d)*.5+c*.5+b;}};
/*============================================================*/
functionsEx.proto_str.format=function(o){
   if(!o) return o;
   var t=[true,o];
   for(var i=1,l=arguments.length;i<l;i++) t.push(arguments[i]);
   return functionsEx.funcs.sprintf.apply(null, t);
}
functionsEx.proto_str.formatClean=function(o){
   if(!o) return o;
   var t=[false,o];
   for(var i=1,l=arguments.length;i<l;i++) t.push(arguments[i]);
   return functionsEx.funcs.sprintf.apply(null, t);
}
/* sprintf.js | (c) Alexandru Marasteanu <hello@alexei.ro> | BSD license */
functionsEx.funcs.sprintf=function(){
   keepNotExisted=arguments[0];
   functionsEx.funcs.sprintf.cache.hasOwnProperty(arguments[1])||(functionsEx.funcs.sprintf.cache[arguments[1]]=functionsEx.funcs.sprintf.parse(arguments[1]));
   return functionsEx.funcs.sprintf.format.call(null,keepNotExisted,functionsEx.funcs.sprintf.cache[arguments[1]],Array.prototype.slice.call(arguments,1));
};
functionsEx.funcs.sprintf.format=function(keepNotExisted,d,c){
var e=1,j=d.length,a="",h=[],f,g,b,k;for(f=0;f<j;f++)if(a=get_type(d[f]),"string"===a)h.push(d[f]);else if("array"===a){b=d[f];if(b[2]){a=c[e];for(g=0;g<b[2].length;g++){if(!a.hasOwnProperty(b[2][g])){a=keepNotExisted?'%('+b[2][g]+')s':'';continue;/*throw functionsEx.funcs.sprintf('[sprintf] property "%s" does not exist',b[2][g]);*/}a=a[b[2][g]];}}else a=b[1]?c[b[1]]:c[e++];if(/[^s]/.test(b[8])&&"number"!=get_type(a))throw functionsEx.funcs.sprintf("[sprintf] expecting number but found %s",get_type(a));switch(b[8]){case "b":a=a.toString(2);break;case "c":a=String.fromCharCode(a);break;case "d":a=parseInt(a,10);break;case "e":a=b[7]?a.toExponential(b[7]):a.toExponential();break;case "f":a=b[7]?parseFloat(a).toFixed(b[7]):parseFloat(a);break;case "o":a=a.toString(8);break;case "s":a=(a=String(a))&&b[7]?a.substring(0,b[7]):a;break;case "u":a>>>=0;break;case "x":a=a.toString(16);break;case "X":a=a.toString(16).toUpperCase()}a=/[def]/.test(b[8])&&b[3]&&0<=a?"+"+a:a;g=b[4]?"0"==b[4]?"0":b[4].charAt(1):" ";k=b[6]-String(a).length;g=b[6]?str_repeat(g,k):"";h.push(b[5]?a+g:g+a)}return h.join("")};functionsEx.funcs.sprintf.cache={};
functionsEx.funcs.sprintf.parse=function(d){for(var c=[],e=[],j=0;d;){if(null!==(c=/^[^\x25]+/.exec(d)))e.push(c[0]);else if(null!==(c=/^\x25{2}/.exec(d)))e.push("%");else if(null!==(c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(d))){if(c[2]){var j=j|1,a=[],h=c[2],f=[];if(null!==(f=/^([a-z_][a-z_\d]*)/i.exec(h)))for(a.push(f[1]);""!==(h=h.substring(f[0].length));)if(null!==(f=/^\.([a-z_][a-z_\d]*)/i.exec(h)))a.push(f[1]);else if(null!==(f=/^\[(\d+)\]/.exec(h)))a.push(f[1]);else throw"[sprintf] huh? "+d;else throw"[sprintf] huh? "+d;c[2]=a}else j|=2;if(3===j)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";e.push(c)}else throw"[sprintf] huh? "+d;d=d.substring(c[0].length)}return e};var vsprintf=function(d,c,e){e=c.slice(0);e.splice(0,0,d);return functionsEx.funcs.sprintf.apply(null,e)};function get_type(d){return Object.prototype.toString.call(d).slice(8,-1).toLowerCase()}function str_repeat(d,c){for(var e=[];0<c;e[--c]=d);return e.join("")};
/*============================================================*/
/* GUID generator (v1 and v4) | (c) Robert Kieffer, https://github.com/broofa/node-uuid | version 1.4.0 */
functionsEx.uuid_load_fix=(function(){var _global=window;var _rng;var _crypto=_global.crypto||_global.msCrypto;if(typeof _global.require=="function")try{var _rb=_global.require("crypto").randomBytes;_rng=_rb&&function(){return _rb(16)}}catch(e){}if(!_rng&&_crypto&&_crypto.getRandomValues){var _rnds8=new Uint8Array(16);_rng=function whatwgRNG(){_crypto.getRandomValues(_rnds8);return _rnds8}}if(!_rng){var _rnds=new Array(16);_rng=function(){for(var i=0,r;i<16;i++){if((i&3)===0)r=Math.random()*4294967296;_rnds[i]=r>>>((i&3)<<3)&255}return _rnds}}var BufferClass=typeof _global.Buffer=="function"?_global.Buffer:Array;var _byteToHex=[];var _hexToByte={};for(var i=0;i<256;i++){_byteToHex[i]=(i+256).toString(16).substr(1);_hexToByte[_byteToHex[i]]=i}function parse(s,buf,offset){var i=buf&&offset||0,ii=0;buf=buf||[];s.toLowerCase().replace(/[0-9a-f]{2}/g,function(oct){if(ii<16)buf[i+ii++]=_hexToByte[oct]});while(ii<16)buf[i+ii++]=0;return buf}function unparse(buf,offset){var i=offset||0,bth=_byteToHex;return bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]}var _seedBytes=_rng();var _nodeId=[_seedBytes[0]|1,_seedBytes[1],_seedBytes[2],_seedBytes[3],_seedBytes[4],_seedBytes[5]];var _clockseq=(_seedBytes[6]<<8|_seedBytes[7])&16383;var _lastMSecs=0,_lastNSecs=0;function v1(options,buf,offset){var i=buf&&offset||0;var b=buf||[];options=options||{};var clockseq=options.clockseq!=null?options.clockseq:_clockseq;var msecs=options.msecs!=null?options.msecs:(new Date).getTime();var nsecs=options.nsecs!=null?options.nsecs:_lastNSecs+1;var dt=msecs-_lastMSecs+(nsecs-_lastNSecs)/1E4;if(dt<0&&options.clockseq==null)clockseq=clockseq+1&16383;if((dt<0||msecs>_lastMSecs)&&options.nsecs==null)nsecs=0;if(nsecs>=1E4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");_lastMSecs=msecs;_lastNSecs=nsecs;_clockseq=clockseq;msecs+=122192928E5;var tl=((msecs&268435455)*1E4+nsecs)%4294967296;b[i++]=tl>>>24&255;b[i++]=tl>>>16&255;b[i++]=tl>>>8&255;b[i++]=tl&255;var tmh=msecs/4294967296*1E4&268435455;b[i++]=tmh>>>8&255;b[i++]=tmh&255;b[i++]=tmh>>>24&15|16;b[i++]=tmh>>>16&255;b[i++]=clockseq>>>8|128;b[i++]=clockseq&255;var node=options.node||_nodeId;for(var n=0;n<6;n++)b[i+n]=node[n];return buf?buf:unparse(b)}function v4(options,buf,offset){var i=buf&&offset||0;if(typeof options=="string"){buf=options=="binary"?new BufferClass(16):null;options=null}options=options||{};var rnds=options.random||(options.rng||_rng)();rnds[6]=rnds[6]&15|64;rnds[8]=rnds[8]&63|128;if(buf)for(var ii=0;ii<16;ii++)buf[i+ii]=rnds[ii];return buf||unparse(rnds)}functionsEx.funcs.uuid=functionsEx.funcs.guid=v4;functionsEx.funcs.uuid.v1=v1;functionsEx.funcs.uuid.v4=v4;functionsEx.funcs.uuid.parse=parse;functionsEx.funcs.uuid.unparse=unparse;functionsEx.funcs.uuid.BufferClass=BufferClass;})();
/*============================================================*/
/* elementFromPoint implementation for iOS and Android | (c) Andri Möll, github.com/moll/js-element-from-point | 2014-08-11 */
if(window.pageXOffset && document.elementFromPoint){//IE fix
   functionsEx.funcs.elementFromPoint=function(x, y){
      if (!functionsEx.funcs.isRelativeToViewport()) x += window.pageXOffset, y += window.pageYOffset;
      return document.elementFromPoint(x, y);
   }
   functionsEx.vars.relativeToViewport=null;
   functionsEx.funcs.isRelativeToViewport=function(){
      if (functionsEx.vars.relativeToViewport != null) return functionsEx.vars.relativeToViewport;
      var x = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0;
      var y = window.pageYOffset ? window.pageYOffset + window.innerHeight - 1 : 0;
      if (!x && !y) return true;
      return functionsEx.vars.relativeToViewport = !document.elementFromPoint(x, y);
   }
}
/*============================================================*/
/* Bowser - a browser detector | MIT License | (c) Dustin Diaz 2015, github.com/ded/bowser */
functionsEx.funcs.bowser=(function(){function t(t){function n(e){var n=t.match(e);return n&&n.length>1&&n[1]||""}function r(e){var n=t.match(e);return n&&n.length>1&&n[2]||""}var i=n(/(ipod|iphone|ipad)/i).toLowerCase(),s=/like android/i.test(t),o=!s&&/android/i.test(t),u=/CrOS/.test(t),a=n(/edge\/(\d+(\.\d+)?)/i),f=n(/version\/(\d+(\.\d+)?)/i),l=/tablet/i.test(t),c=!l&&/[^-]mobi/i.test(t),h;/opera|opr/i.test(t)?h={name:"Opera",opera:e,version:f||n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(t)?h={name:"Yandex Browser",yandexbrowser:e,version:f||n(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?(h={name:"Windows Phone",windowsphone:e},a?(h.msedge=e,h.version=a):(h.msie=e,h.version=n(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(t)?h={name:"Internet Explorer",msie:e,version:n(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:u?h={name:"Chrome",chromeBook:e,chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/chrome.+? edge/i.test(t)?h={name:"Microsoft Edge",msedge:e,version:a}:/chrome|crios|crmo/i.test(t)?h={name:"Chrome",chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:i?(h={name:i=="iphone"?"iPhone":i=="ipad"?"iPad":"iPod"},f&&(h.version=f)):/sailfish/i.test(t)?h={name:"Sailfish",sailfish:e,version:n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?h={name:"SeaMonkey",seamonkey:e,version:n(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(h={name:"Firefox",firefox:e,version:n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(h.firefoxos=e)):/silk/i.test(t)?h={name:"Amazon Silk",silk:e,version:n(/silk\/(\d+(\.\d+)?)/i)}:o?h={name:"Android",version:f}:/phantom/i.test(t)?h={name:"PhantomJS",phantom:e,version:n(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?h={name:"BlackBerry",blackberry:e,version:f||n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(h={name:"WebOS",webos:e,version:f||n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},new RegExp('touchpad\/', 'i').test(t)&&(h.touchpad=e)):/bada/i.test(t)?h={name:"Bada",bada:e,version:n(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?h={name:"Tizen",tizen:e,version:n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||f}:/safari/i.test(t)?h={name:"Safari",safari:e,version:f}:h={name:n(/^(.*)\/(.*) /),version:r(/^(.*)\/(.*) /)},!h.msedge&&/(apple)?webkit/i.test(t)?(h.name=h.name||"Webkit",h.webkit=e,!h.version&&f&&(h.version=f)):!h.opera&&/gecko\//i.test(t)&&(h.name=h.name||"Gecko",h.gecko=e,h.version=h.version||n(/gecko\/(\d+(\.\d+)?)/i)),!h.msedge&&(o||h.silk)?h.android=e:i&&(h[i]=e,h.ios=e);var p="";h.windowsphone?p=n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):i?(p=n(/os (\d+([_\s]\d+)*) like mac os x/i),p=p.replace(/[_\s]/g,".")):o?p=n(/android[ \/-](\d+(\.\d+)*)/i):h.webos?p=n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):h.blackberry?p=n(/rim\stablet\sos\s(\d+(\.\d+)*)/i):h.bada?p=n(/bada\/(\d+(\.\d+)*)/i):h.tizen&&(p=n(/tizen[\/\s](\d+(\.\d+)*)/i)),p&&(h.osversion=p);var d=p.split(".")[0];if(l||i=="ipad"||o&&(d==3||d==4&&!c)||h.silk)h.tablet=e;else if(c||i=="iphone"||i=="ipod"||o||h.blackberry||h.webos||h.bada)h.mobile=e;return h.msedge||h.msie&&h.version>=10||h.yandexbrowser&&h.version>=15||h.chrome&&h.version>=20||h.firefox&&h.version>=20||h.safari&&h.version>=6||h.opera&&h.version>=10||h.ios&&h.osversion&&h.osversion.split(".")[0]>=6||h.blackberry&&h.version>=10.1?h.a=e:h.msie&&h.version<10||h.chrome&&h.version<20||h.firefox&&h.version<20||h.safari&&h.version<6||h.opera&&h.version<10||h.ios&&h.osversion&&h.osversion.split(".")[0]<6?h.c=e:h.x=e,h}var e=!0,n=t(typeof navigator!="undefined"?navigator.userAgent:"");return n.test=function(e){for(var t=0;t<e.length;++t){var r=e[t];if(typeof r=="string"&&r in n)return!0}return!1},n._detect=t,n})();
functionsEx.funcs.browser=functionsEx.funcs.bowser;
/*============================================================*/
/* Tick.js - fast and crossbrowser implementation of setImmediate() | (c) Louter NightMigera 2016, github.com/NightMigera/tick | 2016-03-11 */
//! need to replace with another version, (this polyfill outdated, unsupported and undocumented).
// CANDIDATS
// https://habrahabr.ru/post/275023/
// https://github.com/YuzuJS/setImmediate
//? https://github.com/kriskowal/asap
(function(){var q,r,t,a,h,u,v,w,x,y,n,m,p,k;q=window.MutationObserver;t=window.TypeError||window.Error||Object;r=window.RangeError||window.Error||Object;v=function(){var f,b,c,a;b=0;a=Array(16);f=!1;window.onmessage=function(c){var d,l;if("a"===c.data)for(l=a,c=b,d=0,a=Array(16),b=0,f=!1;d<c;)l[d++]()};c=function(c){a[b++]=c;f||(f=!0,postMessage("a","*"));return 16>=b};return[c,function(b){return c(function(){try{b()}catch(c){}})}]};u=function(){var a,b,c,g,e,d;d=c=0;e=Array(16);b=!1;a=document.createElement("a");(new q(function(){var a,d,f;f=e;a=c;d=0;e=Array(16);c=0;for(b=!1;d<a;)f[d++]()})).observe(a,{attributes:!0,attributeFilter:["lang"]});g=function(l){e[c++]=l;b||(b=!0,a.setAttribute("lang",(d++).toString()));return 16>=c};return[g,function(b){return g(function(){try{b()}catch(a){}})}]};w=function(){var a,b,c,g,e,d;c=0;d=Array(16);b=!1;e=Promise.resolve();a=function(){var a,f,e;e=d;a=c;f=0;d=Array(16);c=0;for(b=!1;f<a;)e[f++]()};g=function(l){d[c++]=l;b||(b=!0,e=e.then(a));return 16>=c};return[g,function(a){return g(function(){try{a()}catch(b){}})}]};x=function(){var a,b,c,g,e;c=0;e=Array(16);b=!1;a=function(a){var f,g;g=e;a=c;f=0;e=Array(16);c=0;for(b=!1;f<a;)g[f++]()};g=function(d){e[c++]=d;b||(b=!0,setTimeout(a,0));return 16>=c};return[g,function(a){return g(function(){try{a()}catch(b){}})}]};a=navigator.userAgent.match(/Chrome\/(\d+)/);y=navigator.userAgent.match(/Opera\/(\d+)/);h="T";null!=a?39<=parseInt(a[1])&&null!=window.Promise&&(h="P"):null!=y&&15<=parseInt(a[1])&&null!=window.Promise&&(h="P");"T"===h&&(null!=window.MutationObserver?h="M":window.WebkitMutationObserver?(q=window.WebkitMutationObserver,h="M"):"function"===typeof window.postMessage&&(h="S"));switch(h){case "P":a=w(!1);k=a[0];m=a[1];break;case "M":a=u(!1);k=a[0];m=a[1];break;case "S":a=v(!1);k=a[0];m=a[1];break;case "T":a=x(!1);k=a[0];m=a[1];break;default:throw Error("Impossible state");}n=null;k.getSafe=function(){return null!==n?n:n=function(a){var b;b=null;if("function"!==typeof a)return new t("fn is not a function");k(a)||(b=new r("more than 16 task wait end of queue, not critical"));return b}};p=null;k.getSecure=function(){return null!==p?p:p=function(a){var b;b=null;if("function"!==typeof a)throw new t("fn is not a function");m(a)||(b=new r("more than 16 task wait end of queue, not critical"));return b}};k.mode=h;functionsEx.funcs.tick=k.getSafe()/*k.getSecure()*/}).call(this);
/*============================================================*/
/* Function for converts SVG to URI for <IMG>, from Highcharts-offline-export */
functionsEx.funcs.svgToDataUrl=function(svg){
   //! по какойто причине этот код срабатывает в phantomJS (и выдает ссылку на ресурс, недоступный вне браузера), нужно проверить юзерагент.
   // try{
   //    // Safari requires data URI since it doesn't allow navigation to blob URLs
   //    // Firefox has an issue with Blobs and internal references, leading to gradients not working using Blobs
   //    if(!(navigator.userAgent.indexOf('WebKit')>-1 && navigator.userAgent.indexOf('Chrome')<0) && navigator.userAgent.toLowerCase().indexOf('firefox')<0)
   //       return (window.URL || window.webkitURL || window).createObjectURL(new Blob([svg], {type:'image/svg+xml;charset-utf-16'}));
   // }catch(e){}
   return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
/*============================IMPORT================================*/
functionsEx.importNow=function(_scope, _import, solveConflicts){
   solveConflicts=solveConflicts===false? false: true;
   var functionsEx_import=_import|| functionsEx['import'];
   if(!functionsEx.funcs.isObject(functionsEx_import))
      functionsEx_import={'vars':functionsEx_import, 'funcs':functionsEx_import, 'proto':functionsEx_import};
   var functionsEx_scope=_scope|| functionsEx['scope'];
   var scopeIsWindow=functionsEx_scope===window;
   if(functionsEx_scope && functionsEx.funcs.isObject(functionsEx_import)){
      if(functionsEx_scope.functionsex_imported_into_scope)
         return console.log('FEX: given scope contain param "functionsex_imported_into_scope", import ignored!');
   //==Variables
      if(functionsEx_import.vars){
         functionsEx.funcs.forMe(functionsEx.vars, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.vars) && !functionsEx.funcs.inOf(functionsEx_import.vars, k)) return;
            if(k in functionsEx_scope){
               if(solveConflicts && scopeIsWindow){
                  // console.log('! FEX: conflicting name "'+k+'", overloaded');
               }
               else if(solveConflicts){
                  // console.log('! FEX: conflicting name "'+k+'", changed to "fex_'+k+'"');
                  k='fex_'+k;
               }else
                  return console.log('!!! FEX: conflicting name "'+k+'", skipped');
            }
            functionsEx_scope[k]=v;
         });
      }
   //==Functions
      if(functionsEx_import.funcs){
         functionsEx.funcs.forMe(functionsEx.funcs, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.funcs) && !functionsEx.funcs.inOf(functionsEx_import.funcs, k)) return;
            if(k in functionsEx_scope){
               if(solveConflicts && scopeIsWindow){
                  // console.log('! FEX: conflicting name "'+k+'", overloaded');
               }
               else if(solveConflicts){
                  // console.log('! FEX: conflicting name "'+k+'", changed to "fex_'+k+'"');
                  k='fex_'+k;
               }else
                  return console.log('!!! FEX: conflicting name "'+k+'", skipped');
            }
            functionsEx_scope[k]=v;
         });
      }
   //==String.prototype
      if(functionsEx_import.proto || functionsEx_import.proto_str){
         functionsEx.funcs.forMe(functionsEx.proto_str, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.proto_str) && !functionsEx.funcs.inOf(functionsEx_import.proto_str, k)) return;
            if(k in String.prototype){
               if(solveConflicts){
                  // console.log('! FEX: conflicting name in String.prototype "'+k+'", overloaded');
               }
               else
                  return console.log('!!! FEX: conflicting name in String.prototype "'+k+'", skipped');
            }
            String.prototype[k]=(function(){
               Array.prototype.unshift.call(arguments, this);
               return v.apply(this, arguments);
            });
         });
      }
   //==Array.prototype
      if(functionsEx_import.proto || functionsEx_import.proto_arr){
         functionsEx.funcs.forMe(functionsEx.proto_arr, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.proto_arr) && !functionsEx.funcs.inOf(functionsEx_import.proto_arr, k)) return;
            if(k in Array.prototype){
               if(solveConflicts){
                  // console.log('! FEX: conflicting name in Array.prototype "'+k+'", overloaded');
               }
               else
                  return console.log('!!! FEX: conflicting name in Array.prototype "'+k+'", skipped');
            }
            Array.prototype[k]=(function(){
               Array.prototype.unshift.call(arguments, this);
               return v.apply(this, arguments);
            });
         });
      }
   //==Number.prototype
      if(functionsEx_import.proto || functionsEx_import.proto_num){
         functionsEx.funcs.forMe(functionsEx.proto_num, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.proto_num) && !functionsEx.funcs.inOf(functionsEx_import.proto_num, k)) return;
            if(k in Number.prototype){
               if(solveConflicts){
                  // console.log('! FEX: conflicting name in Number.prototype "'+k+'", overloaded');
               }
               else
                  return console.log('!!! FEX: conflicting name in Number.prototype "'+k+'", skipped');
            }
            Number.prototype[k]=(function(){
               Array.prototype.unshift.call(arguments, this);
               return v.apply(this, arguments);
            });
         });
      }
   //==Boolean.prototype
      if(functionsEx_import.proto || functionsEx_import.proto_bool){
         functionsEx.funcs.forMe(functionsEx.proto_bool, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.proto_bool) && !functionsEx.funcs.inOf(functionsEx_import.proto_bool, k)) return;
            if(k in Boolean.prototype){
               if(solveConflicts){
                  // console.log('! FEX: conflicting name in Boolean.prototype "'+k+'", overloaded');
               }
               else
                  return console.log('!!! FEX: conflicting name in Boolean.prototype "'+k+'", skipped');
            }
            Boolean.prototype[k]=(function(){
               Array.prototype.unshift.call(arguments, this);
               return v.apply(this, arguments);
            });
         });
      }
   //==Object
      if(functionsEx_import.proto || functionsEx_import.proto_obj){
         functionsEx.funcs.forMe(functionsEx.proto_obj, function(k, v){
            if(functionsEx.funcs.isArray(functionsEx_import.proto_obj) && !functionsEx.funcs.inOf(functionsEx_import.proto_obj, k)) return;
            if(k in Object){
               if(solveConflicts){
                  // console.log('! FEX: conflicting name in Object "'+k+'", overloaded');
               }
               else
                  return console.log('!!! FEX: conflicting name in Object "'+k+'", skipped');
            }
            Object[k]=v;
         });
      }
   //==Object.prototype
      if(functionsEx_import.proto || functionsEx_import.proto_obj2){
         functionsEx.funcs.forMe(functionsEx.proto_obj2, function(k, v){
            // functionsEx.funcs.print('!!! Importing Object.prototype not supported for now');
            // if(functionsEx.funcs.isArray(functionsEx_import.proto_obj2) && !functionsEx.funcs.inOf(functionsEx_import.proto_obj2, k)) return;
            // var func0=(function(){
            //    Array.prototype.unshift.call(arguments, this);
            //    return v.apply(this, arguments);
            // });
            // try{
            //    Object.defineProperty(Object.prototype, k, {enumerable:false, configurable:false, writable:false, value: func0});
            // }catch(e){//!такой метод импорта ломает jquery
            //    Object.prototype[k]=func0;
            // }
         });
      }
   //==mark as imported
      if(functionsEx_scope)
         functionsEx_scope.functionsex_imported_into_scope=true;
   }
}

functionsEx.importNow();
/*=============================Polyfill===============================*/
functionsEx.funcs.ie_arrIndexOf=function(arr, searchElement, fromIndex){
   // if(null===this || undefined===this)
   //    throw new TypeError('"this" is null or not defined');
   var o=Object(arr);
   var len=o.length>>>0;
   if(len===0) return -1;
   var n=+fromIndex|| 0;
   if(Math.abs(n)===Infinity) n=0;
   if(n>=len) return -1;
   var k=Math.max(n>=0? n: len-Math.abs(n), 0);
   while(k<len){
      if(k in o && o[k]===searchElement) return k;
      k++;
   }
   return -1;
};

if(!String.prototype.trim){
   String.prototype.trim=function(){
      return this.replace(/^\s+|\s+$/g, '');
   }
}

// if(!Array.prototype.indexOf){
//    Array.prototype.indexOf=function(searchElement, fromIndex){
//       var k;
//       if(null===this|| undefined===this){
//          throw new TypeError('"this" is null or not defined');
//       }
//       var O=Object(this);
//       var len=O.length>>>0;
//       if(len===0) return -1;
//       var n=+fromIndex|| 0;
//       if(Math.abs(n)===Infinity) n=0;
//       if(n>=len) return -1;
//       k=Math.max(n>=0? n: len-Math.abs(n), 0);
//       while(k<len){
//          if(k in O && O[k]===searchElement) return k;
//          k++;
//       }
//       return -1;
//    };
// }


// function TEST_GET(url){
// var query = 'select * from html where url="'+url+'" and xpath="*"';
// var url = 'https://query.yahooapis.com/v1/public/yql?q='+encodeURI(query)+'&format=xml&callback=callback';
// var script = document.createElement('script');
// script.src = url;
// document.body.appendChild(script);
// function callback(data) {
//     console.log(data); //сам текст ответа находится в data.result[0]
// }
// }