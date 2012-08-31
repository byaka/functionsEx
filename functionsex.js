var None=undefined;
var rad2deg=180/Math.PI;
var deg2rad=Math.PI/180;
/*============================================================*/
function isArray(o){return Object.prototype.toString.call(o)=='[object Array]'}
function isFunction(o){return Object.prototype.toString.call(o)=='[object Function]'}
function isString(o){return Object.prototype.toString.call(o)=='[object String]'}
function isObject(o){return Object.prototype.toString.call(o)=='[object Object]'}
function isNumber(o){return Object.prototype.toString.call(o)=='[object Number]'}
/*============================================================*/
function objMake(key,val){
   var s={};
   key=isArray(key)?key:[key];
   for(var i=0,l=key.length;i<l;i++){
      if(isArray(val)) s[key[i]]=val[i];
      else  s[key[i]]=val;
   }
   return s;
}

function randomEx(mult,vals,pref,suf){
   pref=pref ||'';
   suf=suf ||'';
   var s=pref+Math.floor(Math.random()*mult)+suf;
   if(vals==undefined) return s;
   while(vals[s]!==undefined) s=pref+Math.floor(Math.random()*mult)+suf;
   return s;
}

function callMe(func,args,namespc){
   if(!func) return;
   namespc=namespc||window;
   if(isFunction(func)) return func(args);
   else if(isFunction(namespc[func])) return namespc[func](args);
}

function cloneMe(obj,keep){
//this method has problems with functions and recursion. use 'keep' for solve this
   if(!obj) return '';
   var tarr={};
   if(keep) for(var i=0,l=keep.length;i<l;i++){
      tarr[keep[i]]=obj[keep[i]];
      delete obj[keep[i]];
   }
   var tout=JSON.parse(JSON.stringify(obj));
   if(keep) for(var i=0,l=keep.length;i<l;i++){
      tout[keep[i]]=tarr[keep[i]];
      obj[keep[i]]=tarr[keep[i]];
   }
   return tout;
}

function forMe(o,callback,sameorder){
   if(isArray(o)){
      for(var i=0,l=o.length;i<l;i++){
         if(callback(o[i],i,o)===false) break;
      }
   }else if(isObject(o)){
      for(i in o){
         if(!o.hasOwnProperty(i)) continue;
         else if(!sameorder && callback(i,o[i],o)===false) break;
         else if(sameorder && callback(o[i],i,o)===false) break;
      }
   }
}

function byIndex(o,ind){
   var i=0;
   for(var k in o){
      if(!o.hasOwnProperty(k)) continue;
      if(i==ind) return k;
      i++;
   }
}

function getms(){return new Date().getTime()}

function reRound(val,to,asfloat){
   to=to||100;
   if(Math.abs(val)<to) return val;
   var s=val/to;
   s=(s-Math.floor(s))*to;
   if(!asfloat) s=Math.round(s);
   return s;
}
function reAngle(val){
   if(isString(val)) val=parseFloat(val);
   val=reRound(val,360,true);
   if(val<=0) val+=360;
   return val;
}

function getChecked(obj,whatreturn){
   whatreturn=whatreturn||'value';
   for(var i=0;i<obj.length;i++){
      if(obj[i].checked) return obj[i][whatreturn];
   }
   return undefined;
}
/*============================================================*/
Array.prototype.inOf=function(val,from){
   from=from||0;
   var i=this.indexOf(val,from);
   if(i==-1) return undefined;
   return i+1;
}

Array.prototype.average=function(mode){
   if(!mode) var s=0;
   else var s=1;
   for(var i=0,l=this.length;i<l;i++){
      if(!mode) s=s+parseFloat(this[i]);
      else s=s*parseFloat(this[i]);
   }
   return (s/this.length);
}

Array.prototype.max=function(){return Math.max.apply(Math,this)}

Array.prototype.min=function(){return Math.min.apply(Math,this)}

Array.prototype.inObj=function(key,val,returnAsObj){
//==find item on array of objects by key:val on this objects
   for(var i=0,l=this.length;i<l;i++){
      if(!isObject(this[i])) continue;
      if(this[i][key]==val && !returnAsObj) return i+1;
      else if(this[i][key]==val) return this[i];
   }
   return undefined;
}

Array.prototype.del=function(ind){if(ind>=0) this.splice(ind,1)}

Array.prototype.delex=function(val){this.del(this.indexOf(val))}

Array.prototype.unique=function(){
	var tmp_arr=new Array();
	for(var i=0;i<this.length;i++){
		if(tmp_arr.indexOf(this[i])==-1) tmp_arr.push(this[i]);
	}
	return tmp_arr;
}
/*============================================================*/
NodeList.prototype.byAttr=function(key,val){
   for(var i=0,l=this.length;i<l;i++){
      if(this[i][key]==val) return this[i];
   }
   return undefined;
}

Boolean.prototype.bool=function(){return (this==true?true:false)}

String.prototype.capital=function(){return this.slice(0,1).toUpperCase()+this.slice(1).toLowerCase()}

String.prototype.bool=function(patterns){
   patterns=patterns||['true','1','yes','checked'];
   if(patterns.inOf(this.toLowerCase())) return true;
   else return false;
}

String.prototype.get=function(pref,suf,from){
   if(!this) return '';
   var i1=0, i2=0, text=this.toLowerCase();
   if(pref) pref=pref.toLowerCase();
   if(suf) suf=suf.toLowerCase();
   from=from||0;
   if(pref) i1=text.indexOf(pref,from);
   else i1=from;
   if(i1==-1) return '';
   if(suf) i2=text.indexOf(suf,i1+pref.length);
   else i2=text.length;
   if(i2==-1) return '';
   return this.slice(i1+pref.length,i2);
}

String.prototype.toBase64=function(){var base64EncodeChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var out,i,len;var c1,c2,c3;len=this.length;i=0;out='';while(i<len){c1=this.charCodeAt(i++)&0xff;if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt((c1&0x3)<<4);out+='==';break;}c2=this.charCodeAt(i++);if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt((c2&0xF)<<2);out+='=';break;}c3=this.charCodeAt(i++);out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));out+=base64EncodeChars.charAt(c3&0x3F);}return out;}
/*============================================================*/
function fileSave(what,name,iscontent){
   iscontent=iscontent||false;
   name=name||'';
	var link=document.createElement('a'), event=document.createEvent('MouseEvents');
   if(iscontent) what='data:text;charset=utf-8,'+encodeURIComponent(what);
	link.setAttribute('href',what);
	link.setAttribute('download',name);
	event.initMouseEvent('click',true,true,window,1,0,0,0,0,false,false,false,false,0,null);
	link.dispatchEvent(event);
}

function fileLoad(callback){
	var dialog=document.createElement('input'), event=document.createEvent('MouseEvents');
	dialog.setAttribute('type','file');
   $(dialog).change(function(e){
      var fr=new FileReader();
      fr._name=e.target.files[0].name.get('','.');
      fr._ext=e.target.files[0].name.get('.','');
      fr.onload=function(){callback(this.result,this._name,this._ext)};
      fr.onerror=function(){alert('error reading!')};
      fr.readAsText(e.target.files[0]);
   });
	event.initMouseEvent('click',true,true,window,1,0,0,0,0,false,false,false,false,0,null);
	dialog.dispatchEvent(event);
}
/*============================================================*/
function lStorage(){
   if(typeof(localStorage)=='undefined') return false;
   var all=localStorage.getItem('!all!');
   if(all==undefined){
      localStorage.setItem('!all!',JSON.stringify({'key':[],'type':[]}));
      return {'key':[],'type':[]};
   }
   return JSON.parse(all);
}

lStorage.set=function(key,val,type){
   type=type||'string';
   if(typeof(localStorage)=='undefined') return false;
   var all=lStorage(),i=all.key.indexOf(key);
   if(all==false) return false;
   if(!isString(val)) val=JSON.stringify(val);
   try{localStorage.setItem(key,val);}
   catch(e){
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

lStorage.get=function(key,parse){
   if(typeof(localStorage)=='undefined') return false;
   var all=lStorage(),i=all.key.indexOf(key);
   if(all==false || i==-1) return false;
   var v=localStorage.getItem(key);
   if(parse && all.type[i]!=='string') v=JSON.parse(v);
   return v;
}
/*============================================================*/
var easing={easeInQuad:function(t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(t,b,c,d){return -c*(t/=d)*(t-2)+b;},easeInOutQuad:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return -c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return -c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(t,b,c,d){return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(t,b,c,d){return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(t,b,c,d){if((t/=d/2)<1)return -c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(t,b,c,d){vars=1.70158;varp=0;vara=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;vars=p/4;}elsevars=p/(2*Math.PI)*Math.asin(c/a);return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(t,b,c,d){vars=1.70158;varp=0;vara=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;vars=p/4;}elsevars=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(t,b,c,d){vars=1.70158;varp=0;vara=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;vars=p/4;}elsevars=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(t,b,c,d){return c-easing.easeOutBounce(d-t,0,c,d)+b;},easeOutBounce:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(t,b,c,d){if(t<d/2)return easing.easeInBounce(t*2,0,c,d)*.5+b;return easing.easeOutBounce(t*2-d,0,c,d)*.5+c*.5+b;}};
