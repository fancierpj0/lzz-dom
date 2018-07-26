//IE9，及其以上
const ABOVE_IE9 = "getComputedStyle" in window;

//->listToArray:把类数组集合转换为数组
function listToArray(likeAry) {
  if (ABOVE_IE9) {
    return Array.prototype.slice.call(likeAry, 0);
  }
  var ary = [];
  for (var i = 0; i < likeAry.length; i++) {
    ary[ary.length] = likeAry[i];
  }
  return ary;
}

//->formatJSON:把JSON格式字符串转换为JSON格式对象
function formatJSON(jsonStr) {
  return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
}

//->offset:获取页面中任意元素距离BODY的偏移
function offset(curEle) {
  var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
  while (par) {
    // IE8的offsetLeft/Top不会包括边框
    if (navigator.userAgent.indexOf("MSIE 8") === -1) {
      disLeft += par.clientLeft;
      disTop += par.clientTop;
    }
    disLeft += par.offsetLeft;
    disTop += par.offsetTop;
    par = par.offsetParent;
  }
  return {left: disLeft, top: disTop};
}

//->win:操作浏览器的盒子模型信息
function win(attr, value) {
  if (typeof value === "undefined") {
    return document.documentElement[attr] || document.body[attr];
  }
  document.documentElement[attr] = value;
  document.body[attr] = value;
}

//->children:获取所有的元素子节点
//tagName不传表示获取所有子元素节点
function children(curEle, tagName) {
  var ary = [];
  //IE9以下不支持.children
  if (!ABOVE_IE9) {
    var nodeList = curEle.childNodes;
    for (var i = 0, len = nodeList.length; i < len; i++) {
      var curNode = nodeList[i];
      curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
    }
    nodeList = null;
  } else {
    ary = listToArray(curEle.children);
  }
  //如果为undefined说明是返回所有子元素节点
  if (typeof tagName === "string") {
    for (var k = 0; k < ary.length; k++) {
      var curEleNode = ary[k];
      if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
        ary.splice(k, 1);
        k--;
      }
    }
  }
  return ary;
}


//->prev:获取上一个哥哥元素节点
//->首先获取当前元素的上一个哥哥节点,判断是否为元素节点(而不是文本节点注释节点什么的),不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止,如果没有哥哥元素节点,返回null即可
function prev(curEle) {
  if (ABOVE_IE9) {
    return curEle.previousElementSibling;
  }
  var pre = curEle.previousSibling;
  while (pre && pre.nodeType !== 1) {
    pre = pre.previousSibling;
  }
  return pre;
}

//->next:获取下一个弟弟元素节点
function next(curEle) {
  if (ABOVE_IE9) {
    return curEle.nextElementSibling;
  }
  var nex = curEle.nextSibling;
  while (nex && nex.nodeType !== 1) {
    nex = nex.nextSibling;
  }
  return nex;
}

//->prevAll:获取所有的哥哥元素节点
//最大的哥哥放最前面
function prevAll(curEle) {
  var ary = [];
  var pre = prev(curEle);
  while (pre) {
    ary.unshift(pre);
    pre = prev(pre);
  }
  return ary;
}

//->nextAll:获取所有的弟弟元素节点
//最小的弟弟放最后面
function nextAll(curEle) {
  var ary = [];
  var nex = next(curEle);
  while (nex) {
    ary.push(nex);
    nex = next(nex);
  }
  return ary;
}

//->sibling:获取相邻的两个元素节点
//如果左边或则右边没有则为null
function sibling(curEle) {
  var pre = prev(curEle);
  var nex = next(curEle);
  var ary = [];
  pre ? ary.push(pre) : null;
  nex ? ary.push(nex) : null;
  return ary;
}

//->siblings:获取所有的兄弟元素节点
//从大哥到小弟排列
function siblings(curEle) {
  return prevAll(curEle).concat(nextAll(curEle));
}

//->index:获取当前元素的索引
function index(curEle) {
  return prevAll(curEle).length;
}

//->firstChild:获取第一个元素子节点
function firstChild(curEle) {
  var chs = children(curEle);
  return chs.length > 0 ? chs[0] : null;
}

//->lastChild:获取最后一个元素子节点
function lastChild(curEle) {
  var chs = children(curEle);
  return chs.length > 0 ? chs[chs.length - 1] : null;
}

//->append:向指定容器的末尾追加元素
function append(newEle, container) {
  container.appendChild(newEle);
}

//->prepend:向指定容器的开头追加元素
//->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有,就放在末尾即可
function prepend(newEle, container) {
  var fir = firstChild(container);
  if (fir) {
    container.insertBefore(newEle, fir);
    return;
  }
  container.appendChild(newEle);
}

//->insertBefore:把新元素(newEle)追加到指定元素(oldEle)的前面
function insertBefore(newEle, oldEle) {
  oldEle.parentNode.insertBefore(newEle, oldEle);
}

//->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
//->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在,也就是当前元素已经是最后一个了,我们把新的元素放在最末尾即可
function insertAfter(newEle, oldEle) {
  var nex = next(oldEle);
  if (nex) {
    oldEle.parentNode.insertBefore(newEle, nex);
    return;
  }
  oldEle.parentNode.appendChild(newEle);
}


//->hasClass:验证当前元素中是否包含className这个样式类名
function hasClass(curEle, className) {
  //(^| +)xx( +|$) 以xx类名开头结尾或则只是类名字符串中间的组成部分之一
  var reg = new RegExp("(^| +)" + className + "( +|$)");
  return reg.test(curEle.className);
}

//->addClass:给元素增加样式类名
//支持这样同时添加 addClass(el,'a b') a和b两个类名
function addClass(curEle, className) {
  //去掉首尾的空格，'a b'会被分为两个类名
  var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
  for (var i = 0, len = ary.length; i < len; i++) {
    var curName = ary[i];
    if (!hasClass(curEle, curName)) {
      curEle.className += " " + curName;
    }
  }
}

//->removeClass:给元素移除样式类名
//同样支持同时去除多个类名 removeClass(el,'a b')
function removeClass(curEle, className) {
  var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
  for (var i = 0, len = ary.length; i < len; i++) {
    var curName = ary[i];
    if (hasClass(curEle, curName)) {
      var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
      curEle.className = curEle.className.replace(reg, " ");
    }
  }
}

//->getElementsByClass:通过元素的样式类名获取一组元素集合
function getElementsByClass(strClass, context) {
  context = context || document;
  if (ABOVE_IE9) {
    return listToArray(context.getElementsByClassName(strClass));
  }
  //->IE6~8
  var ary = [], strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
  var nodeList = context.getElementsByTagName("*");
  for (var i = 0, len = nodeList.length; i < len; i++) {
    var curNode = nodeList[i];
    var isOk = true;
    for (var k = 0; k < strClassAry.length; k++) {
      var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
      if (!reg.test(curNode.className)) {
        isOk = false;
        break;
      }
    }
    if (isOk) {
      ary[ary.length] = curNode;
    }
  }
  return ary;
}

//->getCss:获取元素的样式值
//会去掉单位
//只支持这样 getCss.apply(curEle, ary)
function getCss(attr) {
  var val = null, reg = null;
  if (ABOVE_IE9) {
    val = window.getComputedStyle(this, null)[attr];
  } else {
    if (attr === "opacity") {
      val = currentStyle["filter"];
      reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
      val = reg.test(val) ? reg.exec(val)[1] / 100
        //如果没有给IE中的不透明度赋值，则上边的正则会为false
        //而此时我们应该将1作为返回值(opacity:1)
        : 1;
    } else {
      val = currentStyle[attr];
    }
  }
  reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
  return reg.test(val) ? parseFloat(val) : val;
}

//->setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
function setCss(attr, value) {
  if (attr === "float") {
    this["style"]["cssFloat"] = value;
    this["style"]["styleFloat"] = value;
    return;
  }
  if (attr === "opacity") {
    this["style"]["opacity"] = value;
    this["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
    return;
  }
  var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
  if (reg.test(attr)) {
    if (!isNaN(value)) {
      value += "px";
    }
  }
  this["style"][attr] = value;
}

//->setGroupCss:给当前元素批量的设置样式属性值
function setGroupCss(options) {
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      setCss.call(this, key, options[key]);
    }
  }
}

//->css:此方法实现了获取、单独设置、批量设置元素的样式值
//css(el,attr[,value])||css(el,{top:10,left:20})
function css(curEle) {
  var argTwo = arguments[1], ary = Array.prototype.slice.call(arguments, 1);
  if (typeof argTwo === "string") {
    if (!arguments[2]) {
      return getCss.apply(curEle, ary);
    }
    setCss.apply(curEle, ary);
  }
  argTwo = argTwo || 0;
  //说明是批量设置css属性
  if (argTwo.toString() === "[object Object]") {
    setGroupCss.apply(curEle, ary);
  }
}

//->把外界需要使用的方法暴露给utils
export default {
  win: win,
  offset: offset,
  listToArray: listToArray,
  formatJSON: formatJSON,
  children: children,
  prev: prev,
  next: next,
  prevAll: prevAll,
  nextAll: nextAll,
  sibling: sibling,
  siblings: siblings,
  index: index,
  firstChild: firstChild,
  lastChild: lastChild,
  append: append,
  prepend: prepend,
  insertBefore: insertBefore,
  insertAfter: insertAfter,
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  getElementsByClass: getElementsByClass,
  css: css
}

// - offsetParent的默认值(没有定位时)为body，定位为relative的元素也有offsetParent，规则同绝对定位的元素
