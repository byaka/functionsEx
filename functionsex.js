var None=undefined;
var rad2deg=180/Math.PI;
var deg2rad=Math.PI/180;

function base64encode(str){var base64EncodeChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var out,i,len;var c1,c2,c3;len=str.length;i=0;out='';while(i<len){c1=str.charCodeAt(i++)&0xff;if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt((c1&0x3)<<4);out+='==';break;}c2=str.charCodeAt(i++);if(i==len){out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt((c2&0xF)<<2);out+='=';break;}c3=str.charCodeAt(i++);out+=base64EncodeChars.charAt(c1>>2);out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));out+=base64EncodeChars.charAt(c3&0x3F);}return out;}

function randomEx(mult,vals,pref,suf){
   pref=pref ||'';
   suf=suf ||'';
   var s=pref+Math.floor(Math.random()*mult)+suf;
   if(vals==undefined) return s;
   while(vals[s]!==undefined) s=pref+Math.floor(Math.random()*mult)+suf;
   return s;
}

function cloneMe(obj){
   return JSON.parse(JSON.stringify(obj));
}

Array.prototype.inOf=function(val,from){
   var i=this.indexOf(val,from);
   if(i==-1) return undefined;
   return i+1;
}

Array.prototype.average=function(p){
   if(p==undefined || !p) var s=0;
   else var s=1;
   for(var i=0,l=this.length;i<l;i++){
      if(p==undefined || !p) s=s+parseFloat(this[i]);
      else s=s*parseFloat(this[i]);
   }
   return (s/this.length);
}

Array.prototype.max=function(){
return Math.max.apply(Math,this);
}

Array.prototype.min=function(){
return Math.min.apply(Math,this);
}

Array.prototype.inObj=function(key,val){
//==find item on array of objects by key:val on this objects
   for(var i=0,l=this.length;i<l;i++){
      if(!isObject(this[i])) continue;
      if(this[i][key]==val) return i+1;
   }
   return undefined;
}

Array.prototype.delex=function(val){
   var ind=this.indexOf(val);
	if(ind>=0) this.splice(ind,1);
}

Array.prototype.del=function(ind){
	if(ind>=0) this.splice(ind,1);
}

String.prototype.capital=function(){
   return this.slice(0,1).toUpperCase()+this.slice(1);
}

function isArray(o){
   return Object.prototype.toString.call(o)=='[object Array]';
}

function isFunction(o){
   return Object.prototype.toString.call(o)=='[object Function]';
}

function isString(o){
   return Object.prototype.toString.call(o)=='[object String]';
}

function isObject(o){
   return Object.prototype.toString.call(o)=='[object Object]';
}

function getsett(text,ss,si,es){
   if(text==undefined) return undefined;
   if(ss==undefined) return undefined;
   if(es==undefined) return undefined;
   var getsett_i1=0;
   var getsett_i2=0;
   var text1=text.toLowerCase();
   ss=ss.toLowerCase();
   es=es.toLowerCase();
   if(ss!=='') getsett_i1=text1.indexOf(ss,si);
   else getsett_i1=si;
   if(getsett_i1==-1) return undefined;
   if(es!=='') getsett_i2=text1.indexOf(es,getsett_i1+ss.length);
   else getsett_i2=text1.length;
   if(getsett_i2==-1) return undefined;
   return text.slice(getsett_i1+ss.length,getsett_i2);

}

function getms(){
   return new Date().getTime();
}

Array.prototype.unique=function(){
	var tmp_arr=new Array();
	for(var i=0;i<this.length;i++){
		if(tmp_arr.indexOf(this[i])==-1) tmp_arr.push(this[i]);
	}
	return tmp_arr;
}

function reRound(val,as,float){
   if(as==undefined) as=360;
   if(Math.abs(val)<as) return val;
   var s=val/as;
   s=(s-Math.floor(s))*as;
   if(float!==undefined || !float) s=Math.round(s);
   return s;
}
function reAngle(val){
   if(isString(val)) val=parseFloat(val);
   val=reRound(val,360);
   if(val<=0) val+=360;
   return val;
}

function group2val(groupObj,what){
   what=what||'value';
   for(var i=0;i<groupObj.length;i++){
      if(groupObj[i].type=='radio' && groupObj[i].checked) return groupObj[i][what];
      else if(groupObj[i].type!=='radio') return groupObj[i][what];
   }
   return undefined;
}

function cache(){
   if(typeof(localStorage)=='undefined') return false;
   var all=localStorage.getItem('!all!');
   if(all==undefined){
      localStorage.setItem('!all!',JSON.stringify({'key':[],'type':[]}));
      return {'key':[],'type':[]};
   }
   return JSON.parse(all);
}

cache.set=function(key,val,type){
   if(typeof(localStorage)=='undefined') return false;
   var all=cache(),i=all.key.indexOf(key);
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

cache.get=function(key,parse){
   if(typeof(localStorage)=='undefined') return false;
   var all=cache(),i=all.key.indexOf(key),parse=parse||true;
   if(all==false || i==-1) return false;
   var v=localStorage.getItem(key);
   if(parse && all.type[i]!=='string') v=JSON.parse(v);
   return v;
}