(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
!function(a,b){"use strict";var c=b.prototype.trim,d=b.prototype.trimRight,e=b.prototype.trimLeft,f=function(a){return a*1||0},g=function(a,b){if(b<1)return"";var c="";while(b>0)b&1&&(c+=a),b>>=1,a+=a;return c},h=[].slice,i=function(a){return a==null?"\\s":a.source?a.source:"["+n.escapeRegExp(a)+"]"},j={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"},k={};for(var l in j)k[j[l]]=l;var m=function(){function a(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}var c=g,d=function(){return d.cache.hasOwnProperty(arguments[0])||(d.cache[arguments[0]]=d.parse(arguments[0])),d.format.call(null,d.cache[arguments[0]],arguments)};return d.format=function(d,e){var f=1,g=d.length,h="",i,j=[],k,l,n,o,p,q;for(k=0;k<g;k++){h=a(d[k]);if(h==="string")j.push(d[k]);else if(h==="array"){n=d[k];if(n[2]){i=e[f];for(l=0;l<n[2].length;l++){if(!i.hasOwnProperty(n[2][l]))throw new Error(m('[_.sprintf] property "%s" does not exist',n[2][l]));i=i[n[2][l]]}}else n[1]?i=e[n[1]]:i=e[f++];if(/[^s]/.test(n[8])&&a(i)!="number")throw new Error(m("[_.sprintf] expecting number but found %s",a(i)));switch(n[8]){case"b":i=i.toString(2);break;case"c":i=b.fromCharCode(i);break;case"d":i=parseInt(i,10);break;case"e":i=n[7]?i.toExponential(n[7]):i.toExponential();break;case"f":i=n[7]?parseFloat(i).toFixed(n[7]):parseFloat(i);break;case"o":i=i.toString(8);break;case"s":i=(i=b(i))&&n[7]?i.substring(0,n[7]):i;break;case"u":i=Math.abs(i);break;case"x":i=i.toString(16);break;case"X":i=i.toString(16).toUpperCase()}i=/[def]/.test(n[8])&&n[3]&&i>=0?"+"+i:i,p=n[4]?n[4]=="0"?"0":n[4].charAt(1):" ",q=n[6]-b(i).length,o=n[6]?c(p,q):"",j.push(n[5]?i+o:o+i)}}return j.join("")},d.cache={},d.parse=function(a){var b=a,c=[],d=[],e=0;while(b){if((c=/^[^\x25]+/.exec(b))!==null)d.push(c[0]);else if((c=/^\x25{2}/.exec(b))!==null)d.push("%");else{if((c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b))===null)throw new Error("[_.sprintf] huh?");if(c[2]){e|=1;var f=[],g=c[2],h=[];if((h=/^([a-z_][a-z_\d]*)/i.exec(g))===null)throw new Error("[_.sprintf] huh?");f.push(h[1]);while((g=g.substring(h[0].length))!=="")if((h=/^\.([a-z_][a-z_\d]*)/i.exec(g))!==null)f.push(h[1]);else{if((h=/^\[(\d+)\]/.exec(g))===null)throw new Error("[_.sprintf] huh?");f.push(h[1])}c[2]=f}else e|=2;if(e===3)throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");d.push(c)}b=b.substring(c[0].length)}return d},d}(),n={VERSION:"2.2.0rc",isBlank:function(a){return a==null&&(a=""),/^\s*$/.test(a)},stripTags:function(a){return a==null?"":b(a).replace(/<\/?[^>]+>/g,"")},capitalize:function(a){return a=a==null?"":b(a),a.charAt(0).toUpperCase()+a.slice(1)},chop:function(a,c){return a==null?[]:(a=b(a),c=~~c,c>0?a.match(new RegExp(".{1,"+c+"}","g")):[a])},clean:function(a){return n.strip(a).replace(/\s+/g," ")},count:function(a,c){return a==null||c==null?0:b(a).split(c).length-1},chars:function(a){return a==null?[]:b(a).split("")},swapCase:function(a){return a==null?"":b(a).replace(/\S/g,function(a){return a===a.toUpperCase()?a.toLowerCase():a.toUpperCase()})},escapeHTML:function(a){return a==null?"":b(a).replace(/[&<>"']/g,function(a){return"&"+k[a]+";"})},unescapeHTML:function(a){return a==null?"":b(a).replace(/\&([^;]+);/g,function(a,c){var d;return c in j?j[c]:(d=c.match(/^#x([\da-fA-F]+)$/))?b.fromCharCode(parseInt(d[1],16)):(d=c.match(/^#(\d+)$/))?b.fromCharCode(~~d[1]):a})},escapeRegExp:function(a){return a==null?"":b(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},splice:function(a,b,c,d){var e=n.chars(a);return e.splice(~~b,~~c,d),e.join("")},insert:function(a,b,c){return n.splice(a,b,0,c)},include:function(a,c){return c===""?!0:a==null?!1:b(a).indexOf(c)!==-1},join:function(){var a=h.call(arguments),b=a.shift();return b==null&&(b=""),a.join(b)},lines:function(a){return a==null?[]:b(a).split("\n")},reverse:function(a){return n.chars(a).reverse().join("")},startsWith:function(a,c){return c===""?!0:a==null||c==null?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(0,c.length)===c)},endsWith:function(a,c){return c===""?!0:a==null||c==null?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(a.length-c.length)===c)},succ:function(a){return a==null?"":(a=b(a),a.slice(0,-1)+b.fromCharCode(a.charCodeAt(a.length-1)+1))},titleize:function(a){return a==null?"":b(a).replace(/(?:^|\s)\S/g,function(a){return a.toUpperCase()})},camelize:function(a){return n.trim(a).replace(/[-_\s]+(.)?/g,function(a,b){return b.toUpperCase()})},underscored:function(a){return n.trim(a).replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase()},dasherize:function(a){return n.trim(a).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},classify:function(a){return n.titleize(b(a).replace(/_/g," ")).replace(/\s/g,"")},humanize:function(a){return n.capitalize(n.underscored(a).replace(/_id$/,"").replace(/_/g," "))},trim:function(a,d){return a==null?"":!d&&c?c.call(a):(d=i(d),b(a).replace(new RegExp("^"+d+"+|"+d+"+$","g"),""))},ltrim:function(a,c){return a==null?"":!c&&e?e.call(a):(c=i(c),b(a).replace(new RegExp("^"+c+"+"),""))},rtrim:function(a,c){return a==null?"":!c&&d?d.call(a):(c=i(c),b(a).replace(new RegExp(c+"+$"),""))},truncate:function(a,c,d){return a==null?"":(a=b(a),d=d||"...",c=~~c,a.length>c?a.slice(0,c)+d:a)},prune:function(a,c,d){if(a==null)return"";a=b(a),c=~~c,d=d!=null?b(d):"...";if(a.length<=c)return a;var e=function(a){return a.toUpperCase()!==a.toLowerCase()?"A":" "},f=a.slice(0,c+1).replace(/.(?=\W*\w*$)/g,e);return f.slice(f.length-2).match(/\w\w/)?f=f.replace(/\s*\S+$/,""):f=n.rtrim(f.slice(0,f.length-1)),(f+d).length>a.length?a:a.slice(0,f.length)+d},words:function(a,b){return n.isBlank(a)?[]:n.trim(a,b).split(b||/\s+/)},pad:function(a,c,d,e){a=a==null?"":b(a),c=~~c;var f=0;d?d.length>1&&(d=d.charAt(0)):d=" ";switch(e){case"right":return f=c-a.length,a+g(d,f);case"both":return f=c-a.length,g(d,Math.ceil(f/2))+a+g(d,Math.floor(f/2));default:return f=c-a.length,g(d,f)+a}},lpad:function(a,b,c){return n.pad(a,b,c)},rpad:function(a,b,c){return n.pad(a,b,c,"right")},lrpad:function(a,b,c){return n.pad(a,b,c,"both")},sprintf:m,vsprintf:function(a,b){return b.unshift(a),m.apply(null,b)},toNumber:function(a,c){if(a==null||a=="")return 0;a=b(a);var d=f(f(a).toFixed(~~c));return d===0&&!a.match(/^0+$/)?Number.NaN:d},numberFormat:function(a,b,c,d){if(isNaN(a)||a==null)return"";a=a.toFixed(~~b),d=d||",";var e=a.split("."),f=e[0],g=e[1]?(c||".")+e[1]:"";return f.replace(/(\d)(?=(?:\d{3})+$)/g,"$1"+d)+g},strRight:function(a,c){if(a==null)return"";a=b(a),c=c!=null?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strRightBack:function(a,c){if(a==null)return"";a=b(a),c=c!=null?b(c):c;var d=c?a.lastIndexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strLeft:function(a,c){if(a==null)return"";a=b(a),c=c!=null?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(0,d):a},strLeftBack:function(a,b){if(a==null)return"";a+="",b=b!=null?""+b:b;var c=a.lastIndexOf(b);return~c?a.slice(0,c):a},toSentence:function(a,b,c,d){b=b||", ",c=c||" and ";var e=a.slice(),f=e.pop();return a.length>2&&d&&(c=n.rtrim(b)+c),e.length?e.join(b)+c+f:f},toSentenceSerial:function(){var a=h.call(arguments);return a[3]=!0,n.toSentence.apply(n,a)},slugify:function(a){if(a==null)return"";var c="ąàáäâãćęèéëêìíïîłńòóöôõùúüûñçżź",d="aaaaaaceeeeeiiiilnooooouuuunczz",e=new RegExp(i(c),"g");return a=b(a).toLowerCase().replace(e,function(a){var b=c.indexOf(a);return d.charAt(b)||"-"}),n.dasherize(a.replace(/[^\w\s-]/g,""))},surround:function(a,b){return[b,a,b].join("")},quote:function(a){return n.surround(a,'"')},exports:function(){var a={};for(var b in this){if(!this.hasOwnProperty(b)||b.match(/^(?:include|contains|reverse)$/))continue;a[b]=this[b]}return a},repeat:function(a,c,d){if(a==null)return"";c=~~c;if(d==null)return g(b(a),c);for(var e=[];c>0;e[--c]=a);return e.join(d)},levenshtein:function(a,c){if(a==null&&c==null)return 0;if(a==null)return b(c).length;if(c==null)return b(a).length;a=b(a),c=b(c);var d=[],e,f;for(var g=0;g<=c.length;g++)for(var h=0;h<=a.length;h++)g&&h?a.charAt(h-1)===c.charAt(g-1)?f=e:f=Math.min(d[h],d[h-1],e)+1:f=g+h,e=d[h],d[h]=f;return d.pop()}};n.strip=n.trim,n.lstrip=n.ltrim,n.rstrip=n.rtrim,n.center=n.lrpad,n.rjust=n.lpad,n.ljust=n.rpad,n.contains=n.include,n.q=n.quote,typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(module.exports=n),exports._s=n):typeof define=="function"&&define.amd?define("underscore.string",[],function(){return n}):(a._=a._||{},a._.string=a._.str=n)}(this,String);
jjvm = {
	core: {

	},
	compiler: {

	},
	runtime: {

	},
	types: {

	},
	ui: {

	},
	nativeMethods: {}
};

jjvm.Util = {
	createStringRef: function(string) {
		var chars = string.split("");

		return jjvm.Util.createObjectRef("java.lang.String", ["char[]"], [chars]);
	},

	createObjectRef: function(className, constructorSignature, constructorArgs) {
		var classDef = jjvm.core.ClassLoader.loadClass(className);
		var objectRef = new jjvm.runtime.ObjectReference(classDef);

		if(constructorArgs) {
			constructorArgs.unshift(objectRef);
		} else {
			constructorArgs = [objectRef];
		}

		var frame = new jjvm.runtime.Frame(classDef, classDef.getMethod("<init>", constructorSignature), constructorArgs);
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);
		thread.run();
		jjvm.runtime.ThreadPool.reap();

		return objectRef;
	},

	parseArgs: function(string) {
		var args = [];
		var iterator = new jjvm.core.Iterator(string.split(""));

		while(iterator.hasNext()) {
			var character = iterator.peek();

			if(character == "(") {
				// discard (
				iterator.next();
				continue;
			}

			if(character == ")") {
				break;
			}

			if(character == "L") {
				args.push(jjvm.Util._readObjectArgument(iterator));
			} else if(character == "[") {
				args.push(jjvm.Util._readArrayArgument(iterator));
			} else {
				var primitive = jjvm.Util._readPrimitiveArgument(iterator);

				if(primitive) {
					args.push(primitive);
				}
			}
		}

		return args;
	},

	execute: function(target, methodName, args, argTypes) {
		if(!argTypes) {
			argTypes = [];
		}

		if(!args) {
			args = [];
		}

		var methodDef;

		if(target instanceof jjvm.types.ClassDefinition) {
			// a static method
			methodDef = target.getMethod(methodName, argTypes);
		} else if(target instanceof jjvm.runtime.ObjectReference) {
			args.unshift(target);
			methodDef = target.getClass().getMethod(methodName, argTypes);
		} else {
			throw "Please pass only ClassDefinition or ObjectReference types to jjvm.Util#execute";
		}

		var frame = new jjvm.runtime.Frame(
			target.getClass(), 
			methodDef,
			args
		);
		frame.setIsSystemFrame(true);
		var thread = new jjvm.runtime.Thread(frame);
		frame.execute(thread);

		return frame.getOutput();
	},

	_readPrimitiveArgument: function(iterator) {
		var character = iterator.next();

		return jjvm.types.Primitives.jvmTypesToPrimitive[character];
	},

	_readObjectArgument: function(iterator) {
		// discard L
		iterator.next();
		var className = "";

		while(true) {
			var classNameCharacter = iterator.next();

			if(classNameCharacter == ";") {
				className = className.replace(/\//g, ".");

				return className;
			} else {
				className += classNameCharacter;
			}
		}
	},

	_readArrayArgument: function(iterator) {
		// discard [
		iterator.next();

		var character = iterator.peek();

		if(character == "L") {
			return jjvm.Util._readObjectArgument(iterator) + "[]";
		} else {
			return jjvm.Util._readPrimitiveArgument(iterator) + "[]";
		}
	}
};

// Methods specified here will override any specified in bytecode.
//
// If you compile bytecode with native methods, you should specify
// an implementation of the method here, otherwise a compile time
// warning will be generated and your code will likely fail at
// run time.
//
// When exectuted, the this keyword will have a value of the passed
// objectRef, unless the method is static, in which case it will
// be the passed classDef
jjvm.nativeMethods = {

	"java.lang.Object": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"getClass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getObjectRef();
		},

		"hashCode()I": function(frame, classDef, methodDef, objectRef) {
			var output = "";

			for(var i = 0; i < classDef.getName().length; i++) {
				output += classDef.getName().charCodeAt(i);
			}

			return parseInt(output, 8);
		},

		"clone()Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			// yikes!
			return objectRef;
		},

		"notify()V": function(frame, classDef, methodDef, objectRef) {

		},

		"notifyAll()V": function(frame, classDef, methodDef, objectRef) {

		},

		"wait(J)V": function(frame, classDef, methodDef, objectRef, interval) {

		}
	},

	"java.lang.Class": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"forName0(Ljava/lang/String;ZLjava/lang/ClassLoader;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className, classLoader) {
			return jjvm.core.ClassLoader.loadClass(className).getObjectRef();
		},

		"isInstance(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef, otherObjectRef) {
			return otherObjectRef.getClass().isChildOf(classDef);
		},

		"isAssignableFrom(Ljava/lang/Class;)Z": function(frame, classDef, methodDef, objectRef, otherClassDefObjectRef) {
			return classDef.isChildOf(otherClassDefObjectRef.getClass());
		},

		"isInterface()Z": function(frame, classDef, methodDef, objectRef) {
			return classDef.isInterface();
		},

		"isArray()Z": function(frame, classDef, methodDef, objectRef) {
			return false;
		},

		"isPrimitive()Z": function(frame, classDef, methodDef, objectRef) {
			return jjvm.types.Primitives.classToPrimitive[classDef.getName()] !== undefined;
		},

		"getName0()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			var stringClassDef = jjvm.core.ClassLoader.loadClass("java.lang.String");
			var stringObjectRef = new jjvm.runtime.ObjectReference(stringClassDef);

			stringObjectRef.setField("hash32", 0);
			stringObjectRef.setField("value", classDef.getName().split(""));

			return stringObjectRef;

			//return jjvm.Util.createStringRef(classDef.getName());
		},

		"getClassLoader0()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getClassLoader().getObjectRef();
		},

		"getSuperclass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			return classDef.getParent().getObjectRef();
		},

		"getInterfaces()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			var output = [];
			var iterator = new jjvm.core.Iterator(classDef.getInterfaces());

			while(iterator.hasNext()) {
				output.push(iterator.next().getClassDef().getObjectRef());
			}

			return output;
		},

		"getComponentType()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getComponentType()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getModifiers()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getModifiers()I invoked on " + classDef.getName() + "!");
		},

		"getSigners()[Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getSigners()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"setSigners([Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef, signersArray) {
			console.warn("setSigners([Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getEnclosingMethod0()[Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getEnclosingMethod0()[Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"getDeclaringClass()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDeclaringClass()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getProtectionDomain0()Ljava/security/ProtectionDomain;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getProtectionDomain0()Ljava/security/ProtectionDomain; invoked on " + classDef.getName() + "!");
		},

		"setProtectionDomain0(Ljava/security/ProtectionDomain;)V": function(frame, classDef, methodDef, objectRef, protectionDomainRef) {
			console.warn("setProtectionDomain0(Ljava/security/ProtectionDomain;)V invoked on " + classDef.getName() + "!");
		},

		"getPrimitiveClass(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, stringRef) {
			var name = stringRef.getField("value").join("");
			var className = jjvm.types.Primitives.primitiveToClass[name];
			var primitiveClassDef = jjvm.core.ClassLoader.loadClass(className);

			return primitiveClassDef.getObjectRef();
		},

		"getGenericSignature()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getGenericSignature()Ljava/lang/String; invoked on " + classDef.getName() + "!");
		},

		"getRawAnnotations()[B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getRawAnnotations()[B invoked on " + classDef.getName() + "!");
		},

		"getConstantPool()Lsun/reflect/ConstantPool;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getConstantPool()Lsun/reflect/ConstantPool; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredFields0(Z)[Ljava/lang/reflect/Field;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredFields0(Z)[Ljava/lang/reflect/Field; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredMethods0(Z)[Ljava/lang/reflect/Method;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredMethods0(Z)[Ljava/lang/reflect/Method; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor;": function(frame, classDef, methodDef, objectRef, bool) {
			console.warn("getDeclaredConstructors0(Z)[Ljava/lang/reflect/Constructor; invoked on " + classDef.getName() + "!");
		},

		"getDeclaredClasses0()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDeclaredClasses0()[Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"desiredAssertionStatus0(Ljava/lang/Class;)Z": function(frame, classDef, methodDef, objectRef, forClassRef) {
			return true;
		},

		"desiredAssertionStatus()Z": function(frame, classDef, methodDef, objectRef, stringRef) {
			return true;
		},

		"getClassLoader()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef, forClassRef) {
			return classDef.getClassLoader().getObjectRef();
		}
	},

	"java.lang.String": {
		"intern()Ljava/lang/String;": function(frame, classDef, methodDef, objectRef) {
			console.warn("intern()Ljava/lang/String; invoked on " + classDef.getName() + "!");
		}
	},

	"java.io.PrintStream": {
		"println(Ljava/lang/String;)V": function(frame, classDef, methodDef, objectRef, stringRef) {
			var line = stringRef.getField("value").join("");
			console.info(line);
		}
	},

	"java.lang.System": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {

		},
		"setIn0(Ljava/io/InputStream;)V": function(frame, classDef, methodDef, objectRef, inputStream) {
			classDef.setStaticField("in", inputStream);
		},
		"setOut0(Ljava/io/PrintStream;)V": function(frame, classDef, methodDef, objectRef, printStream) {
			classDef.setStaticField("out", printStream);
		},
		"setErr0(Ljava/io/PrintStream;)V": function(frame, classDef, methodDef, objectRef, printStream) {
			classDef.setStaticField("err", printStream);
		},
		"currentTimeMillis()J": function(frame, classDef, methodDef, objectRef) {
			return new Date().getTime();
		},
		"nanoTime()J": function(frame, classDef, methodDef, objectRef) {
			return new Date().getTime() * 1000;
		},
		"arraycopy(Ljava/lang/Object;ILjava/lang/Object;II)V": function(frame, classDef, methodDef, objectRef, src, srcPos, dest, destPos, length) {
			if(!dest) {
				throw "NullPointerException";
			}

			if(!src) {
				throw "NullPointerException";
			}

			if(!_.isArray(src) || !_.isArray(dest)) {
				throw "ArrayStoreException";
			}

			if(srcPos < 0 || destPos < 0 || length < 0 || (srcPos + length > src.length) || (destPos + length > dest.length)) {
				throw "IndexOutOfBoundsException";
			}

			for(var i = 0; i < length; i++) {
				dest[destPos + i] = src[srcPos + i];
			}
		},
		"identityHashCode(Ljava/lang/Object;)I": function(frame, classDef, methodDef, objectRef, otherObjectRef) {
			return otherObjectRef.getIndex();
		},
		"initProperties(Ljava/util/Properties;)Ljava/util/Properties;": function(frame, classDef, methodDef, objectRef, properties) {
			console.warn("initProperties(Ljava/util/Properties;)Ljava/util/Properties; invoked on " + classDef.getName() + "!");
		},
		"mapLibraryName(Ljava/lang/String;)Ljava/lang/String;": function(frame, classDef, methodDef, objectRef, libName) {
			console.warn("mapLibraryName(Ljava/lang/String;)Ljava/lang/String; invoked on " + classDef.getName() + "!");
		}
	},

	"java.lang.Throwable": {
		"fillInStackTrace(I)Ljava/lang/Throwable;": function(frame, classDef, methodDef, objectRef, x) {
			return objectRef;
		},

		"getStackTraceDepth()I": function(frame, classDef, methodDef, objectRef) {
			return 0;
		},

		"getStackTraceElement(I)Ljava/lang/StackTraceElement;": function(frame, classDef, methodDef, objectRef, index) {
			return null;
		}
	},

	"java.lang.Float": {
		"floatToRawIntBits(F)I": function(frame, classDef, methodDef, objectRef, f) {
			return f;
		},

		"intBitsToFloat(I)F": function(frame, classDef, methodDef, objectRef, i) {
			return i;
		}
	},

	"java.lang.Double": {
		"doubleToRawLongBits(D)J": function(frame, classDef, methodDef, objectRef, d) {
			return d;
		},

		"longBitsToDouble(J)D": function(frame, classDef, methodDef, objectRef, j) {
			return j;
		}
	},

	"java.lang.ClassLoader": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {

		},

		"defineClass0(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, bytes, offset, length, protectionDomain) {
			console.warn("defineClass0(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass1(Ljava/lang/String;[BIILjava/security/ProtectionDomain;Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, bytes, offset, length, protectionDomain, anotherString) {
			console.warn("defineClass1(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass2(Ljava/lang/String;Ljava/nio/ByteBuffer;IILjava/security/ProtectionDomain;Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, name, byteBuffer, offset, length, protectionDomain, anotherString) {
			console.warn("defineClass2(Ljava/lang/String;[BIILjava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"resolveClass0(Ljava/lang/Class;)V": function(frame, classDef, methodDef, objectRef, clazz) {
			console.warn("resolveClass0(Ljava/lang/Class;)V invoked on " + classDef.getName() + "!");
		},

		"findBootstrapClass(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className) {
			console.warn("findBootstrapClass(Ljava/lang/String;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"findLoadedClass0(Ljava/lang/String;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, className) {
			console.warn("findLoadedClass0(Ljava/lang/String;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"getCaller(I)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, index) {
			console.warn("getCaller(I)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"retrieveDirectives()Ljava/lang/AssertionStatusDirectives;": function(frame, classDef, methodDef, objectRef) {
			console.warn("retrieveDirectives()Ljava/lang/AssertionStatusDirectives; invoked on " + classDef.getName() + "!");
		}
	},

	"java.security.AccessController": {
		"doPrivileged(Ljava/security/PrivilegedAction;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef) {
			return jjvm.Util.execute(actionRef, "run");
		},

		"doPrivileged(Ljava/security/PrivilegedAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef, contextRef) {
			return jjvm.Util.execute(actionRef, "run");
		},

		"doPrivileged(Ljava/security/PrivilegedExceptionAction;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef) {
			console.warn("doPrivileged(Ljava/security/PrivilegedExceptionAction;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"doPrivileged(Ljava/security/PrivilegedExceptionAction;Ljava/security/AccessControlContext;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef, actionRef, contextRef) {
			console.warn("doPrivileged(Ljava/security/PrivilegedExceptionAction;Ljava/security/AccessControlContext;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"getStackAccessControlContext()Ljava/security/AccessControlContext;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getStackAccessControlContext()Ljava/security/AccessControlContext; invoked on " + classDef.getName() + "!");
		},

		"getInheritedAccessControlContext()Ljava/security/AccessControlContext;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getStackAccessControlContext()Ljava/security/AccessControlContext; invoked on " + classDef.getName() + "!");
		}
	},

	"sun.misc.Unsafe": {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},
	
		"getInt(Ljava/lang/Object;J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getInt(Ljava/lang/Object;J)I invoked on " + classDef.getName() + "!");
		},

		"putInt(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putInt(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"getObject(Ljava/lang/Object;J)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getObject(Ljava/lang/Object;J)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"putObject(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putObject(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getBoolean(Ljava/lang/Object;J)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("getBoolean(Ljava/lang/Object;J)Z invoked on " + classDef.getName() + "!");
		},

		"putBoolean(Ljava/lang/Object;JZ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putBoolean(Ljava/lang/Object;JZ)V invoked on " + classDef.getName() + "!");
		},

		"getByte(Ljava/lang/Object;J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByte(Ljava/lang/Object;J)B invoked on " + classDef.getName() + "!");
		},

		"putByte(Ljava/lang/Object;JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByte(Ljava/lang/Object;JB)V invoked on " + classDef.getName() + "!");
		},

		"getShort(Ljava/lang/Object;J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShort(Ljava/lang/Object;J)S invoked on " + classDef.getName() + "!");
		},

		"putShort(Ljava/lang/Object;JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShort(Ljava/lang/Object;JS)V invoked on " + classDef.getName() + "!");
		},

		"getChar(Ljava/lang/Object;J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getChar(Ljava/lang/Object;J)C invoked on " + classDef.getName() + "!");
		},

		"putChar(Ljava/lang/Object;JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putChar(Ljava/lang/Object;JC)V invoked on " + classDef.getName() + "!");
		},

		"getLong(Ljava/lang/Object;J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLong(Ljava/lang/Object;J)J invoked on " + classDef.getName() + "!");
		},

		"putLong(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLong(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloat(Ljava/lang/Object;J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloat(Ljava/lang/Object;J)F invoked on " + classDef.getName() + "!");
		},

		"putFloat(Ljava/lang/Object;JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putFloat(Ljava/lang/Object;JF)V invoked on " + classDef.getName() + "!");
		},

		"getDouble(Ljava/lang/Object;J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDouble(Ljava/lang/Object;J)D invoked on " + classDef.getName() + "!");
		},

		"putDouble(Ljava/lang/Object;JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDouble(Ljava/lang/Object;JD)V invoked on " + classDef.getName() + "!");
		},

		"getByte(J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByte(J)B invoked on " + classDef.getName() + "!");
		},

		"putByte(JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByte(JB)V invoked on " + classDef.getName() + "!");
		},

		"getShort(J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShort(J)S invoked on " + classDef.getName() + "!");
		},

		"putShort(JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShort(JS)V invoked on " + classDef.getName() + "!");
		},

		"getChar(J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getChar(J)C invoked on " + classDef.getName() + "!");
		},

		"putChar(JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putChar(JC)V invoked on " + classDef.getName() + "!");
		},

		"getInt(J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getInt(J)I invoked on " + classDef.getName() + "!");
		},

		"putInt(JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putInt(JI)V invoked on " + classDef.getName() + "!");
		},

		"getLong(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLong(J)J invoked on " + classDef.getName() + "!");
		},

		"putLong(JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLong(JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloat(J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloat(J)F invoked on " + classDef.getName() + "!");
		},

		"putFloat(JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putFloat(JF)V invoked on " + classDef.getName() + "!");
		},

		"getDouble(J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDouble(J)D invoked on " + classDef.getName() + "!");
		},

		"putDouble(JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDouble(JD)V invoked on " + classDef.getName() + "!");
		},

		"getAddress(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getAddress(J)J invoked on " + classDef.getName() + "!");
		},

		"putAddress(JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putAddress(JJ)V invoked on " + classDef.getName() + "!");
		},

		"allocateMemory(J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("allocateMemory(J)J invoked on " + classDef.getName() + "!");
		},

		"reallocateMemory(JJ)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("reallocateMemory(JJ)J invoked on " + classDef.getName() + "!");
		},

		"setMemory(Ljava/lang/Object;JJB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setMemory(Ljava/lang/Object;JJB)V invoked on " + classDef.getName() + "!");
		},

		"copyMemory(Ljava/lang/Object;JLjava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("copyMemory(Ljava/lang/Object;JLjava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"freeMemory(J)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("freeMemory(J)V invoked on " + classDef.getName() + "!");
		},

		"staticFieldOffset(Ljava/lang/reflect/Field;)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("staticFieldOffset(Ljava/lang/reflect/Field;)J invoked on " + classDef.getName() + "!");
		},

		"objectFieldOffset(Ljava/lang/reflect/Field;)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("objectFieldOffset(Ljava/lang/reflect/Field;)J invoked on " + classDef.getName() + "!");
		},

		"staticFieldBase(Ljava/lang/reflect/Field;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("staticFieldBase(Ljava/lang/reflect/Field;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"ensureClassInitialized(Ljava/lang/Class;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("ensureClassInitialized(Ljava/lang/Class;)V invoked on " + classDef.getName() + "!");
		},

		"arrayBaseOffset(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("arrayBaseOffset(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		},

		"arrayIndexScale(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("arrayIndexScale(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		},

		"addressSize()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("addressSize()I invoked on " + classDef.getName() + "!");
		},

		"pageSize()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("pageSize()I invoked on " + classDef.getName() + "!");
		},

		"defineClass(Ljava/lang/String;[BIILjava/lang/ClassLoader;Ljava/security/ProtectionDomain;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineClass(Ljava/lang/String;[BIILjava/lang/ClassLoader;Ljava/security/ProtectionDomain;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineClass(Ljava/lang/String;[BII)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineClass(Ljava/lang/String;[BII)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"defineAnonymousClass(Ljava/lang/Class;[B[Ljava/lang/Object;)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("defineAnonymousClass(Ljava/lang/Class;[B[Ljava/lang/Object;)Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"allocateInstance(Ljava/lang/Class;)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("allocateInstance(Ljava/lang/Class;)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"monitorEnter(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("monitorEnter(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"monitorExit(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("monitorExit(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"tryMonitorEnter(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("tryMonitorEnter(Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"throwException(Ljava/lang/Throwable;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("hrowException(Ljava/lang/Throwable;)V invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapObject(Ljava/lang/Object;JLjava/lang/Object;Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapObject(Ljava/lang/Object;JLjava/lang/Object;Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapInt(Ljava/lang/Object;JII)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapInt(Ljava/lang/Object;JII)Z invoked on " + classDef.getName() + "!");
		},

		"compareAndSwapLong(Ljava/lang/Object;JJJ)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("compareAndSwapLong(Ljava/lang/Object;JJJ)Z invoked on " + classDef.getName() + "!");
		},

		"getObjectVolatile(Ljava/lang/Object;J)Ljava/lang/Object;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getObjectVolatile(Ljava/lang/Object;J)Ljava/lang/Object; invoked on " + classDef.getName() + "!");
		},

		"putObjectVolatile(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putObjectVolatile(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"getIntVolatile(Ljava/lang/Object;J)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getIntVolatile(Ljava/lang/Object;J)I invoked on " + classDef.getName() + "!");
		},

		"putIntVolatile(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putIntVolatile(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"getBooleanVolatile(Ljava/lang/Object;J)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("getBooleanVolatile(Ljava/lang/Object;J)Z invoked on " + classDef.getName() + "!");
		},

		"putBooleanVolatile(Ljava/lang/Object;JZ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putBooleanVolatile(Ljava/lang/Object;JZ)V invoked on " + classDef.getName() + "!");
		},

		"getByteVolatile(Ljava/lang/Object;J)B": function(frame, classDef, methodDef, objectRef) {
			console.warn("getByteVolatile(Ljava/lang/Object;J)B invoked on " + classDef.getName() + "!");
		},

		"putByteVolatile(Ljava/lang/Object;JB)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putByteVolatile(Ljava/lang/Object;JB)V invoked on " + classDef.getName() + "!");
		},

		"getShortVolatile(Ljava/lang/Object;J)S": function(frame, classDef, methodDef, objectRef) {
			console.warn("getShortVolatile(Ljava/lang/Object;J)S invoked on " + classDef.getName() + "!");
		},

		"putShortVolatile(Ljava/lang/Object;JS)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putShortVolatile(Ljava/lang/Object;JS)V invoked on " + classDef.getName() + "!");
		},

		"getCharVolatile(Ljava/lang/Object;J)C": function(frame, classDef, methodDef, objectRef) {
			console.warn("getCharVolatile(Ljava/lang/Object;J)C invoked on " + classDef.getName() + "!");
		},

		"putCharVolatile(Ljava/lang/Object;JC)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putCharVolatile(Ljava/lang/Object;JC)V invoked on " + classDef.getName() + "!");
		},

		"getLongVolatile(Ljava/lang/Object;J)J": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLongVolatile(Ljava/lang/Object;J)J invoked on " + classDef.getName() + "!");
		},

		"putLongVolatile(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putLongVolatile(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"getFloatVolatile(Ljava/lang/Object;J)F": function(frame, classDef, methodDef, objectRef) {
			console.warn("getFloatVolatile(Ljava/lang/Object;J)F invoked on " + classDef.getName() + "!");
		},

		"putFloatVolatile(Ljava/lang/Object;JF)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("utFloatVolatile(Ljava/lang/Object;JF)V invoked on " + classDef.getName() + "!");
		},

		"getDoubleVolatile(Ljava/lang/Object;J)D": function(frame, classDef, methodDef, objectRef) {
			console.warn("getDoubleVolatile(Ljava/lang/Object;J)D invoked on " + classDef.getName() + "!");
		},

		"putDoubleVolatile(Ljava/lang/Object;JD)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putDoubleVolatile(Ljava/lang/Object;JD)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedObject(Ljava/lang/Object;JLjava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedObject(Ljava/lang/Object;JLjava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedInt(Ljava/lang/Object;JI)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedInt(Ljava/lang/Object;JI)V invoked on " + classDef.getName() + "!");
		},

		"putOrderedLong(Ljava/lang/Object;JJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("putOrderedLong(Ljava/lang/Object;JJ)V invoked on " + classDef.getName() + "!");
		},

		"unpark(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("unpark(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"park(ZJ)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("park(ZJ)V invoked on " + classDef.getName() + "!");
		},

		"getLoadAverage([DI)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getLoadAverage([DI)I invoked on " + classDef.getName() + "!");
		}
	},

	"sun.reflect.Reflection" : {
		"getCallerClass(I)Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef, stackDepth) {
			for(var i = 0; i < stackDepth; i++) {
				frame = frame.getParent();
			}

			return frame.getClassDef().getObjectRef();
		},

		"getClassAccessFlags(Ljava/lang/Class;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("getClassAccessFlags(Ljava/lang/Class;)I invoked on " + classDef.getName() + "!");
		}
	},

	"sun.misc.VM": {
		"initialize()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("initialize()V invoked on " + classDef.getName() + "!");
		}
	},

	"java.lang.SecurityManager": {
		"getClassContext()[Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getClassContext()[Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"currentClassLoader0()Ljava/lang/ClassLoader;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentClassLoader0()Ljava/lang/ClassLoader; invoked on " + classDef.getName() + "!");
		},

		"classDepth(Ljava/lang/String;)I": function(frame, classDef, methodDef, objectRef) {
			console.warn("classDepth(Ljava/lang/String;)I invoked on " + classDef.getName() + "!");
		},

		"classLoaderDepth0()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("classLoaderDepth0()I invoked on " + classDef.getName() + "!");
		},

		"currentLoadedClass0()Ljava/lang/Class;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentLoadedClass0()Ljava/lang/Class; invoked on " + classDef.getName() + "!");
		},

		"checkPermission(Ljava/security/Permission;)V": function(frame, classDef, methodDef, objectRef) {
			// do nothing
		},

		"checkPermission(Ljava/security/Permission;Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			// do nothing
		}
	},

	"java.lang.Thread" : {
		"registerNatives()V": function(frame, classDef, methodDef, objectRef) {
			
		},

		"currentThread()Ljava/lang/Thread;": function(frame, classDef, methodDef, objectRef) {
			console.warn("currentThread()Ljava/lang/Thread; invoked on " + classDef.getName() + "!");
		},

		"yield()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("yield()V invoked on " + classDef.getName() + "!");
		},

		"sleep(J)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("sleep(J)V invoked on " + classDef.getName() + "!");
		},

		"start0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("start0()V invoked on " + classDef.getName() + "!");
		},

		"isInterrupted(Z)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("isInterrupted(Z)Z invoked on " + classDef.getName() + "!");
		},

		"isAlive()Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("isAlive()Z invoked on " + classDef.getName() + "!");
		},

		"countStackFrames()I": function(frame, classDef, methodDef, objectRef) {
			console.warn("countStackFrames()I invoked on " + classDef.getName() + "!");
		},

		"holdsLock(Ljava/lang/Object;)Z": function(frame, classDef, methodDef, objectRef) {
			console.warn("holdsLock(Ljava/lang/Object;)Z invoked on " + classDef.getName() + "!");
		},

		"dumpThreads([Ljava/lang/Thread;)[[Ljava/lang/StackTraceElement;": function(frame, classDef, methodDef, objectRef) {
			console.warn("dumpThreads([Ljava/lang/Thread;)[[Ljava/lang/StackTraceElement; invoked on " + classDef.getName() + "!");
		},

		"getThreads()[Ljava/lang/Thread;": function(frame, classDef, methodDef, objectRef) {
			console.warn("getThreads()[Ljava/lang/Thread; invoked on " + classDef.getName() + "!");
		},

		"setPriority0(I)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setPriority0(I)V invoked on " + classDef.getName() + "!");
		},

		"stop0(Ljava/lang/Object;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("stop0(Ljava/lang/Object;)V invoked on " + classDef.getName() + "!");
		},

		"suspend0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("suspend0()V invoked on " + classDef.getName() + "!");
		},

		"resume0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("resume0()V invoked on " + classDef.getName() + "!");
		},

		"interrupt0()V": function(frame, classDef, methodDef, objectRef) {
			console.warn("interrupt0()V invoked on " + classDef.getName() + "!");
		},

		"setNativeName(Ljava/lang/String;)V": function(frame, classDef, methodDef, objectRef) {
			console.warn("setNativeName(Ljava/lang/String;)V invoked on " + classDef.getName() + "!");
		}
	}/*,

	"java.lang.AbstractStringBuilder": {
		"expandCapacity(I)V": function(frame, classDef, methodDef, objectRef, newCapacity) {
			var value = objectRef.getField("value");
			value.length = newCapacity;
		}
	}*/
};

jjvm.core.ByteIterator = function(iterable) {
	_.extend(this, new jjvm.core.Iterator(iterable));

	this.readU8 = function() {
		return this.next();
	};

	this.read8 = function() {
		return this._checkSign(this.readU8(), 8);
	};

	this.readU16 = function() {

		// Under 32 bits so can use bitwise operators
		return ((this.readU8() & 0xFF) << 8) + ((this.readU8() & 0xFF) << 0);
	};

	this.read16 = function() {
		return this._checkSign(this.readU16(), 16);
	};

	this.readU32 = function() {

		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU16() * Math.pow(2, 16)) + this.readU16();
	};

	this.read32 = function() {
		return this._checkSign(this.readU32(), 32);
	};

	this.readU64 = function() {
		// In JavaScript, bitwise operators only work on 32 bit integers...
		return (this.readU32() * Math.pow(2, 32)) + this.readU32();
	};

	this.read64 = function() {
		return this._checkSign(this.readU64(), 64);
	};

	this.readFloat = function() {
		var bits = this.readU32();

		if(bits == 0x7f800000) {
			return Infinity;
		} else if(bits == 0xff800000) {
			return -Infinity;
		} else if(bits >= 0x7f800001 && bits <= 0x7fffffff) {
			return NaN;
		} else if(bits >= 0xff800001 && bits <= 0xffffffff) {
			return NaN;
		}

		var s = ((bits >> 31) === 0) ? 1 : -1;
		var e = ((bits >> 23) & 0xff);
		var m = (e === 0) ?
				(bits & 0x7fffff) << 1 :
				(bits & 0x7fffff) | 0x800000;

		return s * m * Math.pow(2, e - 150);
	};

	this.readDouble = function() {
		var bits = this.readU64();

		if(bits == 0x7ff0000000000000) {
			return Infinity;
		} else if(bits == 0xfff0000000000000) {
			return -Infinity;
		} else if(bits >= 0x7ff0000000000001 && bits <= 0x7fffffffffffffff) {
			return NaN;
		} else if(bits >= 0xfff0000000000001 && bits <= 0xffffffffffffffff) {
			return NaN;
		}

		var s = (this._shiftRight(bits, 63) === 0) ? 1 : -1;
		var e = (this._shiftRight(bits, 52) & 0x7ff);
		var m = (e === 0) ?
			this._shiftLeft(this._64bitAnd(bits, 0xfffffffffffff), 1) :
			this._64bitOr(this._64bitAnd(bits, 0xfffffffffffff), 0x10000000000000);
		
		return s * m * Math.pow(2, e - 1075);
	};

	this._checkSign = function(value, bits) {
		var max = Math.pow(2, bits - 1);

		// if most significant bit is set, number is negative
		if(Math.abs(value & max) == max) {
			return value - Math.pow(2, bits);
		}

		return value;
	};

	this._shiftLeft = function(value, bits) {
		return parseInt(value * Math.pow(2, bits), 10);
	};

	this._shiftRight = function(value, bits) {
		return parseInt(value / Math.pow(2, bits), 10);
	};

	this._64bitSplit = function(value) {
		value = value.toString(16);
		var low_bytes = parseInt(value.substring(value.length - 8), 16);
		var high_bytes = parseInt(value.substring(0, value.length - 8), 16);

		return [high_bytes, low_bytes];
	};

	this._64bitJoin = function(value) {
		return (value[0] * Math.pow(16, 8)) + value[1];
	};

	this._64bitAnd = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] & nBits[0];
		valueBits[1] = valueBits[1] & nBits[1];

		return this._64bitJoin(valueBits);
	};

	this._64bitOr = function(value, n) {
		var valueBits = this._64bitSplit(value);
		var nBits = this._64bitSplit(n);

		valueBits[0] = valueBits[0] | nBits[0];
		valueBits[1] = valueBits[1] | nBits[1];

		return this._64bitJoin(valueBits);
	};
};
jjvm.core.ClassCache = {
	/*load: function(className) {
		if(!localStorage) {
			return null;
		}

		if(!localStorage["jjvm_" + className]) {
			return null;
		}

		console.info("loading " + className);
		var data = JSON.parse(localStorage["jjvm_" + className]);

		var classDef = new jjvm.types.ClassDefinition(data);

		jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef, true]);
		jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);

		return classDef;
	},

	store: function(classDef) {
		if(!localStorage) {
			return;
		}

		var data = JSON.stringify(classDef.getData());

		localStorage["jjvm_" + classDef.getName()] = data;
	},

	empty: function(className) {
		if(!localStorage) {
			return;
		}

		for(var key in localStorage) {
			if(key.substr(0, 5) == "jjvm_") {
				delete localStorage[key];
			}
		}
	},

	evict: function(className) {
		if(!localStorage) {
			return;
		}

		if(className instanceof jjvm.types.ClassDefinition) {
			className = className.getName();
		}

		delete localStorage["jjvm_" + className];
	}*/
};
jjvm.core.ClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.ClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.ClassLoader);

		// haven't seen this class before
		jjvm.core.ClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.ClassLoader._classes;
	},

	loadClass: function(className) {
		if(!className) {
			var sdfoij = "asdf9j";
		}

		className = className.replace(/\//g, ".");

		var output;

		for(var i = 0; i < jjvm.core.ClassLoader._classes.length; i++) {
			if(jjvm.core.ClassLoader._classes[i].getName() == className) {
				output = jjvm.core.ClassLoader._classes[i];
				break;
			}
		}

		if(!output) {
			output = jjvm.core.SystemClassLoader.loadClass(className);
		}

		if(output.hasMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER) && !output.getInitialized()) {
			// has class initializer so execute it
			output.setInitialized(true);
			var frame = new jjvm.runtime.Frame(output, output.getMethod(jjvm.types.MethodDefinition.CLASS_INITIALISER));
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			thread.run();
		}

		return output;
	},

	getObjectRef: function() {
		if(!jjvm.core.ClassLoader._objectRef) {
			jjvm.core.ClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.ClassLoader._objectRef.getClass(), 
				jjvm.core.ClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, ["java.lang.ClassLoader"]), 
				[jjvm.core.SystemClassLoader.getObjectRef()]
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.ClassLoader._objectRef;
	}
};
jjvm.core.DOMUtil = {
	create: function(type, content, attributes) {
		// if we've been passed two arguments, see if the second is content or attributes
		if(!attributes && _.isObject(content) && !_.isString(content) && !_.isArray(content) && !_.isElement(content)) {
			attributes = content;
			content = null;
		}

		if(type && content && attributes) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && content) {
			return jjvm.core.DOMUtil._create(type, content, attributes);
		} else if(type && attributes) {
			return jjvm.core.DOMUtil._createEmpty(type, attributes);
		} else {
			return jjvm.core.DOMUtil._createEmpty(type);
		}

		//console.error("jjvm.core.DOMUtil.create passed wrong number of arguments.  Expected 1, 2 or 3, was " + arguments.length);
	},

	_create: function(type, content, attributes) {
		var output = jjvm.core.DOMUtil._createEmpty(type, attributes);

		jjvm.core.DOMUtil.append(content, output);

		return output;
	},

	_createEmpty: function(type, attributes) {
		var output = document.createElement(type);

		if(attributes) {
			for(var key in attributes) {
				output[key] = attributes[key];
			}
		}

		return output;
	},

	append: function(content, node) {
		if(_.isString(content)) {
			jjvm.core.DOMUtil._appendText(content, node);
		} else if(_.isArray(content)) {
			for(var i = 0; i < content.length; i++) {
				jjvm.core.DOMUtil.append(content[i], node);
			}
		} else if(_.isElement(content)) {
			node.appendChild(content);
		}
	},

	_appendText: function(content, node) {
		node.appendChild(document.createTextNode(content));
	}
};
jjvm.core.Iterator = function(iterable) {
	var index = 0;

	if(!iterable) {
		throw "Cannot iterrate over falsy value!";	
	}

	this.next = function() {
		var output = iterable[index];
		index++;

		return output;
	};

	this.hasNext = function() {
		return index < iterable.length;
	};

	this.peek = function() {
		return iterable[index];
	};

	this.skip = function() {
		index++;
	};

	this.rewind = function() {
		index--;
	};

	this.reset = function() {
		index = 0;
	};

	this.jump = function(location) {
		index = location;
	};

	this.consume = function() {
		index = iterable.length;
	};

	this.getLocation = function() {
		return index;
	};

	this.getIterable = function() {
		return iterable;
	};
};
jjvm.core.SystemClassLoader = {
	_classes: [],
	_objectRef: null,

	addClassDefinition: function(classDef) {
		// see if we are redefining the class
		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == classDef.getName()) {
				// replace previous definition and bail
				jjvm.core.SystemClassLoader._classes[i] = classDef;

				return;
			}
		}

		classDef.setClassLoader(jjvm.core.SystemClassLoader);

		// haven't seen this class before
		jjvm.core.SystemClassLoader._classes.push(classDef);
	},

	getClassDefinitions: function() {
		return jjvm.core.SystemClassLoader._classes;
	},

	loadClass: function(className) {
		if(jjvm.types.Primitives.primitiveToClass[className]) {
			// convert int to java.lang.Integer
			var className2 = jjvm.types.Primitives.primitiveToClass[className];
		}

		for(var i = 0; i < jjvm.core.SystemClassLoader._classes.length; i++) {
			if(jjvm.core.SystemClassLoader._classes[i].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[i];
			}
		}

		if(_.string.startsWith(className, "[")) {
			var clazz = new jjvm.types.ClassDefinition({
				getValue: function() {
					return className;
				}
			}, {
				getValue: function() {
					return "java.lang.Object";
				}
			});

			jjvm.core.SystemClassLoader.addClassDefinition(clazz);

			return clazz;
		}

		/*var cached = jjvm.core.ClassCache.load(className);

		if(cached) {
			jjvm.core.SystemClassLoader._classes.push(cached);

			return cached;
		}*/

		console.info("Downloading " + className);

		// Have to use synchronous request here and as such can't use html5
		// response types as they make the UI unresponsive even though
		// we're in a non-UI thread.  Thanks for nothing W3C.
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/rt/" + className.replace(/\./g, "/") + ".json", false);
		xhr.send();

		if(xhr.status == 200) {
			var bytes = JSON.parse(xhr.responseText);

			var compiler = new jjvm.compiler.Compiler();
			compiler.compileSystemBytes(bytes);
		}

		for(var n = 0; n < jjvm.core.SystemClassLoader._classes.length; n++) {
			if(jjvm.core.SystemClassLoader._classes[n].getName() == className) {
				return jjvm.core.SystemClassLoader._classes[n];
			}
		}

		throw "NoClassDefFound: " + className;
	},

	getObjectRef: function() {
		if(!jjvm.core.SystemClassLoader._objectRef) {
			jjvm.core.SystemClassLoader._objectRef = new jjvm.runtime.ObjectReference(jjvm.core.ClassLoader.loadClass("java.lang.ClassLoader"));

			// run constructor
			var frame = new jjvm.runtime.Frame(
				jjvm.core.SystemClassLoader._objectRef.getClass(), 
				jjvm.core.SystemClassLoader._objectRef.getClass().getMethod(jjvm.types.MethodDefinition.OBJECT_INITIALISER, [])
			);
			frame.setIsSystemFrame(true);
			var thread = new jjvm.runtime.Thread(frame);
			frame.execute(thread);
		}

		return jjvm.core.SystemClassLoader._objectRef;
	}
};

jjvm.core.Watchable = {

	register: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
	},

	registerOneTimeListener: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};
		}

		if(this._observers[eventType] === undefined) {
			this._observers[eventType] = [];
		}

		this._observers[eventType].push(listener);
		listener.____oneTime = true;
	},

	deRegister: function(eventType, listener) {
		if(!this._observers) {
			this._observers = {};

			return false;
		}

		if(this._observers[eventType] === undefined) {
			return false;
		}

		var lengthBefore = this._observers[eventType].length;

		this._observers[eventType] = _.without(this._observers[eventType], listener);

		var lengthAfter = this._observers[eventType].length;

		var deregistered = lengthBefore != lengthAfter;

		if(!deregistered) {
			throw "Failed to deregister " + listener + " for event type " + eventType;
		}

		return deregistered;
	},

	dispatch: function(eventType, args) {
		if(!this._observers) {
			this._observers = {};
		}

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.Watchable#dispatch as args";
		}

		if(this._observers[eventType] !== undefined) {
			var observerArgs = [this];
			observerArgs = observerArgs.concat(args);

			// copy the array in case the listener deregisters itself as part of the callback
			var observers = this._observers[eventType].concat([]);

			for(var i = 0; i < observers.length; i++) {
				observers[i].apply(observers[i], observerArgs);

				if(observers[i].____oneTime === true) {
					this.deRegister(eventType, observers[i]);
				}
			}
		}

		// inform global listeners
		//console.info("dispatching " + eventType + " with args " + args);
		jjvm.core.NotificationCentre.dispatch(this, eventType, args);
	}
};
jjvm.types.ByteCode = function(data) {
	var _data = data ? data : {};

	var _breakpoint;
	var _operation;

	var invokeMethod = function(methodDef, frame) {
		var args = [];

		for(var i = 0; i < methodDef.getArgs().length; i++) {
			args.unshift(frame.getStack().pop());
		}

		if(!methodDef.isStatic()) {
			// place reference to current object at position 0 of local arguments
			args.unshift(frame.getStack().pop());
		}

		if(args[0] instanceof jjvm.types.ClassDefinition) {
			// swap ClassDefinition for it's object ref
			var classDef = args.shift();
			args.unshift(classDef.getObjectRef());
		}

		if(methodDef.isStatic()) {
			console.debug("Invoking static method " + methodDef.getName() + " on " + methodDef.getClassDef().getName() + " with args " + args);
		} else {
			console.debug("Invoking instance method " + methodDef.getName() + " on " + args[0].getClass().getName() + " as " + methodDef.getClassDef().getName() + " with args " + args);
		}

		frame.executeChild(methodDef.getClassDef(), methodDef, args);
	};

	var operations = {
		"nop": function() {
			this.execute = function(frame, constantPool) {
				
			};
		},
		"push": function(value) {
			this.execute = function(frame, constantPool) {
				frame.getStack().push(value);
			};
		},
		"push_constant": function(index) {
			this.execute = function(frame, constantPool) {
				// should return String, int or float
				var value = constantPool.load(index);

				if(!value) {
					throw "Constant value was falsy!";
				}

				if(value instanceof jjvm.types.ConstantPoolClassValue) {
					value = value.getClassDef();
				} else if(value instanceof jjvm.types.ConstantPoolStringReferenceValue) {
					value = value.getStringReference();
				} else {
					value = value.getValue();
				}

				frame.getStack().push(value);
			};
		},
		"load": function(location) {
			this.execute = function(frame, constantPool) {
				var value = frame.getLocalVariables().load(location);
				frame.getStack().push(value);
			};
		},
		"array_load": function() {
			this.execute = function(frame, constantPool) {
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index]);
			};
		},
		"array_load_character": function() {
			this.execute = function(frame, constantPool) {
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				if(index >= array.length) {
					throw "ArrayIndexOutOfBoundsExecption: " + index;
				}

				frame.getStack().push(array[index].charCodeAt(0));
			};
		},
		"store": function(location) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getLocalVariables().store(location, value);
			};
		},
		"array_store": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				array[index] = value;
			};
		},
		"array_store_character": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();
				var index = frame.getStack().pop();
				var array = frame.getStack().pop();

				// convert ascii code to string
				array[index] = String.fromCharCode(value);
			};
		},
		"pop": function() {
			this.execute = function(frame, constantPool) {
				frame.getStack().pop();
			};
		},
		"pop2": function() {
			this.execute = function(frame, constantPool) {
				frame.getStack().pop();
				frame.getStack().pop();
			};
		},
		"dup": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value);
				frame.getStack().push(value);
			};
		},
		"dup2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup2_x1": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup2_x2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();
				var value4 = frame.getStack().pop();

				frame.getStack().push(value2);
				frame.getStack().push(value1);
				frame.getStack().push(value4);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup_x1": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"dup_x2": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();
				var value3 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value3);
				frame.getStack().push(value2);
				frame.getStack().push(value1);
			};
		},
		"swap": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1);
				frame.getStack().push(value2);
			};
		},
		"add": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 + value2);
			};
		},
		"sub": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 - value1);
			};	
		},
		"mul": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value1 * value2);
			};	
		},
		"div": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 / value1);
			};	
		},
		"rem": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				frame.getStack().push(value2 % value1);
			};	
		},
		"neg": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();

				frame.getStack().push(-1 * value1);
			};	
		},
		"shift_left": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// bitwise operators don't work for > 32bit integers in JavaScript
				var result = value2 * Math.pow(2, value1);

				frame.getStack().push(result);
			};
		},
		"arithmetic_shift_right": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// bitwise operators don't work for > 32bit integers in JavaScript
				var result = value2 / Math.pow(2, value1);

				frame.getStack().push(result);
			};
		},
		"logical_shift_right": function() {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				// probably won't work for > 32bit integers in JavaScript
				frame.getStack().push(value2 >>> value1);
			};
		},
		"and": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 & value2);
			};
		},
		"or": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 | value2);
			};
		},
		"xor": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 ^ value2);
			};
		},
		"increment": function(location, amount) {
			this.execute = function(frame, constantPool) {
				var value = frame.getLocalVariables().load(location);

				frame.getLocalVariables().store(location, value + amount);
			};
		},
		"compare": function() {
			this.execute = function(frame, constantPool) {
				var value2 = frame.getStack().pop();
				var value1 = frame.getStack().pop();

				frame.getStack().push(value1 == value2);
			};	
		},
		"convert": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value);
			};	
		},
		"convert_to_boolean": function() {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				frame.getStack().push(value ? true : false);
			};	
		},
		"if_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 == value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpeq #" + jumpTo;
			};
		},
		"if_not_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 != value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpne #" + jumpTo;
			};
		},
		"if_less_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 < value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmplt #" + jumpTo;
			};
		},
		"if_greater_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 >= value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpge #" + jumpTo;
			};
		},
		"if_greater_than": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 > value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmpgt #" + jumpTo;
			};
		},
		"if_less_than_or_equal": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value1 = frame.getStack().pop();
				var value2 = frame.getStack().pop();

				if(value2 <= value1) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
			this.describe = function() {
				return "if_cmple #" + jumpTo;
			};
		},
		"if_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value === 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_not_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value !== 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value < 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than_or_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value >= 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_greater_than_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value > 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_less_than_or_equal_to_zero": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value <= 0) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"goto": function(goingTo) {
			this.execute = function(frame, constantPool) {
				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"jsr": function(goingTo) {
			this.execute = function(frame, constantPool) {
				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"ret": function(location) {
			this.execute = function(frame, constantPool) {
				var goingTo = frame.getLocalVariables().load(location);

				throw new jjvm.runtime.Goto(goingTo);
			};
		},
		"tableswitch": function(low, high, table) {
			this.execute = function(frame, constantPool) {
				throw "tableswitch is not implemented";
			};
		},
		"lookupswitch": function(table) {
			this.execute = function(frame, constantPool) {
				throw "lookupswitch is not implemented";
			};
		},
		"return_value": function(string) {
			this.execute = function(frame, constantPool) {
				return frame.getStack().pop();
			};
		},
		"return_void": function(string) {
			this.execute = function(frame, constantPool) {
				return jjvm.runtime.Void;
			};
		},
		"get_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = constantPool.load(index).getClassDef();
				var value = classDef.getStaticField(fieldDef.getName());

				frame.getStack().push(value);
			};
		},
		"put_static": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var classDef = constantPool.load(index).getClassDef();
				var value = frame.getStack().pop();

				classDef.setStaticField(fieldDef.getName(), value);
			};
		},
		"get_field": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();
				var objectRef = frame.getStack().pop();
				var value = objectRef.getField(fieldDef.getName());

				frame.getStack().push(value);
			};
		},
		"put_field": function(index) {
			this.execute = function(frame, constantPool) {
				var fieldDef = constantPool.load(index).getFieldDef();

				var value = frame.getStack().pop();
				var objectRef = frame.getStack().pop();

				objectRef.setField(fieldDef.getName(), value);
			};
		},
		"invoke_virtual": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_special": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_static": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_interface": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				// special case - the interface contract demands that the object reference on the stack
				// will implement a method with the same name and arguments as the interface method def
				// so execute that instead

				var objectRef = frame.getStack().pop();
				var classDef = objectRef.getClass();
				methodDef = classDef.getMethod(methodDef.getName());

				// put the ref back on the stack
				frame.getStack().push(objectRef);

				invokeMethod(methodDef, frame);
			};
		},
		"invoke_dynamic": function(index) {
			this.execute = function(frame, constantPool) {
				var methodDef = constantPool.load(index).getMethodDef();

				invokeMethod(methodDef, frame);
			};
		},
		"new": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();

				frame.getStack().push(new jjvm.runtime.ObjectReference(classDef));
			};
			this.describe = function() {
				return "new #" + index + " // " + constantPool.load(index);
			};
		},
		"array_create": function(index) {
			this.execute = function(frame, constantPool) {
				var length = frame.getStack().pop();
				var array = [];
				array.length = length;

				frame.getStack().push(array);
			};
		},
		"array_length": function() {
			this.execute = function(frame, constantPool) {
				var array = frame.getStack().pop();

				frame.getStack().push(array.length);
			};
		},
		"throw": function(string) {
			this.execute = function(frame, constantPool) {
				var throwable = frame.getStack().pop();

				throw new jjvm.runtime.Thrown(throwable);
			};
		},
		"check_cast": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();
				var objectRef = frame.getStack().pop();

				if(!objectRef.isInstanceOf(classDef)) {
					throw "ClassCastException: Object of type " + objectRef.getClass().getName() + " cannot be cast to " + classDef.getName();
				}

				// put it back on the stack
				frame.getStack().push(objectRef);
			};	
		},
		"instance_of": function(index) {
			this.execute = function(frame, constantPool) {
				var classDef = constantPool.load(index).getClassDef();
				var objectRef = frame.getStack().pop();

				frame.getStack().push(objectRef.isInstanceOf(classDef));
			};
		},
		"monitor_enter": function() {
			this.execute = function(frame, constantPool) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"monitor_exit": function() {
			this.execute = function(frame, constantPool) {
				// don't support synchronisation so just pop the ref
				frame.getStack().pop();
			};
		},
		"wide": function() {
			this.execute = function(frame, constantPool) {
				throw "Wide is not implemented. Your program will probably now crash.";
			};
		},		
		"multi_dimensional_array_create": function(index, dimensions) {
			this.execute = function(frame, constantPool) {
				var array = [];
				var lengths = [];

				for(var i = (dimensions - 1); i > -1; i--) {
					lengths[i] = frame.getStack().pop();
				}

				this._createArray(frame, array, lengths, 0);

				frame.getStack().push(array);
			};

			this._createArray = function(frame, parent, lengths, index) {
				if(index === (lengths.length - 1)) {
					return;
				}

				var length = lengths[index];

				for(var i = 0; i < length; i++) {
					var innerArray = [];

					if((index + 1) === (lengths.length - 1)) {
						innerArray.length = lengths[index + 1];
					}

					parent.push(innerArray);

					this._createArray(frame, innerArray, lengths, index + 1);
				}
			};
		},
		"if_null": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value === null) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		},
		"if_non_null": function(jumpTo) {
			this.execute = function(frame, constantPool) {
				var value = frame.getStack().pop();

				if(value !== null) {
					throw new jjvm.runtime.Goto(jumpTo);
				}
			};
		}
	};

	this._getOperation = function() {
		if(!_operation) {

			// lets us call .apply on a function constructor
			var construct = _.bind(function(constructor) {
				function F() {
					return constructor.apply(this, _data.args);
				}
				F.prototype = constructor.prototype;

				return new F();
			}, this);

			_operation = construct(operations[this.getOperation()]);

			// allow for overriding description as sometimes we want to show specific 
			// arguments and bytecode for instructions that have been grouped together
			if(_data.description) {
				_operation.describe = function() {
					return _data.description;
				};
			}
		}

		return _operation;
	};

	this.execute = function(frame, constantPool) {
		return this._getOperation().execute(frame, constantPool);
	};

	this.getLocation = function() {
		return location;
	};

	this.toString = function() {
		return this.getLocation() + ": " + this.getDescription();
	};

	this.hasBreakpoint = function() {
		return _breakpoint ? true : false;
	};

	this.setBreakpoint = function(breakpoint) {
		_breakpoint = breakpoint;
	};

	this.setMnemonic = function(mnemonic) {
		this.getData().mnemonic = mnemonic;
	};

	this.getMnemonic = function() {
		return this.getData().mnemonic;
	};

	this.setOperation = function(operation) {
		this.getData().operation = operation;
	};

	this.getOperation = function() {
		return this.getData().operation;
	};

	this.setArgs = function(args) {
		this.getData().args = args;
	};

	this.getArgs = function() {
		return this.getData().args;
	};

	this.setLocation = function(location) {
		this.getData().location = location;
	};

	this.getLocation = function() {
		return this.getData().location;
	};

	this.setDescription = function(description) {
		this.getData().description = description;
	};

	this.getDescription = function() {
		return this.getData().description;
	};

	this.canStepInto = function() {
		return _.string.startsWith(this.getOperation(), "invoke");
	};

	this.getData = function() {
		return _data;
	};
};

jjvm.types.ClassDefinition = function(data) {
	var _data = data ? data : {
		interfaces: [],
		methods: {},
		fields: {}
	};

	var _parent;
	var _methods = [];
	var _fields = [];
	var _exceptionTable = null;
	var _constantPool = new jjvm.types.ConstantPool(_data.constantPool);
	var _enclosingMethod = null;
	var _objectRef = null;
	var _initialized = false;
	var _classLoader = null;

	// holds values of static fields
	var _staticFields = {};

	if(data) {
		if(data.parent) {
			_parent = jjvm.core.ClassLoader.loadClass(data.parent);
		}

		for(var m in data.methods) {
			var method = new jjvm.types.MethodDefinition(data.methods[m]);
			method.setClassDef(this);

			if(jjvm.nativeMethods[data.name] && jjvm.nativeMethods[data.name][method.getSignature()]) {
				// we've overriden the method implementation
				method.setImplementation(jjvm.nativeMethods[data.name][method.getSignature()]);
			}

			_methods.push(method);
		}

		for(var f in data.fields) {
			_fields.push(new jjvm.types.FieldDefinition(data.fields[f]));
		}

		if(data.enclosingMethod) {
			_enclosingMethod = new jjvm.types.EnclosingMethod(data.enclosingMethod);
		}
	}

	this.getName = function() {
		return _data.name;
	};

	this.setName = function(name) {
		_data.name = _.string.trim(name);
	};

	this.getParent = function() {
		return _parent;
	};

	this.setParent = function(parent) {
		delete _data.parent;

		if(parent) {
			_parent = jjvm.core.ClassLoader.loadClass(parent);
			_data.parent = parent;
		}
	};

	this.getVisibility = function() {
		return _data.visibility;
	};

	this.setVisibility = function(visibility) {
		_data.visibility = visibility;
	};

	this.isAbstract = function() {
		return _data.isAbstract ? true : false;
	};

	this.setIsAbstract = function(isAbstract) {
		_data.isAbstract = isAbstract ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isInterface = function() {
		return _data.isInterface ? true : false;
	};

	this.setIsInterface = function(isInterface) {
		_data.isInterface = isInterface ? true : false;
	};

	this.isSuper = function() {
		return _data.isSuper ? true : false;
	};

	this.setIsSuper = function(isSuper) {
		_data.isSuper = isSuper ? true : false;
	};

	this.getInterfaces = function() {
		return _data.interfaces;
	};

	this.addInterface = function(anInterface) {
		_data.interfaces.push(anInterface);
	};

	this.getMethods = function() {
		return _methods;
	};

	this.hasMethod = function(name) {
		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name) {
				return true;
			}
		}

		if(_parent) {
			return _parent.hasMethod(name);
		}

		return false;
	};

	this.getMethod = function(name, args) {
		if(!args) {
			args = [];
		}

		for(var i = 0; i < _methods.length; i++) {
			if(_methods[i].getName() == name && this._argsMatch(_methods[i].getArgs(), args)) {
				return _methods[i];
			}
		}

		if(_parent) {
			return _parent.getMethod(name);
		}

		throw "Method " + name + " with args " + args + " does not exist on class " + this.getName();
	};

	this._argsMatch = function(arr1, arr2) {
		if(arr1.length != arr2.length) {
			return false;
		}

		for(var i = 0; i < arr1.length; i++) {
			if(arr1[i] != arr2[i]) {
				return false;
			}
		}

		return true;
	};

	this.addMethod = function(methodDef) {
		_methods.push(methodDef);

		if(!_data.methods) {
			_data.methods = {};
		}

		_data.methods[methodDef.getSignature()] = methodDef.getData();
	};

	this.getFields = function() {
		return _fields;
	};

	this.getField = function(name) {
		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name) {
				return _fields[i];
			}
		}

		if(_parent) {
			return _parent.getField(name);
		}
	};

	this.addField = function(fieldDef) {
		_fields.push(fieldDef);

		if(!_data.fields) {
			_data.fields = {};
		}

		_data.fields[fieldDef.getName()] = fieldDef.getData();
	};

	this.hasField = function(name) {
		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && !_fields[i].isStatic()) {
				return true;
			}
		}

		if(_parent) {
			return _parent.hasField(name);
		}

		return false;
	};

	this.invokeStaticMethod = function(name, args) {
		
	};

	this.getStaticField = function(name) {
		this.hasStaticField(name);

		if(_staticFields[name] === undefined) {
			// we have the field but it's not been used yet so initialise it.

			var fieldDef = this.getField(name);

			if(fieldDef.getType() == "boolean" || fieldDef.getType() == "byte" || fieldDef.getType() == "short" || fieldDef.getType() == "int" || fieldDef.getType() == "long" || fieldDef.getType() == "char") {
				_staticFields[name] = 0;
			} else if(fieldDef.getType() == "float" || fieldDef.getType() == "double") {
				_staticFields[name] = 0.0;
			} else {
				_staticFields[name] = null;				
			}
		}

		return _staticFields[name];
	};

	this.getStaticFields = function() {
		return _staticFields;
	};

	this.setStaticField = function(name, value) {
		this.hasStaticField(name);

		_staticFields[name] = value;
	};

	this.hasStaticField = function(name) {
		var foundField = false;

		for(var i = 0; i < _fields.length; i++) {
			if(_fields[i].getName() == name && _fields[i].isStatic()) {
				foundField = true;
			}
		}

		if(!foundField) {
			throw "field " + name + " does not exist on class " + this.getName();
		}
	};

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setConstantPool = function(constantPool) {
		_constantPool = constantPool;

		_data.constantPool = constantPool.getData();
	};

	this.getConstantPool = function() {
		return _constantPool;
	};

	this.setSourceFile = function(sourceFile) {
		_data.sourceFile = sourceFile;
	};

	this.getSourceFile = function() {
		return _data.sourceFile;
	};

	this.setMinorVersion = function(minorVersion) {
		_data.minorVersion = minorVersion;
	};

	this.getMinorVersion = function() {
		return _data.minorVersion;
	};

	this.setMajorVersion = function(majorVersion) {
		_data.majorVersion = majorVersion;
	};

	this.getMajorVersion = function() {
		return _data.majorVersion;
	};

	this.setDeprecated = function(deprecated) {
		_data.deprecated = deprecated;
	};

	this.getDeprecated = function() {
		return _data.deprecated;
	};

	this.setSynthetic = function(synthetic) {
		_data.synthetic = synthetic;
	};

	this.getSynthetic = function() {
		return _data.synthetic;
	};

	this.setEnclosingMethod = function(enclosingMethod) {
		_enclosingMethod = enclosingMethod;

		if(enclosingMethod) {
			_data.enclosingMethod = enclosingMethod.getData();
		}
	};

	this.getEnclosingMethod = function() {
		return _enclosingMethod;
	};

	this.getObjectRef = function() {
		if(!_objectRef) {
			_objectRef = jjvm.Util.createObjectRef("java.lang.Class");
		}

		return _objectRef;
	};

	this.getVersion = function() {
		var versions = {
			0x2D: "Java 1.1",
			0x2E: "Java 1.2",
			0x2F: "Java 1.3",
			0x30: "Java 1.4",
			0x31: "Java 5",
			0x32: "Java 6",
			0x33: "Java 7",
			0x34: "Java 8"
		};

		return versions[_data.majorVersion];
	};

	this.isChildOf = function(classDef) {
		if(this.getName() == classDef.getName()) {
			return true;
		}

		for(var i = 0; i < this.getInterfaces().length; i++) {
			var interfaceDef = jjvm.core.ClassLoader.loadClass(this.getInterfaces()[i]);

			if(interfaceDef.isChildOf(classDef)) {
				return true;
			}
		}

		if(this.getParent()) {
			return this.getParent().isChildOf(classDef);
		}

		return false;
	};

	this.getInitialized = function() {
		return this._initialized;
	};

	this.setInitialized = function(initialized) {
		this._initialized = initialized;
	};

	this.getClassLoader = function() {
		return this._classLoader;
	};

	this.setClassLoader = function(classLoader) {
		this._classLoader = classLoader;
	};

	this.getData = function() {
		return _data;
	};

	this.toString = function() {
		return "ClassDef#" + this.getName();
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isAbstract() ? " abstract" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isInterface() ? " interface" : " class";
		output += " " + this.getName();
		output += this.getParent() ? " extends " + this.getParent() : "";
		output += "\r\n";
		output += "\tSourceFile: \"" + this.getSourceFile() + "\"\r\n";
		output += "\tMinor version: " + this.getMinorVersion() + "\r\n";
		output += "\tMajor version: " + this.getMajorVersion() + "\r\n";
		output += "\r\n";
		output += _constantPool.toJavaP();
		output += "\r\n";

		if(_fields.length > 0) {
			for(var f = 0; f < _fields.length; f++) {
				output += _fields[f].toJavaP();
			}

			output += "\r\n";
		}

		for(var m = 0; m < _methods.length; m++) {
			output += _methods[m].toJavaP();
			output += "\r\n";
		}

		return output;
	};
};

jjvm.types.ConstantPool = function(data) {
	var _data = data ? data : {};
	var pool = [];

	if(_data.constants) {
		for(var i = 0; i < _data.constants.length; i++) {
			var value;

			if(_data.constants[i].type == jjvm.types.ConstantPoolClassValue.type) {
				value = new jjvm.types.ConstantPoolClassValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolFieldValue.type) {
				value = new jjvm.types.ConstantPoolFieldValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolMethodValue.type) {
				value = new jjvm.types.ConstantPoolMethodValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolNameAndTypeValue.type) {
				value = new jjvm.types.ConstantPoolNameAndTypeValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.S || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.I || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.F || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.J || _data.constants[i].type == jjvm.types.ConstantPoolPrimitiveValue.types.D) {
				value = new jjvm.types.ConstantPoolPrimitiveValue(_data.constants[i]);
			} else if(_data.constants[i].type == jjvm.types.ConstantPoolStringReferenceValue.type) {
				value = new jjvm.types.ConstantPoolStringReferenceValue(_data.constants[i]);
			} else {
				throw "Unknown constant pool type " + _data.constants[i].type;
			}

			pool[value.getIndex()] = value;
		}
	} else {
		_data.constants = [];
	}

	this.store = function(index, value) {
		pool[index] = value;

		for(var i = 0; i < _data.constants.length; i++) {
			if(_data.constants[i].index == index) {
				// we've defined this constant before, overwrite it
				_data.constants[i] = value.getData();

				return;
			}
		}

		// this is a new constant, store it
		_data.constants.push(value.getData());
	};

	this.load = function(index) {
		return pool[index];
	};

	this.getPool = function() {
		return pool;
	};

	this.toString = function() {
		return "ConstantPool";
	};

	this.getData = function() {
		return _data;
	};

	this.toJavaP = function() {
		var output = "\tConstant pool:\r\n";

		for(var i = 0; i < pool.length; i++) {
			if(!pool[i]) {
				continue;
			}

			output += "\tconst #" + i + "\t= " + pool[i] + "\r\n";
		}

		return output;
	};
};

jjvm.types.ConstantPoolClassValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolClassValue.type);

	this.getClassDef = function() {
		var className = this.getValue();
		className = className.replace(/\//g, ".");

		return jjvm.core.ClassLoader.loadClass(className);
	};

	this.setClassIndex = function(classIndex) {
		this.getData().classIndex = classIndex;
	};

	this.getClassIndex = function() {
		return this.getData().classIndex;
	};

	this.toString = function() {
		return this.getType() + "\t\t\t#" + this.getClassIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolClassValue.type = "class";
jjvm.types.ConstantPoolFieldValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolFieldValue.type);

	this.setClassIndex = function(classIndex) {
		this.getData().classIndex = classIndex;
	};

	this.getClassIndex = function() {
		return this.getData().classIndex;
	};

	this.setNameAndTypeIndex = function(nameAndTypeIndex) {
		this.getData().nameAndTypeIndex = nameAndTypeIndex;
	};

	this.getNameAndTypeIndex = function() {
		return this.getData().nameAndTypeIndex;
	};

	this.setClassName = function(className) {
		this.getData().className = className;
	};

	this.getClassName = function() {
		return this.getData().className;
	};

	this.setFieldName = function(fieldName) {
		this.getData().fieldName = fieldName;
	};

	this.getFieldName = function() {
		return this.getData().fieldName;
	};

	this.setFieldType = function(fieldType) {
		this.getData().fieldType = fieldType;
	};

	this.getFieldType = function() {
		return this.getData().fieldType;
	};

	this.getFieldDef = function() {
		var classDef = this.getClassDef();

		return classDef.getField(this.getFieldName());
	};

	this.getClassDef = function() {
		return jjvm.core.ClassLoader.loadClass(this.getClassName());
	};

	this.toString = function() {
		return this.getType() + "\t\t\t#" + this.getClassIndex() + ".#" + this.getNameAndTypeIndex() + ";\t// " + this.getClassName() + "." + this.getFieldName() + ":" + this.getFieldType();
	};
};

jjvm.types.ConstantPoolFieldValue.type = "Field";

jjvm.types.ConstantPoolMethodValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolMethodValue.type);

	this.setClassIndex = function(classIndex) {
		this.getData().classIndex = classIndex;
	};

	this.getClassIndex = function() {
		return this.getData().classIndex;
	};

	this.setNameAndTypeIndex = function(nameAndTypeIndex) {
		this.getData().nameAndTypeIndex = nameAndTypeIndex;
	};

	this.getNameAndTypeIndex = function() {
		return this.getData().nameAndTypeIndex;
	};

	this.setClassName = function(className) {
		this.getData().className = className;
	};

	this.getClassName = function() {
		return this.getData().className;
	};

	this.setMethodName = function(methodName) {
		this.getData().methodName = methodName;
	};

	this.getMethodName = function() {
		return this.getData().methodName;
	};

	this.setMethodType = function(methodType) {
		this.getData().methodType = methodType;
	};

	this.getMethodType = function() {
		return this.getData().methodType;
	};

	this.getMethodDef = function() {
		var classDef = jjvm.core.ClassLoader.loadClass(this.getClassName());
		var methodName = this.getMethodName();
		var type = this.getMethodType();
		var args = jjvm.Util.parseArgs(type);

		return classDef.getMethod(methodName, args);
	};

	this.toString = function() {
		return this.getType() + "\t\t#" + this.getClassIndex() + ".#" + this.getNameAndTypeIndex() + ";\t\t// " + this.getClassName() + "." + this.getMethodName() + this.getMethodType();
	};
};

jjvm.types.ConstantPoolMethodValue.type = "Method";

jjvm.types.ConstantPoolNameAndTypeValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolNameAndTypeValue.type);

	this.getValue = function() {
		return this.getName() + ":" + this.getNameType();
	};

	this.setName = function(name) {
		this.getData().name = name;
	};

	this.getName = function() {
		return this.getData().name;
	};

	this.setNameIndex = function(nameIndex) {
		this.getData().nameIndex = nameIndex;
	};

	this.getNameIndex = function() {
		return this.getData().nameIndex;
	};

	this.setNameType = function(nameType) {
		this.getData().nameType = nameType;
	};

	this.getNameType = function() {
		return this.getData().nameType;
	};

	this.setNameTypeIndex = function(nameTypeIndex) {
		this.getData().nameTypeIndex = nameTypeIndex;
	};

	this.getNameTypeIndex = function() {
		return this.getData().nameTypeIndex;
	};

	this.toString = function() {
		return this.getType() + "\t#" + this.getNameIndex() + ":#" + this.getNameTypeIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolNameAndTypeValue.type = "NameAndType";

jjvm.types.ConstantPoolPrimitiveValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	if(data) {
		this.setType(jjvm.types.Primitives.jvmTypesToPrimitive[data.type]);
	}

	this.toString = function() {
		return this.getType() + "\t\t\t// " + this.getValue() + ";";
	};
};

jjvm.types.ConstantPoolPrimitiveValue.types = {
	S: "Utf8",
	I: "int",
	F: "float",
	J: "long",
	D: "double"
};

jjvm.types.ConstantPoolStringReferenceValue = function(data) {
	_.extend(this, new jjvm.types.ConstantPoolValue(data));

	this.setType(jjvm.types.ConstantPoolStringReferenceValue.type);

	// holds the string reference
	var _objectRef = null;

	this.setStringIndex = function(stringIndex) {
		this.getData().stringIndex = stringIndex;
	};

	this.getStringIndex = function() {
		return this.getData().stringIndex;
	};

	this.getStringReference = function() {
		if(!_objectRef) {
			_objectRef = jjvm.Util.createStringRef(this.getValue());
		}

		return _objectRef;
	};

	this.toString = function() {
		return this.getType() + "\t\t#" + this.getStringIndex() + ";\t\t// " + this.getValue();
	};
};

jjvm.types.ConstantPoolStringReferenceValue.type = "String";

jjvm.types.ConstantPoolValue = function(data) {
	var _data = data ? data : {};

	this.setValue = function(value) {
		_data.value = value;
	};

	this.getValue = function() {
		return _data.value;
	};

	this.setType = function(type) {
		_data.type = type;
	};

	this.getType = function() {
		return _data.type;
	};

	this.setIndex = function(index) {
		_data.index = index;
	};

	this.getIndex = function() {
		return _data.index;
	};

	this.getData = function() {
		return _data;
	};
};

jjvm.types.EnclosingMethod = function(data) {
	var _data = data ? data : {};

	this.setClassName = function(className) {
		_data.className = className;
	};

	this.getClassName = function() {
		return _data.className;
	};

	this.setMethodName = function() {
		return _data.methodName;
	};

	this.getMethodName = function(methodName) {
		_data.methodName = methodName;
	};

	this.getData = function() {
		return _data;	
	};

	this.toJavaP = function() {
		var output = "\t\tEnclosingMethod:\r\n";
		output += "\t\t\t" + this.getClassName() + "." + this.getMethodName();

		return output;
	};

	this.toString = function() {
		return "EnclosingMethod";
	};
};

jjvm.types.ExceptionTable = function(table) {

	this.resolve = function(line, type) {
		for(var i = 0; i < table.length; i++) {
			if(table[i].from <= line && table[i].to >= line && type.getClass().isChildOf(table[i].type.getClassDef())) {
				return table[i].target;
			}
		}

		return null;
	};

	this.toJavaP = function() {
		var output = "\t\tExceptionTable:\r\n";
		output += "\t\t\tfrom\tto\ttarget\ttype\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			output += "\t\t\t" + table[i].from + "\t\t" + table[i].to + "\t\t" + table[i].target + "\t" + table[i].type.getClassDef().getName() + "\r\n";
		}

		return output;
	};

	this.getData = function() {
		return table;
	};

	this.toString = function() {
		return "ExceptionTable";
	};
};

jjvm.types.FieldDefinition = function(data) {
	// will be serialized to JSON so don't put any functions in here...
	var _data = data ? data : {};

	this.getVisibility = function() {
		return _data.visibility ? _data.visibility : "package";
	};

	this.setVisibility = function(visibility) {
		_data.visibility = _.string.trim(visibility);
	};

	this.isStatic = function() {
		return _data.isStatic ? true : false;
	};

	this.setIsStatic = function(isStatic) {
		_data.isStatic = isStatic ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isVolatile = function() {
		return _data.isVolatile ? true : false;
	};

	this.setIsVolatile = function(isVolatile) {
		_data.isVolatile = isVolatile ? true : false;
	};

	this.isTransient = function() {
		return _data.isTransient ? true : false;
	};

	this.setIsTransient = function(isTransient) {
		_data.isTransient = isTransient ? true : false;
	};

	this.setType = function(type) {
		_data.type = _.str.trim(type);
	};

	this.getType = function() {
		return _data.type;
	};

	this.setName = function(name) {
		_data.name = _.str.trim(name);
	};

	this.getName = function() {
		return _data.name;
	};

	this.setDeprecated = function(isDeprecated) {
		_data.isDeprecated = isDeprecated ? true : false;
	};

	this.isDeprecated = function() {
		return _data.isDeprecated ? true : false;
	};

	this.setSynthetic = function(isSynthetic) {
		_data.isSynthetic = isSynthetic ? true : false;
	};

	this.isSynthetic = function() {
		return _data.isSynthetic ? true : false;
	};

	this.setConstantValue = function(constantValue) {
		_data.constantValue = constantValue;
	};

	this.getConstantValue = function() {
		return _data.constantValue;
	};

	this.getData = function() {
		return _data;
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isStatic() ? " static" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isVolatile() ? " volatile" : "";
		output += this.isTransient() ? " transient" : "";
		output += " " + this.getType() + " " + this.getName() + ");\r\n";

		return output;
	};

	this.toString = function() {
		return "Field#" + this.getName();
	};
};

jjvm.types.LineNumberTable = function(table) {

	this.getTable = function() {
		return table;
	};

	this.toJavaP = function() {
		var output = "\t\tLineNumberTable:\r\n";

		for(var i = 0; i < table.length; i++) {
			if(!table[i]) {
				continue;
			}

			output += "\t\t\tline " + table[i] + ":\t" + i + "\r\n";
		}

		return output;
	};

	this.getData = function() {
		return table;
	};

	this.toString = function() {
		return "LineNumberTable";
	};
};

jjvm.types.LocalVariableTable = function(table) {

	this.getTable = function() {
		return table;
	};

	this.getData = function() {
		return table;
	};
};

jjvm.types.MethodDefinition = function(data) {
	// will be serialized to JSON so don't put any functions in here...
	var _data = data ? data : {
		instructions: []
	};

	// holds a function
	var _implementation = null;

	// holds a list of bytecode instructions
	var _instructions = [];
	var _lineNumberTable = null;
	var _localVariableTable = null;
	var _stackMapTable = null;
	var _exceptionTable = null;
	var _classDef = null;
	
	if(data) {
		if(data.lineNumberTable) {
			_lineNumberTable = new jjvm.types.LineNumberTable(data.lineNumberTable);
		}

		if(data.localVariableTable) {
			_localVariableTable = new jjvm.types.LocalVariableTable(data.localVariableTable);
		}

		if(data.stackMapTable) {
			_stackMapTable = new jjvm.types.StackMapTable(data.stackMapTable);
		}

		if(data.exceptionTable) {
			_exceptionTable = new jjvm.types.ExceptionTable(data.exceptionTable);
		}

		if(data.instructions) {
			_.each(data.instructions, function(data) {
				_instructions.push(new jjvm.types.ByteCode(data));
			});
		}
	}

	this.getVisibility = function() {
		return _data.visibility ? _data.visibility : "package";
	};

	this.setVisibility = function(visibility) {
		_data.visibility = visibility;
	};

	this.getSignature = function() {
		return _data.signature;
	};

	this.setSignature = function(signature) {
		_data.signature = signature;
	};

	this.isStatic = function() {
		return _data.isStatic ? true : false;
	};

	this.setIsStatic = function(isStatic) {
		_data.isStatic = isStatic ? true : false;
	};

	this.isFinal = function() {
		return _data.isFinal ? true : false;
	};

	this.setIsFinal = function(isFinal) {
		_data.isFinal = isFinal ? true : false;
	};

	this.isSynchronized = function() {
		return _data.isSynchronized ? true : false;
	};

	this.setIsSynchronized = function(isSynchronized) {
		_data.isSynchronized = isSynchronized ? true : false;
	};

	this.isNative = function() {
		return _data.isNative ? true : false;
	};

	this.setIsNative = function(isNative) {
		_data.isNative = isNative ? true : false;
	};

	this.isAbstract = function() {
		return _data.isAbstract ? true : false;
	};

	this.setIsAbstract = function(isAbstract) {
		_data.isAbstract = isAbstract ? true : false;
	};

	this.getIsStrict = function() {
		return _data.isStrict ? true : false;
	};

	this.setIsStrict = function(isStrict) {
		_data.isStrict = isStrict ? true : false;
	};

	this.setName = function(name) {
		_data.name = _.string.trim(name);
	};

	this.getName = function() {
		return _data.name;
	};

	this.setArgs = function(args) {
		return _data.args = args;
	};

	this.getArgs = function() {
		return _data.args;
	};

	this.setReturns = function(returns) {
		_data.returns = _.str.trim(returns);
	};

	this.getReturns = function() {
		return _data.returns ? _data.returns : "void";
	};

	this.getInstructions = function() {
		return _instructions;
	};

	this.setInstructions = function(instructions) {
		_instructions = instructions;

		_data.instructions = [];

		_.each(instructions, function(instruction) {
			_data.instructions.push(instruction.getData());
		});
	};

	this.setDeprecated = function(deprecated) {
		_data.isDeprecated = deprecated ? true : false;
	};

	this.isDeprecated = function() {
		return _data.isDeprecated;
	};

	this.setSynthetic = function(synthetic) {
		_data.synthetic = synthetic ? true : false;
	};

	this.isSynthetic = function() {
		return _data.isSynthetic;
	};

	this.setThrows = function(list) {
		_data.throws = list;
	};

	this.getThrows = function() {
		return _data.throws;
	};

	this.setMaxStackSize = function(maxStackSize) {
		_data.maxStackSize = maxStackSize;
	};

	this.getMaxStackSize = function() {
		return _data.maxStackSize;
	};

	this.setMaxLocalVariables = function(maxLocalVariables) {
		_data.maxLocalVariables = maxLocalVariables;
	};

	this.getMaxLocalVariables = function() {
		return _data.maxLocalVariables;
	};

	this.getImplementation = function() {
		return _implementation;
	};

	this.setImplementation = function(implementation) {
		_implementation = implementation;
	};

	this.setExceptionTable = function(exceptionTable) {
		_exceptionTable = exceptionTable;

		if(exceptionTable) {
			_data.exceptionTable = exceptionTable.getData();
		}
	};

	this.getExceptionTable = function() {
		return _exceptionTable;
	};

	this.setLineNumberTable = function(lineNumberTable) {
		_lineNumberTable = lineNumberTable;

		if(lineNumberTable) {
			_data.lineNumberTable = lineNumberTable.getData();
		}
	};

	this.getLineNumberTable = function() {
		return _lineNumberTable;
	};

	this.setLocalVariableTable = function(localVariableTable) {
		_localVariableTable = localVariableTable;

		if(localVariableTable) {
			_data.localVariableTable = localVariableTable.getData();
		}		
	};

	this.getLocalVariableTable = function() {
		return _localVariableTable;
	};

	this.setStackMapTable = function(stackMapTable) {
		_stackMapTable = stackMapTable;

		if(stackMapTable) {
			_data.stackMapTable = stackMapTable.getData();
		}
	};

	this.getStackMapTable = function() {
		return _stackMapTable;
	};

	this.setClassDef = function(classDef) {
		_classDef = classDef;
	};

	this.getClassDef = function() {
		return _classDef;
	};

	this.getData = function() {
		return _data;
	};

	this.toJavaP = function() {
		var output = this.getVisibility();
		output += this.isStatic() ? " static" : "";
		output += this.isFinal() ? " final" : "";
		output += this.isAbstract() ? " abstract" : "";
		output += this.isSynchronized() ? " synchronized" : "";
		output += " " + this.getReturns() + " " + this.getName() + "(" + this.getArgs().join(", ") + ");\r\n";
		output += "\tCode:\r\n";
		output += "\t\tStack=" + this.getMaxStackSize() + ", Locals="+ this.getMaxLocalVariables() + ", Args_size=" + this.getArgs().length + "\r\n";

		if(this.getImplementation()) {
			output += "\t\tNative code\r\n";
		} else {
			for(var i = 0; i < this.getInstructions().length; i++) {
				output += "\t\t" + this.getInstructions()[i].getLocation() + ":\t" + this.getInstructions()[i] + "\r\n";
			}
		}

		if(this.getLineNumberTable()) {
			output += this.getLineNumberTable().toJavaP();
		}

		if(this.getExceptionTable()) {
			output += this.getExceptionTable().toJavaP();
		}

		return output;
	};

	this.toString = function() {
		return "Method#" + this.getName();
	};
};

jjvm.types.MethodDefinition.CLASS_INITIALISER = "<clinit>";
jjvm.types.MethodDefinition.OBJECT_INITIALISER = "<init>";
jjvm.types.Primitives = {
	jvmTypesToPrimitive: {
		"Z": "boolean",
		"B": "byte",
		"C": "char",
		"S": "short",
		"I": "int",
		"J": "long",
		"F": "float",
		"D": "double",
		"V": "void"
	},

	classToPrimitive: {
		"java.lang.Boolean": "boolean",
		"java.lang.Byte": "byte",
		"java.lang.Char": "char",
		"java.lang.Short": "short",
		"java.lang.Integer": "int",
		"java.lang.Long": "long",
		"java.lang.Float": "float",
		"java.lang.Double": "double",
		"java.lang.Void": "void"
	},

	primitiveToClass: {
		"boolean": "java.lang.Boolean",
		"byte": "java.lang.Byte",
		"char": "java.lang.Char",
		"short": "java.lang.Short",
		"int": "java.lang.Integer",
		"long": "java.lang.Long",
		"float": "java.lang.Float",
		"double": "java.lang.Double",
		"void": "java.lang.Void"
	}
};

jjvm.types.StackMapTable = function(className, methodName) {

	this.toJavaP = function() {
		var output = "\t\tEnclosingMethod:\r\n";
		output += "\t\t\t" + className + methodName;

		return output;
	};

	this.getData = function() {
		return table;
	};

	this.toString = function() {
		return "EnclosingMethod";
	};
};

jjvm.runtime.Frame = function(classDef, methodDef, args, parent) {
	_.extend(this, jjvm.core.Watchable);

	var _stack = new jjvm.runtime.Stack();
	var _variables = new jjvm.runtime.LocalVariables(args ? args : []);
	var _child;
	var _thread;
	var _output;
	var _currentInstruction;
	var _version = jjvm.runtime.Frame.index++;
	var _instructions = new jjvm.core.Iterator(methodDef.getInstructions());
	var _skipBreakpointAtLocation;
	var _executionHalted;
	var _isSystemFrame;

	this.getLocalVariables = function() {
		return _variables;
	};

	this.getStack = function() {
		return _stack;
	};

	this.getClassDef = function() {
		return classDef;
	};

	this.getMethodDef = function() {
		return methodDef;
	};

	this.getParent = function() {
		return parent;
	};

	this.getChild = function() {
		return _child;
	};

	this.getCurrentInstruction = function() {
		return _currentInstruction;
	};

	this.getNextInstruction = function() {
		return _instructions.peek();
	};

	this.getOutput = function() {
		return _output;
	};

	this.getThread = function() {
		return _thread;
	};

	this._resumeExecution = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		_thread.setExecutionSuspended(false);
		_skipBreakpointAtLocation = _currentInstruction.getLocation();

		this._executeNextInstruction();
	};

	this._stepOver = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// start stepping
		this._executeNextInstruction();
	};

	this._stepInto = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		var nextInstruction = _instructions.peek();

		if(!nextInstruction.canStepInto()) {
			console.warn("Can only step into methods that create a new frame.");
			return;
		}

		// start stepping
		this._executeNextInstruction();
	};

	this._dropToFrame = function(sender) {
		if(!_thread.isCurrentFrame(this)) {
			return;
		}

		// reset execution index and enabled stepping
		_instructions.reset();
		_stack = new jjvm.runtime.Stack();
		_currentInstruction = _instructions.peek();
		this._dispatchNotification("onBeforeInstructionExecution");
	};

	var stepOverCallback = _.bind(this._stepOver, this);
	var stepIntoCallback = _.bind(this._stepInto, this);
	var dropToFrameCallback = _.bind(this._dropToFrame, this);
	var resumeExecutionCallback = _.bind(this._resumeExecution, this);

	this.execute = function(thread) {
		_thread = thread;
		_thread.setCurrentFrame(this);
		_thread.register("onStepOver", stepOverCallback);
		_thread.register("onStepInto", stepIntoCallback);
		_thread.register("onDropToFrame", dropToFrameCallback);
		_thread.register("onResumeExecution", resumeExecutionCallback);

		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = classDef;

			if(!methodDef.isStatic()) {
				target = _variables.load(0);
			}

			args.unshift(target);
			args.unshift(methodDef);
			args.unshift(classDef);
			args.unshift(this);
			_output = methodDef.getImplementation().apply(target, args);

			this.dispatch("onFrameComplete");
		} else {
			if(_thread.isExecutionSuspended()) {
				_currentInstruction = _instructions.peek();
				this._dispatchNotification("onBeforeInstructionExecution");
			} else {
				this._executeNextInstruction();
			}
		}
	};

	this.executeChild = function(classDef, methodDef, args) {
		if(methodDef.getImplementation()) {
			// special case - where we have overriden method behaviour to stub 
			// functionality like writing to System.out
			var target = classDef;

			if(!methodDef.isStatic()) {
				target = args.shift();
			}

			args.unshift(target);
			args.unshift(methodDef);
			args.unshift(classDef);
			args.unshift(this);
			var childOutput = methodDef.getImplementation().apply(target, args);

			// override produced output so push it onto the stack
			if(childOutput !== undefined) {
				this.getStack().push(childOutput);
			}

			this.dispatch("onChildFrameCompleted", [childOutput]);
		} else {
			_child = new jjvm.runtime.Frame(classDef, methodDef, args, this);
			_child.setIsSystemFrame(_isSystemFrame);

			_child.registerOneTimeListener("onFrameComplete", _.bind(function(frame, output) {
				// child frame produced output so push it onto the stack
				if(output !== undefined) {
					this.getStack().push(output);
				}

				_child = null;
				_thread.setCurrentFrame(this);

				this.dispatch("onChildFrameCompleted", [output]);
			}, this));
			_child.registerOneTimeListener("onExceptionThrown", _.bind(function(frame, thrown) {
				if(!this.getMethodDef().getExceptionTable()) {
					if(!parent) {
						// nowhere to bubble to...
						throw "Uncaught exception! " + thrown;
					}

					// exception bubbles up
					this.dispatch("onExceptionThrown", [thrown]);

					return;
				}

				var exceptionTable = this.getMethodDef().getExceptionTable();
				var jumpTo = exceptionTable.resolve(_currentInstruction.getLocation(), thrown);

				if(jumpTo === null) {
					if(!parent) {
						// nowhere to bubble to...
						throw "Uncaught exception! " + thrown;
					}

					// uncaught exception
					this.dispatch("onExceptionThrown", [thrown]);

					return;
				} else {
					// find the instruction we are to jump to
					for(var i = 0; i < _instructions.getIterable().length; i++) {
						if(_instructions.getIterable()[i].getLocation() == jumpTo) {
							_instructions.jump(i);
						}
					}
				}

				_child = null;
				_thread.setCurrentFrame(this);
			}, this));

			_child.execute(_thread, _executionHalted);
		}

		return _child;
	};

	this.toString = function() {
		return "Frame#" + _version + " " + classDef.getName() + "." + methodDef.getName() + (_currentInstruction ? ":" + _currentInstruction.getLocation() : "");
	};

	this._shouldStopOnBreakpoint = function() {
		if(_isSystemFrame) {
			// sometimes we don't want breakpoints - class initializers,
			// internal string ref creation and so on
			return false;
		}

		if(!_currentInstruction.hasBreakpoint()) {
			return false;
		}

		// this makes the resume button work if we're currently on an 
		// instruction with a breakpoint
		if(_currentInstruction.getLocation() == _skipBreakpointAtLocation) {
			_skipBreakpointAtLocation = -1;

			return false;
		}

		if(_thread.isExecutionSuspended()) {
			return false;
		}

		return true;
	};

	this._executeNextInstruction = function() {
		// get instruction to execute
		_currentInstruction = _instructions.next();

		this._dispatchNotification("onBeforeInstructionExecution");

		if(this._shouldStopOnBreakpoint()) {
			_thread.setExecutionSuspended(true, this);
			this._dispatchNotification("onBreakpointEncountered");
			_instructions.rewind();

			return;
		}

		try {
			var constantPool = classDef.getConstantPool();

			// if we're not executing an interface, use the constantpool from 
			// the method definition's containing class
			if(!methodDef.getClassDef().isInterface()) {
				constantPool = methodDef.getClassDef().getConstantPool();
			}

			_output = _currentInstruction.execute(this, constantPool);

			if(_output !== undefined) {
				// have executed a return statement..

				if(_output == jjvm.runtime.Void) {
					_output = undefined;
				}

				// make sure we don't execute any more instructions..
				_instructions.consume();
			}
		} catch(error) {
			if(error instanceof jjvm.runtime.Goto) {
				// jump to another instruction
				for(var i = 0; i < methodDef.getInstructions().length; i++) {
					if(methodDef.getInstructions()[i].getLocation() == error.getLocation()) {
						_instructions.jump(i);
					}
				}
			} else if(error instanceof jjvm.runtime.Thrown) {
				// handle java exception ref
				_output = error.getThrowable();

				this._tearDownThreadListeners();

				this.dispatch("onExceptionThrown", [error.getThrowable()]);

				return;
			} else {
				// don't know what to do
				console.error(error);
				throw error;
			}
		}

		this._dispatchNotification("onInstructionExecution");
		this._dispatchNotification("onAfterInstructionExecution");

		if(!_instructions.hasNext()) {
			// all done
			this._tearDownThreadListeners();
			this.dispatch("onFrameComplete", [_output]);

			return;
		}

		//if(!_thread.isSuspendedInFrame(this)) {
		if(!_thread.isExecutionSuspended()) {
			this._executeNextInstruction();
			// execute next instruction in one second
			//setTimeout(_.bind(this._executeNextInstruction, this), 1000);
		}
	};

	this.setIsSystemFrame = function(systemFrame) {
		_isSystemFrame = systemFrame;
	};

	this.isSystemFrame = function() {
		return _isSystemFrame;
	};

	this.toString = function() {
		return "Frame#" + classDef.getName() + "#" + methodDef.getName();
	};

	this._tearDownThreadListeners = function() {
		_thread.deRegister("onStepOver", stepOverCallback);
		_thread.deRegister("onStepInto", stepIntoCallback);
		_thread.deRegister("onDropToFrame", dropToFrameCallback);
		_thread.deRegister("onResumeExecution", resumeExecutionCallback);
	};

	this._dispatchNotification = function(eventType) {
		var stack = [];

		_.each(this.getStack().getStack(), function(index, item) {
			stack.push(item.toString());
		});

		var localVariables = [];

		_.each(this.getLocalVariables().getLocalVariables(), function(index, item) {
			localVariables.push(item.toString());
		});

		this.dispatch(eventType, [this.getData()]);
	};

	this.getData = function() {
		var stack = [];

		_.each(this.getStack().getStack(), function(item) {
			stack.push(item ? item.toString() : item);
		});

		var localVariables = [];

		_.each(this.getLocalVariables().getLocalVariables(), function(item) {
			localVariables.push(item ? item.toString() : item);
		});

		var nextInstruction = {
			className: classDef.getName(), 
			methodSignature: methodDef.getSignature(), 
			instruction: _instructions.peek()
		};

		if(!nextInstruction.instruction && parent) {
			nextInstruction = {
				className: parent.getClassDef().getName(), 
				methodSignature: parent.getMethodDef().getSignature(), 
				instruction: parent.getNextInstruction()
			};
		}

		if(nextInstruction.instruction) {
			nextInstruction.instruction = nextInstruction.instruction.getData();
		}

		return {
			className: classDef.getName(), 
			methodSignature: methodDef.getSignature(), 
			currentInstruction: _currentInstruction ? _currentInstruction.getData() : null, 
			nextInstruction: nextInstruction, 
			isSystemFrame: _isSystemFrame, 
			isCurrentFrame: _thread ? _thread.isCurrentFrame(this) : false,
			isExecutionSuspended: _thread ? _thread.isExecutionSuspended() : false,
			stack: stack, 
			localVariables: localVariables
		};
	};
};

jjvm.runtime.Frame.index = 0;
jjvm.runtime.Goto = function(offset) {
	this.getLocation = function() {
		return offset;
	};
};

jjvm.runtime.LocalVariables = function(args) {
	var _args = [].concat(args);

	this.store = function(index, value) {
		_args[index] = value;
	};

	this.load = function(index) {
		return _args[index];
	};

	this.getLocalVariables = function(index) {
		return _args;
	};
};

jjvm.runtime.ObjectReference = function(classDef) {
	var _fields = {};
	var _values = {};
	var _index = jjvm.runtime.ObjectReference.index++;

	this.getClass = function() {
		return classDef;
	};

	this.invoke = function(methodName, args) {

	};

	this.getField = function(name) {
		this._hasField(name);

		if(_fields[name] === undefined) {
			// we have the field but it's not been used yet so initialise it.

			var fieldDef = this.getClass().getField(name);

			if(fieldDef.getType() == "boolean" || fieldDef.getType() == "byte" || fieldDef.getType() == "short" || fieldDef.getType() == "int" || fieldDef.getType() == "long" || fieldDef.getType() == "char") {
				_fields[name] = 0;
			} else if(fieldDef.getType() == "float" || fieldDef.getType() == "double") {
				_fields[name] = 0.0;
			} else if(fieldDef.getType() == "boolean") {
				_fields[name] = false;
			} else {
				_fields[name] = null;				
			}
		}

		return _fields[name];
	};

	this.setField = function(name, value) {
		this._hasField(name);

		_fields[name] = value;
	};

	this._hasField = function(name) {
		if(!this.getClass().hasField(name)) {
			throw "field " + name + " does not exist on class " + this.getClass().getName();
		}
	};

	this.isInstanceOf = function(classDef) {
		return this.getClass().isChildOf(classDef);
	};

	this.getIndex = function() {
		return _index;
	};

	this.toString = function() {
		return "ObjectReference #" + this.getIndex() + " " + classDef.getName();
	};
};

jjvm.runtime.ObjectReference.index = 0;

jjvm.runtime.Stack = function() {
	var _stack = [];

	this.push = function(value) {
		_stack.push(value);
	};

	this.pop = function() {
		return _stack.pop();
	};

	this.getStack = function() {
		return _stack;
	};
};

jjvm.runtime.Thread = function(frame, parent) {
	_.extend(this, jjvm.core.Watchable);

	jjvm.runtime.ThreadPool.threads.push(this);
	
	var _initialFrame = frame;
	var _currentFrame = frame;
	var _index = jjvm.runtime.Thread.index++;
	var _status = jjvm.runtime.Thread.STATUS.NEW;
	var _executionSuspended;
	var _suspendedInFrame;

	this.run = function() {
		frame.register("onFrameComplete", _.bind(function() {
			this.setStatus(jjvm.runtime.Thread.STATUS.TERMINATED);

			if(parent === undefined && frame.getMethodDef().getName() == "main") {
				this.dispatch("onExecutionComplete");
			}

			jjvm.runtime.ThreadPool.reap();
		}, this));

		this.setStatus(jjvm.runtime.Thread.STATUS.RUNNABLE);
		frame.execute(this);
	};

	this.isExecutionSuspended = function() {
		return _executionSuspended ? true : false;
	};

	this.setExecutionSuspended = function(executionSuspended, frame) {
		_executionSuspended  = executionSuspended;
		_suspendedInFrame = frame;
	};

	this.isSuspendedInFrame = function(frame) {
		return _suspendedInFrame == frame;
	};

	this.isCurrentFrame = function(frame) {
		return _currentFrame == frame;
	};

	this.getCurrentFrame = function() {
		return _currentFrame;
	};

	this.setCurrentFrame = function(frame) {
		_currentFrame = frame;

		this.dispatch("onCurrentFrameChanged", [this.getData(), frame.getData()]);
	};

	this.getInitialFrame = function(frame) {
		return _initialFrame;
	};

	this.setStatus = function(status) {
		_status = status;

		this.dispatch("onThreadStatusChanged", [this.getData(), frame.getData()]);
	};

	this.getStatus = function() {
		return _status;
	};

	this.toString = function() {
		return "Thread#" + _index + " (" + _status + ")";
	};

	this.getData = function() {
		var frames = [];
		var frame = _initialFrame;

		while(frame) {
			var frameData = frame.getData();

			if(_currentFrame == frame) {
				frameData.currentFrame = true;
			}

			frames.push(frameData);

			frame = frame.getChild();
		}

		return {
			name: this.toString(), 
			status: this.getStatus(),
			frames: frames
		};
	};
};

jjvm.runtime.Thread.index = 0;
jjvm.runtime.Thread.STATUS = {
	NEW: "NEW",
	RUNNABLE: "RUNNABLE",
	BLOCKED: "BLOCKED",
	WAITING: "WAITING",
	TIMED_WAITING: "TIMED_WAITING",
	TERMINATED: "TERMINATED"
};

jjvm.runtime.ThreadPool = {
	threads: [],
	
	reap: function() {
		for(var i = 0; i < jjvm.runtime.ThreadPool.threads.length; i++) {
			if(jjvm.runtime.ThreadPool.threads[i].getStatus() == jjvm.runtime.Thread.STATUS.TERMINATED) {
				jjvm.runtime.ThreadPool.threads.splice(i, 1);
			}
		}

		jjvm.core.NotificationCentre.dispatch(this, "onThreadGC", [jjvm.runtime.ThreadPool.getData()]);
	},

	getData: function() {
		var threads  = [];

		_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
			threads.push(thread.getData());
		});

		return threads;
	}
};

jjvm.runtime.Thrown = function(throwable) {
	this.getThrowable = function() {
		return throwable;
	};
};

jjvm.runtime.Void = {
	
};

jjvm.compiler.AttributesParser = function(iterator, constantPool) {
	
	this.parse = function(iterator, constantPool) {
		var attributeCount = iterator.readU16();

		this.onAttributeCount(attributeCount);

		for(var n = 0; n < attributeCount; n++) {
			var attributeName = constantPool.load(iterator.readU16()).getValue();
			var attributeLength = iterator.readU32();
			var attributeStart = iterator.getLocation();

			var nextPosition = iterator.getLocation() + attributeLength;

			if(this["on" + attributeName]) {
				this["on" + attributeName](iterator, constantPool);
			} else {
				this.onUnrecognisedAttribute(attributeName);
			}

			// make sure we've consumed the attribute
			var read = iterator.getLocation() - attributeStart;

			if(read != attributeLength) {
				//jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Short read of " + attributeName + " read " + read + " of " + attributeLength + " bytes"]);
			}

			iterator.jump(nextPosition);
		}
	};

	this.onAttributeCount = function(attributeCount) {

	};

	this.onUnrecognisedAttribute = function(attributeName) {

	};

	this.toString = function() {
		return "AttributesParser";
	};
};
jjvm.compiler.BlockParser = function() {

	this.parseBlock = function(iterator, constantsPool, length, parser) {
		//console.info("parsing block of length " + length + " with " + parser);
		var block = iterator.getIterable().subarray(iterator.getLocation(), iterator.getLocation() + length);
		var blockIterator = new jjvm.core.ByteIterator(block);

		// skip to end of block
		iterator.jump(iterator.getLocation() + length);

		// parse block
		return parser.parse(blockIterator, constantsPool);
	};

	this.readEmptyBlock = function(attributeName, iterator, expectedLength) {
		if(expectedLength === undefined) {
			expectedLength = 0;
		}

		var attributeLength = iterator.readU32();

		if(attributeLength !== expectedLength) {
			throw attributeName + " attribute should have length " + expectedLength + "! found " + attributeLength;
		}
	};

	this.toString = function() {
		return "BlockParser";
	};
};
jjvm.compiler.ByteCodeParser = function() {

	var _bytecode_mapping = {
		0x00: {
			mnemonic: "nop",
			operation: "nop",
			args: []
		},
		0x01: {
			mnemonic: "aconst_null",
			operation: "push",
			args: [null]
		},
		0x02: {
			mnemonic: "iconst_m1",
			operation: "push",
			args: [-1]
		},
		0x03: {
			mnemonic: "iconst_0",
			operation: "push",
			args: [0]
		},
		0x04: {
			mnemonic: "iconst_1",
			operation: "push",
			args: [1]
		},
		0x05: {
			mnemonic: "iconst_2",
			operation: "push",
			args: [2]
		},
		0x06: {
			mnemonic: "iconst_3",
			operation: "push",
			args: [3]
		},
		0x07: {
			mnemonic: "iconst_4",
			operation: "push",
			args: [4]
		},
		0x08: {
			mnemonic: "iconst_5",
			operation: "push",
			args: [5]
		},
		0x09: {
			mnemonic: "lconst_0",
			operation: "push",
			args: [0]
		},
		0x0A: {
			mnemonic: "lconst_1",
			operation: "push",
			args: [1]
		},
		0x0B: {
			mnemonic: "fconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0C: {
			mnemonic: "fconst_1",
			operation: "push",
			args: [1.0]
		},
		0x0D: {
			mnemonic: "fconst_2",
			operation: "push",
			args: [2.0]
		},
		0x0E: {
			mnemonic: "dconst_0",
			operation: "push",
			args: [0.0]
		},
		0x0F: {
			mnemonic: "dconst_1",
			operation: "push",
			args: [1.0]
		},
		0x10: {
			mnemonic: "bipush",
			operation: "push",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x11: {
			mnemonic: "sipush",
			operation: "push",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x12: {
			mnemonic: "ldc",
			operation: "push_constant",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var value = constantPool.load(args[0]).getValue();

				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x13: {
			mnemonic: "ldc_w",
			operation: "push_constant",
			index: null,
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x14: {
			mnemonic: "ldc2_w",
			operation: "push_constant",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + "\t\t// #" + args[0] + " " + constantPool.load(args[0]).getValue();
			}
		},
		0x15: {
			mnemonic: "iload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x16: {
			mnemonic: "lload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x17: {
			mnemonic: "fload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x18: {
			mnemonic: "dload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x19: {
			mnemonic: "aload",
			operation: "load",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x1A: {
			mnemonic: "iload_0",
			operation: "load",
			args: [0]
		},
		0x1B: {
			mnemonic: "iload_1",
			operation: "load",
			args: [1]
		},
		0x1C: {
			mnemonic: "iload_2",
			operation: "load",
			args: [2]
		},
		0x1D: {
			mnemonic: "iload_3",
			operation: "load",
			args: [3]
		},
		0x1E: {
			mnemonic: "lload_0",
			operation: "load",
			args: [0]
		},
		0x1F: {
			mnemonic: "lload_1",
			operation: "load",
			args: [1]
		},
		0x20: {
			mnemonic: "lload_2",
			operation: "load",
			args: [2]
		},
		0x21: {
			mnemonic: "lload_3",
			operation: "load",
			args: [3]
		},
		0x22: {
			mnemonic: "fload_0",
			operation: "load",
			args: [0.0]
		},
		0x23: {
			mnemonic: "fload_1",
			operation: "load",
			args: [1.0]
		},
		0x24: {
			mnemonic: "fload_2",
			operation: "load",
			args: [2.0]
		},
		0x25: {
			mnemonic: "fload_3",
			operation: "load",
			args: [3.0]
		},
		0x26: {
			mnemonic: "dload_0",
			operation: "load",
			args: [0.0]
		},
		0x27: {
			mnemonic: "dload_1",
			operation: "load",
			args: [1.0]
		},
		0x28: {
			mnemonic: "dload_2",
			operation: "load",
			args: [2.0]
		},
		0x29: {
			mnemonic: "dload_3",
			operation: "load",
			args: [3.0]
		},
		0x2A: {
			mnemonic: "aload_0",
			operation: "load",
			args: [0]
		},
		0x2B: {
			mnemonic: "aload_1",
			operation: "load",
			args: [1]
		},
		0x2C: {
			mnemonic: "aload_2",
			operation: "load",
			args: [2]
		},
		0x2D: {
			mnemonic: "aload_3",
			operation: "load",
			args: [3]
		},
		0x2E: {
			mnemonic: "iaload",
			operation: "array_load",
			args: []
		},
		0x2F: {
			mnemonic: "laload",
			operation: "array_load",
			args: []
		},
		0x30: {
			mnemonic: "faload",
			operation: "array_load",
			args: []
		},
		0x31: {
			mnemonic: "daload",
			operation: "array_load",
			args: []
		},
		0x32: {
			mnemonic: "aaload",
			operation: "array_load",
			args: []
		},
		0x33: {
			mnemonic: "baload",
			operation: "array_load",
			args: []
		},
		0x34: {
			mnemonic: "caload",
			operation: "array_load_character",
			args: []
		},
		0x35: {
			mnemonic: "saload",
			operation: "array_load",
			args: []
		},
		0x36: {
			mnemonic: "istore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x37: {
			mnemonic: "lstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x38: {
			mnemonic: "fstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x39: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x3A: {
			mnemonic: "dstore",
			operation: "store",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0x3B: {
			mnemonic: "istore_0",
			operation: "store",
			args: [0]
		},
		0x3C: {
			mnemonic: "istore_1",
			operation: "store",
			args: [1]
		},
		0x3D: {
			mnemonic: "istore_2",
			operation: "store",
			args: [2]
		},
		0x3E: {
			mnemonic: "istore_3",
			operation: "store",
			args: [3]
		},
		0x3F: {
			mnemonic: "lstore_0",
			operation: "store",
			args: [0]
		},
		0x40: {
			mnemonic: "lstore_1",
			operation: "store",
			args: [1]
		},
		0x41: {
			mnemonic: "lstore_2",
			operation: "store",
			args: [2]
		},
		0x42: {
			mnemonic: "lstore_3",
			operation: "store",
			args: [3]
		},
		0x43: {
			mnemonic: "fstore_0",
			operation: "store",
			args: [0.0]
		},
		0x44: {
			mnemonic: "fstore_1",
			operation: "store",
			args: [1.0]
		},
		0x45: {
			mnemonic: "fstore_2",
			operation: "store",
			args: [2.0]
		},
		0x46: {
			mnemonic: "fstore_3",
			operation: "store",
			args: [3.0]
		},
		0x47: {
			mnemonic: "dstore_0",
			operation: "store",
			args: [0.0]
		},
		0x48: {
			mnemonic: "dstore_1",
			operation: "store",
			args: [1.0]
		},
		0x49: {
			mnemonic: "dstore_2",
			operation: "store",
			args: [2.0]
		},
		0x4A: {
			mnemonic: "dstore_3",
			operation: "store",
			args: [3.0]
		},
		0x4B: {
			mnemonic: "astore_0",
			operation: "store",
			args: [0.0]
		},
		0x4C: {
			mnemonic: "astore_1",
			operation: "store",
			args: [1.0]
		},
		0x4D: {
			mnemonic: "astore_2",
			operation: "store",
			args: [2.0]
		},
		0x4E: {
			mnemonic: "astore_3",
			operation: "store",
			args: [3.0]
		},
		0x4F: {
			mnemonic: "iastore",
			operation: "array_store",
			args: []
		},
		0x50: {
			mnemonic: "lastore",
			operation: "array_store",
			args: []
		},
		0x51: {
			mnemonic: "fastore",
			operation: "array_store",
			args: []
		},
		0x52: {
			mnemonic: "dastore",
			operation: "array_store",
			args: []
		},
		0x53: {
			mnemonic: "aastore",
			operation: "array_store",
			args: []
		},
		0x54: {
			mnemonic: "bastore",
			operation: "array_store",
			args: []
		},
		0x55: {
			mnemonic: "castore",
			operation: "array_store_character",
			args: []
		},
		0x56: {
			mnemonic: "sastore",
			operation: "array_store",
			args: []
		},
		0x57: {
			mnemonic: "pop",
			operation: "pop",
			args: []
		},
		0x58: {
			mnemonic: "pop2",
			operation: "pop2",
			args: []
		},
		0x59: {
			mnemonic: "dup",
			operation: "dup",
			args: []
		},
		0x5A: {
			mnemonic: "dup_x1",
			operation: "dup_x1",
			args: []
		},
		0x5B: {
			mnemonic: "dup_x2",
			operation: "dup_x2",
			args: []
		},
		0x5C: {
			mnemonic: "dup2",
			operation: "dup2",
			args: []
		},
		0x5D: {
			mnemonic: "dup2_x1",
			operation: "dup2_x1",
			args: []
		},
		0x5E: {
			mnemonic: "dup2_x2",
			operation: "dup2_x2",
			args: []
		},
		0x5F: {
			mnemonic: "swap",
			operation: "swap",
			args: []
		},
		0x60: {
			mnemonic: "iadd",
			operation: "add",
			args: []
		},
		0x61: {
			mnemonic: "ladd",
			operation: "add",
			args: []
		},
		0x62: {
			mnemonic: "fadd",
			operation: "add",
			args: []
		},
		0x63: {
			mnemonic: "dadd",
			operation: "add",
			args: []
		},
		0x64: {
			mnemonic: "isub",
			operation: "sub",
			args: []
		},
		0x65: {
			mnemonic: "lsub",
			operation: "sub",
			args: []
		},
		0x66: {
			mnemonic: "fsub",
			operation: "sub",
			args: []
		},
		0x67: {
			mnemonic: "dsub",
			operation: "sub",
			args: []
		},
		0x68: {
			mnemonic: "imul",
			operation: "mul",
			args: []
		},
		0x69: {
			mnemonic: "lmul",
			operation: "mul",
			args: []
		},
		0x6A: {
			mnemonic: "fmul",
			operation: "mul",
			args: []
		},
		0x6B: {
			mnemonic: "dmul",
			operation: "mul",
			args: []
		},
		0x6C: {
			mnemonic: "idiv",
			operation: "div",
			args: []
		},
		0x6D: {
			mnemonic: "ldiv",
			operation: "div",
			args: []
		},
		0x6E: {
			mnemonic: "fdiv",
			operation: "div",
			args: []
		},
		0x6F: {
			mnemonic: "ddiv",
			operation: "div",
			args: []
		},
		0x70: {
			mnemonic: "irem",
			operation: "rem",
			args: []
		},
		0x71: {
			mnemonic: "lrem",
			operation: "rem",
			args: []
		},
		0x72: {
			mnemonic: "frem",
			operation: "rem",
			args: []
		},
		0x73: {
			mnemonic: "drem",
			operation: "rem",
			args: []
		},
		0x74: {
			mnemonic: "ineg",
			operation: "neg",
			args: []
		},
		0x75: {
			mnemonic: "lneg",
			operation: "neg",
			args: []
		},
		0x76: {
			mnemonic: "fneg",
			operation: "neg",
			args: []
		},
		0x77: {
			mnemonic: "dneg",
			operation: "neg",
			args: []
		},
		0x78: {
			mnemonic: "ishl",
			operation: "shift_left",
			args: []
		},
		0x79: {
			mnemonic: "lshl",
			operation: "shift_left",
			args: []
		},
		0x7A: {
			mnemonic: "ishr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7B: {
			mnemonic: "lshr",
			operation: "arithmetic_shift_right",
			args: []
		},
		0x7C: {
			mnemonic: "iushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7D: {
			mnemonic: "lushr",
			operation: "logical_shift_right",
			args: []
		},
		0x7E: {
			mnemonic: "iand",
			operation: "and",
			args: []
		},
		0x7F: {
			mnemonic: "land",
			operation: "and",
			args: []
		},
		0x80: {
			mnemonic: "ior",
			operation: "or",
			args: []
		},
		0x81: {
			mnemonic: "lor",
			operation: "or",
			args: []
		},
		0x82: {
			mnemonic: "ixor",
			operation: "xor",
			args: []
		},
		0x83: {
			mnemonic: "lxor",
			operation: "xor",
			args: []
		},
		0x84: {
			mnemonic: "iinc",
			operation: "increment",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8(), iterator.read8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0x85: {
			mnemonic: "i2l",
			operation: "convert",
			args: []
		},
		0x86: {
			mnemonic: "i2f",
			operation: "convert",
			args: []
		},
		0x87: {
			mnemonic: "i2d",
			operation: "convert",
			args: []
		},
		0x88: {
			mnemonic: "l2i",
			operation: "convert",
			args: []
		},
		0x89: {
			mnemonic: "l2f",
			operation: "convert",
			args: []
		},
		0x8A: {
			mnemonic: "l2d",
			operation: "convert",
			args: []
		},
		0x8B: {
			mnemonic: "f2i",
			operation: "convert",
			args: []
		},
		0x8C: {
			mnemonic: "f2l",
			operation: "convert",
			args: []
		},
		0x8D: {
			mnemonic: "f2d",
			operation: "convert",
			args: []
		},
		0x8E: {
			mnemonic: "d2i",
			operation: "convert",
			args: []
		},
		0x8F: {
			mnemonic: "d2l",
			operation: "convert",
			args: []
		},
		0x90: {
			mnemonic: "d2f",
			operation: "convert",
			args: []
		},
		0x91: {
			mnemonic: "i2b",
			operation: "convert_to_boolean",
			args: []
		},
		0x92: {
			mnemonic: "i2c",
			operation: "convert",
			args: []
		},
		0x93: {
			mnemonic: "i2s",
			operation: "convert",
			args: []
		},
		0x94: {
			mnemonic: "lcmp",
			operation: "compare",
			args: []
		},
		0x95: {
			mnemonic: "fcmpl",
			operation: "compare",
			args: []
		},
		0x96: {
			mnemonic: "fcmpg",
			operation: "compare",
			args: []
		},
		0x97: {
			mnemonic: "dcmpl",
			operation: "compare",
			args: []
		},
		0x98: {
			mnemonic: "dcmpg",
			operation: "compare",
			args: []
		},
		0x99: {
			mnemonic: "ifeq",
			operation: "if_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9A: {
			mnemonic: "ifne",
			operation: "if_not_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9B: {
			mnemonic: "iflt",
			operation: "if_less_than_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9C: {
			mnemonic: "ifge",
			operation: "if_greater_than_or_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9D: {
			mnemonic: "ifgt",
			operation: "if_greater_than_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9E: {
			mnemonic: "ifle",
			operation: "if_less_than_or_equal_to_zero",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0x9F: {
			mnemonic: "if_icmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA0: {
			mnemonic: "if_icmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA1: {
			mnemonic: "if_icmplt",
			operation: "if_less_than",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA2: {
			mnemonic: "if_icmpge",
			operation: "if_greater_than_or_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA3: {
			mnemonic: "if_icmpgt",
			operation: "if_greater_than",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA4: {
			mnemonic: "if_icmple",
			operation: "if_less_than_or_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA5: {
			mnemonic: "if_acmpeq",
			operation: "if_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA6: {
			mnemonic: "if_acmpne",
			operation: "if_not_equal",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA7: {
			mnemonic: "goto",
			operation: "goto",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA8: {
			mnemonic: "jsr",
			operation: "jsr",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xA9: {
			mnemonic: "ret",
			operation: "ret",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xAA: {
			mnemonic: "tableswitch",
			operation: "tableswitch",
			args: function(iterator, constantPool, location) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var low = iterator.readU32();
				var high = iterator.readU32();
				var table = [];

				for(var n = 0; n < (low - high) + 1; i++) {
					table.push(iterator.readU32());
				}

				return [
					low,
					high,
					table
				];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1] + " " + args[2];
			}
		},
		0xAB: {
			mnemonic: "lookupswitch",
			operation: "lookupswitch",
			args: function(iterator, constantPool, location) {
				var default_offset;

				// there are 0-3 bytes of padding before default_offset
				for(var i = 0; i < 3; i++) {
					default_offset = iterator.readU8();

					// fewer than three bytes!
					if(default_offset !== 0) {
						break;
					}
				}

				if(default_offset === 0 || default_offset === undefined) {
					default_offset = iterator.readU32();
				}

				var keys = iterator.readU32();
				var table = {};

				for(var n = 0; n < keys; i++) {
					table[iterator.readU32()] = iterator.readU32();
				}

				return [table];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xAC: {
			mnemonic: "ireturn",
			operation: "return_value",
			args: []
		},
		0xAD: {
			mnemonic: "lreturn",
			operation: "return_value",
			args: []
		},
		0xAE: {
			mnemonic: "flreturn",
			operation: "return_value",
			args: []
		},
		0xAF: {
			mnemonic: "dreturn",
			operation: "return_value",
			args: []
		},
		0xB0: {
			mnemonic: "areturn",
			operation: "return_value",
			args: []
		},
		0xB1: {
			mnemonic: "return",
			operation: "return_void",
			args: []
		},
		0xB2: {
			mnemonic: "getstatic",
			operation: "get_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB3: {
			mnemonic: "putstatic",
			operation: "put_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB4: {
			mnemonic: "getfield",
			operation: "get_field",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + "; // " + constantPool.load(args[0]);
			}
		},
		0xB5: {
			mnemonic: "putfield",
			operation: "put_field",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB6: {
			mnemonic: "invokevirtual",
			operation: "invoke_virtual",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB7: {
			mnemonic: "invokespecial",
			operation: "invoke_special",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB8: {
			mnemonic: "invokestatic",
			operation: "invoke_static",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xB9: {
			mnemonic: "invokeinterface",
			operation: "invoke_interface",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16(), iterator.readU8(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var method = constantPool.load(args[0]);
				var numArgs = args[1];

				return this.mnemonic + " // " + method;
			}
		},
		0xBA: {
			mnemonic: "invokedynamic",
			operation: "invoke_dynamic",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xBB: {
			mnemonic: "new",
			operation: "new",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0] + " // " + constantPool.load(args[0]);
			}
		},
		0xBC: {
			mnemonic: "newarray",
			operation: "array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				var types = [];
				types[4] = "boolean";
				types[5] = "char";
				types[6] = "float";
				types[7] = "double";
				types[8] = "byte";
				types[9] = "short";
				types[10] = "int";
				types[11] = "long";

				return this.mnemonic + " " + types[args[0]];
			}
		},
		0xBD: {
			mnemonic: "anewarray",
			operation: "array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xBE: {
			mnemonic: "arraylength",
			operation: "array_length",
			args: []
		},
		0xBF: {
			mnemonic: "athrow",
			operation: "throw",
			args: []
		},
		0xC0: {
			mnemonic: "checkcast",
			operation: "check_cast",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xC1: {
			mnemonic: "instanceof",
			operation: "instance_of",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xC2: {
			mnemonic: "monitorenter",
			operation: "monitor_enter",
			args: []
		},
		0xC3: {
			mnemonic: "monitorexit",
			operation: "monitor_exit",
			args: []
		},
		0xC4: {
			mnemonic: "wide",
			operation: "wide",
			args: function(iterator, constantPool, location) {
				return [iterator.readU8(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0xC5: {
			mnemonic: "multianewarray",
			operation: "multi_dimensional_array_create",
			args: function(iterator, constantPool, location) {
				return [iterator.readU16(), iterator.readU8()];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0] + " " + args[1];
			}
		},
		0xC6: {
			mnemonic: "ifnull",
			operation: "if_null",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC7: {
			mnemonic: "ifnonnull",
			operation: "if_non_null",
			args: function(iterator, constantPool, location) {
				return [iterator.read16() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC8: {
			mnemonic: "goto_w",
			operation: "goto",
			args: function(iterator, constantPool, location) {
				return [iterator.read32() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " #" + args[0];
			}
		},
		0xC9: {
			mnemonic: "jsr_w",
			operation: "jsr",
			args: function(iterator, constantPool, location) {
				return [iterator.readU32() + location];
			},
			description: function(args, constantPool, location) {
				return this.mnemonic + " " + args[0];
			}
		},
		0xCA: {
			mnemonic: "breakpoint",
			operation: "nop",
			args: []
		},
		0xFE: {
			mnemonic: "impdep1",
			operation: "nop",
			args: []
		},
		0xFF: {
			mnemonic: "impdep2",
			operation: "nop",
			args: []
		}
	};

	this._createArgFunction = function(code, args, constantPool) {
		return function() {
			return _bytecode_mapping[code].args(args, constantPool);
		};
	};

	this._createDefaultArgFunction = function(code) {
		return function() {
			return _bytecode_mapping[code].args;
		};
	};

	this.parse = function(iterator, constantPool) {
		var instructions = [];

		while(iterator.hasNext()) {
			var location = iterator.getLocation();
			var code = iterator.readU8();

			if(!_bytecode_mapping[code]) {
				console.warn("No bytecode mapping for " + code.toString(16) + " mapping to nop");

				_bytecode_mapping[code] = {
					mnemonic: "undefined " + code.toString(16),
					operation: "nop",
					args: []
				};
			}

			var args = _bytecode_mapping[code].args;

			if(_bytecode_mapping[code].args instanceof Function) {
				args = _bytecode_mapping[code].args(iterator, constantPool, location);
			}

			var description = _bytecode_mapping[code].mnemonic;

			if(_bytecode_mapping[code].description instanceof Function) {
				// read any values from the iterator as necessary
				description = _bytecode_mapping[code].description(args, constantPool, location);
			}

			var byteCode = new jjvm.types.ByteCode();
			byteCode.setMnemonic(_bytecode_mapping[code].mnemonic);
			byteCode.setArgs(args);
			byteCode.setLocation(location);
			byteCode.setDescription(description);
			byteCode.setOperation(_bytecode_mapping[code].operation);

			instructions.push(byteCode);
		}

		return instructions;
	};

	this.toString = function() {
		return "ByteCodeParser";
	};
};

jjvm.compiler.ClassDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var constantPoolParser = new jjvm.compiler.ConstantPoolParser();
	var fieldDefinitionParser = new jjvm.compiler.FieldDefinitionParser();
	var methodDefinitionParser = new jjvm.compiler.MethodDefinitionParser();
	var innerClassesParser = new jjvm.compiler.InnerClassesParser();
	var enclosingMethodParser = new jjvm.compiler.EnclosingMethodParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator) {
		var classDef = new jjvm.types.ClassDefinition();
		classDef.setMinorVersion(iterator.readU16());
		classDef.setMajorVersion(iterator.readU16());

		var constantPool = constantPoolParser.parse(iterator);
		classDef.setConstantPool(constantPool);

		var accessFlags = iterator.readU16();

		if(accessFlags & 0x0001) {
			classDef.setVisibility("public");
		}

		classDef.setIsFinal(accessFlags & 0x0010);
		classDef.setIsSuper(accessFlags & 0x0020);
		classDef.setIsInterface(accessFlags & 0x0200);
		classDef.setIsAbstract(accessFlags & 0x0400);
		classDef.setName(this._loadClassName(iterator, constantPool));
		classDef.setParent(this._loadClassName(iterator, constantPool));

		var interfaceCount = iterator.readU16();

		for(var i = 0; i < interfaceCount; i++) {
			classDef.addInterface(this._loadClassName(iterator, constantPool));
		}

		this.parseFields(iterator, classDef, constantPool);
		this.parseMethods(iterator, classDef, constantPool);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("class " + name + " has " + attributeCount + " attribtues");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Class " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onSourceFile = function(iterator, constantPool) {
			var sourceFileName = constantPool.load(iterator.readU16()).getValue();
			classDef.setSourceFile(sourceFileName);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Deprecated", iterator);
			classDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			blockParser.readEmptyBlock("Synthetic", iterator);
			classDef.setSynthetic(true);
		};
		attributesParser.onInnerClasses = function(iterator, constantPool) {
			blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, innerClassesParser);
		};
		attributesParser.onEnclosingMethod = function(iterator, constantPool) {
			var enclosingMethod = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), enclosingMethodParser);
			classDef.setEnclosingMethod(enclosingMethod);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return classDef;
	};

	this.parseFields = function(iterator, classDef, constantPool) {
		var fieldCount = iterator.readU16();

		for(var i = 0; i < fieldCount; i++) {
			classDef.addField(fieldDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.parseMethods = function(iterator, classDef, constantPool) {
		var methodCount = iterator.readU16();

		for(var i = 0; i < methodCount; i++) {
			classDef.addMethod(methodDefinitionParser.parse(iterator, constantPool, classDef));
		}
	};

	this.toString = function() {
		return "ClassDefinitionParser";
	};
};

jjvm.compiler.Compiler = function() {
	var classDefinitionParser = new jjvm.compiler.ClassDefinitionParser();

	this.compileSystemBytes = function(buffer) {
		this._compileBytes(buffer, true);
	};

	this.compileBytes = function(buffer) {
		this._compileBytes(buffer);
	};

	this._compileBytes = function(buffer, isSystemClass) {
		try {
			if(!(buffer instanceof Uint8Array)) {
				buffer = new Uint8Array(buffer);				
			}

			var iterator = new jjvm.core.ByteIterator(buffer);

			if(!this._isClassFile(iterator)) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["No bytecode found"]);

				return;
			}

			var classDef = classDefinitionParser.parse(iterator);

			if(isSystemClass) {
				jjvm.core.SystemClassLoader.addClassDefinition(classDef);

				// jjvm.core.ClassCache.store(classDef);
			} else {
				jjvm.core.ClassLoader.addClassDefinition(classDef);
			}

			jjvm.core.NotificationCentre.dispatch(this, "onClassDefined", [classDef.getData(), isSystemClass]);
			jjvm.core.NotificationCentre.dispatch(this, "onCompileSuccess", [this]);
		} catch(error) {
			console.error(error);

			jjvm.core.NotificationCentre.dispatch(this, "onCompileError", [error]);
		}
	};

	this._isClassFile = function(iterator) {
		var value = iterator.readU32();

		return value == 0xCAFEBABE;
	};
};

jjvm.compiler.ConstantPoolParser = function() {

	this.parse = function(iterator) {
		var poolSize = iterator.readU16();
		var pool = new jjvm.types.ConstantPool();
		var table = new jjvm.core.ByteIterator(iterator.getIterable().subarray(10));

		var nameAndTypeValues = [];
		var classValues = [];
		var methodValues = [];
		var fieldValues = [];
		var stringReferenceValues = [];

		// pass 1, populate all primitive values
		for(var i = 1; i < poolSize; i++) {
			var tag = iterator.next();
			var value;

			if(tag == 0x01) {
				value = this._createStringValue(iterator, pool);
			} else if(tag == 0x03) {
				value = this._createIntValue(iterator, pool);
			} else if(tag == 0x04) {
				value =this._createFloatValue(iterator, pool);
			} else if(tag == 0x05) {
				value = this._createLongValue(iterator, pool);
			} else if(tag == 0x06) {
				value = this._createDoubleValue(iterator, pool);
			} else if(tag == 0x07) {
				value = this._createClassValue(iterator, pool);

				classValues.push(value);
			} else if(tag == 0x08) {
				value = this._createStringReferenceValue(iterator, pool);

				stringReferenceValues.push(value);
			} else if(tag == 0x09) {
				value = this._createFieldValue(iterator, pool);

				fieldValues.push(value);
			} else if(tag == 0x0A || tag == 0x0B) {
				value = this._createMethodValue(iterator, pool);

				methodValues.push(value);
			} else if(tag == 0x0C) {
				value = this._createNameAndTypeValue(iterator, pool);

				nameAndTypeValues.push(value);
			} else {
				throw "ConstantPoolParser cannot parse " + tag;
			}

			value.setIndex(i);

			pool.store(i, value);

			if(tag == 0x05 || tag == 0x06) {
				// longs and doubles take two slots in the table
				i++;
			}
		}

		// pass 2, populate all complex values
		_.each(nameAndTypeValues, _.bind(function(nameAndTypeValue) {
			this._populateNameAndTypeValue(nameAndTypeValue, pool);
		}, this));

		_.each(classValues, _.bind(function(classValue) {
			this._populateClassValue(classValue, pool);
		}, this));

		_.each(methodValues, _.bind(function(methodValue) {
			this._populateMethodValue(methodValue, pool);
		}, this));

		_.each(fieldValues, _.bind(function(fieldValue) {
			this._populateFieldValue(fieldValue, pool);
		}, this));

		_.each(stringReferenceValues, _.bind(function(stringReferenceValue) {
			this._populateStringReferenceValue(stringReferenceValue, pool);
		}, this));

		return pool;
	};

	this._createStringValue = function(iterator) {
		var length = iterator.readU16();
		var stringValue = "";

		for(var n = 0; n < length; n++) {
			stringValue += String.fromCharCode(parseInt(iterator.next(), 10));
		}

		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.S);
		value.setValue(stringValue);

		return value;
	};

	this._createIntValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.I);
		value.setValue(iterator.read32());

		return value;
	};

	this._createFloatValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.F);
		value.setValue(iterator.readFloat());

		return value;
	};

	this._createLongValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.J);
		value.setValue(iterator.read64());

		return value;
	};

	this._createDoubleValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolPrimitiveValue();
		value.setType(jjvm.types.ConstantPoolPrimitiveValue.types.D);
		value.setValue(iterator.readDouble());

		return value;
	};

	this._createClassValue = function(iterator) {
		var value = new jjvm.types.ConstantPoolClassValue();
		value.setClassIndex(iterator.readU16());

		return value;
	};

	this._populateClassValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();

		value.setValue(className);
	};

	this._createStringReferenceValue = function(iterator) {
		var stringIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolStringReferenceValue();
		value.setStringIndex(stringIndex);

		return value;
	};

	this._populateStringReferenceValue = function(value, constantPool) {
		var string = constantPool.load(value.getStringIndex()).getValue();

		value.setValue(string);
	};

	this._createFieldValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolFieldValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateFieldValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setFieldName(nameAndType.getName());
		value.setFieldType(nameAndType.getNameType());
	};

	this._createMethodValue = function(iterator) {
		var classIndex = iterator.readU16();
		var nameAndTypeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolMethodValue();
		value.setClassIndex(classIndex);
		value.setNameAndTypeIndex(nameAndTypeIndex);

		return value;
	};

	this._populateMethodValue = function(value, constantPool) {
		var className = constantPool.load(value.getClassIndex()).getValue();
		var nameAndType = constantPool.load(value.getNameAndTypeIndex());

		value.setClassName(className);
		value.setMethodName(nameAndType.getName());
		value.setMethodType(nameAndType.getNameType());
	};

	this._createNameAndTypeValue = function(iterator) {
		var nameIndex = iterator.readU16();
		var typeIndex = iterator.readU16();

		var value = new jjvm.types.ConstantPoolNameAndTypeValue();
		value.setNameIndex(nameIndex);
		value.setNameTypeIndex(typeIndex);

		return value;
	};

	this._populateNameAndTypeValue = function(value, constantPool) {
		var name = constantPool.load(value.getNameIndex()).getValue();
		var type = constantPool.load(value.getNameTypeIndex()).getValue();

		value.setName(name);
		value.setNameType(type);
	};

	this.toString = function() {
		return "ConstantPoolParser";
	};
};

jjvm.compiler.EnclosingMethodParser = function() {

	this.parse = function(iterator, constantsPool) {
		var classEntry = this._loadEntry(iterator, constantsPool);
		var methodEntry = this._loadEntry(iterator, constantsPool);

		var enclosingMethod = new jjvm.types.EnclosingMethod(classEntry, methodEntry);
		enclosingMethod.setClassName(classEntry);
		enclosingMethod.setMethodName(methodEntry);

		return enclosingMethod;
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "EnclosingMethodParser";
	};
};

jjvm.compiler.ExceptionTableParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var table = [];

		// default catch type is all exceptions
		var type = {
			getClassDef: function() {
				return jjvm.core.ClassLoader.loadClass("java.lang.Throwable");
			}
		};

		while(iterator.hasNext()) {
			var from = iterator.readU16();
			var to = iterator.readU16();
			var target = iterator.readU16();
			var typeIndex = iterator.readU16();

			if(typeIndex !== 0) {
				// catch only specific type
				type = constantsPool.load(typeIndex);
			}

			table.push({
				from: from,
				to: to,
				target: target,
				type: type
			});
		}

		if(table.length === 0) {
			return null;
		}

		return new jjvm.types.ExceptionTable(table);
	};

	this.toString = function() {
		return "ExceptionTableParser";
	};
};

jjvm.compiler.FieldDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var accessFlags = iterator.readU16();
		
		var fieldDef = new jjvm.types.FieldDefinition();
		fieldDef.setName(this._loadString(iterator, constantPool));
		fieldDef.setType(this._loadClassName(iterator, constantPool));

		if(accessFlags & 0x0001) {
			fieldDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			fieldDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			fieldDef.setVisibility("protected");
		}

		fieldDef.setIsStatic(accessFlags & 0x0008);
		fieldDef.setIsFinal(accessFlags & 0x0010);
		fieldDef.setIsVolatile(accessFlags & 0x0040);
		fieldDef.setIsTransient(accessFlags & 0x0080);

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("field " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Field " + name + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onConstantValue = function(iterator, constantPool) {
			var value = constantPool.load(iterator.readU16());
			fieldDef.setConstantValue(value);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onSynthetic", iterator);
			fieldDef.setSynthetic(true);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			//blockParser.readEmptyBlock("onDeprecated", iterator);
			fieldDef.setDeprecated(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return fieldDef;
	};

	this.toString = function() {
		return "FieldDefinitionParser";
	};
};
jjvm.compiler.InnerClassesParser = function() {
	
	this.parse = function(iterator, constantsPool) {
		var innerClasses = [];

		while(iterator.hasNext()) {
			var innerClass = this._loadEntry(iterator, constantsPool);
			var outerClass = this._loadEntry(iterator, constantsPool);
			var innerClassName = this._loadEntry(iterator, constantsPool);

			var accessFlags = iterator.readU16();

			var isPublic = accessFlags & 0x0001 ? true : false;
			var isPrivate = accessFlags & 0x0002 ? true : false;
			var isProtected = accessFlags & 0x0004 ? true : false;
			var isStatic = accessFlags & 0x0008 ? true : false;
			var isFinal = accessFlags & 0x0010 ? true : false;
			var isInterface = accessFlags & 0x0200 ? true : false;
			var isAbstract = accessFlags & 0x0400 ? true : false;

			innerClasses.push({
				innerClass: innerClass,
				outerClass: outerClass,
				innerClassName: innerClassName,
				isPublic: isPublic,
				isPrivate: isPrivate,
				isProtected: isProtected,
				isStatic: isStatic,
				isFinal: isFinal,
				isInterface: isInterface,
				isAbstract: isAbstract
			});
		}

		//console.dir(innerClasses);
	};

	this._loadEntry = function(iterator, constantsPool) {
		var index = iterator.readU16();

		if(index !== 0) {
			return constantsPool.load(index);
		}
	};

	this.toString = function() {
		return "InnerClassesParser";
	};
};

jjvm.compiler.LineNumberTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		var table = [];

		while(iterator.hasNext()) {
			table[iterator.readU16()] = iterator.readU16();
		}

		return new jjvm.types.LineNumberTable(table);
	};

	this.toString = function() {
		return "LineNumberTableParser";
	};
};

jjvm.compiler.MethodDefinitionParser = function() {
	_.extend(this, new jjvm.compiler.Parser());

	var byteCodeParser = new jjvm.compiler.ByteCodeParser();
	var exceptionTableParser = new jjvm.compiler.ExceptionTableParser();
	var lineNumberTableParser = new jjvm.compiler.LineNumberTableParser();
	var stackMapTableParser = new jjvm.compiler.StackMapTableParser();
	var blockParser = new jjvm.compiler.BlockParser();
	var attributesParser = new jjvm.compiler.AttributesParser();
	var codeAttributesParser = new jjvm.compiler.AttributesParser();

	this.parse = function(iterator, constantPool, classDef) {
		var methodDef = new jjvm.types.MethodDefinition();

		var accessFlags = iterator.readU16();
		var name = constantPool.load(iterator.readU16()).getValue();
		var descriptor = constantPool.load(iterator.readU16());
		var type = descriptor.getValue();

		var typeRegex = /\((.*)?\)(\[+)?(L[a-zA-Z\/$]+;|Z|B|C|S|I|J|F|D|V)/;
		var match = type.match(typeRegex);

		var returnsArray = match[2] ? true : false;
		var returns = match[3];

		if(returns.length > 1) {
			// returns an object type, remove the L and ;
			returns = returns.substring(1, returns.length - 1).replace(/\//g, ".");
		}

		if(jjvm.types.Primitives.jvmTypesToPrimitive[returns]) {
			// convert I to int, Z to boolean, etc
			returns = jjvm.types.Primitives.jvmTypesToPrimitive[returns];
		}

		if(returnsArray) {
			returns += "[]";
		}

		var args = [];

		if(match[1]) {
			args = jjvm.Util.parseArgs(match[1]);
		}

		
		methodDef.setName(name);
		methodDef.setArgs(args);
		methodDef.setReturns(returns);
		methodDef.setSignature(methodDef.getName() + type);
		methodDef.setClassDef(classDef);

		if(accessFlags & 0x0001) {
			methodDef.setVisibility("public");
		}

		if(accessFlags & 0x0002) {
			methodDef.setVisibility("private");
		}

		if(accessFlags & 0x0004) {
			methodDef.setVisibility("protected");
		}

		if(accessFlags & 0x0008) {
			methodDef.setIsStatic(true);
		}
		
		if(accessFlags & 0x0010) {
			methodDef.setIsFinal(true);
		}
		
		if(accessFlags & 0x0020) {
			methodDef.setIsSynchronized(true);
		}

		if(jjvm.nativeMethods[classDef.getName()] && jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]) {
			// we've overriden the method implementation
			methodDef.setImplementation(jjvm.nativeMethods[classDef.getName()][methodDef.getName() + type]);
		}

		if(accessFlags & 0x0100) {
			methodDef.setIsNative(true);

			if(!methodDef.getImplementation()) {
				// method marked as native but no implementation supplied - make a fuss
				jjvm.core.NotificationCentre.dispatch(this, "onCompileError", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]"]);
				//throw "Method " + methodDef.getName() + " on class " + classDef.getName() + " is marked as native - you should provide an implementation in native.js under jjvm.nativeMethods[\"" + classDef.getName() + "\"][\"" + methodDef.getName() + type + "\"]";
			}
		}

		if(accessFlags & 0x0400) {
			methodDef.setIsAbstract(true);
		}

		if(accessFlags & 0x0800) {
			methodDef.setIsStrict(true);
		}

		attributesParser.onAttributeCount = function(attributeCount) {
			//console.info("method " + name + " has " + attributeCount + " attributes");
		};
		attributesParser.onUnrecognisedAttribute = function(attributeName) {
			jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName]);
		};
		attributesParser.onCode = function(iterator, constantPool) {
			methodDef.setMaxStackSize(iterator.readU16());
			methodDef.setMaxLocalVariables(iterator.readU16());

			// read bytecode instructions
			methodDef.setInstructions(blockParser.parseBlock(iterator, constantPool, iterator.readU32(), byteCodeParser));

			// read exception table
			methodDef.setExceptionTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 8, exceptionTableParser));

			codeAttributesParser.onAttributeCount = function(attributeCount) {
				//console.info("Code block has " + attributeCount + " attributes");
			};
			codeAttributesParser.onUnrecognisedAttribute = function(attributeName) {
				jjvm.core.NotificationCentre.dispatch(this, "onCompileWarning", ["Method " + methodDef.getName() + " on class " + classDef.getName() + " has unrecognised attribute " + attributeName + " on code block"]);
			};
			codeAttributesParser.onLineNumberTable = function() {
				methodDef.setLineNumberTable(blockParser.parseBlock(iterator, constantPool, iterator.readU16() * 4, lineNumberTableParser));
			};
			codeAttributesParser.onStackMapTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.onLocalVariableTable = function(iterator, constantPool) {
				// can be variable length
				//var statckMapTable = blockParser.parseBlock(iterator, constantPool, iterator.readU16(), stackMapTableParser);
				//methodDef.setStackMapTable(statckMapTable);
			};
			codeAttributesParser.parse(iterator, constantPool);
		};
		attributesParser.onExceptions = function(iterator, constantPool) {
			var numExceptions = iterator.readU16();
			var exceptions = [];

			for(var m = 0; m < numExceptions; m++) {
				exceptions.push(constantPool.load(iterator.readU16()));
			}

			methodDef.setThrows(exceptions);
		};
		attributesParser.onDeprecated = function(iterator, constantPool) {
			methodDef.setDeprecated(true);
		};
		attributesParser.onSynthetic = function(iterator, constantPool) {
			methodDef.setSynthetic(true);
		};
		attributesParser.onSignature = function(iterator, constantPool) {
			
		};
		attributesParser.parse(iterator, constantPool);

		return methodDef;
	};

	this.toString = function() {
		return "MethodDefinitionParser";
	};
};

jjvm.compiler.Parser = function() {

	this._loadClassName = function(iterator, constantPool) {
		var string = this._loadString(iterator, constantPool);

		if(jjvm.types.Primitives.jvmTypesToPrimitive[string]) {
			return jjvm.types.Primitives.jvmTypesToPrimitive[string];
		}

		if(string) {
			string = string.replace(/\//g, ".");

			if(_.string.startsWith(string, "L") && _.string.endsWith(string, ";")) {
				string = string.substring(1, string.length - 1);
			}

			return string;
		}

		return undefined;
	};

	this._loadString = function(iterator, constantPool) {
		var index = iterator.readU16();

		if(index > 0) {
			return constantPool.load(index).getValue();
		}

		return undefined;
	};
};

jjvm.compiler.StackMapTableParser = function() {

	this.parse = function(iterator, constantsPool) {
		// not implemented yet...
		while(iterator.hasNext()) {
			
		}
	};

	this.toString = function() {
		return "StackMapTableParser";
	};
};

jjvm.core.NotificationCentre = {
	_listeners: {},

	register: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			jjvm.core.NotificationCentre._listeners[eventType] = [];
		}

		jjvm.core.NotificationCentre._listeners[eventType].push(listener);
	},

	deRegister: function(eventType, listener) {
		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		for(var i = 0; i < jjvm.core.NotificationCentre._listeners[eventType].length; i++) {
			if(jjvm.core.NotificationCentre._listeners[eventType][i] == listener) {
				jjvm.core.NotificationCentre._listeners[eventType].splice(i, 1);
				i--;
			}
		}
	},

	dispatch: function(sender, eventType, args) {
		if(self.postMessage) {
			self.postMessage({
				action: "postNotification", 
				args: JSON.stringify([eventType, args])
			});
		}

		if(jjvm.core.NotificationCentre._listeners[eventType] === undefined) {
			return;
		}

		if(args === undefined) {
			args = [];
		}

		if(!_.isArray(args)) {
			throw "Please only pass arrays to jjvm.core.NotificationCentre#dispatch as args";
		}

		var observerArgs = [sender];
		observerArgs = observerArgs.concat(args);

		// copy the array in case the listener deregisters itself as part of the callback
		var observers = jjvm.core.NotificationCentre._listeners[eventType].concat([]);

		for(var i = 0; i < observers.length; i++) {
			observers[i].apply(observers[i], observerArgs);
		}
	}
};

console = {
	debug: function(string) {
		self.postMessage({
			action: "consoleDebug",
			args: JSON.stringify([string])
		});
	},

	info: function(string) {
		self.postMessage({
			action: "consoleInfo",
			args: JSON.stringify([string])
		});
	},

	warn: function(string) {
		self.postMessage({
			action: "consoleWarn",
			args: JSON.stringify([string])
		});
	},

	error: function(string) {
		if(string.stack) {
			_.each(string.stack.split("\n"), function(line) {
				self.postMessage({
					action: "consoleError",
					args: JSON.stringify([line])
				});
			});
		} else if(_.isString(string)) {
			self.postMessage({
				action: "consoleError",
				args: JSON.stringify([string])
			});
		}
	}
};

self.addEventListener("message", function(event) {
	var actions = {
		"compile": function(bytes, isSystemClass) {
			var compiler = new jjvm.compiler.Compiler();
			compiler.compileBytes(bytes);
		},
		"run": function(args) {
			// find something to execute
			var mainClass;
			var mainMethod;

			_.each(jjvm.core.ClassLoader.getClassDefinitions(), function(classDef) {
				_.each(classDef.getMethods(), function(methodDef) {
					if(methodDef.getName() == "main" && methodDef.isStatic() && methodDef.getReturns() == "void") {
						mainClass = classDef;
						mainMethod = methodDef;
					}
				});
			});

			if(!mainMethod) {
				// nothing to execute, abort!
				console.warn("No main method present.");

				return;
			}

			var stringArgs = [];

			_.each(args, function(arg) {
				arg = _.str.trim(arg);

				stringArgs.push(jjvm.Util.createStringRef(arg));
			});

			try {
				console.info("Executing...");
				var thread = new jjvm.runtime.Thread(new jjvm.runtime.Frame(mainClass, mainMethod, args));
				thread.register("onExecutionComplete", function() {
					thread.deRegister("onExecutionComplete", this);

					jjvm.runtime.ThreadPool.reap();
				});
				jjvm.core.NotificationCentre.dispatch(this, "onExecutionStarted");

				thread.run();
			} catch(error) {
				console.error(error);
				console.error(error.stack);
			}
		},
		"setBreakpoint": function(className, methodSignature, instructionIndex, setBreakpoint) {
			var classDef = jjvm.core.ClassLoader.loadClass(className);

			_.each(classDef.getMethods(), function(method) {
				if(method.getSignature() == methodSignature) {
					_.each(method.getInstructions(), function(instruction) {
						if(instruction.getLocation() == instructionIndex) {
							instruction.setBreakpoint(setBreakpoint);

							console.debug("Breakpoint " + (setBreakpoint ? "" : "un") + "set in " + className + "#" + methodSignature + " at location " + instructionIndex);
							jjvm.core.NotificationCentre.dispatch(this, "onBreakpointSet", [className, methodSignature, instructionIndex, setBreakpoint]);
						}
					});
				}
			});
		},
		"resumeExecution": function() {
			jjvm.core.NotificationCentre.dispatch(this, "onResumeExecution");
		},
		"suspendExecution": function() {
			jjvm.core.NotificationCentre.dispatch(this, "onSuspendExecution");
		},
		"stepOver": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onStepOver");
				}
			});
		},
		"stepInto": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onStepInto");
				}
			});
		},
		"dropToFrame": function(threadName) {
			_.each(jjvm.runtime.ThreadPool.threads, function(thread) {
				if(thread.toString() == threadName) {
					thread.dispatch("onDropToFrame");
				}
			});
		},
		"getThreads": function() {
			self.postMessage({
				action: "getThreads",
				args: JSON.stringify([jjvm.runtime.ThreadPool.getData()])
			});
		}
	};

	if(actions[event.data.action]) {
		actions[event.data.action].apply(actions[event.data.action], event.data.args);
	} else {
		console.error("Unknown action from main thread " + event.data.action);
	}
}, false);

// set up System.out & System.err
var system = jjvm.core.ClassLoader.loadClass("java.lang.System");
var voidClass = jjvm.core.ClassLoader.loadClass("java.lang.Void");
system.setStaticField("in", new jjvm.runtime.ObjectReference(voidClass));
system.setStaticField("out", new jjvm.runtime.ObjectReference(voidClass));
system.setStaticField("err", new jjvm.runtime.ObjectReference(voidClass));