webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(24);
var hide = __webpack_require__(13);
var redefine = __webpack_require__(14);
var ctx = __webpack_require__(20);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(69)('wks');
var uid = __webpack_require__(38);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var IE8_DOM_DEFINE = __webpack_require__(130);
var toPrimitive = __webpack_require__(25);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(27);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(26);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(37);
module.exports = __webpack_require__(7) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(13);
var has = __webpack_require__(12);
var SRC = __webpack_require__(38)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(24).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var fails = __webpack_require__(3);
var defined = __webpack_require__(26);
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(59);
var defined = __webpack_require__(26);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(60);
var createDesc = __webpack_require__(37);
var toIObject = __webpack_require__(16);
var toPrimitive = __webpack_require__(25);
var has = __webpack_require__(12);
var IE8_DOM_DEFINE = __webpack_require__(130);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(7) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(12);
var toObject = __webpack_require__(10);
var IE_PROTO = __webpack_require__(90)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(33);
var core = __webpack_require__(23);
var ctx = __webpack_require__(57);
var hide = __webpack_require__(48);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(11);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(3);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 24 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(24);
var fails = __webpack_require__(3);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(20);
var IObject = __webpack_require__(59);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(9);
var asc = __webpack_require__(107);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(168)('wks');
var uid = __webpack_require__(124);
var Symbol = __webpack_require__(33).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__(7)) {
  var LIBRARY = __webpack_require__(39);
  var global = __webpack_require__(2);
  var fails = __webpack_require__(3);
  var $export = __webpack_require__(0);
  var $typed = __webpack_require__(79);
  var $buffer = __webpack_require__(113);
  var ctx = __webpack_require__(20);
  var anInstance = __webpack_require__(45);
  var propertyDesc = __webpack_require__(37);
  var hide = __webpack_require__(13);
  var redefineAll = __webpack_require__(47);
  var toInteger = __webpack_require__(27);
  var toLength = __webpack_require__(9);
  var toIndex = __webpack_require__(156);
  var toAbsoluteIndex = __webpack_require__(41);
  var toPrimitive = __webpack_require__(25);
  var has = __webpack_require__(12);
  var classof = __webpack_require__(61);
  var isObject = __webpack_require__(4);
  var toObject = __webpack_require__(10);
  var isArrayIter = __webpack_require__(104);
  var create = __webpack_require__(42);
  var getPrototypeOf = __webpack_require__(18);
  var gOPN = __webpack_require__(43).f;
  var getIterFn = __webpack_require__(106);
  var uid = __webpack_require__(38);
  var wks = __webpack_require__(5);
  var createArrayMethod = __webpack_require__(29);
  var createArrayIncludes = __webpack_require__(70);
  var speciesConstructor = __webpack_require__(77);
  var ArrayIterators = __webpack_require__(109);
  var Iterators = __webpack_require__(55);
  var $iterDetect = __webpack_require__(74);
  var setSpecies = __webpack_require__(44);
  var arrayFill = __webpack_require__(108);
  var arrayCopyWithin = __webpack_require__(146);
  var $DP = __webpack_require__(8);
  var $GOPD = __webpack_require__(17);
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var Map = __webpack_require__(151);
var $export = __webpack_require__(0);
var shared = __webpack_require__(69)('metadata');
var store = shared.store || (shared.store = new (__webpack_require__(154))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(38)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(12);
var setDesc = __webpack_require__(8).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(3)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(13)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(63);
var IE8_DOM_DEFINE = __webpack_require__(401);
var toPrimitive = __webpack_require__(402);
var dP = Object.defineProperty;

exports.f = __webpack_require__(50) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(132);
var enumBugKeys = __webpack_require__(91);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(27);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(1);
var dPs = __webpack_require__(133);
var enumBugKeys = __webpack_require__(91);
var IE_PROTO = __webpack_require__(90)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(88)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(92).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(132);
var hiddenKeys = __webpack_require__(91).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var dP = __webpack_require__(8);
var DESCRIPTORS = __webpack_require__(7);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(20);
var call = __webpack_require__(144);
var isArrayIter = __webpack_require__(104);
var anObject = __webpack_require__(1);
var toLength = __webpack_require__(9);
var getIterFn = __webpack_require__(106);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(14);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(36);
var createDesc = __webpack_require__(118);
module.exports = __webpack_require__(50) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(51)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var globals = exports.globals = {
  VERSION: 'Version 1.74',
  MAX_LEVEL: 115,
  CLASSES: {
    enc: {
      title: 'EQ Enchanter DPS Tool',
      critRate: 'ENC_INNATE_CRIT_RATE',
      critDmg: 'ENC_INNATE_CRIT_DMG',
      cookie: 'mode=enc',
      css: 'enc-only'
    },
    mag: {
      title: 'EQ Mage DPS Tool',
      critRate: 'MAGE_INNATE_CRIT_RATE',
      critDmg: 'MAGE_INNATE_CRIT_DMG',
      cookie: 'mode=mag',
      css: 'mag-only'
    },
    wiz: {
      title: 'EQ Wizard DPS Tool',
      critRate: 'WIZ_INNATE_CRIT_RATE',
      critDmg: 'WIZ_INNATE_CRIT_DMG',
      cookie: 'mode=wiz',
      css: 'wiz-only'
    }
  }
};

// wizard spells to display in spell drop down
var wizSpellList = exports.wizSpellList = ['CG', 'CS', 'CT', 'DF', 'ET', 'EB', 'EC', 'EI', 'ES', 'FP', 'FB', 'FBC', 'LF', 'RI', 'SB', 'SC', 'SH', 'SP', 'SR', 'SJ', 'TW', 'VD', 'WE', 'WS'];

// mage spells to display in spell drop down
var magSpellList = exports.magSpellList = ['BK', 'BM', 'BS', 'BB', 'CI', 'DC', 'FC', 'FBC', 'MB', 'RK', 'RM', 'RU', 'RS', 'SH', 'SB', 'SS', 'SA', 'VM'];

// enc spells to display in spell drop down
var encSpellList = exports.encSpellList = ['CA', 'CD', 'CF', 'CR', 'GT', 'MC', 'MU', 'MS', 'PA'];

// values need to be strings for HTML dom nodes
var basicDmgFocusContext = exports.basicDmgFocusContext = [{
  id: 'eye-decay',
  value: '0.1',
  desc: 'Eyes of Life and Decay (6/6)',
  data: [{ value: '0.1', desc: 'Eyes of Life and Decay (6/6)' }, { value: '0.09', desc: 'Eye of Decay (5/6)' }, { value: '0.07', desc: 'Eye of Decay (4/6)' }, { value: '0.05', desc: 'Eye of Decay (3/6)' }, { value: '0.03', desc: 'Eye of Decay (2/6)' }, { value: '0.01', desc: 'Eye of Decay (1/6)' }, { value: '0', desc: 'No Eye of Decay Selected' }]
}, {
  id: 'wn-type3',
  value: 'true',
  desc: 'Use Relevant Type3 Augs',
  data: [{ value: 'true', desc: 'Use Relevant Type3 Augs' }, { value: 'false', desc: 'Use No Type3 Augs' }]
}, {
  id: 'wn-fhead',
  value: 'FMAGIC85123',
  desc: 'Ice Woven/Velium Emp Cap',
  data: [{ value: 'FMAGIC85123', desc: 'Ice Woven/Velium Emp Cap' }, { value: 'FMAGIC70120', desc: 'Heavenly/Veiled Cap' }, { value: 'FMAGIC70', desc: 'Scaleborn Cap' }, { value: 'FMAGIC67', desc: 'Velazul\'s Cap' }, { value: 'FMAGIC75', desc: 'Icebound/Velium Infused Cap' }, { value: 'FMAGIC6090', desc: 'Snowbound/Adamant/Battle Cap' }, { value: 'NONE', desc: 'No Cap Selected' }]
}, {
  id: 'wn-fhand',
  value: 'FCOLD85123',
  desc: 'Ice Woven/Velium Emp Gloves',
  data: [{ value: 'FCOLD85123', desc: 'Ice Woven/Velium Emp Gloves' }, { value: 'FCOLD85123', desc: 'White Platinum Threaded Satin Gloves' }, { value: 'FCOLD70120', desc: 'Heavenly/Veiled Gloves' }, { value: 'FCOLD70', desc: 'Scaleborn Gloves' }, { value: 'FCOLD67', desc: 'Velazul\'s Gloves' }, { value: 'FCOLD75', desc: 'Icebound/Velium Infused Cap' }, { value: 'FCOLD6090', desc: 'Snowbound/Adamant/Battle Gloves' }, { value: 'NONE', desc: 'No Gloves Selected' }]
}, {
  id: 'wn-farm',
  value: 'FFIRE85123',
  desc: 'Ice Woven/Velium Emp Sleeves',
  data: [{ value: 'FFIRE85123', desc: 'Ice Woven/Velium Emp Sleeves' }, { value: 'FFIRE70120', desc: 'Heavenly/Veiled Sleeves' }, { value: 'FFIRE70', desc: 'Scaleborn Sleeves' }, { value: 'FFIRE67', desc: 'Velazul\'s Sleeves' }, { value: 'FFIRE75', desc: 'Icebound/Velium Infused Cap' }, { value: 'FFIRE6090', desc: 'Snowbound/Adamant/Battle Sleeves' }, { value: 'NONE', desc: 'No Sleeves Selected' }]
}, {
  id: 'wn-fchest',
  value: 'ESD9',
  desc: 'Ice Woven/Velium Emp Robe',
  data: [{ value: 'ESD9', desc: 'Ice Woven/Velium Emp Robe' }, { value: 'ESD9', desc: 'Heavenly/Veiled Robe' }, { value: 'ESD9', desc: 'Scaleborn Robe' }, { value: 'ESD7', desc: 'Snowbound/Adamant/Battle Robe' }, { value: 'NONE', desc: 'No Robe Selected' }]
}, {
  id: 'wn-fwrist',
  value: 'FCHROM85123',
  desc: 'Ice Woven/Velium Emp Wristguard',
  data: [{ value: 'FCHROM85123', desc: 'Ice Woven/Velium Emp Wristguard' }, { value: 'FCHROM70120', desc: 'Heavenly/Veiled Wristguard' }, { value: 'FCHROM70', desc: 'Scaleborn Wristguard' }, { value: 'FCHROM67', desc: 'Velazul\'s Wristguard' }, { value: 'FCHROM75', desc: 'Icebound/Velium Infused Cap' }, { value: 'FCHROM6090', desc: 'Snowbound/Adamant/Battle Wristguard' }, { value: 'NONE', desc: 'No Wristguard Selected' }]
}, {
  id: 'armor-proc1',
  value: 'NONE',
  desc: 'No Evolving Armor Aug1 Selected',
  data: [{ value: 'EBOFVIII', desc: 'Blazing Paradise Casting Fire' }, { value: 'ESOMVIII', desc: 'Blazing Paradise Casting Magic' }, { value: 'NONE', desc: 'No Evolving Armor Aug Selected' }]
}, {
  id: 'armor-proc2',
  value: 'NONE',
  desc: 'No Evolving Armor Aug2 Selected',
  data: [{ value: 'EBOFV', desc: 'Whispering Midnight Casting Fire' }, { value: 'ESOMV', desc: 'Whispering Midnight Casting Magic' }, { value: 'NONE', desc: 'No Evolving Armor Aug Selected' }]
}, {
  id: 'staff-proc',
  value: 'NONE',
  desc: 'No Weapon Selected',
  data: [{ value: 'SOI129', desc: 'Velium Enhanced Arcane Staff / T1 Raid' }, { value: 'BOFVIII', desc: 'Ascending Sun Arcane Staff / Heavy Onyx' }, { value: 'HOMVII', desc: 'Rod of Ri`zyr' }, { value: 'SOI109', desc: 'Velium Infused Arcane Staff / T2 Group' }, { value: 'SOI99', desc: 'ToV T1 Group' }, { value: 'POP99', desc: 'Premier Staff' }, { value: 'BFVI', desc: 'Nightfear\'s Halo / Bloodstaff' }, { value: 'SOIV', desc: 'Mute Spiral / Fathomless Staff' }, { value: 'SOM51', desc: 'Velium Enhanced Wand / T1 Raid' }, { value: 'SOC47', desc: 'Ascending Sun Bodkin / Deep Cavern' }, { value: 'SOM43', desc: 'Velium Infused Wand / T2 Group' }, { value: 'BOFVII', desc: 'Shissar Arcanist\'s Stylet' }, { value: 'BOFVI', desc: 'Crystal Misericorde' }, { value: 'SOCV', desc: 'Eldritch Misericorde' }, { value: 'NONE', desc: 'No Primary Weapon Selected' }]
}, {
  id: 'shield-proc',
  value: 'NONE',
  desc: 'No Secondary Item Selected',
  data: [{ value: 'OS', desc: 'Tome of Obulous' }, { value: 'NONE', desc: 'No Secondary Item Selected' }]
}, {
  id: 'belt-proc',
  value: 'NONE',
  desc: 'No Belt Selected',
  data: [{ value: 'FCX', desc: 'Runed Belt of Boromas' }, { value: 'THREADSP', desc: 'Skywing Threaded Sash (Threads)' }, { value: 'SEERS', desc: 'Sash of the Dar Brood (Seers)' }, { value: 'THREADSM', desc: 'Parogressio' }, { value: 'BONDF', desc: 'Burning Sash of Ro' }, { value: 'NONE', desc: 'No Belt Selected' }]
}, {
  id: 'dps-aug1',
  value: 'NONE',
  desc: 'No Additional Aug1 Selected',
  data: [{ value: 'SOCII', desc: 'Elemental Curio of Ondine Force' }, { value: 'SOCI', desc: 'Elemental Gem of Stone' }, { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' }, { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' }, { value: 'SODIX', desc: 'Exotic Gem' }, { value: 'FOMVII', desc: 'Tempest Magic' }, { value: 'FCVII', desc: 'The Heart of Narikor' }, { value: 'SOFV', desc: 'Spirit of the Gorgon' }, { value: 'NONE', desc: 'No Additional Aug2 Selected' }]
}, {
  id: 'dps-aug2',
  value: 'NONE',
  desc: 'No Additional Aug2 Selected',
  data: [{ value: 'SOCII', desc: 'Elemental Curio of Ondine Force' }, { value: 'SOCI', desc: 'Elemental Gem of Stone' }, { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' }, { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' }, { value: 'SODIX', desc: 'Exotic Gem' }, { value: 'FOMVII', desc: 'Tempest Magic' }, { value: 'FCVII', desc: 'The Heart of Narikor' }, { value: 'SOFV', desc: 'Spirit of the Gorgon' }, { value: 'NONE', desc: 'No Additional Aug2 Selected' }]
}, {
  id: 'range-aug',
  value: 'NONE',
  desc: 'No Range Aug Selected',
  data: [{ value: 'FSVI', desc: 'Sodkee\'s Sympathetic Stone' }, { value: 'FZVI', desc: 'Nra`Vruu\'s Sympathetic Stone' }, { value: 'ASVI', desc: 'SaNril\'s Sympathetic Stone' }, { value: 'NONE', desc: 'No Range Aug Selected' }]
}];

var wizSpellFocusAAContext = exports.wizSpellFocusAAContext = [{
  id: 'aa-wsyn',
  value: '11',
  desc: 'Evoker\'s Synergy (11/11)',
  data: [{ value: '11', desc: 'Evoker\'s Synergy (11/11)' }, { value: '10', desc: 'Evoker\'s Synergy (10/11)' }, { value: '9', desc: 'Evoker\'s Synergy (9/11)' }, { value: '8', desc: 'Evoker\'s Synergy (8/11)' }, { value: '7', desc: 'Evoker\'s Synergy (7/11)' }, { value: '6', desc: 'Evoker\'s Synergy (6/11)' }, { value: '5', desc: 'Evoker\'s Synergy (5/11)' }, { value: '4', desc: 'Evoker\'s Synergy (4/11)' }, { value: '3', desc: 'Evoker\'s Synergy (3/11)' }, { value: '2', desc: 'Evoker\'s Synergy (2/11)' }, { value: '1', desc: 'Evoker\'s Synergy (1/11)' }, { value: '0', desc: 'Evoker\'s Synergy (0/11)' }]
}, {
  id: 'aa-beams',
  value: '13',
  desc: 'Beams (13/13)',
  data: [{ value: '13', desc: 'Beams (13/13)' }, { value: '12', desc: 'Beams (12/13)' }, { value: '0', desc: 'Beams (0/13)' }]
}, {
  id: 'aa-chaos',
  value: '13',
  desc: 'Chaos Scintillation (13/13)',
  data: [{ value: '13', desc: 'Chaos Scintillation (13/13)' }, { value: '12', desc: 'Chaos Scintillation (12/13)' }, { value: '0', desc: 'Chaos Scintillation (0/13)' }]
}, {
  id: 'aa-claws',
  value: '13',
  desc: 'Claws (13/13)',
  data: [{ value: '13', desc: 'Claws (13/13)' }, { value: '12', desc: 'Claws (12/13)' }, { value: '0', desc: 'Claws (0/13)' }]
}, {
  id: 'aa-cloudb',
  value: '13',
  desc: 'Cloudburst Stormstrike (13/13)',
  data: [{ value: '13', desc: 'Cloudburst Stormstrike (13/13)' }, { value: '12', desc: 'Cloudburst Stormstrike (12/13)' }, { value: '0', desc: 'Cloudburst Stormstrike (0/13)' }]
}, {
  id: 'aa-corona',
  value: '13',
  desc: 'Corona of Flame (13/13)',
  data: [{ value: '13', desc: 'Corona of Flame (13/13)' }, { value: '12', desc: 'Corona of Flame (12/13)' }, { value: '0', desc: 'Corona of Flame (0/13)' }]
}, {
  id: 'aa-eflash',
  value: '13',
  desc: 'Ethereal Flash (13/13)',
  data: [{ value: '13', desc: 'Ethereal Flash (13/13)' }, { value: '12', desc: 'Ethereal Flash (12/13)' }, { value: '0', desc: 'Ethereal Flash (0/13)' }]
}, {
  id: 'aa-erime',
  value: '13',
  desc: 'Ethereal Rimeblast (13/13)',
  data: [{ value: '13', desc: 'Ethereal Rimeblast (13/13)' }, { value: '12', desc: 'Ethereal Rimeblast (12/13)' }, { value: '11', desc: 'Ethereal Rimeblast (11/13)' }, { value: '10', desc: 'Ethereal Rimeblast (10/13)' }, { value: '9', desc: 'Ethereal Rimeblast (9/13)' }, { value: '0', desc: 'Ethereal Rimeblast (0/13)' }]
}, {
  id: 'aa-eblaze',
  value: '13',
  desc: 'Ethereal Skyblaze (13/13)',
  data: [{ value: '13', desc: 'Ethereal Skyblaze (13/13)' }, { value: '12', desc: 'Ethereal Skyblaze (12/13)' }, { value: '11', desc: 'Ethereal Skyblaze (11/13)' }, { value: '10', desc: 'Ethereal Skyblaze (10/13)' }, { value: '9', desc: 'Ethereal Skyblaze (9/13)' }, { value: '0', desc: 'Ethereal Skyblaze (0/13)' }]
}, {
  id: 'aa-flashchar',
  value: '13',
  desc: 'Flashchar (13/13)',
  data: [{ value: '13', desc: 'Flashchar (13/13)' }, { value: '12', desc: 'Flashchar (12/13)' }, { value: '0', desc: 'Flashchar (0/13)' }]
}, {
  id: 'aa-pills',
  value: '13',
  desc: 'Pillars (13/13)',
  data: [{ value: '13', desc: 'Pillars (13/13)' }, { value: '12', desc: 'Pillars (12/13)' }, { value: '0', desc: 'Pillars (0/13)' }]
}, {
  id: 'aa-pure',
  value: '13',
  desc: 'Pure Wildflash (13/13)',
  data: [{ value: '13', desc: 'Pure Wildflash (13/13)' }, { value: '12', desc: 'Pure Wildflash (12/13)' }, { value: '0', desc: 'Pure Wildflash (0/13)' }]
}, {
  id: 'aa-rains',
  value: '13',
  desc: 'Rains (13/13)',
  data: [{ value: '13', desc: 'Rains (13/13)' }, { value: '12', desc: 'Rains (12/13)' }, { value: '0', desc: 'Rains (0/13)' }]
}, {
  id: 'aa-rimeb',
  value: '13',
  desc: 'Rimeblast Cascade (13/13)',
  data: [{ value: '13', desc: 'Rimeblast Cascade (13/13)' }, { value: '12', desc: 'Rimeblast Cascade (12/13)' }, { value: '0', desc: 'Rimeblast Cascade (0/13)' }]
}, {
  id: 'aa-selfc',
  value: '0.20',
  desc: 'Self-Combustion (10/11)',
  data: [{ value: '0.20', desc: 'Self-Combustion (10/10)' }, { value: '0.18', desc: 'Self-Combustion (9/10)' }, { value: '0.16', desc: 'Self-Combustion (8/10)' }, { value: '0.14', desc: 'Self-Combustion (7/10)' }, { value: '0.12', desc: 'Self-Combustion (6/10)' }, { value: '0.10', desc: 'Self-Combustion (5/10)' }, { value: '0.08', desc: 'Self-Combustion (4/10)' }, { value: '0.06', desc: 'Self-Combustion (3/10)' }, { value: '0.04', desc: 'Self-Combustion (2/10)' }, { value: '0.02', desc: 'Self-Combustion (1/10)' }, { value: '0', desc: 'Self-Combustion (0/10)' }]
}, {
  id: 'aa-thrice',
  value: '0.20',
  desc: 'Thricewoven Stormstrike (11/11)',
  data: [{ value: '0.20', desc: 'Thricewoven Stormstrike (11/11)' }, { value: '0.18', desc: 'Thricewoven Stormstrike (10/11)' }, { value: '0.16', desc: 'Thricewoven Stormstrike (9/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (8/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (7/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (6/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (5/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (4/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (3/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (2/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (1/11)' }, { value: '0', desc: 'Thricewoven Stormstrike (0/11)' }]
}, {
  id: 'aa-vortex',
  value: '0.20',
  desc: 'Vortexes (10/10)',
  data: [{ value: '0.20', desc: 'Vortexes (10/10)' }, { value: '0.18', desc: 'Vortexes (9/10)' }, { value: '0', desc: 'Vortexes (8/10)' }, { value: '0', desc: 'Vortexes (7/10)' }, { value: '0', desc: 'Vortexes (6/10)' }, { value: '0', desc: 'Vortexes (5/10)' }, { value: '0', desc: 'Vortexes (4/10)' }, { value: '0', desc: 'Vortexes (3/10)' }, { value: '0', desc: 'Vortexes (2/10)' }, { value: '0', desc: 'Vortexes (1/10)' }, { value: '0', desc: 'Vortexes (0/10)' }]
}];

var magSpellFocusAAContext = exports.magSpellFocusAAContext = [{
  id: 'aa-msyn',
  value: '11',
  desc: 'Conjurer\'s Synergy (11/11)',
  data: [{ value: '11', desc: 'Conjurer\'s Synergy (11/11)' }, { value: '10', desc: 'Conjurer\'s Synergy (10/11)' }, { value: '9', desc: 'Conjurer\'s Synergy (9/11)' }, { value: '8', desc: 'Conjurer\'s Synergy (8/11)' }, { value: '7', desc: 'Conjurer\'s Synergy (7/11)' }, { value: '6', desc: 'Conjurer\'s Synergy (6/11)' }, { value: '5', desc: 'Conjurer\'s Synergy (5/11)' }, { value: '4', desc: 'Conjurer\'s Synergy (4/11)' }, { value: '3', desc: 'Conjurer\'s Synergy (3/11)' }, { value: '2', desc: 'Conjurer\'s Synergy (2/11)' }, { value: '1', desc: 'Conjurer\'s Synergy (1/11)' }, { value: '0', desc: 'Conjurer\'s Synergy (0/11)' }]
}, {
  id: 'aa-beam-molten',
  value: '0.20',
  desc: 'Beam of Molten Shieldstone (11/11)',
  data: [{ value: '0.20', desc: 'Beam of Molten Shieldstone (11/11)' }, { value: '0.18', desc: 'Beam of Molten Shieldstone (10/11)' }, { value: '0.16', desc: 'Beam of Molten Shieldstone (9/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (8/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (7/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (6/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (5/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (4/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (3/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (2/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (1/11)' }, { value: '0', desc: 'Beam of Molten Shieldstone (0/11)' }]
}, {
  id: 'aa-beam-scythes',
  value: '0.20',
  desc: 'Beam of Scythes (11/11)',
  data: [{ value: '0.20', desc: 'Beam of Scythes (11/11)' }, { value: '0.18', desc: 'Beam of Scythes (10/11)' }, { value: '0.16', desc: 'Beam of Scythes (9/11)' }, { value: '0', desc: 'Beam of Scythes (8/11)' }, { value: '0', desc: 'Beam of Scythes (7/11)' }, { value: '0', desc: 'Beam of Scythes (6/11)' }, { value: '0', desc: 'Beam of Scythes (5/11)' }, { value: '0', desc: 'Beam of Scythes (4/11)' }, { value: '0', desc: 'Beam of Scythes (3/11)' }, { value: '0', desc: 'Beam of Scythes (2/11)' }, { value: '0', desc: 'Beam of Scythes (1/11)' }, { value: '0', desc: 'Beam of Scythes (0/11)' }]
}, {
  id: 'aa-boltm',
  value: '0.20',
  desc: 'Bolt of Molten Shieldstone (11/11)',
  data: [{ value: '0.20', desc: 'Bolt of Molten Shieldstone (11/11)' }, { value: '0.18', desc: 'Bolt of Molten Shieldstone (10/11)' }, { value: '0.16', desc: 'Bolt of Molten Shieldstone (9/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (8/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (7/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (6/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (5/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (4/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (3/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (2/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (1/11)' }, { value: '0', desc: 'Bolt of Molten Shieldstone (0/11)' }]
}, {
  id: 'aa-coronal',
  value: '0.20',
  desc: 'Coronal Rain (11/11)',
  data: [{ value: '0.20', desc: 'Coronal Rain (11/11)' }, { value: '0.18', desc: 'Coronal Rain (10/11)' }, { value: '0.16', desc: 'Coronal Rain (9/11)' }, { value: '0', desc: 'Coronal Rain (8/11)' }, { value: '0', desc: 'Coronal Rain (7/11)' }, { value: '0', desc: 'Coronal Rain (6/11)' }, { value: '0', desc: 'Coronal Rain (5/11)' }, { value: '0', desc: 'Coronal Rain (4/11)' }, { value: '0', desc: 'Coronal Rain (3/11)' }, { value: '0', desc: 'Coronal Rain (2/11)' }, { value: '0', desc: 'Coronal Rain (1/11)' }, { value: '0', desc: 'Coronal Rain (0/11)' }]
}, {
  id: 'aa-eradun',
  value: '0.20',
  desc: 'Eradicate the Unnatural (11/11)',
  data: [{ value: '0.20', desc: 'Eradicate the Unnatural (11/11)' }, { value: '0.18', desc: 'Eradicate the Unnatural (10/11)' }, { value: '0.16', desc: 'Eradicate the Unnatural (9/11)' }, { value: '0', desc: 'Eradicate the Unnatural (8/11)' }, { value: '0', desc: 'Eradicate the Unnatural (7/11)' }, { value: '0', desc: 'Eradicate the Unnatural (6/11)' }, { value: '0', desc: 'Eradicate the Unnatural (5/11)' }, { value: '0', desc: 'Eradicate the Unnatural (4/11)' }, { value: '0', desc: 'Eradicate the Unnatural (3/11)' }, { value: '0', desc: 'Eradicate the Unnatural (2/11)' }, { value: '0', desc: 'Eradicate the Unnatural (1/11)' }, { value: '0', desc: 'Eradicate the Unnatural (0/11)' }]
}, {
  id: 'aa-fickle',
  value: '0.20',
  desc: 'Fickle Conflagration (10/10)',
  data: [{ value: '0.20', desc: 'Fickle Conflagration (10/10)' }, { value: '0.18', desc: 'Fickle Conflagration (9/10)' }, { value: '0.16', desc: 'Fickle Conflagration (8/10)' }, { value: '0.14', desc: 'Fickle Conflagration (7/10)' }, { value: '0.12', desc: 'Fickle Conflagration (6/10)' }, { value: '0.1', desc: 'Fickle Conflagration (5/10)' }, { value: '0.08', desc: 'Fickle Conflagration (4/10)' }, { value: '0.06', desc: 'Fickle Conflagration (3/10)' }, { value: '0.04', desc: 'Fickle Conflagration (2/10)' }, { value: '0.02', desc: 'Fickle Conflagration (1/10)' }, { value: '0', desc: 'Fickle Conflagration (0/10)' }]
}, {
  id: 'aa-flames-pwr',
  value: '4',
  desc: 'Flames of Power (4/4)',
  data: [{ value: '4', desc: 'Flames of Power (4/4)' }, { value: '3', desc: 'Flames of Power (3/4)' }, { value: '2', desc: 'Flames of Power (2/4)' }, { value: '1', desc: 'Flames of Power (1/4)' }, { value: '0', desc: 'Flames of Power (0/4)' }]
}, {
  id: 'aa-sear',
  value: '0.20',
  desc: 'Searing Blast (11/11)',
  data: [{ value: '0.20', desc: 'Searing Blast (11/11)' }, { value: '0.18', desc: 'Searing Blast (10/11)' }, { value: '0.16', desc: 'Searing Blast (9/11)' }, { value: '0', desc: 'Searing Blast (8/11)' }, { value: '0', desc: 'Searing Blast (7/11)' }, { value: '0', desc: 'Searing Blast (6/11)' }, { value: '0', desc: 'Searing Blast (5/11)' }, { value: '0', desc: 'Searing Blast (4/11)' }, { value: '0', desc: 'Searing Blast (3/11)' }, { value: '0', desc: 'Searing Blast (2/11)' }, { value: '0', desc: 'Searing Blast (1/11)' }, { value: '0', desc: 'Searing Blast (0/11)' }]
}, {
  id: 'aa-servant',
  value: '6',
  desc: 'Hastened Raging Servant (3/3)',
  data: [{ value: '6', desc: 'Hastened Raging Servant (3/3)' }, { value: '4', desc: 'Hastened Raging Servant (2/3)' }, { value: '2', desc: 'Hastened Raging Servant (1/3)' }, { value: '0', desc: 'Hastened Raging Servant (0/3)' }]
}, {
  id: 'aa-raincut',
  value: '0.20',
  desc: 'Rain of Cutlasses (11/11)',
  data: [{ value: '0.20', desc: 'Rain of Cutlasses (11/11)' }, { value: '0.18', desc: 'Rain of Cutlasses (10/11)' }, { value: '0.16', desc: 'Rain of Cutlasses (9/11)' }, { value: '0', desc: 'Rain of Cutlasses (8/11)' }, { value: '0', desc: 'Rain of Cutlasses (7/11)' }, { value: '0', desc: 'Rain of Cutlasses (6/11)' }, { value: '0', desc: 'Rain of Cutlasses (5/11)' }, { value: '0', desc: 'Rain of Cutlasses (4/11)' }, { value: '0', desc: 'Rain of Cutlasses (3/11)' }, { value: '0', desc: 'Rain of Cutlasses (2/11)' }, { value: '0', desc: 'Rain of Cutlasses (1/11)' }, { value: '0', desc: 'Rain of Cutlasses (0/11)' }]
}, {
  id: 'aa-shockd',
  value: '11',
  desc: 'Shock of Darksteel  (11/11)',
  data: [{ value: '11', desc: 'Shock of Darksteel (11/11)' }, { value: '10', desc: 'Shock of Darksteel (10/11)' }, { value: '9', desc: 'Shock of Darksteel (9/11)' }, { value: '0.16', desc: 'Shock of Darksteel (8/11)' }, { value: '0.14', desc: 'Shock of Darksteel (7/11)' }, { value: '0.12', desc: 'Shock of Darksteel (6/11)' }, { value: '0.10', desc: 'Shock of Darksteel (5/11)' }, { value: '0.08', desc: 'Shock of Darksteel (4/11)' }, { value: '0.06', desc: 'Shock of Darksteel (3/11)' }, { value: '0.04', desc: 'Shock of Darksteel (2/11)' }, { value: '0.02', desc: 'Shock of Darksteel (1/11)' }, { value: '0', desc: 'Shock of Darksteel (0/11)' }]
}, {
  id: 'aa-spearm',
  value: '11', // special case to check new spear vs old. uses 16%
  desc: 'Spear of Molten Shieldstone (11/11)',
  data: [{ value: '11', desc: 'Spear of Molten Shieldstone (11/11)' }, { value: '10', desc: 'Spear of Molten Shieldstone (10/11)' }, { value: '9', desc: 'Spear of Molten Shieldstone (9/11)' }, { value: '0.16', desc: 'Spear of Molten Shieldstone (8/11)' }, { value: '0.14', desc: 'Spear of Molten Shieldstone (7/11)' }, { value: '0.12', desc: 'Spear of Molten Shieldstone (6/11)' }, { value: '0.10', desc: 'Spear of Molten Shieldstone (5/11)' }, { value: '0.08', desc: 'Spear of Molten Shieldstone (4/11)' }, { value: '0.06', desc: 'Spear of Molten Shieldstone (3/11)' }, { value: '0.04', desc: 'Spear of Molten Shieldstone (2/11)' }, { value: '0.02', desc: 'Spear of Molten Shieldstone (1/11)' }, { value: '0', desc: 'Spear of Molten Shieldstone (0/11)' }]
}, {
  id: 'aa-storm',
  value: '0.50',
  desc: 'Storm of Many (11/11)',
  data: [{ value: '0.50', desc: 'Storm of Many (11/11)' }, { value: '0.45', desc: 'Storm of Many (10/11)' }, { value: '0.40', desc: 'Storm of Many (9/11)' }, { value: '0', desc: 'Storm of Many (8/11)' }, { value: '0', desc: 'Storm of Many (7/11)' }, { value: '0', desc: 'Storm of Many (6/11)' }, { value: '0', desc: 'Storm of Many (5/11)' }, { value: '0', desc: 'Storm of Many (4/11)' }, { value: '0', desc: 'Storm of Many (3/11)' }, { value: '0', desc: 'Storm of Many (2/11)' }, { value: '0', desc: 'Storm of Many (1/11)' }, { value: '0', desc: 'Storm of Many (0/11)' }]
}];

var encSpellFocusAAContext = exports.encSpellFocusAAContext = [{
  id: 'aa-esyn',
  value: '11',
  desc: 'Beguiler\'s Synergy (11/11)',
  data: [{ value: '11', desc: 'Beguiler\'s Synergy (11/11)' }, { value: '10', desc: 'Beguiler\'s Synergy (10/11)' }, { value: '9', desc: 'Beguiler\'s Synergy (9/11)' }, { value: '8', desc: 'Beguiler\'s Synergy (8/11)' }, { value: '7', desc: 'Beguiler\'s Synergy (7/11)' }, { value: '6', desc: 'Beguiler\'s Synergy (6/11)' }, { value: '5', desc: 'Beguiler\'s Synergy (5/11)' }, { value: '4', desc: 'Beguiler\'s Synergy (4/11)' }, { value: '3', desc: 'Beguiler\'s Synergy (3/11)' }, { value: '2', desc: 'Beguiler\'s Synergy (2/11)' }, { value: '1', desc: 'Beguiler\'s Synergy (1/11)' }, { value: '0', desc: 'Beguiler\'s Synergy (0/11)' }]
}, {
  id: 'aa-chromarift',
  value: '0.20',
  desc: 'Chromarift (11/11)',
  data: [{ value: '0.20', desc: 'Chromarift (11/11)' }, { value: '0.18', desc: 'Chromarift (10/11)' }, { value: '0.16', desc: 'Chromarift (9/11)' }, { value: '0', desc: 'Chromarift (8/11)' }, { value: '0', desc: 'Chromarift (7/11)' }, { value: '0', desc: 'Chromarift (6/11)' }, { value: '0', desc: 'Chromarift (5/11)' }, { value: '0', desc: 'Chromarift (4/11)' }, { value: '0', desc: 'Chromarift (3/11)' }, { value: '0', desc: 'Chromarift (2/11)' }, { value: '0', desc: 'Chromarift (1/11)' }, { value: '0', desc: 'Chromarift (0/11)' }]
}, {
  id: 'aa-chromablink',
  value: '0.20',
  desc: 'Chromatic Blink (11/11)',
  data: [{ value: '0.20', desc: 'Chromatic Blink (11/11)' }, { value: '0.18', desc: 'Chromatic Blink (10/11)' }, { value: '0.16', desc: 'Chromatic Blink (9/11)' }, { value: '0', desc: 'Chromatic Blink (8/11)' }, { value: '0', desc: 'Chromatic Blink (7/11)' }, { value: '0', desc: 'Chromatic Blink (6/11)' }, { value: '0', desc: 'Chromatic Blink (5/11)' }, { value: '0', desc: 'Chromatic Blink (4/11)' }, { value: '0', desc: 'Chromatic Blink (3/11)' }, { value: '0', desc: 'Chromatic Blink (2/11)' }, { value: '0', desc: 'Chromatic Blink (1/11)' }, { value: '0', desc: 'Chromatic Blink (0/11)' }]
}, {
  id: 'aa-gravity-twist',
  value: '0.20',
  desc: 'Gravity Twist (10/10)',
  data: [{ value: '0.20', desc: 'Gravity Twist (10/10)' }, { value: '0.18', desc: 'Gravity Twist (9/10)' }, { value: '0.16', desc: 'Gravity Twist (8/10)' }, { value: '0.14', desc: 'Gravity Twist (7/10)' }, { value: '0.12', desc: 'Gravity Twist (6/10)' }, { value: '0.10', desc: 'Gravity Twist (5/10)' }, { value: '0.08', desc: 'Gravity Twist (4/10)' }, { value: '0.06', desc: 'Gravity Twist (3/10)' }, { value: '0.04', desc: 'Gravity Twist (2/10)' }, { value: '0.02', desc: 'Gravity Twist (1/10)' }, { value: '0', desc: 'Gravity Twist (0/10)' }]
}, {
  id: 'aa-mindsunder',
  value: '11',
  desc: 'Mindsunder (11/11)',
  data: [{ value: '11', desc: 'Mindsunder (11/11)' }, { value: '10', desc: 'Mindsunder (10/11)' }, { value: '9', desc: 'Mindsunder (9/11)' }, { value: '0.16', desc: 'Mindsunder (8/11)' }, { value: '0.14', desc: 'Mindsunder (7/11)' }, { value: '0.12', desc: 'Mindsunder (6/11)' }, { value: '0.10', desc: 'Mindsunder (5/11)' }, { value: '0.08', desc: 'Mindsunder (4/11)' }, { value: '0.06', desc: 'Mindsunder (3/11)' }, { value: '0.04', desc: 'Mindsunder (2/11)' }, { value: '0.02', desc: 'Mindsunder (1/11)' }, { value: '0', desc: 'Mindsunder (0/11)' }]
}, {
  id: 'aa-poly-ass',
  value: '0.20',
  desc: 'Polyrefractive Assault (11/11)',
  data: [{ value: '0.20', desc: 'Polyrefractive Assault (11/11)' }, { value: '0.18', desc: 'Polyrefractive Assault (10/11)' }, { value: '0.16', desc: 'Polyrefractive Assault (9/11)' }, { value: '0', desc: 'Polyrefractive Assault (8/11)' }, { value: '0', desc: 'Polyrefractive Assault (7/11)' }, { value: '0', desc: 'Polyrefractive Assault (6/11)' }, { value: '0', desc: 'Polyrefractive Assault (5/11)' }, { value: '0', desc: 'Polyrefractive Assault (4/11)' }, { value: '0', desc: 'Polyrefractive Assault (3/11)' }, { value: '0', desc: 'Polyrefractive Assault (2/11)' }, { value: '0', desc: 'Polyrefractive Assault (1/11)' }, { value: '0', desc: 'Polyrefractive Assault (0/11)' }]
}];

var wizDPSAAContext = exports.wizDPSAAContext = [{
  id: 'aa-afusion',
  value: 'AFU4',
  desc: 'Arcane Fusion (4/4)',
  data: [{ value: 'AFU4', desc: 'Arcane Fusion (4/4)' }, { value: 'AFU3', desc: 'Arcane Fusion (3/4)' }, { value: 'AFU2', desc: 'Arcane Fusion (2/4)' }, { value: 'AFU1', desc: 'Arcane Fusion (1/4)' }, { value: 'NONE', desc: 'Arcane Fusion (0/4)' }]
}, {
  id: 'aa-dadept',
  value: '0.10',
  desc: 'Destructive Adept (10/10)',
  data: [{ value: '0.10', desc: 'Destructive Adept (10/10)' }, { value: '0.09', desc: 'Destructive Adept (9/10)' }, { value: '0.08', desc: 'Destructive Adept (8/10)' }, { value: '0.07', desc: 'Destructive Adept (7/10)' }, { value: '0.06', desc: 'Destructive Adept (6/10)' }, { value: '0.05', desc: 'Destructive Adept (5/10)' }, { value: '0.04', desc: 'Destructive Adept (4/10)' }, { value: '0.03', desc: 'Destructive Adept (3/10)' }, { value: '0.02', desc: 'Destructive Adept (2/10)' }, { value: '0.01', desc: 'Destructive Adept (1/10)' }, { value: '0', desc: 'Destructive Adept (0/10)' }]
}, {
  id: 'aa-destfury',
  value: '340',
  desc: 'Destructive Fury (39/39)',
  data: [{ value: '340', desc: 'Destructive Fury (39/39)' }, { value: '335', desc: 'Destructive Fury (38/39)' }, { value: '330', desc: 'Destructive Fury (37/39)' }, { value: '325', desc: 'Destructive Fury (36/39)' }, { value: '320', desc: 'Destructive Fury (35/39)' }, { value: '315', desc: 'Destructive Fury (34/39)' }, { value: '310', desc: 'Destructive Fury (33/39)' }, { value: '300', desc: 'Destructive Fury (32/39)' }, { value: '290', desc: 'Destructive Fury (31/39)' }, { value: '280', desc: 'Destructive Fury (30/39)' }, { value: '278', desc: 'Destructive Fury (29/39)' }, { value: '276', desc: 'Destructive Fury (28/39)' }, { value: '274', desc: 'Destructive Fury (27/39)' }, { value: '264', desc: 'Destructive Fury (26/39)' }, { value: '254', desc: 'Destructive Fury (25/39)' }, { value: '249', desc: 'Destructive Fury (24/39)' }, { value: '242', desc: 'Destructive Fury (23/39)' }, { value: '235', desc: 'Destructive Fury (22/39)' }, { value: '228', desc: 'Destructive Fury (21/39)' }, { value: '221', desc: 'Destructive Fury (20/39)' }, { value: '214', desc: 'Destructive Fury (19/39)' }, { value: '207', desc: 'Destructive Fury (18/39)' }, { value: '200', desc: 'Destructive Fury (17/39)' }, { value: '193', desc: 'Destructive Fury (16/39)' }, { value: '186', desc: 'Destructive Fury (15/39)' }, { value: '179', desc: 'Destructive Fury (14/39)' }, { value: '172', desc: 'Destructive Fury (13/39)' }, { value: '165', desc: 'Destructive Fury (12/39)' }, { value: '160', desc: 'Destructive Fury (11/39)' }, { value: '155', desc: 'Destructive Fury (10/39)' }, { value: '150', desc: 'Destructive Fury (9/39)' }, { value: '141', desc: 'Destructive Fury (8/39)' }, { value: '133', desc: 'Destructive Fury (7/39)' }, { value: '125', desc: 'Destructive Fury (6/39)' }, { value: '115', desc: 'Destructive Fury (5/39)' }, { value: '107', desc: 'Destructive Fury (4/39)' }, { value: '100', desc: 'Destructive Fury (3/39)' }, { value: '60', desc: 'Destructive Fury (2/39)' }, { value: '30', desc: 'Destructive Fury (1/39)' }, { value: '0', desc: 'Destructive Fury (0/39)' }]
}, {
  id: 'aa-don',
  value: '1',
  desc: 'Dark Reign/Keepers DoN (5/5)',
  data: [{ value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' }, { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }]
}, {
  id: 'aa-forceflame',
  value: 'FF12',
  desc: 'Force of Flame (12/12)',
  data: [{ value: 'FF12', desc: 'Force of Flame (12/12)' }, { value: 'FF11', desc: 'Force of Flame (11/12)' }, { value: 'FF10', desc: 'Force of Flame (10/12)' }, { value: 'FF9', desc: 'Force of Flame (9/12)' }, { value: 'FF8', desc: 'Force of Flame (8/12)' }, { value: 'FF7', desc: 'Force of Flame (7/12)' }, { value: 'FF6', desc: 'Force of Flame (6/12)' }, { value: 'FF5', desc: 'Force of Flame (5/12)' }, { value: 'FF4', desc: 'Force of Flame (4/12)' }]
}, {
  id: 'aa-forceice',
  value: 'FI12',
  desc: 'Force of Ice (12/12)',
  data: [{ value: 'FI12', desc: 'Force of Ice (12/12)' }, { value: 'FI11', desc: 'Force of Ice (11/12)' }, { value: 'FI10', desc: 'Force of Ice (10/12)' }, { value: 'FI9', desc: 'Force of Ice (9/12)' }, { value: 'FI8', desc: 'Force of Ice (8/12)' }, { value: 'FI7', desc: 'Force of Ice (7/12)' }, { value: 'FI6', desc: 'Force of Ice (6/12)' }, { value: 'FI5', desc: 'Force of Ice (5/12)' }, { value: 'FI4', desc: 'Force of Ice (4/12)' }]
}, {
  id: 'aa-forcewill',
  value: 'FW32',
  desc: 'Force of Will (32/32)',
  data: [{ value: 'FW32', desc: 'Force of Will (32/32)' }, { value: 'FW31', desc: 'Force of Will (31/32)' }, { value: 'FW30', desc: 'Force of Will (30/32)' }, { value: 'FW29', desc: 'Force of Will (29/32)' }, { value: 'FW28', desc: 'Force of Will (28/32)' }, { value: 'FW27', desc: 'Force of Will (27/32)' }, { value: 'FW26', desc: 'Force of Will (26/32)' }, { value: 'FW25', desc: 'Force of Will (25/32)' }, { value: 'FW24', desc: 'Force of Will (24/32)' }]
}, {
  id: 'aa-furymagic',
  value: '50',
  desc: 'Fury of Magic (35/35)',
  data: [{ value: '50', desc: 'Fury of Magic (35/35)' }, { value: '49', desc: 'Fury of Magic (34/35)' }, { value: '47', desc: 'Fury of Magic (33/35)' }, { value: '45', desc: 'Fury of Magic (32/35)' }, { value: '43', desc: 'Fury of Magic (31/35)' }, { value: '41', desc: 'Fury of Magic (30/35)' }, { value: '39', desc: 'Fury of Magic (29/35)' }, { value: '38', desc: 'Fury of Magic (28/35)' }, { value: '37', desc: 'Fury of Magic (27/35)' }, { value: '36', desc: 'Fury of Magic (26/35)' }, { value: '35', desc: 'Fury of Magic (25/35)' }, { value: '34', desc: 'Fury of Magic (24/35)' }, { value: '33', desc: 'Fury of Magic (23/35)' }, { value: '32', desc: 'Fury of Magic (22/35)' }, { value: '31', desc: 'Fury of Magic (21/35)' }, { value: '30', desc: 'Fury of Magic (20/35)' }, { value: '29', desc: 'Fury of Magic (19/35)' }, { value: '28', desc: 'Fury of Magic (18/35)' }, { value: '27', desc: 'Fury of Magic (17/35)' }, { value: '26', desc: 'Fury of Magic (16/35)' }, { value: '25', desc: 'Fury of Magic (15/35)' }, { value: '24', desc: 'Fury of Magic (14/35)' }, { value: '22', desc: 'Fury of Magic (13/35)' }, { value: '20', desc: 'Fury of Magic (12/35)' }, { value: '18', desc: 'Fury of Magic (11/35)' }, { value: '17', desc: 'Fury of Magic (10/35)' }, { value: '16', desc: 'Fury of Magic (9/35)' }, { value: '15', desc: 'Fury of Magic (8/35)' }, { value: '14', desc: 'Fury of Magic (7/35)' }, { value: '13', desc: 'Fury of Magic (6/35)' }, { value: '11', desc: 'Fury of Magic (5/35)' }, { value: '9', desc: 'Fury of Magic (4/35)' }, { value: '7', desc: 'Fury of Magic (3/35)' }, { value: '4', desc: 'Fury of Magic (2/35)' }, { value: '2', desc: 'Fury of Magic (1/35)' }, { value: '0', desc: 'Fury of Magic (0/35)' }]
}, {
  id: 'spell-pet-focus',
  value: 'IMPF',
  desc: 'Improved Familiar (30)',
  data: [{ value: 'IMPF', desc: 'Improved Familiar (30)' }, { value: '', desc: 'No Familiar Selected' }]
}, {
  id: 'aa-sveng',
  value: '5500',
  desc: 'Sorcerer\'s Vengeance (25/25)',
  data: [{ value: '5500', desc: 'Sorcerer\'s Vengeance (25/25)' }, { value: '5200', desc: 'Sorcerer\'s Vengeance (24/25)' }, { value: '4900', desc: 'Sorcerer\'s Vengeance (23/25)' }, { value: '4600', desc: 'Sorcerer\'s Vengeance (22/25)' }, { value: '4300', desc: 'Sorcerer\'s Vengeance (21/25)' }, { value: '4000', desc: 'Sorcerer\'s Vengeance (20/25)' }, { value: '3650', desc: 'Sorcerer\'s Vengeance (19/25)' }, { value: '3375', desc: 'Sorcerer\'s Vengeance (18/25)' }, { value: '3100', desc: 'Sorcerer\'s Vengeance (17/25)' }, { value: '2825', desc: 'Sorcerer\'s Vengeance (16/25)' }, { value: '2550', desc: 'Sorcerer\'s Vengeance (15/25)' }, { value: '2275', desc: 'Sorcerer\'s Vengeance (14/25)' }, { value: '2000', desc: 'Sorcerer\'s Vengeance (13/25)' }, { value: '1800', desc: 'Sorcerer\'s Vengeance (12/25)' }, { value: '1600', desc: 'Sorcerer\'s Vengeance (11/25)' }, { value: '1400', desc: 'Sorcerer\'s Vengeance (10/25)' }, { value: '1200', desc: 'Sorcerer\'s Vengeance (9/25)' }, { value: '1100', desc: 'Sorcerer\'s Vengeance (8/25)' }, { value: '1000', desc: 'Sorcerer\'s Vengeance (7/25)' }, { value: '900', desc: 'Sorcerer\'s Vengeance (6/25)' }, { value: '800', desc: 'Sorcerer\'s Vengeance (5/25)' }, { value: '700', desc: 'Sorcerer\'s Vengeance (4/25)' }, { value: '600', desc: 'Sorcerer\'s Vengeance (3/25)' }, { value: '400', desc: 'Sorcerer\'s Vengeance (2/25)' }, { value: '200', desc: 'Sorcerer\'s Vengeance (1/25)' }, { value: '0', desc: 'Sorcerer\'s Vengeance (0/25)' }]
}, {
  id: 'aa-twincast',
  value: '0.05',
  desc: 'Twincast (5/5)',
  data: [{ value: '0.05', desc: 'Twincast (5/5)' }, { value: '0.04', desc: 'Twincast (4/5)' }, { value: '0.03', desc: 'Twincast (3/5)' }, { value: '0.02', desc: 'Twincast (2/5)' }, { value: '0.01', desc: 'Twincast (1/5)' }, { value: '0', desc: 'Twincast (0/5)' }]
}, {
  id: 'aa-twinproc',
  value: '0.21',
  desc: 'Twinproc (9/9)',
  data: [{ value: '0.21', desc: 'Twinproc (9/9)' }, { value: '0.20', desc: 'Twinproc (8/9)' }, { value: '0.19', desc: 'Twinproc (7/9)' }, { value: '0.18', desc: 'Twinproc (6/9)' }, { value: '0.15', desc: 'Twinproc (5/9)' }, { value: '0.12', desc: 'Twinproc (4/9)' }, { value: '0.09', desc: 'Twinproc (3/9)' }, { value: '0.06', desc: 'Twinproc (2/9)' }, { value: '0.03', desc: 'Twinproc (1/9)' }, { value: '0', desc: 'Twinproc (0/9)' }]
}];

var magDPSAAContext = exports.magDPSAAContext = [{
  id: 'aa-destfury',
  value: '340',
  desc: 'Destructive Fury (38/38)',
  data: [{ value: '340', desc: 'Destructive Fury (38/38)' }, { value: '335', desc: 'Destructive Fury (37/38)' }, { value: '330', desc: 'Destructive Fury (36/38)' }, { value: '320', desc: 'Destructive Fury (35/38)' }, { value: '310', desc: 'Destructive Fury (34/38)' }, { value: '301', desc: 'Destructive Fury (33/38)' }, { value: '296', desc: 'Destructive Fury (32/38)' }, { value: '291', desc: 'Destructive Fury (31/38)' }, { value: '286', desc: 'Destructive Fury (30/38)' }, { value: '279', desc: 'Destructive Fury (29/38)' }, { value: '272', desc: 'Destructive Fury (28/38)' }, { value: '265', desc: 'Destructive Fury (27/38)' }, { value: '251', desc: 'Destructive Fury (26/38)' }, { value: '238', desc: 'Destructive Fury (25/38)' }, { value: '230', desc: 'Destructive Fury (24/38)' }, { value: '222', desc: 'Destructive Fury (23/38)' }, { value: '214', desc: 'Destructive Fury (22/38)' }, { value: '206', desc: 'Destructive Fury (21/38)' }, { value: '199', desc: 'Destructive Fury (20/38)' }, { value: '192', desc: 'Destructive Fury (19/38)' }, { value: '185', desc: 'Destructive Fury (18/38)' }, { value: '180', desc: 'Destructive Fury (17/38)' }, { value: '175', desc: 'Destructive Fury (16/38)' }, { value: '170', desc: 'Destructive Fury (15/38)' }, { value: '165', desc: 'Destructive Fury (14/38)' }, { value: '160', desc: 'Destructive Fury (13/38)' }, { value: '155', desc: 'Destructive Fury (12/38)' }, { value: '150', desc: 'Destructive Fury (11/38)' }, { value: '145', desc: 'Destructive Fury (10/38)' }, { value: '140', desc: 'Destructive Fury (9/38)' }, { value: '135', desc: 'Destructive Fury (8/38)' }, { value: '130', desc: 'Destructive Fury (7/38)' }, { value: '125', desc: 'Destructive Fury (6/38)' }, { value: '115', desc: 'Destructive Fury (5/38)' }, { value: '107', desc: 'Destructive Fury (4/38)' }, { value: '100', desc: 'Destructive Fury (3/38)' }, { value: '60', desc: 'Destructive Fury (2/38)' }, { value: '30', desc: 'Destructive Fury (1/38)' }, { value: '0', desc: 'Destructive Fury (0/38)  ' }]
}, {
  id: 'aa-don',
  value: '1',
  desc: 'Dark Reign/Keepers DoN (5/5)',
  data: [{ value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' }, { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }]
}, {
  id: 'aa-force-of-elements',
  value: 'FE18',
  desc: 'Force of Elements (18/18)',
  data: [{ value: 'FE18', desc: 'Force of Elements (18/18)' }, { value: 'FE17', desc: 'Force of Elements (17/18)' }, { value: 'FE16', desc: 'Force of Elements (16/18)' }, { value: 'FE15', desc: 'Force of Elements (15/18)' }, { value: 'FE14', desc: 'Force of Elements (14/18)' }, { value: 'FE13', desc: 'Force of Elements (13/18)' }]
}, {
  id: 'aa-furymagic',
  value: '57',
  desc: 'Fury of Magic (30/30)',
  data: [{ value: '57', desc: 'Fury of Magic (30/30)' }, { value: '55', desc: 'Fury of Magic (29/30)' }, { value: '53', desc: 'Fury of Magic (28/30)' }, { value: '52', desc: 'Fury of Magic (27/30)' }, { value: '50', desc: 'Fury of Magic (26/30)' }, { value: '48', desc: 'Fury of Magic (25/30)' }, { value: '46', desc: 'Fury of Magic (24/30)' }, { value: '44', desc: 'Fury of Magic (23/30)' }, { value: '42', desc: 'Fury of Magic (22/30)' }, { value: '40', desc: 'Fury of Magic (21/30)' }, { value: '38', desc: 'Fury of Magic (20/30)' }, { value: '36', desc: 'Fury of Magic (19/30)' }, { value: '34', desc: 'Fury of Magic (18/30)' }, { value: '32', desc: 'Fury of Magic (17/30)' }, { value: '30', desc: 'Fury of Magic (16/30)' }, { value: '25', desc: 'Fury of Magic (15/30)' }, { value: '24', desc: 'Fury of Magic (14/30)' }, { value: '23', desc: 'Fury of Magic (13/30)' }, { value: '22', desc: 'Fury of Magic (12/30)' }, { value: '20', desc: 'Fury of Magic (11/30)' }, { value: '18', desc: 'Fury of Magic (10/30)' }, { value: '16', desc: 'Fury of Magic (9/30)' }, { value: '15', desc: 'Fury of Magic (8/30)' }, { value: '14', desc: 'Fury of Magic (7/30)' }, { value: '13', desc: 'Fury of Magic (6/30)' }, { value: '11', desc: 'Fury of Magic (5/30)' }, { value: '9', desc: 'Fury of Magic (4/30)' }, { value: '7', desc: 'Fury of Magic (3/30)' }, { value: '4', desc: 'Fury of Magic (2/30)' }, { value: '2', desc: 'Fury of Magic (1/30)' }, { value: '0', desc: 'Fury of Magic (0/30)' }]
}, {
  id: 'aa-steelveng',
  value: '12',
  desc: 'Steel Vengeance (12/12)',
  data: [{ value: '12', desc: 'Steel Vengeance (12/12)' }, { value: '11', desc: 'Steel Vengeance (11/12)' }, { value: '10', desc: 'Steel Vengeance (10/12)' }, { value: '0', desc: 'Steel Vengeance (0/12)' }]
}, {
  id: 'aa-twincast',
  value: '0.05',
  desc: 'Twincast (5/5)',
  data: [{ value: '0.05', desc: 'Twincast (5/5)' }, { value: '0.04', desc: 'Twincast (4/5)' }, { value: '0.03', desc: 'Twincast (3/5)' }, { value: '0.02', desc: 'Twincast (2/5)' }, { value: '0.01', desc: 'Twincast (1/5)' }, { value: '0', desc: 'Twincast (0/5)' }]
}, {
  id: 'aa-twinproc',
  value: '0.20',
  desc: 'Twinproc (8/8)',
  data: [{ value: '0.20', desc: 'Twinproc (8/8)' }, { value: '0.19', desc: 'Twinproc (7/8)' }, { value: '0.18', desc: 'Twinproc (6/8)' }, { value: '0.15', desc: 'Twinproc (5/8)' }, { value: '0.12', desc: 'Twinproc (4/8)' }, { value: '0.09', desc: 'Twinproc (3/8)' }, { value: '0.06', desc: 'Twinproc (2/8)' }, { value: '0.03', desc: 'Twinproc (1/8)' }, { value: '0', desc: 'Twinproc (0/8)' }]
}];

var encDPSAAContext = exports.encDPSAAContext = [{
  id: 'aa-critafflic',
  value: '33',
  desc: 'Critical Affliction (11/11)',
  data: [{ value: '33', desc: 'Critical Affliction (11/11)' }, { value: '30', desc: 'Critical Affliction (10/11)' }, { value: '27', desc: 'Critical Affliction (9/11)' }, { value: '24', desc: 'Critical Affliction (8/11)' }, { value: '21', desc: 'Critical Affliction (7/11)' }, { value: '18', desc: 'Critical Affliction (6/11)' }, { value: '15', desc: 'Critical Affliction (5/11)' }, { value: '12', desc: 'Critical Affliction (4/11)' }, { value: '9', desc: 'Critical Affliction (3/11)' }, { value: '6', desc: 'Critical Affliction (2/11)' }, { value: '3', desc: 'Critical Affliction (1/11)' }, { value: '0', desc: 'Critical Affliction (0/11)  ' }]
}, {
  id: 'aa-destcascade',
  value: '375',
  desc: 'Destructive Cascade (39/39)',
  data: [{ value: '375', desc: 'Destructive Cascade (39/39)' }, { value: '370', desc: 'Destructive Cascade (38/39)' }, { value: '365', desc: 'Destructive Cascade (37/39)' }, { value: '360', desc: 'Destructive Cascade (36/39)' }, { value: '356', desc: 'Destructive Cascade (35/39)' }, { value: '352', desc: 'Destructive Cascade (34/39)' }, { value: '347', desc: 'Destructive Cascade (33/39)' }, { value: '343', desc: 'Destructive Cascade (32/39)' }, { value: '338', desc: 'Destructive Cascade (31/39)' }, { value: '334', desc: 'Destructive Cascade (30/39)' }, { value: '329', desc: 'Destructive Cascade (29/39)' }, { value: '325', desc: 'Destructive Cascade (28/39)' }, { value: '321', desc: 'Destructive Cascade (27/39)' }, { value: '318', desc: 'Destructive Cascade (26/39)' }, { value: '315', desc: 'Destructive Cascade (25/39)' }, { value: '310', desc: 'Destructive Cascade (24/39)' }, { value: '305', desc: 'Destructive Cascade (23/39)' }, { value: '300', desc: 'Destructive Cascade (22/39)' }, { value: '295', desc: 'Destructive Cascade (21/39)' }, { value: '290', desc: 'Destructive Cascade (20/39)' }, { value: '285', desc: 'Destructive Cascade (19/39)' }, { value: '280', desc: 'Destructive Cascade (18/39)' }, { value: '275', desc: 'Destructive Cascade (17/39)' }, { value: '270', desc: 'Destructive Cascade (16/39)' }, { value: '265', desc: 'Destructive Cascade (15/39)' }, { value: '260', desc: 'Destructive Cascade (14/39)' }, { value: '250', desc: 'Destructive Cascade (13/39)' }, { value: '240', desc: 'Destructive Cascade (12/39)' }, { value: '230', desc: 'Destructive Cascade (11/39)' }, { value: '215', desc: 'Destructive Cascade (10/39)' }, { value: '200', desc: 'Destructive Cascade (9/39)' }, { value: '175', desc: 'Destructive Cascade (8/39)' }, { value: '150', desc: 'Destructive Cascade (7/39)' }, { value: '140', desc: 'Destructive Cascade (6/39)' }, { value: '135', desc: 'Destructive Cascade (5/39)' }, { value: '130', desc: 'Destructive Cascade (4/39)' }, { value: '125', desc: 'Destructive Cascade (3/39)' }, { value: '115', desc: 'Destructive Cascade (2/39)' }, { value: '107', desc: 'Destructive Cascade (1/39)' }, { value: '0', desc: 'Destructive Cascade (0/39)  ' }]
}, {
  id: 'aa-destfury',
  value: '340',
  desc: 'Destructive Fury (38/38)',
  data: [{ value: '340', desc: 'Destructive Fury (38/38)' }, { value: '335', desc: 'Destructive Fury (37/38)' }, { value: '330', desc: 'Destructive Fury (36/38)' }, { value: '320', desc: 'Destructive Fury (35/38)' }, { value: '310', desc: 'Destructive Fury (34/38)' }, { value: '301', desc: 'Destructive Fury (33/38)' }, { value: '296', desc: 'Destructive Fury (32/38)' }, { value: '291', desc: 'Destructive Fury (31/38)' }, { value: '286', desc: 'Destructive Fury (30/38)' }, { value: '279', desc: 'Destructive Fury (29/38)' }, { value: '272', desc: 'Destructive Fury (28/38)' }, { value: '265', desc: 'Destructive Fury (27/38)' }, { value: '251', desc: 'Destructive Fury (26/38)' }, { value: '238', desc: 'Destructive Fury (25/38)' }, { value: '230', desc: 'Destructive Fury (24/38)' }, { value: '222', desc: 'Destructive Fury (23/38)' }, { value: '214', desc: 'Destructive Fury (22/38)' }, { value: '206', desc: 'Destructive Fury (21/38)' }, { value: '199', desc: 'Destructive Fury (20/38)' }, { value: '192', desc: 'Destructive Fury (19/38)' }, { value: '185', desc: 'Destructive Fury (18/38)' }, { value: '180', desc: 'Destructive Fury (17/38)' }, { value: '175', desc: 'Destructive Fury (16/38)' }, { value: '170', desc: 'Destructive Fury (15/38)' }, { value: '165', desc: 'Destructive Fury (14/38)' }, { value: '160', desc: 'Destructive Fury (13/38)' }, { value: '155', desc: 'Destructive Fury (12/38)' }, { value: '150', desc: 'Destructive Fury (11/38)' }, { value: '145', desc: 'Destructive Fury (10/38)' }, { value: '140', desc: 'Destructive Fury (9/38)' }, { value: '135', desc: 'Destructive Fury (8/38)' }, { value: '130', desc: 'Destructive Fury (7/38)' }, { value: '125', desc: 'Destructive Fury (6/38)' }, { value: '115', desc: 'Destructive Fury (5/38)' }, { value: '107', desc: 'Destructive Fury (4/38)' }, { value: '100', desc: 'Destructive Fury (3/38)' }, { value: '60', desc: 'Destructive Fury (2/38)' }, { value: '30', desc: 'Destructive Fury (1/38)' }, { value: '0', desc: 'Destructive Fury (0/38)  ' }]
}, {
  id: 'aa-don',
  value: '1',
  desc: 'Dark Reign/Keepers DoN (5/5)',
  data: [{ value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' }, { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' }, { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }]
}, {
  id: 'aa-furymagic',
  value: '57',
  desc: 'Fury of Magic (30/30)',
  data: [{ value: '57', desc: 'Fury of Magic (30/30)' }, { value: '55', desc: 'Fury of Magic (29/30)' }, { value: '53', desc: 'Fury of Magic (28/30)' }, { value: '52', desc: 'Fury of Magic (27/30)' }, { value: '50', desc: 'Fury of Magic (26/30)' }, { value: '48', desc: 'Fury of Magic (25/30)' }, { value: '46', desc: 'Fury of Magic (24/30)' }, { value: '44', desc: 'Fury of Magic (23/30)' }, { value: '42', desc: 'Fury of Magic (22/30)' }, { value: '40', desc: 'Fury of Magic (21/30)' }, { value: '38', desc: 'Fury of Magic (20/30)' }, { value: '36', desc: 'Fury of Magic (19/30)' }, { value: '34', desc: 'Fury of Magic (18/30)' }, { value: '32', desc: 'Fury of Magic (17/30)' }, { value: '30', desc: 'Fury of Magic (16/30)' }, { value: '25', desc: 'Fury of Magic (15/30)' }, { value: '24', desc: 'Fury of Magic (14/30)' }, { value: '23', desc: 'Fury of Magic (13/30)' }, { value: '22', desc: 'Fury of Magic (12/30)' }, { value: '20', desc: 'Fury of Magic (11/30)' }, { value: '18', desc: 'Fury of Magic (10/30)' }, { value: '16', desc: 'Fury of Magic (9/30)' }, { value: '15', desc: 'Fury of Magic (8/30)' }, { value: '14', desc: 'Fury of Magic (7/30)' }, { value: '13', desc: 'Fury of Magic (6/30)' }, { value: '11', desc: 'Fury of Magic (5/30)' }, { value: '9', desc: 'Fury of Magic (4/30)' }, { value: '7', desc: 'Fury of Magic (3/30)' }, { value: '4', desc: 'Fury of Magic (2/30)' }, { value: '2', desc: 'Fury of Magic (1/30)' }, { value: '0', desc: 'Fury of Magic (0/30)' }]
}, {
  id: 'aa-hazy',
  value: '0.08',
  desc: 'Gift of Hazy Thoughts (1/1)',
  data: [{ value: '0.08', desc: 'Gift of Hazy Thoughts (1/1)' }, { value: '0', desc: 'Gift of Hazy Thoughts (0/1)' }]
}, {
  id: 'aa-twincast',
  value: '0.05',
  desc: 'Twincast (5/5)',
  data: [{ value: '0.05', desc: 'Twincast (5/5)' }, { value: '0.04', desc: 'Twincast (4/5)' }, { value: '0.03', desc: 'Twincast (3/5)' }, { value: '0.02', desc: 'Twincast (2/5)' }, { value: '0.01', desc: 'Twincast (1/5)' }, { value: '0', desc: 'Twincast (0/5)' }]
}, {
  id: 'aa-twinproc',
  value: '0.20',
  desc: 'Twinproc (8/8)',
  data: [{ value: '0.20', desc: 'Twinproc (8/8)' }, { value: '0.19', desc: 'Twinproc (7/8)' }, { value: '0.18', desc: 'Twinproc (6/8)' }, { value: '0.15', desc: 'Twinproc (5/8)' }, { value: '0.12', desc: 'Twinproc (4/8)' }, { value: '0.09', desc: 'Twinproc (3/8)' }, { value: '0.06', desc: 'Twinproc (2/8)' }, { value: '0.03', desc: 'Twinproc (1/8)' }, { value: '0', desc: 'Twinproc (0/8)' }]
}];

var chartOptions = exports.chartOptions = {
  spellline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'center',
    zoomable: true,
    editable: false,
    clickToUse: false,
    maxHeight: '160px',
    minHeight: '100px',
    selectable: false
  },
  timeline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'left',
    zoomable: true,
    editable: {
      add: false,
      updateTime: true,
      remove: true
    },
    clickToUse: false
  },
  graphcritr: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        range: {
          min: -20,
          max: 130
        },
        title: {
          text: 'Crit Rate'
        }
      },
      visible: false
    },
    interpolation: true,
    height: '85px',
    drawPoints: {
      size: 0
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  },
  graphcritd: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        range: {
          min: -200,
          max: 1200
        },
        title: {
          text: 'Crit Dmg%'
        }
      },
      visible: false
    },
    interpolation: true,
    height: '85px',
    drawPoints: {
      size: 0
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  },
  graphdmg: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        title: {
          text: 'Damage'
        }
      },
      visible: false
    },
    interpolation: false,
    height: '130px',
    drawPoints: {
      size: 1,
      style: 'circle'
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f;
var has = __webpack_require__(12);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(26);
var fails = __webpack_require__(3);
var spaces = __webpack_require__(94);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(165);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLASS_TO_NAME = undefined;

var _assign = __webpack_require__(184);

var _assign2 = _interopRequireDefault(_assign);

exports.copyToClipboard = copyToClipboard;
exports.appendHtml = appendHtml;
exports.asDecimal32Precision = asDecimal32Precision;
exports.checkTimerList = checkTimerList;
exports.clearCache = clearCache;
exports.createLabel = createLabel;
exports.collapseMenu = collapseMenu;
exports.createTimer = createTimer;
exports.displayPercent = displayPercent;
exports.getCastTime = getCastTime;
exports.getCurrentTime = getCurrentTime;
exports.getCounterKeys = getCounterKeys;
exports.getNumberValue = getNumberValue;
exports.getPercentClass = getPercentClass;
exports.getPercentText = getPercentText;
exports.getSpellData = getSpellData;
exports.getAllSpellData = getAllSpellData;
exports.getUrlParameter = getUrlParameter;
exports.isAbilityActive = isAbilityActive;
exports.isAbilityExpired = isAbilityExpired;
exports.numberWithCommas = numberWithCommas;
exports.readChartOptions = readChartOptions;
exports.readDmgFocusContext = readDmgFocusContext;
exports.readMainContext = readMainContext;
exports.readSpellFocusContext = readSpellFocusContext;
exports.readSpellList = readSpellList;
exports.setRank = setRank;
exports.getRank = getRank;
exports.getAppURL = getAppURL;
exports.switchMode = switchMode;
exports.toUpper = toUpper;
exports.useCache = useCache;

var _settings = __webpack_require__(52);

var SETTINGS = _interopRequireWildcard(_settings);

var _spelldataGeneral = __webpack_require__(436);

var _spelldataWiz = __webpack_require__(437);

var _spelldataMage = __webpack_require__(438);

var _spelldataEnc = __webpack_require__(439);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUERY_CACHE = {};
var RANK = 'Rk3';

var CLASS_TO_NAME = exports.CLASS_TO_NAME = {
  brd: 'Bard',
  dru: 'Druid',
  enc: 'Enchanter',
  rng: 'Ranger',
  nec: 'Necromancer',
  mag: 'Magician',
  war: 'Warrior',
  wiz: 'Wizard'
};

// Copies a string to the clipboard. Must be called from within an 
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+, 
// Firefox 42+, Safari 10+, Edge and IE 10+.
// IE: The clipboard feature may be disabled by an administrator. By
// default a prompt is shown the first time the clipboard is 
// used (per session).
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData("Text", text);
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function getActiveState(state, key) {
  var keys = getCounterKeys(key);
  var activeTimer = void 0;

  if (state[keys.expireTime] !== undefined && state[keys.expireTime] !== -1) {
    if (state[keys.expireTime] < state.workingTime) {
      state[keys.expireTime] = -1;

      // clear counters if expired
      if (state[keys.counter] !== undefined) {
        state[keys.counter] = 0;
      }
      return 'expired';
    } else {
      activeTimer = true;
    }
  }

  if (state[keys.counter] !== undefined) {
    if (state[keys.counter] <= 0) {
      return false;
    } else if (activeTimer || activeTimer === undefined) {
      return true;
    }
  }

  return !!activeTimer;
}

function appendHtml(context, html, count) {
  for (var i = 0; i < count; i++) {
    var $el = $(html);
    $el.find('button').attr('id', 'sBtn' + i);
    context.append($el);
  }
}

function asDecimal32Precision(value) {
  return +value.toFixed(7);
}

function checkTimerList(state, counterKey, timerKey) {
  var timers = state[timerKey];

  if (timers && timers.length > 0) {
    var updatedTimers = [];
    $(timers).each(function (i, timer) {
      if (state.workingTime > timer.expireTime) {
        state[counterKey] = timer.update(state[counterKey]);
      } else {
        updatedTimers.push(timer);
      }
    });

    state[timerKey] = updatedTimers;
  }
}

function clearCache() {
  QUERY_CACHE = {};
}

function createLabel(ability, date) {
  var label = void 0;
  if (!ability.instant) {
    label = ability.name + ' (zzz)';

    var m = date.getMinutes();
    var s = date.getSeconds();
    if (m > 0) {
      if (s > 0) {
        label = label.replace('zzz', m + 'm' + s);
      } else {
        label = label.replace('zzz', m + 'm');
      }
    } else {
      label = label.replace('zzz', s + 's');
    }
  } else {
    label = ability.name;
  }

  return label;
}

function collapseMenu(p) {
  var doShow = function doShow(hidden) {
    if (hidden.length > 0) {
      hidden.show();
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-down');
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-left');
    } else {
      $(p).siblings('li').hide();
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-down');
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-left');
    }
  };

  switch (_settings.globals.MODE) {
    case 'wiz':
      doShow($(p).siblings('li:hidden:not(".enc-only,.mag-only")'));
      break;
    case 'mag':
      doShow($(p).siblings('li:hidden:not(".enc-only,.wiz-only")'));
      break;
    case 'enc':
      doShow($(p).siblings('li:hidden:not(".wiz-only,.mag-only")'));
      break;
  }
}

function createTimer(expireTime, updateFunc) {
  return { expireTime: expireTime, update: updateFunc };
}

function displayPercent(value) {
  return value ? (value * 100).toFixed(2) + "%" : "0%";
}

function getCastTime(state, spell) {
  var castTime = spell.castTime;

  // cast spells that can be adjusted
  // DF is listed as 250 atm 
  if (spell.level <= 250 && spell.castTime > 0) {
    var adjust = 0;
    if (state && state.activeAbilities.has('QT')) {
      adjust = 250;
    }

    var origCastTime = spell.origCastTime;
    if (spell.mez) {
      // enc mez have 30% bonus AA
      origCastTime -= adjust;
      castTime = origCastTime - origCastTime * 0.30;
    } else if (origCastTime >= 3000) {
      origCastTime -= adjust;
      if (['DF', 'FBC'].find(function (id) {
        return id === spell.id;
      })) {
        // DF and FBC don't receive benefit from AA quicker damage
        castTime = origCastTime - origCastTime * 0.34;
      } else {
        // most spells hit 50% cap with piety + legs + AA (11 + 23 + 20)
        castTime = origCastTime - origCastTime * 0.50;
      }
    } else {
      origCastTime -= adjust;
      // spells with low cast times only receive AA benefit
      castTime = origCastTime - origCastTime * 0.20;
    }
  }

  return castTime;
}

function getCurrentTime() {
  var date = new Date();
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
}

function getCounterKeys(key) {
  return useCache('counter-key-' + key, function () {
    var lower = key.toLowerCase();
    return {
      counter: lower + 'Counter',
      charges: lower + 'ChargesUsed',
      addDmg: lower + 'AddDmg',
      expireTime: lower + 'ExpireTime',
      timers: lower + 'Timers'
    };
  });
}

function getNumberValue(n) {
  return Number(n) || 0;
}

function getPercentClass(first, second) {
  var className = "";
  if (first > second) {
    className = 'stat-down';
  } else if (first < second) {
    className = 'stat-up';
  }

  return className;
}

function getPercentText(first, second) {
  var value = second - first;
  if (value != 0) {
    value = value > 0 ? second / first * 100 - 100 : 100 - second / first * 100;
  }

  value = value > 99999 ? value.toExponential(2) : value.toFixed(2);
  return (second - first > 0 ? '+' : '-') + value + '%';
}

function getSpellData(id) {
  var data = {};
  var altData = {};

  var altRankId = id + RANK;
  switch (_settings.globals.MODE) {
    case 'enc':
      data = _spelldataGeneral.SPELL_DATA[id] || _spelldataEnc.SPELL_DATA[id] || data;
      altData = _spelldataGeneral.SPELL_DATA[altRankId] || _spelldataEnc.SPELL_DATA[altRankId] || altData;
      break;
    case 'mag':
      data = _spelldataGeneral.SPELL_DATA[id] || _spelldataMage.SPELL_DATA[id] || data;
      altData = _spelldataGeneral.SPELL_DATA[altRankId] || _spelldataMage.SPELL_DATA[altRankId] || altData;
      break;
    case 'wiz':
      data = _spelldataGeneral.SPELL_DATA[id] || _spelldataWiz.SPELL_DATA[id] || data;
      altData = _spelldataGeneral.SPELL_DATA[altRankId] || _spelldataWiz.SPELL_DATA[altRankId] || altData;
      break;
  }

  return (0, _assign2.default)(data, altData);
}

function getAllSpellData() {
  return [{ name: 'gen', spells: _spelldataGeneral.SPELL_DATA }, { name: 'enc', spells: _spelldataEnc.SPELL_DATA }, { name: 'mag', spells: _spelldataMage.SPELL_DATA }, { name: 'wiz', spells: _spelldataWiz.SPELL_DATA }];
}

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName = void 0,
      i = void 0;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
}

function isAbilityActive(state, key) {
  var activeState = getActiveState(state, key);

  if (activeState === 'expired') {
    return false;
  }

  return activeState;
}

function isAbilityExpired(state, key) {
  return getActiveState(state, key) === 'expired';
}

function numberWithCommas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function readChartOptions(key, time) {
  var opts = SETTINGS['chartOptions'][key];
  opts.start = time - 5000;
  opts.end = time + 120000;
  opts.min = time - 5000;
  return opts;
}

function readDmgFocusContext() {
  return SETTINGS['basicDmgFocusContext'];
}

function readMainContext() {
  return SETTINGS[_settings.globals.MODE + 'DPSAAContext'];
}

function readSpellFocusContext() {
  return SETTINGS[_settings.globals.MODE + 'SpellFocusAAContext'];
}

function readSpellList() {
  var list = [];
  $(SETTINGS[_settings.globals.MODE + 'SpellList']).each(function (i, id) {
    list.push(getSpellData(id));
  });
  return list;
}

function setRank(toRank) {
  RANK = toRank;
}

function getRank() {
  return RANK;
}

function getAppURL() {
  return window.location.protocol + "//" + window.location.hostname + (window.location.port !== '' ? ':' + window.location.port : '') + window.location.pathname + '?class=' + _settings.globals.MODE;
}

function switchMode(toMode) {
  if (_settings.globals.MODE !== toMode) {
    var className = toMode;
    var classInfo = className ? '?class=' + className : '';
    window.location.assign(window.location.protocol + "//" + window.location.hostname + (window.location.port !== '' ? ':' + window.location.port : '') + window.location.pathname + classInfo);
  }
}

function toUpper(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function useCache(cacheKey, readFunc) {
  var value = QUERY_CACHE[cacheKey];
  if (value === undefined) {
    value = readFunc();
    QUERY_CACHE[cacheKey] = value;
  }

  return value;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(21);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(21);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(398), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(84);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPA_KEY_MAP = exports.SPA_TWINCAST = exports.SPA_NO_DMG = exports.SPA_FOCUSABLE = exports.SPA_EFFECTIVENESS = exports.SPA_CRIT_RATE_NUKE = exports.SPA_CRIT_DMG_NUKE = exports.SPA_CRIT_RATE_DOT = exports.SPA_CRIT_DMG_DOT = exports.SPA_461_FOCUS = exports.SPA_BEFORE_DOT_CRIT_FOCUS = exports.SPA_BEFORE_CRIT_FOCUS = exports.SPA_BEFORE_CRIT_ADD = exports.SPA_AFTER_SPA_461_FOCUS = exports.SPA_AFTER_SPA_461_ADD = exports.SPA_AFTER_CRIT_FOCUS = exports.SPA_AFTER_CRIT_ADD = exports.SPA_483_FOCUS = undefined;

var _keys = __webpack_require__(127);

var _keys2 = _interopRequireDefault(_keys);

var _map = __webpack_require__(62);

var _map2 = _interopRequireDefault(_map);

exports.get = get;
exports.getAll = getAll;
exports.getProcEffectForAbility = getProcEffectForAbility;
exports.getAbilityList = getAbilityList;
exports.hasSPA = hasSPA;
exports.setCharges = setCharges;
exports.setProcValue = setProcValue;
exports.setSPAValue = setSPAValue;

var _settings = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SPA
// 124 - increase spell damage                   (before DoT crit)
// 170 - increase nuke crit damage
// 212 - increase nuke crit chance
// 273 - increase dot crit chance
// 286 - increase spell damage                   (after crit addition)
// 294 - increase nuke crit chance
// 296 - increase spell damage                   (before crit multiplyer)
// 297 - increase spell damage                   (before crit addition)
// 302 - increase spell damage                   (before crit multiplyer)
// 303 - increase spell damage                   (before crit addition)
// 375 - increase dot crit damage
// 399 - increase twincast rate
// 413 - increase spell effectiveness            (effectiveness multiplyer)
// 461 - increase spell damage v2                (special crit multiplier)
// 462 - increase spell damage                   (after crit addition)
// 483 - increase spell and dot damage taken     (after SPA 461 mutliplyer)
// 484 - increase spell damage taken             (after SPA 461 addition not modifiable)
// 507 - increase spell damage                   (after SPA 461 multiplayer)

// Notes
// tick durations rounded up 1/2 tick since it seems random what you really get
//   Ex: twincast is 3 ticks and gets 18 to 24 seconds so I go with 21
// 
// repeatEvery -1 means repeat always
//              0 means dont repeat
//             +N repeat every N 
//             -999 repeat when activated by some means like proc/cast

var SPA_483_FOCUS = exports.SPA_483_FOCUS = SMap([483]);
var SPA_AFTER_CRIT_ADD = exports.SPA_AFTER_CRIT_ADD = SMap([286]);
var SPA_AFTER_CRIT_FOCUS = exports.SPA_AFTER_CRIT_FOCUS = SMap([]);
var SPA_AFTER_SPA_461_ADD = exports.SPA_AFTER_SPA_461_ADD = SMap([462, 484]);
var SPA_AFTER_SPA_461_FOCUS = exports.SPA_AFTER_SPA_461_FOCUS = SMap([507]);
var SPA_BEFORE_CRIT_ADD = exports.SPA_BEFORE_CRIT_ADD = SMap([297, 303]);
var SPA_BEFORE_CRIT_FOCUS = exports.SPA_BEFORE_CRIT_FOCUS = SMap([296, 302]);
var SPA_BEFORE_DOT_CRIT_FOCUS = exports.SPA_BEFORE_DOT_CRIT_FOCUS = SMap([124]);
var SPA_461_FOCUS = exports.SPA_461_FOCUS = SMap([461]);
var SPA_CRIT_DMG_DOT = exports.SPA_CRIT_DMG_DOT = SMap([375]);
var SPA_CRIT_RATE_DOT = exports.SPA_CRIT_RATE_DOT = SMap([273]);
var SPA_CRIT_DMG_NUKE = exports.SPA_CRIT_DMG_NUKE = SMap([170]);
var SPA_CRIT_RATE_NUKE = exports.SPA_CRIT_RATE_NUKE = SMap([212, 294]);
var SPA_EFFECTIVENESS = exports.SPA_EFFECTIVENESS = SMap([413]);
var SPA_FOCUSABLE = exports.SPA_FOCUSABLE = SMap([124, 212, 286, 296, 297, 302, 303, 399, 461, 462, 483, 484, 507]);
var SPA_NO_DMG = exports.SPA_NO_DMG = SMap([389, 399]);
var SPA_TWINCAST = exports.SPA_TWINCAST = SMap([399]);

// Build SPA to key Map
var SPA_KEY_MAP = exports.SPA_KEY_MAP = new _map2.default();
SPA_CRIT_RATE_NUKE.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'addCritRate');
});
SPA_CRIT_DMG_NUKE.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'addCritDmg');
});
SPA_483_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'spa483Focus');
});
SPA_AFTER_CRIT_ADD.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'afterCritAdd');
});
SPA_AFTER_CRIT_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'afterCritFocus');
});
SPA_AFTER_SPA_461_ADD.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'afterSPA461Add');
});
SPA_AFTER_SPA_461_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'afterSPA461Focus');
});
SPA_BEFORE_CRIT_ADD.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'beforeCritAdd');
});
SPA_BEFORE_CRIT_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'beforeCritFocus');
});
SPA_BEFORE_DOT_CRIT_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'beforeDoTCritFocus');
});
SPA_461_FOCUS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'spa461Focus');
});
SPA_EFFECTIVENESS.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'effectiveness');
});
SPA_TWINCAST.forEach(function (val, spa) {
  return SPA_KEY_MAP.set(spa, 'twincast');
});

function get(ability) {
  return ABILITIES[ability];
}

function getAll() {
  return (0, _keys2.default)(ABILITIES).sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }

    if (b.name > a.name) {
      return -1;
    }

    return 0;
  });
}

function getProcEffectForAbility(ability) {
  if (ability && ability.effects) {
    return ability.effects.find(function (effect) {
      return effect.proc !== undefined;
    });
  }
}

function getAbilityList(repeating) {
  var list = [];

  (0, _keys2.default)(ABILITIES).forEach(function (key) {
    var ability = ABILITIES[key];

    if ((!ability.mode || ability.mode && ability.mode === _settings.globals.MODE) && (!ability.noClass || !ability.noClass.find(function (cls) {
      return cls === _settings.globals.MODE;
    }))) {
      if (!repeating && ability.adpsDropdown || repeating && ability.repeatEvery) {
        list.push({
          class: ability.class,
          debuff: !!ability.debuff,
          id: key,
          manuallyActivated: ability.manuallyActivated,
          name: ability.name,
          otherCast: ability.otherCast,
          refreshTime: ability.refreshTime,
          repeatEvery: ability.repeatEvery,
          tooltip: ability.tooltip
        });
      }
    }
  });

  return list.sort(abilitySorter);
}

function hasSPA(ability, spaSet) {
  return ability ? ability.effects.find(function (effect) {
    return spaSet.has(effect.spa);
  }) : false;
}

function setCharges(id, value) {
  if (ABILITIES[id]) {
    ABILITIES[id].charges = value;
  }
}

function setProcValue(id, value) {
  if (ABILITIES[id]) {
    var found = ABILITIES[id].effects.find(function (effect) {
      return effect.proc !== undefined;
    });
    if (found) {
      found.proc = value;
    }
  }
}

function setSPAValue(id, spa, value) {
  if (ABILITIES[id]) {
    var found = ABILITIES[id].effects.find(function (effect) {
      return effect.spa === spa;
    });
    if (found) {
      found.value = value;
    }
  }
}

function abilitySorter(a, b) {
  var aClass = _settings.globals.MODE !== a.class || a.otherCast ? a.class : '';
  var bClass = _settings.globals.MODE !== b.class || b.otherCast ? b.class : '';
  var aName = (aClass || '') + a.name;
  var bName = (bClass || '') + b.name;

  if (aName > bName) return 1;
  if (bName > aName) return -1;
  return 0;
}

function SMap(list) {
  var map = new _map2.default();
  list.forEach(function (item) {
    return map.set(item, true);
  });
  return map;
}

var COMBAT_SKILLS = SMap([]); // not needed yet
var TARGET_LOS = SMap(['LOS']);
var TARGET_SINGLE = SMap(['SINGLE']);
var TICK_OFFSET = 3000;

var ABILITIES = {
  AB: {
    charges: 4,
    class: 'brd',
    duration: 24000 + TICK_OFFSET, // about 4 ticks
    level: 115,
    name: 'New Arcane Ballad Rk. III',
    refreshTime: 12000, // varies depending on bard melody set
    repeatEvery: -1,
    effects: [{
      proc: 'AB',
      limits: [{ onSpellUse: true }, { currentHitPoints: true }, { exSpells: SMap(['AB']) }, { maxLevel: 115 }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }]
    }]
  },
  AD: {
    adpsDropdown: true,
    charges: 24,
    class: 'wiz',
    duration: 280000,
    level: 254,
    mode: 'wiz',
    name: 'Arcane Destruction V',
    effects: [{
      spa: 212,
      slot: 1,
      type: 'sp',
      value: 0.60,
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { minDmg: 100 }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }]
    }]
  },
  AF: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 240000,
    level: 254,
    mode: 'wiz',
    name: 'Arcane Fury III',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'sp',
      value: 0.15,
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { minManaCost: 10 }, { maxLevel: 115 }]
    }]
  },
  AFU: {
    class: 'wiz',
    level: 254,
    mode: 'wiz',
    name: 'Arcane Fusion',
    effects: [{
      proc: '', // value read from settings/UI choice
      limits: [{ onSpellUse: true }, { maxDuration: 0 }, { minManaCost: 10 }, { minLevel: 100 }, { minCastTime: 3000 }]
    }]
  },
  CHROMEA: {
    adpsDropdown: true,
    class: 'enc',
    charges: 6,
    duration: 18000 + TICK_OFFSET,
    level: 108,
    mode: 'enc',
    name: 'Chromatic Covenant Rk. III',
    otherCast: true,
    effects: [{
      spa: 484,
      slot: 1,
      type: 'sp',
      value: 51182,
      limits: [{ targets: TARGET_SINGLE }, { currentHitPoints: true }, { type: 'detrimental' }, { minLevel: 101 }, { maxLevel: 115 }, { maxDuration: 0 }, { minManaCost: 10 }, { minDmg: 2500 }]
    }]
  },
  CI: {
    adpsDropdown: true,
    charges: 27,
    class: 'enc',
    duration: 240000,
    level: 254,
    mode: 'enc',
    name: 'Calculated Insanity XV',
    effects: [{
      spa: 212,
      slot: 1,
      type: 'sp',
      value: 0.95,
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { minDmg: 100 }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }]
    }, {
      spa: 170,
      slot: 8,
      type: 'sp',
      value: 0.03
    }]
  },
  RF: {
    level: 255,
    name: 'Restless Focus',
    repeatEvery: -1,
    effects: [{
      proc: 'RF',
      limits: [{ onSpellUse: true }, { minManaCost: 10 }, { minLevel: 75 }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  ARCO: {
    class: 'wiz',
    charges: 5,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Arcomancy XXVII',
    effects: [{
      spa: 462,
      slot: 1,
      type: 'sp',
      value: 10000,
      limits: [{ minManaCost: 10 }, { maxDuration: 0 }, { maxLevel: 115 }]
    }]
  },
  ARIA: {
    class: 'brd',
    level: 111,
    name: 'New Aria of Begalru Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: 0.46,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  AUS: {
    adpsDropdown: true,
    class: 'rng',
    duration: 96000,
    level: 254,
    name: 'Auspice of the Hunter XXVIII',
    effects: [{
      spa: 294,
      slot: 1,
      type: 'sp',
      value: 0.33
    }, {
      spa: 273,
      slot: 5,
      type: 'sp',
      value: 0.33
    }]
  },
  B2: {
    adpsDropdown: true,
    class: 'brd',
    duration: 90000,
    level: 254,
    name: 'Second Spire of the Minstrels IV',
    effects: [{
      spa: 286,
      slot: 1,
      type: 'sp',
      value: 2000,
      limits: [{ type: 'detrimental' }, { minManaCost: 10 }]
    }]
  },
  BA: {
    charges: 24, // game only uses half of spell data?
    class: 'enc',
    duration: 50000,
    level: 113,
    name: 'New Bolstering Aura Rk. III',
    refreshTime: 30000,
    repeatEvery: -1,
    effects: [{
      spa: 413,
      slot: 1,
      type: 'sp',
      value: 0.04,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { minManaCost: 10 }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  BONDF: {
    level: 255,
    name: 'Bond of the Flame',
    effects: [{
      spa: 286,
      slot: 1,
      type: 'wn',
      value: 500,
      limits: [{ resists: SMap(['FIRE']) }, { currentHitPoints: true }, { nonRepeating: true }, { type: 'detrimental' }, { minManaCost: 100 }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  CDG: {
    charges: 2,
    duration: 18000 + TICK_OFFSET,
    level: 254,
    name: 'Chaotic Delusion Gift',
    effects: [{
      spa: 399,
      slot: 1,
      type: 'sp',
      value: 1.0,
      limits: [{ currentHitPoints: true }, { maxDuration: 0 }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }, { type: 'detrimental' }, { maxLevel: 115 }, { exTwincastMarker: true }]
    }]
  },
  CH: {
    adpsDropdown: true,
    charges: 2,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Chromatic Haze VIII',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'sp',
      value: 3.80,
      limits: [{ type: 'detrimental' }, { maxDuration: 0 }, { minManaCost: 10 }, { maxLevel: 115 }, { minDmg: 100 }, { nonRepeating: true }]
    }, {
      spa: 294,
      slot: 10,
      type: 'sp',
      value: 1.0
    }]
  },
  DADEPT: {
    class: 'wiz',
    mode: 'wiz',
    name: 'Destructive Adept AA',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'aa',
      value: 0, // value read from settings/UI choice
      limits: [{ type: 'detrimental' }, { maxDuration: 0 }, { minManaCost: 10 }]
    }]
  },
  DR: {
    adpsDropdown: true,
    charges: 16,
    class: 'enc',
    duration: 18000 + TICK_OFFSET, // Test similar to MR
    level: 250,
    name: 'Dissident Reinforcement 6',
    effects: [{
      proc: 'DRS',
      limits: [{ onSpellUse: true }, { maxLevel: 115 }, { type: 'detrimental' }, { exSpells: SMap(['DRS']) }, { minManaCost: 100 }]
    }, {
      spa: 303,
      slot: 8,
      type: 'sp',
      value: 4365,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { minManaCost: 100 }]
    }]
  },
  DS: {
    manuallyActivated: true,
    name: 'Dark Shield of the Scholar',
    refreshTime: 10000,
    repeatEvery: -1,
    timer: 'recast-3',
    effects: [{
      proc: 'DS',
      limits: [{ activated: true }]
    }]
  },
  E3: {
    adpsDropdown: true,
    class: 'enc',
    duration: 90000,
    level: 254,
    name: 'Third Spire of Enchantment IV',
    effects: [{
      spa: 294,
      slot: 11,
      type: 'sp',
      value: 0.09
    }]
  },
  EDECAY: {
    level: 255,
    name: 'Eyes of Life and Decay',
    effects: [{
      spa: 413,
      slot: 1,
      type: 'wn',
      value: 0.0, // value read from settings/UI choice
      limits: [{ maxLevel: 110 }, { currentHitPoints: true
        // others not sure how to handle and prob dont need to
      }]
    }]
  },
  ESD7: {
    level: 255,
    name: 'Ethereal/Spear Damage 7',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'wn',
      value: 0.07,
      limits: [{ spells: SMap(['EB', 'ES', 'SA', 'SS', 'SB', 'MU', 'MS', 'MC']) }]
    }]
  },
  ESD9: {
    level: 255,
    name: 'Ethereal/Spear Damage 9',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'wn',
      value: 0.09,
      limits: [{ spells: SMap(['EB', 'ES', 'SA', 'SS', 'SB', 'MU', 'MS', 'MC']) }]
    }]
  },
  ESYN1: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Beguiler\'s Synergy I',
    tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindslash.',
    effects: [{
      spa: 461,
      slot: 1,
      type: 'sp',
      value: 0.40,
      limits: [{ resists: SMap(['MAGIC', 'FIRE', 'COLD']) }, { maxLevel: 249 }, { minDmg: 100 }, { nonRepeating: true }]
    }]
  },
  ESYN2: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Beguiler\'s Synergy II',
    otherCast: true,
    repeatEvery: 11000,
    tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindslash.',
    effects: [{
      spa: 461,
      slot: 1,
      type: 'sp',
      value: 0.45,
      limits: [{ resists: SMap(['MAGIC', 'FIRE', 'COLD']) }, { maxLevel: 249 }, { minDmg: 100 }, { nonRepeating: true }]
    }]
  },
  FD: {
    adpsDropdown: true,
    charges: 45,
    class: 'wiz',
    duration: 410000,
    level: 254,
    mode: 'wiz',
    name: 'Frenzied Devastation XXXI',
    effects: [{
      spa: 212,
      slot: 1,
      type: 'sp',
      value: 0.51,
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { minDmg: 100 }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }]
    }, {
      spa: 170,
      slot: 8,
      type: 'sp',
      value: 0.90
    }]
  },
  FIERCE: {
    adpsDropdown: true,
    class: 'brd',
    duration: 132000,
    level: 115,
    name: 'Fierce Eye IV',
    effects: [{
      spa: 294,
      slot: 6,
      type: 'sp',
      value: 0.13
    }, {
      spa: 273,
      slot: 7,
      type: 'sp',
      value: 0.13
    }, {
      spa: 170,
      slot: 11,
      type: 'sp',
      value: 0.13
    }, {
      spa: 507,
      slot: 12,
      type: 'sp',
      value: 0.13
    }]
  },
  FCOLD6090: {
    level: 255,
    name: 'Cold Damage 60-90 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.75,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCOLD67: {
    level: 255,
    name: 'Cold Damage 67-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.84,
      limits: [{ maxLevel: 110 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCOLD70: {
    level: 255,
    name: 'Cold Damage 70-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.85,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCOLD75: {
    level: 255,
    name: 'Cold Damage 75-90 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.825,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCOLD70120: {
    level: 255,
    name: 'Cold Damage 70-120 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.95,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCOLD85123: {
    level: 255,
    name: 'Cold Damage 85-123 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 1.04,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FCHROM6090: {
    level: 255,
    name: 'Chromatic Damage 60-90 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.75,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FCHROM67: {
    level: 255,
    name: 'Chromatic Damage 67-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.84,
      limits: [{ maxLevel: 110 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FCHROM70: {
    level: 255,
    name: 'Chromatic Damage 70-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.85,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FCHROM75: {
    level: 255,
    name: 'Chromatic Damage 75-90 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.825,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FCHROM70120: {
    level: 255,
    name: 'Chromatic Damage 70-120 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.95,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FCHROM85123: {
    level: 255,
    name: 'Chromatic Damage 85-123 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 1.04,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['CHROMATIC']) }]
    }]
  },
  FFIRE6090: {
    level: 255,
    name: 'Fire Damage 60-90 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.75,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FFIRE67: {
    level: 255,
    name: 'Fire Damage 67-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.84,
      limits: [{ maxLevel: 110 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FFIRE70: {
    level: 255,
    name: 'Fire Damage 70-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.85,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FFIRE75: {
    level: 255,
    name: 'Fire Damage 75-90 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.825,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FFIRE70120: {
    level: 255,
    name: 'Fire Damage 70-120 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.95,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FFIRE85123: {
    level: 255,
    name: 'Fire Damage 85-123 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 1.04,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['FIRE']) }]
    }]
  },
  FMAGIC6090: {
    level: 255,
    name: 'Magic Damage 60-90 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.75,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FMAGIC67: {
    level: 255,
    name: 'Magic Damage 67-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.84,
      limits: [{ maxLevel: 110 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FMAGIC70: {
    level: 255,
    name: 'Magic Damage 70-100 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.85,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FMAGIC75: {
    level: 255,
    name: 'Magic Damage 75-90 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.825,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FMAGIC70120: {
    level: 255,
    name: 'Magic Damage 70-120 L115',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 0.95,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FMAGIC85123: {
    level: 255,
    name: 'Magic Damage 85-123 L120',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'wn',
      value: 1.04,
      limits: [{ maxLevel: 120 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['MAGIC']) }]
    }]
  },
  FR: {
    adpsDropdown: true,
    duration: 20000,
    instant: true,
    level: 254,
    name: 'Forceful Rejuvenation',
    effects: [{
      spa: 389,
      slot: 1,
      type: 'aa',
      limits: [{ exSpells: SMap(['TC']) }]
    }]
  },
  FRA: {
    charges: 6,
    class: 'dru',
    duration: 18000 + TICK_OFFSET,
    level: 113,
    name: 'New Frostreave Aura Rk. III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [{
      proc: 'FW',
      limits: [{ onSpellUse: true }, { type: 'detrimental' }, { currentHitPoints: true }, { exSpells: SMap(['FW']) }, { exSkills: COMBAT_SKILLS }, { maxLevel: 120 }, { minManaCost: 10 }]
    }]
  },
  FRB: {
    class: 'dru',
    debuff: true,
    level: 123,
    name: 'New Frostreave Breath Rk. III',
    repeatEvery: -1,
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.06,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { resists: SMap(['COLD']) }]
    }]
  },
  FGODS: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 240000,
    level: 254,
    mode: 'wiz',
    name: 'Fury of the Gods LIV',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4500,
      limits: [{ type: 'detrimental' }, { maxDuration: 0 }]
    }]
  },
  FE: { // generated
    class: 'mag',
    level: 254,
    manuallyActivated: true,
    mode: 'mag',
    name: 'Force of Elements',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '73',
    effects: [{
      proc: '',
      limits: [{ activated: true }]
    }]
  },
  FI: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Ice',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '44',
    effects: [{
      proc: '',
      limits: [{ activated: true }]
    }]
  },
  FBO: {
    charges: 10,
    class: 'mag',
    manuallyActivated: true,
    mode: 'mag',
    name: 'Firebound Orb III',
    refreshTime: 12000,
    refreshTrigger: 'SFB',
    repeatEvery: -1,
    timer: 'recast-5',
    effects: [{
      proc: 'BJ',
      limits: [{ activated: true }]
    }]
  },
  FBSINGERk1: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'New Flashburn Singe I',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4374,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  FBSINGERk2: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'New Flashburn Singe II',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4593,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  FBSINGERk3: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'New Flashburn Singe III',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4823,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  FF: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Flame',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '36',
    effects: [{
      proc: '',
      limits: [{ activated: true }]
    }]
  },
  FIREBA: {
    adpsDropdown: true,
    class: 'mag',
    charges: 8,
    duration: 18000 + TICK_OFFSET,
    level: 101,
    mode: 'mag',
    name: 'Firebound Covenant Rk. III',
    otherCast: true,
    effects: [{
      spa: 484,
      slot: 1,
      type: 'sp',
      value: 42419,
      limits: [{ targets: TARGET_LOS }, { currentHitPoints: true }, { type: 'detrimental' }, { minLevel: 101 }, { maxLevel: 115 }, { maxDuration: 0 }, { minManaCost: 10 }, { minDmg: 2750 }]
    }]
  },
  FROSTBA: {
    adpsDropdown: true,
    class: 'wiz',
    charges: 8,
    duration: 18000 + TICK_OFFSET,
    level: 107,
    mode: 'wiz',
    name: 'Frostbound Covenant Rk. III',
    otherCast: true,
    effects: [{
      spa: 484,
      slot: 1,
      type: 'sp',
      value: 55699,
      limits: [{ targets: TARGET_SINGLE }, { currentHitPoints: true }, { type: 'detrimental' }, { minLevel: 101 }, { maxLevel: 115 }, { maxDuration: 0 }, { minManaCost: 10 }, { minDmg: 2750 }]
    }]
  },
  FW: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Will',
    refreshTime: 12000,
    repeatEvery: -1,
    timer: '37',
    effects: [{
      proc: '',
      limits: [{ activated: true }]
    }]
  },
  GBW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 225000,
    level: 254,
    name: 'Group Spirit of the Black Wolf VII',
    effects: [{
      spa: 294,
      slot: 8,
      type: 'sp',
      value: 0.1
    }, {
      spa: 170,
      slot: 9,
      type: 'sp',
      value: 1.0
    }]
  },
  GCH: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Gift of Chroma Haze',
    repeatEvery: 20000,
    tooltip: 'How often to proc a single Gift of Chromatic Haze (in seconds).\rKeep in mind that it procs only 8% of the time an Enchanter casts a DD, DoT, or Stun so you may want it fairly high.',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'sp',
      value: 0.40,
      limits: [{ type: 'detrimental' }, { maxDuration: 0 }, { minManaCost: 10 }, { maxLevel: 115 }, { minDmg: 100 }, { nonRepeating: true }]
    }, {
      spa: 294,
      slot: 10,
      type: 'sp',
      value: 1.0
    }]
  },
  EQPPROC: {
    level: 255,
    name: 'General EQP Proc Rules',
    effects: [{
      limits: [{ onSpellUse: true }, { type: 'detrimental' }, { minLevel: 70 }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  FATE: {
    class: 'brd',
    level: 112,
    name: 'New Fatesong of Dekloaz Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [{
      spa: 286,
      slot: 1,
      type: 'sp',
      value: 3526,
      limits: [{ minLevel: 106 }, { maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { maxDuration: 0 }, { minManaCost: 10 }, { resists: SMap(['COLD']) }]
    }]
  },
  FPWR: {
    class: 'mag',
    charges: 2,
    duration: 60000,
    level: 255,
    mode: 'mag',
    name: 'Flames of Power IV',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: 1.05,
      limits: [{ minDmg: 100 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }, { maxLevel: 115 // need to really verify
      }]
    }]
  },
  FWEAK: {
    class: 'mag',
    charges: 1000, // workaround to see count in stats
    duration: 12000 + TICK_OFFSET,
    level: 255,
    mode: 'mag',
    name: 'Flames of Weakness IV',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: -0.25,
      limits: [{ currentHitPoints: true }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 // need to really verify
      }]
    }]
  },
  GLYPHC: {
    adpsDropdown: true,
    duration: 120000,
    level: 254,
    name: 'Glyph of Destruction IV',
    effects: [{
      spa: 294,
      slot: 7,
      type: 'sp',
      value: 0.15
    }, {
      spa: 375,
      slot: 8,
      type: 'sp',
      value: 0.6
    }, {
      spa: 170,
      slot: 10,
      type: 'sp',
      value: 0.6
    }]
  },
  HOF: {
    adpsDropdown: true,
    class: 'mag',
    duration: 360000,
    level: 254,
    mode: 'mag',
    name: 'Heart of Skyfire XXVIII',
    effects: [{
      spa: 124,
      slot: 3,
      type: 'sp',
      value: 1.15,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }]
    }, {
      spa: 170,
      slot: 5,
      type: 'sp',
      value: 0.45
    }]
  },
  IMPF: {
    class: 'wiz',
    level: 254,
    mode: 'wiz',
    name: 'Improved Familiar XXXIII',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: 0.575,
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { targets: SMap(['SINGLE']) }, { maxLevel: 115 }, // from testing
      { exSkills: COMBAT_SKILLS }]
    }, {
      spa: 170, // moved rules up from testing
      slot: 5,
      type: 'sp',
      value: 0.35
    }]
  },
  INTENSE: {
    adpsDropdown: true,
    duration: 60000,
    level: 254,
    name: 'Intensity of the Resolute',
    effects: [{
      spa: 294,
      slot: 7,
      type: 'sp',
      value: 0.50
    }, {
      spa: 273,
      slot: 9,
      type: 'sp',
      value: 0.50
    }]
  },
  ITC: {
    adpsDropdown: true,
    charges: 19,
    duration: 150000,
    level: 254,
    name: 'Improved Twincast VII',
    effects: [{
      spa: 399,
      slot: 1,
      type: 'sp',
      value: 1.0,
      limits: [{ currentHitPoints: true }, { exTwincastMarker: true }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }, { type: 'detrimental' }]
    }]
  },
  IOG: {
    adpsDropdown: true,
    class: 'enc',
    duration: 120000,
    level: 105,
    name: 'Illusions of Grandeur III',
    effects: [{
      spa: 273,
      slot: 4,
      type: 'sp',
      value: 0.13
    }, {
      spa: 294,
      slot: 5,
      type: 'sp',
      value: 0.13
    }, {
      spa: 375,
      slot: 6,
      type: 'sp',
      value: 1.15
    }, {
      spa: 170,
      slot: 12,
      type: 'sp',
      value: 1.60
    }]
  },
  HFLM: {
    class: 'npc',
    debuff: true,
    level: 255,
    name: 'Highly Flammable',
    repeatEvery: -1,
    effects: [{
      spa: 483,
      slot: 1,
      type: 'sp',
      value: 85.0,
      limits: [{ resists: SMap(['FIRE']) }]
    }]
  },
  HFRZ: {
    class: 'npc',
    debuff: true,
    level: 255,
    name: 'Highly Freezable',
    repeatEvery: -1,
    effects: [{
      spa: 483,
      slot: 1,
      type: 'sp',
      value: 120.75,
      limits: [{ resists: SMap(['COLD']) }]
    }]
  },
  LING: {
    class: 'enc',
    debuff: true,
    level: 255,
    name: 'New Tashan\'s Lingering Cry',
    repeatEvery: -1,
    effects: [{
      spa: 483,
      slot: 1,
      type: 'sp',
      value: 0.09,
      limits: [{ maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  MALO: {
    class: 'mag',
    debuff: true,
    level: 111,
    name: 'New Malosinata Rk. III',
    otherCast: true,
    repeatEvery: -1,
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.06,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { resists: SMap(['MAGIC']) }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  MBRN: {
    adpsDropdown: true,
    class: 'wiz',
    charges: 500,
    duration: 120000,
    level: 254,
    name: 'Mana Burn XVII',
    effects: [{
      spa: 484,
      slot: 1,
      type: 'sp',
      value: 20400,
      limits: [{ maxDuration: 0 }]
    }]
  },
  M1: {
    adpsDropdown: true,
    class: 'mag',
    duration: 90000,
    level: 254,
    mode: 'mag',
    name: 'Spire of the Elements XII',
    effects: [{
      spa: 294,
      slot: 2,
      type: 'sp',
      value: 0.24
    }]
  },
  MC: {
    adpsDropdown: true,
    charges: 3,
    duration: 24000 + TICK_OFFSET,
    hitType: 'any',
    level: 255,
    name: 'Mana Charge',
    effects: [{
      spa: 294,
      slot: 1,
      type: 'sp',
      value: 1.75
    }, {
      spa: 170,
      slot: 2,
      type: 'sp',
      value: 0.50
    }]
  },
  MRA: {
    charges: 6,
    class: 'enc',
    duration: 18000 + TICK_OFFSET,
    level: 115,
    name: 'New Mana Repetition Aura Rk. III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [{
      proc: 'MR',
      limits: [{ onSpellUse: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { exSpells: SMap(['MR']) }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  MSYN1: {
    class: 'mag',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Conjurer\'s Synergy I',
    tooltip: 'How often to proc a single Conjurer\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Remorseless Servant.',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'sp',
      value: 0.50,
      limits: [{ resists: SMap(['FIRE', 'CHROMATIC']) }, { maxLevel: 250 }, { minDmg: 100 }, { nonRepeating: true }]
    }]
  },
  MSYN2: {
    class: 'mag',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Conjurer\'s Synergy II',
    otherCast: true,
    repeatEvery: 13000,
    tooltip: 'How often to proc a single Conjurer\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Remorseless or Reckless Servant.',
    effects: [{
      spa: 302,
      slot: 1,
      type: 'sp',
      value: 0.60,
      limits: [{ resists: SMap(['FIRE', 'CHROMATIC']) }, { maxLevel: 250 }, { minDmg: 100 }, { nonRepeating: true }]
    }]
  },
  NSYN: {
    charges: 1,
    class: 'nec',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Defiler\'s Synergy II',
    repeatEvery: 7000,
    tooltip: 'How often to proc a single Defiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Refute for Blood.',
    effects: [{
      spa: 170,
      slot: 1,
      type: 'sp',
      value: 0.20
    }, {
      spa: 375,
      slot: 2,
      type: 'sp',
      value: 0.15
    }]
  },
  QT: {
    adpsDropdown: true,
    class: 'brd',
    duration: 240000,
    level: 115,
    name: 'Quick Time VIII',
    effects: []
  },
  QUNARD: {
    class: 'brd',
    level: 113,
    name: 'New Qunard\'s Aria Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [{
      spa: 286,
      slot: 1,
      type: 'sp',
      value: 2519,
      limits: [{ minLevel: 106 }, { maxLevel: 115 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { maxDuration: 0 }, { minManaCost: 10 }, { resists: SMap(['FIRE']) }]
    }]
  },
  REA: {
    adpsDropdown: true,
    class: 'rng',
    debuff: true,
    duration: 60000,
    level: 115,
    name: 'Elemental Arrow X',
    otherCast: true,
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.125,
      limits: [{ resists: SMap(['FIRE', 'COLD']) }]
    }]
  },
  SEERS: {
    level: 255,
    name: 'Boon of the Seeress',
    effects: [{
      spa: 286,
      slot: 1,
      type: 'sp',
      value: 500,
      limits: [{ currentHitPoints: true }, { nonRepeating: true }, { maxManaCost: 0 }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { minLevel: 254 }, { maxDuration: 0 }, { maxCastTime: 0 }]
    }]
  },
  SUMAC: {
    class: 'dru',
    debuff: true,
    level: 110,
    name: 'Skin to Sumac Rk. III',
    repeatEvery: -1,
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.07,
      limits: [{ maxLevel: 110 }, { type: 'detrimental' }, { resists: SMap(['FIRE']) }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  SVENG: {
    class: 'wiz',
    mode: 'wiz',
    name: 'Sorcerer\'s Vengeance AA',
    effects: [{
      spa: 286,
      slot: 1,
      type: 'aa',
      value: 0, // value read from settings/UI choice
      limits: [{ type: 'detrimental' }, { maxLevel: 254 }, { maxDuration: 0 }]
    }]
  },
  SYLLICERk1: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Ice I',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4838,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['COLD']) }]
    }]
  },
  SYLLICERk2: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Ice II',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5080,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['COLD']) }]
    }]
  },
  SYLLICERk3: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Ice III',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5334,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['COLD']) }]
    }]
  },
  SYLLFIRERk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Fire I',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4838,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['FIRE']) }]
    }]
  },
  SYLLFIRERk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Fire II',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5080,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['FIRE']) }]
    }]
  },
  SYLLFIRERk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Fire III',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5334,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['FIRE']) }]
    }]
  },
  SYLLMAGICRk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Magic I',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 4838,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['MAGIC']) }]
    }]
  },
  SYLLMAGICRk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Magic II',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5080,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['MAGIC']) }]
    }]
  },
  SYLLMAGICRk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Magic III',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5334,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }, { resists: SMap(['MAGIC']) }]
    }]
  },
  SYLLMASTERRk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Mastery I',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 5902,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  SYLLMASTERRk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Mastery II',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 6197,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  SYLLMASTERRk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Syllable of Mastery III',
    effects: [{
      spa: 303,
      slot: 1,
      type: 'sp',
      value: 6507,
      limits: [{ minCastTime: 3000 }, { currentHitPoints: true }, { type: 'detrimental' }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 }, { minManaCost: 10 }]
    }]
  },
  SW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 60000,
    level: 254,
    name: 'Season\'s Wrath VII',
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.20,
      limits: [{ type: 'detrimental' }, { resists: SMap(['FIRE', 'COLD']) }]
    }]
  },
  TC: {
    adpsDropdown: true,
    duration: 18000 + TICK_OFFSET,
    level: 85,
    name: 'Twincast Rk. III',
    noClass: ['enc'],
    effects: [{
      spa: 399,
      slot: 1,
      type: 'sp',
      value: 1.0,
      limits: [{ currentHitPoints: true }, { exTwincastMarker: true }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }, { type: 'detrimental' }]
    }]
  },
  TCA: {
    class: 'enc',
    level: 84,
    name: 'Twincast Aura Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [{
      spa: 399,
      slot: 1,
      type: 'sp',
      value: 0.11,
      limits: [{ currentHitPoints: true }, { exTwincastMarker: true }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }, { type: 'detrimental' }]
    }]
  },
  TCAA: {
    name: 'Twincast AA',
    effects: [{
      spa: 399,
      slot: 1,
      type: 'aa',
      value: 0, // value read from settings/UI choice
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { maxLevel: 254 }, { minManaCost: 10 }, { currentHitPoints: true }, { exSkills: COMBAT_SKILLS }, { exTwincastMarker: true }]
    }]
  },
  TF: {
    adpsDropdown: true,
    class: 'mag',
    duration: 180000,
    level: 254,
    mode: 'mag',
    name: 'New Thaumaturge\'s Focus XVI',
    effects: [{
      spa: 212,
      slot: 1,
      type: 'sp',
      value: 0.10,
      limits: [{ maxLevel: 115 }, { currentHitPoints: true }, { minManaCost: 10 }, { type: 'detrimental' }, { maxDuration: 0 }, { resists: SMap(['MAGIC']) }, { minDmg: 100 }]
    }, {
      spa: 461,
      slot: 8,
      type: 'sp',
      value: 0.55,
      limits: [{ maxLevel: 115 }, { currentHitPoints: true }, { minManaCost: 10 }, { type: 'detrimental' }, { maxDuration: 0 }, { resists: SMap(['MAGIC']) }, { minDmg: 100 }]
    }]
  },
  THPWR: {
    class: 'wiz',
    charges: 1,
    duration: 60000,
    level: 255,
    mode: 'wiz',
    name: 'New Thricewoven Power VI',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: 1.325,
      limits: [{ minDmg: 100 }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { minManaCost: 10 }, { maxLevel: 115 }]
    }]
  },
  THWEAK: {
    class: 'wiz',
    charges: 1000, // workaround to see count in stats
    duration: 12000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'New Thricewoven Weakness',
    effects: [{
      spa: 124,
      slot: 1,
      type: 'sp',
      value: -0.20,
      limits: [{ currentHitPoints: true }, { type: 'detrimental' }, { exTargets: SMap(['TargetAE', 'CasterPB']) }, { exSkills: COMBAT_SKILLS }, { maxLevel: 115 // need to really verify
      }]
    }]
  },
  THREADSM: {
    level: 255,
    name: 'Threads of Mana',
    effects: [{
      spa: 286,
      slot: 1,
      type: 'wn',
      value: 1000,
      limits: [{ resists: SMap(['MAGIC']) }, { currentHitPoints: true }, { nonRepeating: true }, { type: 'detrimental' }, { minManaCost: 100 }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  THREADSP: {
    level: 255,
    name: 'Threads of Potential',
    effects: [{
      spa: 462,
      slot: 1,
      type: 'wn',
      value: 5000,
      limits: [{ currentHitPoints: true }, { nonRepeating: true }, { type: 'detrimental' }, { minManaCost: 100 }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  TRIF: {
    class: 'wiz',
    debuff: true,
    level: 115,
    name: 'Trifurcating Magic XXVII',
    repeatEvery: -1,
    effects: [] // handle in damage.js
  },
  TP: {
    name: 'Twinproc AA',
    effects: [{
      spa: 399,
      slot: 1,
      type: 'aa',
      value: 0, // value read from settings/UI choice
      limits: [{ maxDuration: 0 }, { type: 'detrimental' }, { maxDuration: 0 }, { minLevel: 255 }, { maxManaCost: 0 }, { exSkills: COMBAT_SKILLS }, { exTwincastMarker: true }]
    }]
  },
  TRTAL: {
    level: 254,
    name: 'Trophy of Talendor',
    repeatEvery: -1,
    effects: [{
      spa: 170,
      slot: 1,
      type: 'wn',
      value: 0.10
    }, {
      spa: 375,
      slot: 2,
      type: 'wn',
      value: 0.10
    }]
  },
  TRTOR: {
    level: 254,
    name: 'Trophy of Tormax',
    repeatEvery: -1,
    effects: [{
      spa: 399,
      slot: 1,
      type: 'wn',
      value: 0.01,
      limits: [{ currentHitPoints: true }, { exTwincastMarker: true }, { minManaCost: 10 }, { exSkills: COMBAT_SKILLS }]
    }]
  },
  VES: {
    adpsDropdown: true,
    class: 'brd',
    duration: 120000,
    level: 255,
    name: 'Spirit of Vesagran',
    effects: [{
      spa: 294,
      slot: 9,
      type: 'sp',
      value: 0.12
    }, {
      spa: 273,
      slot: 10,
      type: 'sp',
      value: 0.12
    }]
  },
  VFX: {
    class: 'wiz',
    charges: 24,
    duration: 18000 + TICK_OFFSET,
    level: 108,
    mode: 'wiz',
    name: 'Stormjolt Vortex Effect',
    effects: [{
      spa: 296,
      slot: 1,
      type: 'sp',
      value: 0.825,
      limits: [{ maxLevel: 115 }, { type: 'detrimental' }, { maxDuration: 0 }, { minManaCost: 100 }]
    }]
  },
  W1: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 90000,
    level: 254,
    mode: 'wiz',
    name: 'Spire of Arcanum XII',
    effects: [{
      spa: 294,
      slot: 2,
      type: 'sp',
      value: 0.16
    }, {
      spa: 170,
      slot: 3,
      type: 'sp',
      value: 1.6
    }]
  },
  WSYN1: {
    charges: 1,
    class: 'wiz',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Evoker\'s Synergy I',
    tooltip: 'How often to proc a single Evoker\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Stormjolt Vortex.',
    effects: [{
      proc: 'WSYN1',
      limits: [{ onSpellUse: true }, { resists: SMap(['MAGIC', 'COLD', 'POISON', 'DISEASE', 'CORRUPTION', 'CHROMATIC']) }, { type: 'detrimental' }]
    }]
  },
  WSYN2: {
    charges: 1,
    class: 'wiz',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Evoker\'s Synergy II',
    otherCast: true,
    repeatEvery: 38000,
    tooltip: 'How often to proc a single Evoker\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Ethereal Braid.',
    effects: [{
      proc: 'WSYN2',
      limits: [{ onSpellUse: true }, { resists: SMap(['MAGIC', 'COLD', 'POISON', 'DISEASE', 'CORRUPTION', 'CHROMATIC']) }, { type: 'detrimental' }]
    }]
  }
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAERainHitsValue = getAERainHitsValue;
exports.getAEUnitDistanceValue = getAEUnitDistanceValue;
exports.getConfiguredAbilities = getConfiguredAbilities;
exports.getActiveRepeatingAbilities = getActiveRepeatingAbilities;
exports.getAbilityCharges = getAbilityCharges;
exports.getAbilityRate = getAbilityRate;
exports.getAddAfterCritFocusValue = getAddAfterCritFocusValue;
exports.getAddAfterCritAddValue = getAddAfterCritAddValue;
exports.getAddAfterSPA461AddValue = getAddAfterSPA461AddValue;
exports.getAddAfterSPA461FocusValue = getAddAfterSPA461FocusValue;
exports.getAddBeforeCritFocusValue = getAddBeforeCritFocusValue;
exports.getAddBeforeCritAddValue = getAddBeforeCritAddValue;
exports.getAddBeforeDoTCritFocusValue = getAddBeforeDoTCritFocusValue;
exports.getAddEffectivenessValue = getAddEffectivenessValue;
exports.getAddSPA461FocusValue = getAddSPA461FocusValue;
exports.getAddTwincastValue = getAddTwincastValue;
exports.getAllianceFulminationValue = getAllianceFulminationValue;
exports.getArcaneFusionValue = getArcaneFusionValue;
exports.getWornDamageFocusList = getWornDamageFocusList;
exports.getBeltProcValue = getBeltProcValue;
exports.getBeguilersSynergyValue = getBeguilersSynergyValue;
exports.getConjurersSynergyValue = getConjurersSynergyValue;
exports.getCritDmgValue = getCritDmgValue;
exports.getCritRateValue = getCritRateValue;
exports.getArmorProc1Value = getArmorProc1Value;
exports.getArmorProc2Value = getArmorProc2Value;
exports.getDPSAug1AugValue = getDPSAug1AugValue;
exports.getDPSAug2AugValue = getDPSAug2AugValue;
exports.getDestructiveAdeptValue = getDestructiveAdeptValue;
exports.getEyeOfDecayValue = getEyeOfDecayValue;
exports.getFlamesOfPowerValue = getFlamesOfPowerValue;
exports.getForceOfElementsValue = getForceOfElementsValue;
exports.getForceOfFlameValue = getForceOfFlameValue;
exports.getForceOfIceValue = getForceOfIceValue;
exports.getForceOfWillValue = getForceOfWillValue;
exports.getGCDValue = getGCDValue;
exports.getLuckValue = getLuckValue;
exports.getSteelVengeanceValue = getSteelVengeanceValue;
exports.getDomForCritDGraph = getDomForCritDGraph;
exports.getDomForDoTCritDGraph = getDomForDoTCritDGraph;
exports.getDomForCritRGraph = getDomForCritRGraph;
exports.getDomForDoTCritRGraph = getDomForDoTCritRGraph;
exports.getDomForDmgGraph = getDomForDmgGraph;
exports.getDomForSpellline = getDomForSpellline;
exports.getDomForTimeline = getDomForTimeline;
exports.getEvokersSynergyValue = getEvokersSynergyValue;
exports.getHastenedServantValue = getHastenedServantValue;
exports.getRangeAugValue = getRangeAugValue;
exports.getRemorselessServantDPSValue = getRemorselessServantDPSValue;
exports.getRemorselessServantTTLValue = getRemorselessServantTTLValue;
exports.getRobeValue = getRobeValue;
exports.getSelectedSpells = getSelectedSpells;
exports.getShieldProcValue = getShieldProcValue;
exports.getSorcererVengeananceValue = getSorcererVengeananceValue;
exports.getSpellDamageValue = getSpellDamageValue;
exports.getSpellFocusAAValue = getSpellFocusAAValue;
exports.getSpellTimeRangeControl = getSpellTimeRangeControl;
exports.getSpellTimeRangeValue = getSpellTimeRangeValue;
exports.getStaffProcValue = getStaffProcValue;
exports.getVolleyOfManyCountValue = getVolleyOfManyCountValue;
exports.getTwincastAAValue = getTwincastAAValue;
exports.getTwinprocAAValue = getTwinprocAAValue;
exports.getType3AugValue = getType3AugValue;
exports.getType3DmdAugValue = getType3DmdAugValue;
exports.isUsingArcaneFusion = isUsingArcaneFusion;
exports.getCriticalAfflicationValue = getCriticalAfflicationValue;
exports.getDestructiveCascadeValue = getDestructiveCascadeValue;
exports.getDestructiveFuryValue = getDestructiveFuryValue;
exports.getDoNValue = getDoNValue;
exports.getFuryOfMagicValue = getFuryOfMagicValue;
exports.getFamiliarValue = getFamiliarValue;
exports.getGiftOfHazyValue = getGiftOfHazyValue;
exports.getLockoutTime = getLockoutTime;

var _settings = __webpack_require__(52);

var _abilities = __webpack_require__(67);

var abilities = _interopRequireWildcard(_abilities);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// What to query on to find a spell focus value by ID
var FOCUS_AA_KEYS = {
  enc: {
    'CR': '.aa-chromarift .dropdown-toggle',
    'CF': '.aa-chromablink .dropdown-toggle',
    'GT': '.aa-gravity-twist .dropdown-toggle',
    'MU': '.aa-mindsunder .dropdown-toggle',
    'MC': '.aa-mindsunder .dropdown-toggle',
    'MS': '.aa-mindsunder .dropdown-toggle',
    'PA': '.aa-poly-ass .dropdown-toggle'
  },
  mag: {
    'BB': '.aa-sear .dropdown-toggle',
    'BM': '.aa-beam-molten .dropdown-toggle',
    'BK': '.aa-beam-scythes .dropdown-toggle',
    'BS': '.aa-boltm .dropdown-toggle',
    'RM': '.aa-coronal .dropdown-toggle',
    'RU': '.aa-eradun .dropdown-toggle',
    'FC': '.aa-fickle .dropdown-toggle',
    'CI': '.aa-fickle .dropdown-toggle',
    'RK': '.aa-raincut .dropdown-toggle',
    'VM': '.aa-storm .dropdown-toggle',
    'SB': '.aa-spearm .dropdown-toggle',
    'SS': '.aa-spearm .dropdown-toggle',
    'SA': '.aa-spearm .dropdown-toggle',
    'SH': '.aa-shockd .dropdown-toggle'
  },
  wiz: {
    'SB': '.aa-beams .dropdown-toggle',
    'CS': '.aa-claws .dropdown-toggle',
    'CG': '.aa-claws .dropdown-toggle',
    'CT': '.aa-cloudb .dropdown-toggle',
    'CB': '.aa-chaos .dropdown-toggle',
    'ET': '.aa-eflash .dropdown-toggle',
    'ES': '.aa-eblaze .dropdown-toggle',
    'EB': '.aa-eblaze .dropdown-toggle',
    'EI': '.aa-erime .dropdown-toggle',
    'RI': '.aa-erime .dropdown-toggle',
    'FB': '.aa-flashchar .dropdown-toggle',
    'VD': '.aa-rains .dropdown-toggle',
    'PS': '.aa-pure .dropdown-toggle',
    'RC': '.aa-rimeb .dropdown-toggle',
    'SC': '.aa-selfc .dropdown-toggle',
    'FP': '.aa-pills .dropdown-toggle',
    'SJ': '.aa-vortex .dropdown-toggle',
    'TW': '.aa-thrice .dropdown-toggle',
    'LF': '.aa-corona .dropdown-toggle'
  }
};

// Methods for easy lookup of values from DOM nodes related to configuration of
// AAs, spells, equipment options, etc
//
// Some of these use a cache based on those being used most according to profiling
//   --- should probably add more to cache
//

function getAERainHitsValue() {
  return utils.useCache('.ae-rain-hits', function () {
    return utils.getNumberValue($('#aeRainHits').val());
  });
}

function getAEUnitDistanceValue() {
  return utils.useCache('.ae-unit-distance', function () {
    return utils.getNumberValue($('#aeUnitDistance').val());
  });
}

function getConfiguredAbilities(state) {
  return utils.useCache('active-configured-abilities', function () {
    var active = [];
    var spellProc = [];

    // add if set and if specified has a value > 0
    var addAbility = function addAbility(id, value, spa) {
      if (id && id !== 'NONE') {
        if (value === undefined || value > 0) {
          var ability = abilities.get(id);
          if (ability) {
            active.push(id);

            if (value > 0) {
              abilities.setSPAValue(id, spa, value);
            }
          }
        }
      }
    };

    var setSpellProc = function setSpellProc(id, value) {
      if (id !== 'NONE') {
        if (value === 'NONE') {
          value = '';
        }

        var ability = abilities.get(id);
        if (value && ability) {
          abilities.setProcValue(id, value);

          // only configure manual abilities here
          // dont return them
          if (!ability.manuallyActivated && ability.class === _settings.globals.MODE) {
            spellProc.push(id);
          }
        }
      }
    };

    // class specific abilities
    switch (_settings.globals.MODE) {
      case 'wiz':
        // familiar
        addAbility(getFamiliarValue());
        setSpellProc('AFU', getArcaneFusionValue());
        setSpellProc('FF', getForceOfFlameValue());
        setSpellProc('FI', getForceOfIceValue());
        setSpellProc('FW', getForceOfWillValue());
        addAbility('DADEPT', getDestructiveAdeptValue(), 124);
        addAbility('SVENG', getSorcererVengeananceValue(), 286);
        break;

      case 'mag':
        setSpellProc('FE', getForceOfElementsValue());

        // Setup Flames of Power
        abilities.setCharges('FPWR', getFlamesOfPowerValue() === 4 ? 2 : 1);
        break;
    }

    addAbility(getRobeValue());
    addAbility(getBeltProcValue());
    addAbility('EDECAY', getEyeOfDecayValue(), 413);
    addAbility('TCAA', getTwincastAAValue(), 399);
    addAbility('TP', getTwinprocAAValue(), 399);
    getWornDamageFocusList().forEach(function (id) {
      return addAbility(id);
    });

    return { active: active, spellProc: spellProc };
  });
}

function getActiveRepeatingAbilities() {
  return utils.useCache('active-repeating-abilities', function () {
    return $('input.repeating-ability:checked').toArray().map(function (item) {
      return item.id;
    });
  });
}

function getAbilityCharges(id) {
  return utils.useCache('ability-charges-' + id, function () {
    var charges = void 0;
    var $node = $('#' + id + 'Charges');
    if ($node.length > 0) {
      charges = utils.getNumberValue($node.val());
    }

    return charges;
  });
}

function getAbilityRate(id) {
  return utils.useCache('ability-rate-' + id, function () {
    return 1000 * utils.getNumberValue($('#' + id + 'Rate').val());
  });
}

function getAddAfterCritFocusValue() {
  return utils.useCache('.add-after-crit-focus', function () {
    return utils.getNumberValue($('#addAfterCritFocus').val() / 100);
  });
}

function getAddAfterCritAddValue() {
  return utils.useCache('.add-after-crit-add', function () {
    return utils.getNumberValue($('#addAfterCritAdd').val());
  });
}
function getAddAfterSPA461AddValue() {
  return utils.useCache('.add-after-spa-461-add', function () {
    return utils.getNumberValue($('#addAfterSPA461Add').val());
  });
}

function getAddAfterSPA461FocusValue() {
  return utils.useCache('.add-after-spa-461-focus', function () {
    return utils.getNumberValue($('#addAfterSPA461Focus').val() / 100);
  });
}

function getAddBeforeCritFocusValue() {
  return utils.useCache('.add-before-crit-focus', function () {
    return utils.getNumberValue($('#addBeforeCritFocus').val() / 100);
  });
}

function getAddBeforeCritAddValue() {
  return utils.useCache('.add-before-crit-add', function () {
    return utils.getNumberValue($('#addBeforeCritAdd').val());
  });
}

function getAddBeforeDoTCritFocusValue() {
  return utils.useCache('.add-before-dot-crit-focus', function () {
    return utils.getNumberValue($('#addBeforeDoTCritFocus').val() / 100);
  });
}

function getAddEffectivenessValue() {
  return utils.useCache('.add-effectiveness', function () {
    return utils.getNumberValue($('#addEffectiveness').val() / 100);
  });
}

function getAddSPA461FocusValue() {
  return utils.useCache('.add-SPA461Focus', function () {
    return utils.getNumberValue($('#addSPA461Focus').val() / 100);
  });
}

function getAddTwincastValue() {
  return utils.useCache('.add-twincast', function () {
    return utils.getNumberValue($('#addTwincast').val() / 100);
  });
}

function getAllianceFulminationValue() {
  return utils.useCache('.allianceFulmination', function () {
    return 1000 * utils.getNumberValue($('#allianceFulmination').val());
  });
}

function getArcaneFusionValue() {
  return utils.useCache('.aa-afusion', function () {
    return $('.aa-afusion .dropdown-toggle').data('value');
  });
}

function getWornDamageFocusList() {
  return utils.useCache('avg-worn-dmg-focus-list', function () {
    return [$('.wn-farm .dropdown-toggle').data('value'), $('.wn-fhand .dropdown-toggle').data('value'), $('.wn-fhead .dropdown-toggle').data('value'), $('.wn-fwrist .dropdown-toggle').data('value')];
  });
}

function getBeltProcValue() {
  return utils.useCache('.belt-proc', function () {
    return $('.belt-proc .dropdown-toggle').data('value');
  });
}

function getBeguilersSynergyValue() {
  return utils.useCache('.aa-esyn', function () {
    return utils.getNumberValue($('.aa-esyn .dropdown-toggle').data('value'));
  });
}

function getConjurersSynergyValue() {
  return utils.useCache('.aa-msyn', function () {
    return utils.getNumberValue($('.aa-msyn .dropdown-toggle').data('value'));
  });
}

function getCritDmgValue() {
  return utils.getNumberValue($('#innatCritDmg').val());
}

function getCritRateValue() {
  return utils.getNumberValue($('#innatCritRate').val());
}

function getArmorProc1Value() {
  return utils.useCache('.armor-proc1', function () {
    return $('.armor-proc1 .dropdown-toggle').data('value');
  });
}

function getArmorProc2Value() {
  return utils.useCache('.armor-proc2', function () {
    return $('.armor-proc2 .dropdown-toggle').data('value');
  });
}

function getDPSAug1AugValue() {
  return utils.useCache('.dps-aug1', function () {
    return $('.dps-aug1 .dropdown-toggle').data('value');
  });
}

function getDPSAug2AugValue() {
  return utils.useCache('dps-aug2', function () {
    return $('.dps-aug2 .dropdown-toggle').data('value');
  });
}

function getDestructiveAdeptValue() {
  return utils.useCache('.aa-dadept', function () {
    return utils.getNumberValue($('.aa-dadept .dropdown-toggle').data('value'));
  });
}

function getEyeOfDecayValue() {
  return utils.useCache('.eye-decay', function () {
    return utils.getNumberValue($('.eye-decay .dropdown-toggle').data('value'));
  });
}

function getFlamesOfPowerValue() {
  return utils.useCache('.aa-flames-pwr', function () {
    return utils.getNumberValue($('.aa-flames-pwr .dropdown-toggle').data('value'));
  });
}

function getForceOfElementsValue() {
  return utils.useCache('.aa-force-of-elements', function () {
    return $('.aa-force-of-elements .dropdown-toggle').data('value');
  });
}

function getForceOfFlameValue() {
  return utils.useCache('.aa-forceflame', function () {
    return $('.aa-forceflame .dropdown-toggle').data('value');
  });
}

function getForceOfIceValue() {
  return utils.useCache('.aa-forceice', function () {
    return $('.aa-forceice .dropdown-toggle').data('value');
  });
}

function getForceOfWillValue() {
  return utils.useCache('.aa-forcewill', function () {
    return $('.aa-forcewill .dropdown-toggle').data('value');
  });
}

function getGCDValue() {
  return utils.useCache('.gcd-value', function () {
    return 1000 * utils.getNumberValue($('#gcd').val());
  });
}

function getLuckValue() {
  return utils.useCache('.luck', function () {
    return utils.getNumberValue($('#luck').val());
  });
}

function getSteelVengeanceValue() {
  return utils.useCache('.aa-steelveng', function () {
    return $('.aa-steelveng .dropdown-toggle').data('value');
  });
}

function getDomForCritDGraph() {
  return $('#critDGraph').get(0);
}

function getDomForDoTCritDGraph() {
  return $('#critDDoTGraph').get(0);
}

function getDomForCritRGraph() {
  return $('#critRGraph').get(0);
}

function getDomForDoTCritRGraph() {
  return $('#critRDoTGraph').get(0);
}

function getDomForDmgGraph() {
  return $('#dmgGraph').get(0);
}

function getDomForSpellline() {
  return $('#spellline').get(0);
}

function getDomForTimeline() {
  return $('#timeline').get(0);
}

function getEvokersSynergyValue() {
  return utils.useCache('.aa-wsyn', function () {
    return utils.getNumberValue($('.aa-wsyn .dropdown-toggle').data('value'));
  });
}

function getHastenedServantValue() {
  return utils.useCache('.aa-servant', function () {
    return 1000 * utils.getNumberValue($('.aa-servant .dropdown-toggle').data('value'));
  });
}

function getRangeAugValue() {
  return utils.useCache('.range-aug', function () {
    return $('.range-aug .dropdown-toggle').data('value');
  });
}

function getRemorselessServantDPSValue() {
  return utils.useCache('.remorseless-servant-dps', function () {
    return utils.getNumberValue($('#remorselessDPS').val());
  });
}

function getRemorselessServantTTLValue() {
  return utils.useCache('.remorseless-servant-ttl', function () {
    return 1000 * utils.getNumberValue($('#remorselessTTL').val());
  });
}

function getRobeValue() {
  return utils.useCache('.wn-fchest', function () {
    return $('.wn-fchest .dropdown-toggle').data('value');
  });
}

function getSelectedSpells() {
  var spells = [];
  $('#spellButtons div.spell button').each(function (item, b) {
    var spellId = $(b).data('value');
    if (spellId != 'NONE') {
      spells.push(spellId);
    }
  });

  return spells;
}

function getShieldProcValue() {
  return utils.useCache('.shield-proc', function () {
    return $('.shield-proc .dropdown-toggle').data('value');
  });
}

function getSorcererVengeananceValue() {
  return utils.useCache('.aa-sveng', function () {
    return utils.getNumberValue($('.aa-sveng .dropdown-toggle').data('value'));
  });
}

function getSpellDamageValue() {
  return utils.useCache('.spell-damage', function () {
    return utils.getNumberValue($('#spellDamage').val());
  });
}

function getSpellFocusAAValue(id) {
  return utils.useCache('.spell-focus-aa-' + id, function () {
    var value = 0;

    var keys = FOCUS_AA_KEYS[_settings.globals.MODE];
    if (keys && keys[id]) {
      value = utils.getNumberValue($(keys[id]).data('value'));
      var spell = utils.getSpellData(id);

      if (value === 9 && spell && spell.level <= 110) {
        value = 0.16;
      } else if (value === 10 && spell && spell.level <= 110) {
        value = 0.18;
      } else if (value === 11 && spell && spell.level <= 110) {
        value = 0.20;
      } else if (value === 12) {
        value = 0.20;
      } else if (value === 13) {
        value = 0.25;
      } else {
        value = 0.0;
      }
    }

    return value;
  });
}

/*
export function getSpellFocusAAValue(id) {
  return utils.useCache('.spell-focus-aa-' + id, () => {
    let value = 0;

    let keys = FOCUS_AA_KEYS[G.MODE];
    if (keys && keys[id]) {
      value = utils.getNumberValue($(keys[id]).data('value'));

      // special case for now to handle some new and old focus
      // levels but not the new one
      if (['SA', 'SS', 'ES', 'EI', 'EZ', 'ER', 'MS', 'MU', 'SH'].find(spell => spell === id) && value < 9) {
        value = 0;
      } 

      if (value === 9) {
        value = 0.16;
      } else if(value === 10) {
        value = 0.18;
      } else if(value === 11) {
        value = 0.20;
      }
    }

    return value ? value : 0;
  });
}
*/

function getSpellTimeRangeControl() {
  return $('#spellTimeRange');
}

function getSpellTimeRangeValue() {
  var timeRange = utils.getNumberValue(getSpellTimeRangeControl().val());
  if (timeRange > 1000) {
    timeRange = 1000;
  }
  return 1000 * (timeRange < 0 ? 0 : timeRange);
}

function getStaffProcValue() {
  return utils.useCache('.staff-proc', function () {
    return $('.staff-proc .dropdown-toggle').data('value');
  });
}

function getVolleyOfManyCountValue() {
  return utils.useCache('.volley-of-many-count', function () {
    return utils.getNumberValue($('#volleyOfManyCount').val());
  });
}

function getTwincastAAValue() {
  return utils.useCache('.aa-twincast', function () {
    return utils.getNumberValue($('.aa-twincast .dropdown-toggle').data('value'));
  });
}

function getTwinprocAAValue() {
  return utils.useCache('.aa-twinproc', function () {
    return utils.getNumberValue($('.aa-twinproc .dropdown-toggle').data('value'));
  });
}

function getType3AugValue(spell) {
  return utils.useCache('.wn-type3-' + spell.id, function () {
    return $('.wn-type3 .dropdown-toggle').data('value') ? spell.type3Aug || 0 : 0;
  });
}

function getType3DmdAugValue(spell) {
  return utils.useCache('.worn-type3dmgaugs-' + spell.id, function () {
    return $('.wn-type3 .dropdown-toggle').data('value') ? spell.type3DmgAug || 0 : 0;
  });
}

function isUsingArcaneFusion() {
  return getArcaneFusionValue() != 'NONE';
}

// Don't cache these since load rates is called before cache is cleared
// Fix sometime
function getCriticalAfflicationValue() {
  return utils.getNumberValue($('.aa-critafflic .dropdown-toggle').data('value'));
}

function getDestructiveCascadeValue() {
  return utils.getNumberValue($('.aa-destcascade .dropdown-toggle').data('value'));
}

function getDestructiveFuryValue() {
  return utils.getNumberValue($('.aa-destfury .dropdown-toggle').data('value'));
}

function getDoNValue() {
  return utils.getNumberValue($('.aa-don .dropdown-toggle').data('value'));
}

function getFuryOfMagicValue() {
  return utils.getNumberValue($('.aa-furymagic .dropdown-toggle').data('value'));
}

function getFamiliarValue() {
  return $('.spell-pet-focus .dropdown-toggle').data('value');
}

function getGiftOfHazyValue() {
  return utils.getNumberValue($('.aa-hazy .dropdown-toggle').data('value'));
}

function getLockoutTime(spell) {
  return spell.lockoutTime ? spell.lockoutTime > getGCDValue() ? spell.lockoutTime : getGCDValue() : 0;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(16);
var toLength = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(41);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(21);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4);
var cof = __webpack_require__(21);
var MATCH = __webpack_require__(5)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__(13);
var redefine = __webpack_require__(14);
var fails = __webpack_require__(3);
var defined = __webpack_require__(26);
var wks = __webpack_require__(5);

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(11);
var SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(14);
var redefineAll = __webpack_require__(47);
var meta = __webpack_require__(34);
var forOf = __webpack_require__(46);
var anInstance = __webpack_require__(45);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var $iterDetect = __webpack_require__(74);
var setToStringTag = __webpack_require__(53);
var inheritIfRequired = __webpack_require__(95);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(13);
var uid = __webpack_require__(38);
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(39) || !__webpack_require__(3)(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete __webpack_require__(2)[K];
});


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(11);
var ctx = __webpack_require__(20);
var forOf = __webpack_require__(46);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 83 */,
/* 84 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(116);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(57);
var call = __webpack_require__(175);
var isArrayIter = __webpack_require__(176);
var anObject = __webpack_require__(63);
var toLength = __webpack_require__(85);
var getIterFn = __webpack_require__(177);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PREEMPT_SPELL_CASTS = exports.SPELL_PROC_ABILITIES = exports.FC_SPELL_PROC_RATES = exports.TW_SPELL_PROC_RATES = exports.CLAW_SPELL_PROC_RATES = exports.SH_DMG_PER_UNIT = exports.SP_DMG_PER_UNIT = exports.SC_DMG_PER_UNIT = exports.SH_MAX_DMG_UNIT = exports.SP_MAX_DMG_UNIT = exports.SC_MAX_DMG_UNIT = exports.SH_MIN_DMG_MOD = exports.SP_MIN_DMG_MOD = exports.SC_MIN_DMG_MOD = exports.SH_MAX_DMG_MOD = exports.SP_MAX_DMG_MOD = exports.SC_MAX_DMG_MOD = exports.FBSINGE_PROC_RATE = exports.MANCY_PROC_RATE = exports.MAGE_INNATE_CRIT_DMG = exports.MAGE_INNATE_CRIT_RATE = exports.ENC_INNATE_CRIT_DMG = exports.ENC_INNATE_CRIT_RATE = exports.FUSE_PROC_SPELL_CHANCE = exports.WIZ_INNATE_CRIT_DMG = exports.WIZ_INNATE_CRIT_RATE = exports.WILDMAGIC_PURE_CHANCE = exports.WILDMAGIC_RIMEBLAST_CHANCE = exports.WILDMAGIC_CHAOS_CHANCE = exports.FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = exports.FUSE_PROC_CHANCE = undefined;

var _trunc = __webpack_require__(185);

var _trunc2 = _interopRequireDefault(_trunc);

var _set = __webpack_require__(186);

var _set2 = _interopRequireDefault(_set);

var _map = __webpack_require__(62);

var _map2 = _interopRequireDefault(_map);

var _parseInt = __webpack_require__(187);

var _parseInt2 = _interopRequireDefault(_parseInt);

var _keys = __webpack_require__(127);

var _keys2 = _interopRequireDefault(_keys);

exports.buildSPAData = buildSPAData;
exports.checkSingleEffectLimit = checkSingleEffectLimit;
exports.computeSPAs = computeSPAs;
exports.getMultiplier = getMultiplier;
exports.getRSDPS = getRSDPS;
exports.getProcEffect = getProcEffect;
exports.getBaseCritDmg = getBaseCritDmg;
exports.getBaseDoTCritDmg = getBaseDoTCritDmg;
exports.getBaseCritRate = getBaseCritRate;
exports.getBaseDoTCritRate = getBaseDoTCritRate;
exports.getSCDmgMod = getSCDmgMod;
exports.getSPDmgMod = getSPDmgMod;
exports.getSHDmgMod = getSHDmgMod;
exports.getCompoundSpellList = getCompoundSpellList;
exports.getEqpProcs = getEqpProcs;
exports.getSpellProcs = getSpellProcs;
exports.getProcRate = getProcRate;
exports.getNormalizer = getNormalizer;
exports.isCastDetSpell = isCastDetSpell;
exports.isCastDetSpellOrAbility = isCastDetSpellOrAbility;
exports.processCounter = processCounter;
exports.round = round;
exports.trunc = trunc;
exports.displaySpellInfo = displaySpellInfo;

var _settings = __webpack_require__(52);

var _abilities = __webpack_require__(67);

var abilities = _interopRequireWildcard(_abilities);

var _dom = __webpack_require__(68);

var dom = _interopRequireWildcard(_dom);

var _stats = __webpack_require__(128);

var stats = _interopRequireWildcard(_stats);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as testData from './test/test.data.js';

// Wiz Settings
var FUSE_PROC_CHANCE = exports.FUSE_PROC_CHANCE = 0.35;
var FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = exports.FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
var WILDMAGIC_CHAOS_CHANCE = exports.WILDMAGIC_CHAOS_CHANCE = 0.35;
var WILDMAGIC_RIMEBLAST_CHANCE = exports.WILDMAGIC_RIMEBLAST_CHANCE = 0.35;
var WILDMAGIC_PURE_CHANCE = exports.WILDMAGIC_PURE_CHANCE = 0.30;
var WIZ_INNATE_CRIT_RATE = exports.WIZ_INNATE_CRIT_RATE = 2;
var WIZ_INNATE_CRIT_DMG = exports.WIZ_INNATE_CRIT_DMG = 100;
var FUSE_PROC_SPELL_CHANCE = exports.FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;

// Enc Settings
var ENC_INNATE_CRIT_RATE = exports.ENC_INNATE_CRIT_RATE = 0;
var ENC_INNATE_CRIT_DMG = exports.ENC_INNATE_CRIT_DMG = 100;

// Mage Settings
var MAGE_INNATE_CRIT_RATE = exports.MAGE_INNATE_CRIT_RATE = 0;
var MAGE_INNATE_CRIT_DMG = exports.MAGE_INNATE_CRIT_DMG = 100;

var MANCY_PROC_RATE = exports.MANCY_PROC_RATE = 0.30; //100 / (100 * 0.30);
var FBSINGE_PROC_RATE = exports.FBSINGE_PROC_RATE = 100 / (100 * 0.25);

var SC_MAX_DMG_MOD = exports.SC_MAX_DMG_MOD = 1.0;
var SP_MAX_DMG_MOD = exports.SP_MAX_DMG_MOD = 1.2;
var SH_MAX_DMG_MOD = exports.SH_MAX_DMG_MOD = 1.2;
var SC_MIN_DMG_MOD = exports.SC_MIN_DMG_MOD = 0.1;
var SP_MIN_DMG_MOD = exports.SP_MIN_DMG_MOD = 0.6;
var SH_MIN_DMG_MOD = exports.SH_MIN_DMG_MOD = 0.6;
var SC_MAX_DMG_UNIT = exports.SC_MAX_DMG_UNIT = 10;
var SP_MAX_DMG_UNIT = exports.SP_MAX_DMG_UNIT = 20;
var SH_MAX_DMG_UNIT = exports.SH_MAX_DMG_UNIT = 5;
var SC_DMG_PER_UNIT = exports.SC_DMG_PER_UNIT = (1.0 - 0.1) / (60 - 10);
var SP_DMG_PER_UNIT = exports.SP_DMG_PER_UNIT = (1.2 - 0.6) / (60 - 20);
var SH_DMG_PER_UNIT = exports.SH_DMG_PER_UNIT = (1.2 - 0.6) / (30 - 5);

// Claw/Chaotic effect proc rates per 100 casts
var CLAW_SPELL_PROC_RATES = exports.CLAW_SPELL_PROC_RATES = {
  wiz: {
    CG: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.35),
      SYLLFIRE: 100 / (100 * 0.05),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    },
    CS: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.05),
      SYLLFIRE: 100 / (100 * 0.35),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  },
  mag: {
    CI: {
      FPWR: 100 / (100 * 0.28),
      FWEAK: 100 / (100 * 0.01),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  }
};

var TW_SPELL_PROC_RATES = exports.TW_SPELL_PROC_RATES = {
  THPWR: 100 / (100 * 0.25),
  THWEAK: 100 / (100 * 0.01)
};

var FC_SPELL_PROC_RATES = exports.FC_SPELL_PROC_RATES = {
  FPWR: 100 / (100 * 0.25),
  FWEAK: 100 / (100 * 0.01)

  // Spell/Abilities the proc from the result of a spell cast
};var SPELL_PROC_ABILITIES = exports.SPELL_PROC_ABILITIES = ['ARCO', 'CDG', 'ESYN1', 'ESYN2', 'MSYN1', 'MSYN2', 'VFX', 'WSYN1', 'WSYN2', 'SYLLFIRERk1', 'SYLLFIRERk2', 'SYLLFIRERk3', 'SYLLMAGICRk1', 'SYLLMAGICRk2', 'SYLLMAGICRk3', 'SYLLICERk1', 'SYLLICERk2', 'SYLLICERk3', 'SYLLMASTERRk1', 'SYLLMASTERRk2', 'SYLLMASTERRk3', 'TC', 'FPWR', 'FWEAK', 'THPWR', 'THWEAK', 'GCH', 'FBSINGERk1', 'FBSINGERk2', 'FBSINGERk3'];

// Spell/Abilities that exist on both spell timeline and adps (they can overlap)
var PREEMPT_SPELL_CASTS = exports.PREEMPT_SPELL_CASTS = ['TC', 'MBRN', 'DR'];

var LIMIT_RULES_FOR_FAILURE = {
  activated: function activated(effect, spell) {
    return true;
  }, // custom check for non spell casts like AA nukes or orb clicks
  class: function _class(effect, spell, value) {
    return value !== _settings.globals.MODE;
  },
  currentHitPoints: function currentHitPoints(effect, spell) {
    return spell.baseDmg === undefined;
  },
  exSkills: function exSkills(effect, spell, value) {
    return value.has(spell.skill);
  },
  exSpells: function exSpells(effect, spell, value) {
    return value.has(spell.id);
  },
  exTargets: function exTargets(effect, spell, value) {
    return value.has(spell.target);
  },
  exTwincastMarker: function exTwincastMarker(effect, spell) {
    return spell.canTwincast === false;
  },
  onSpellUse: function onSpellUse(effect, spell) {
    return !spell.focusable || spell.inventory;
  }, // focusable spells NOT from inventory
  maxCastTime: function maxCastTime(effect, spell, value) {
    return spell.origCastTime > value;
  },
  maxDuration: function maxDuration(effect, spell, value) {
    return spell.duration > value;
  },
  maxLevel: function maxLevel(effect, spell, value) {
    return spell.level > value && !effect.decay;
  },
  maxManaCost: function maxManaCost(effect, spell, value) {
    return spell.manaCost > value;
  },
  minCastTime: function minCastTime(effect, spell, value) {
    return spell.origCastTime < value;
  },
  minDmg: function minDmg(effect, spell, value) {
    return spell.baseDmg < value;
  },
  minLevel: function minLevel(effect, spell, value) {
    return spell.level < value;
  },
  minManaCost: function minManaCost(effect, spell, value) {
    return spell.manaCost < value;
  },
  nonRepeating: function nonRepeating(effect, spell) {
    return spell.duration > 0 && spell.spa !== 79;
  }, // dots or enc dot nukes
  resists: function resists(effect, spell, value) {
    return !value.has(spell.resist);
  },
  spells: function spells(effect, spell, value) {
    return !value.has(spell.id);
  },
  targets: function targets(effect, spell, value) {
    return !value.has(spell.target);
  },
  type: function type(effect, spell, value) {
    return !isSpellType(value, spell);
  }
};

function checkLimits(id, spell, effect) {
  var key = 'checkLimit-' + id + '-' + spell.id + '-' + (effect.spa || '') + '-' + (effect.slot || '') + '-' + (effect.proc || '');

  return utils.useCache(key, function () {
    var pass = true;
    var check = void 0;
    var ability = abilities.get(id);
    var decayLevel = 0;

    // check basics for a spell object
    if (!spell.id || !spell.level) {
      check = 'not a spell';
      pass = false;
    } else if (!spell.baseDmg && !abilities.SPA_NO_DMG.has(effect.spa)) {
      check = 'no damage';
      pass = false;
    } else if (!spell.focusable && abilities.SPA_FOCUSABLE.has(effect.spa)) {
      check = 'not focusable';
      pass = false;
    } else if (spell.inventory && abilities.SPA_EFFECTIVENESS.has(effect.spa)) {
      check = 'inventory';
      pass = false;
    } else if (effect.limits) {
      effect.limits.find(function (limit) {
        var key = (0, _keys2.default)(limit)[0]; // each limit has 1 key
        if (LIMIT_RULES_FOR_FAILURE[key](effect, spell, limit[key])) {
          pass = false;check = key;
          return true;
        } else {
          // special case for dark shield of shield and ITC
          if (ability.charges && !effect.proc && spell.skill === 52 && spell.inventory) {
            pass = false;check = 'hit type';
            return true;
          }

          // save the level to decay on
          if (effect.decay && key === 'maxLevel') {
            decayLevel = limit[key];
          }
        }
      });
    }

    if (!pass) {
      //console.debug(spell.id + " failed on " + check + " -> " + id);
    }

    var result = { pass: pass, failure: check };
    if (decayLevel) {
      // include decay level in result
      result.decayLevel = decayLevel;
    }

    return result;
  });
}

function buildSPAKey(effect) {
  return String(effect.spa) + '-' + String(effect.type) + '-' + String(effect.slot);
}

function parseSPAKey(key) {
  return {
    spa: (0, _parseInt2.default)(key.substr(0, 3)),
    slot: (0, _parseInt2.default)(key.substr(7))
    //type: key.substr(4,2),
  };
}

function getChargeCount(state, id, mod) {
  // bug for Dicho using extra counters
  // really should make Dicho have a proc
  if (state.spell.id === 'DF' && (id === 'AD' || id === 'FD')) {
    return mod * 2;
  }

  // sometimes charged elsewhere or not needed atall
  if (id === 'DR' || state.aeWave || id === 'ITC' && state.inTwincast) {
    return 0;
  }

  return mod;
}

function isSpellType(type, spell) {
  switch (type) {
    case 'detrimental':
      return !spell.beneficial;
    case 'beneficial':
      return !!spell.benefical;
  }
}

function buildSPAData(ids, spell) {
  var spaMap = new _map2.default();
  var abilitySet = new _set2.default();
  var dontChargeSet = new _set2.default();
  var spaSet = new _set2.default();

  ids.forEach(function (id) {
    var ability = abilities.get(id);

    ability.effects.forEach(function (effect) {
      var result = spell ? checkLimits(id, spell, effect) : false;
      if (!result || result.pass) {
        var key = buildSPAKey(effect);
        var existing = spaMap.get(key);

        if (!existing || effect.value < 0 && effect.value < existing.value || // negative effects override all
        effect.value >= existing.value) {

          // special case for FD/AD stacking
          if (id === 'FD' && abilitySet.has('AD')) {
            dontChargeSet.add(id);
          }

          if (existing) {
            abilitySet.delete(existing.id);
          }

          spaSet.add(effect.spa);
          spaMap.set(key, { value: effect.value, spa: effect.spa, id: id });
          abilitySet.add(id);
        }
      } else {
        // dont charge for abilities when any SPA fails unless hit type allows for any (Mana Charge)
        if (ability.charges && ability.hitType !== 'any' && result && result.failure) {
          dontChargeSet.add(id);
        }
      }
    });
  });

  return { abilitySet: abilitySet, dontChargeSet: dontChargeSet, spaMap: spaMap, spaSet: spaSet };
}

function checkSingleEffectLimit(spell, id) {
  var result = void 0;

  abilities.get(id).effects.find(function (effect) {
    if (checkLimits(id, spell, effect).pass) {
      result = effect;
      return true;
    }
  });

  return result;
}

function computeSPAs(state, mod, dotMod) {
  var spell = state.spell;
  dotMod = dotMod || 0;

  var spaValues = {};
  abilities.SPA_KEY_MAP.forEach(function (v, k) {
    spaValues[v] = 0;
  });

  var charged = new _map2.default();
  var result = buildSPAData(state.activeAbilities, spell);

  result.spaMap.forEach(function (v, k) {
    var parsed = parseSPAKey(k);
    var spa = parsed.spa;
    var slot = parsed.slot;

    var key = abilities.SPA_KEY_MAP.get(spa);
    if (key) {
      var partUsed = 1; // default
      var update = v.value;

      if (result.abilitySet.has(v.id) && abilities.get(v.id).charges && !result.dontChargeSet.has(v.id)) {
        // if charge based then only use part
        partUsed = mod;

        // check if counter already charged
        var alreadyCharged = charged.has(v.id);

        if (!alreadyCharged) {
          // some abilities have special cases for charges
          // Ex: additional charge OR no need to count them here
          var count = getChargeCount(state, v.id, mod);
          partUsed = processCounter(state, v.id, count);
          charged.set(v.id, partUsed);
        } else {
          partUsed = charged.get(v.id);
        }
      }

      // special case for 483 getting double benefit when used with 484
      if (spa === 483 && result.spaSet.has(484)) {
        update = update * 2;
      }

      // some SPA breakup effect over each tick
      if ([303, 462].find(function (x) {
        return x === spa;
      })) {
        update = update / dotMod;
      }

      spaValues[key] += update * partUsed;
    }
  });

  return { abilitySet: result.abilitySet, spaValues: spaValues };
}

function getMultiplier(castTime) {
  var multiplier = 0.2499;

  if (castTime >= 2500 && castTime <= 7000) {
    multiplier = .000167 * (castTime - 1000);
  } else if (castTime > 7000) {
    multiplier = 1 * castTime / 7000;
  }

  return multiplier;
}

function getRSDPS(state) {
  return dom.getRemorselessServantDPSValue() * (state[utils.getCounterKeys('RS').counter] || 0);
}

function getProcEffect(spell, id) {
  var result = void 0;

  var ability = abilities.get(id);
  var effect = abilities.getProcEffectForAbility(ability);

  if (effect && effect.proc != spell.id) {
    // check self
    var check = checkLimits(id, spell, effect);
    if (check.pass) {
      result = effect;
    }
  }

  return result;
}

function getBaseCritDmg() {
  // Wiz Pet is Crit DMG Focus Spell (SPA 170)
  // Definitely stacks with FD and works with DF and AA Nukes
  return (dom.getDestructiveFuryValue() + dom.getCritDmgValue()) / 100;
}

function getBaseDoTCritDmg() {
  return (dom.getDestructiveCascadeValue() + dom.getCritDmgValue()) / 100;
}

function getBaseCritRate() {
  return (dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue()) / 100;
}

function getBaseDoTCritRate() {
  return (dom.getDoNValue() + dom.getCriticalAfflicationValue() + dom.getCritRateValue()) / 100;
}

// Self-Combustion
function getSCDmgMod(units) {
  return utils.useCache('sc-dmg-mod-' + units, function () {
    var maxDmgUnit = units > SC_MAX_DMG_UNIT ? units - SC_MAX_DMG_UNIT : 0;
    var dmgMod = SC_MAX_DMG_MOD - maxDmgUnit * SC_DMG_PER_UNIT;
    if (dmgMod < SC_MIN_DMG_MOD) {
      dmgMod = SC_MIN_DMG_MOD;
    }
    return dmgMod;
  });
}

// Level 100 splash
function getSPDmgMod(units) {
  return utils.useCache('sp-dmg-mod-' + units, function () {
    var maxDmgUnit = units > SP_MAX_DMG_UNIT ? units - SP_MAX_DMG_UNIT : 0;
    var dmgMod = SP_MAX_DMG_MOD - maxDmgUnit * SP_DMG_PER_UNIT;
    if (dmgMod < SP_MIN_DMG_MOD) {
      dmgMod = SP_MIN_DMG_MOD;
    }
    return dmgMod;
  });
}

// Level 90 and 95 splash
function getSHDmgMod(units) {
  return utils.useCache('sh-dmg-mod-' + units, function () {
    var maxDmgUnit = units > SH_MAX_DMG_UNIT ? units - SH_MAX_DMG_UNIT : 0;
    var dmgMod = SH_MAX_DMG_MOD - maxDmgUnit * SH_DMG_PER_UNIT;
    if (dmgMod < SH_MIN_DMG_MOD) {
      dmgMod = SH_MIN_DMG_MOD;
    }
    return dmgMod;
  });
}

function getCompoundSpellList(id) {
  return utils.useCache('compound-spell-list-' + id, function () {
    return {
      'WS': [{ id: 'PS', chance: WILDMAGIC_PURE_CHANCE }, { id: 'RC', chance: WILDMAGIC_RIMEBLAST_CHANCE }, { id: 'CB', chance: WILDMAGIC_CHAOS_CHANCE }],
      'WE': [{ id: 'PE', chance: WILDMAGIC_PURE_CHANCE }, { id: 'HC', chance: WILDMAGIC_RIMEBLAST_CHANCE }, { id: 'CI', chance: WILDMAGIC_CHAOS_CHANCE }],
      'EC': [{ id: 'EB', chance: FUSE_PROC_SPELL_CHANCE }, { id: 'RI', chance: FUSE_PROC_SPELL_CHANCE }, { id: 'ET', chance: FUSE_PROC_SPELL_CHANCE }]
    }[id];
  });
}

function getEqpProcs(spell) {
  // find eqp procs
  var procList = utils.useCache('get-eqp-procs-' + spell.id, function () {
    return [dom.getArmorProc1Value(), dom.getArmorProc2Value(), dom.getStaffProcValue(), dom.getBeltProcValue(), dom.getRangeAugValue(), dom.getDPSAug1AugValue(), dom.getDPSAug2AugValue(), dom.getShieldProcValue()].filter(function (id) {
      if (id !== 'NONE') {
        var procSpell = utils.getSpellData(id);
        var limitCheck = procSpell && (!procSpell.limitResists || procSpell.limitResists.get(spell.resist));
        return limitCheck && procSpell.id && procSpell.id != spell.id; // check self
      }
    });
  });

  // if there are any and this spell can proc them
  if (procList.length > 0 && checkSingleEffectLimit(spell, 'EQPPROC')) {
    return procList;
  }

  return [];
}

function getSpellProcs(abilities, spell) {
  var list = [];

  abilities.forEach(function (id) {
    var effect = getProcEffect(spell, id);

    if (effect) {
      list.push({ proc: effect.proc, id: id, hasCharges: !!abilities.charges });
    }
  });

  return list;
}

function getProcRate(spell, proc) {
  var rate = 1.0;

  if (proc.base1) {
    rate = proc.base1 / 100 * getNormalizer(spell);
  } else if (proc.fixedRate) {
    rate = proc.fixedRate / 100;
  }

  return rate;
}

function getNormalizer(spell) {
  return getMultiplier(spell.origCastTime);
}

function isCastDetSpell(spell) {
  return spell.manaCost > 0 && !![5, 14, 24, 98].find(function (x) {
    return x === spell.skill;
  }) && !spell.aa && !spell.inventory;
}

function isCastDetSpellOrAbility(spell) {
  return isCastDetSpell(spell) || spell.aa || spell.inventory;
}

function processCounter(state, id, mod) {
  var keys = utils.getCounterKeys(id);
  var partUsed = void 0;
  var counterUsed = 0;
  var current = state[keys.counter];
  var start = current >= 1 ? 1 : current;

  if (current >= mod) {
    if (current >= 1) {
      current -= mod;
      counterUsed = mod;
      partUsed = start;
      // use full amount if it's available
    } else {
      current -= mod * current;
      counterUsed = mod * current;
      partUsed = counterUsed;
    }
  } else {
    partUsed = current;
    counterUsed = current;
    current = 0;
  }

  // update stats
  state[keys.counter] = current < 0.000001 ? 0 : current;
  stats.addSpellStatistics(state, keys.charges, counterUsed);

  // Why x start? So, 1 charge is normally required. mod that for twincast. Easy.
  // But if there's only 0.5 total left then it's really only half strength. ie think proc damage
  return partUsed;
}

function round(value) {
  return utils.asDecimal32Precision(value);
}

function trunc(value) {
  return (0, _trunc2.default)(utils.asDecimal32Precision(value));
}

function displaySpellInfo(target, testData) {
  $(target).css('height', '600px');
  $(target).css('overflow-y', 'auto');
  var test = $(target).find('.test-data');
  var current = $(target).find('.current-data');

  if (test.find('pre').length > 0) {
    return; // content already loaded
  }

  var count = 1;
  var lines = [];

  var rankMarker = new RegExp(/Rk\d/);
  utils.getAllSpellData().forEach(function (data) {
    (0, _keys2.default)(data.spells).sort(function (a, b) {
      if (data.spells[a].name > data.spells[b].name) {
        return 1;
      }
      if (data.spells[b].name > data.spells[a].name) {
        return -1;
      }
      return 0;
    }).forEach(function (sid) {
      if (rankMarker.test(sid) === false) {
        var spell = data.spells[sid];

        lines.push(String(count++).padStart(4, '0') + ': <strong style="font-size: 15px;">' + spell.name + '</strong>');

        abilities.getAll().forEach(function (aid) {
          var ability = abilities.get(aid);

          // dont mix mage/wiz spells and abilities
          if (!ability.mode || data.name === 'gen' || ability.mode === data.name) {
            ability.effects.forEach(function (effect) {
              var eName = 'Misc';
              if (effect.spa) eName = 'SPA ' + effect.spa;
              if (effect.proc !== undefined) eName = 'Proc';

              var result = checkLimits(aid, spell, effect);
              if (result.pass) {
                lines.push(String(count++).padStart(4, '0') + ':   <em style="color: green;">Pass</em> ' + eName + ' ' + ability.name);
              } else {
                lines.push(String(count++).padStart(4, '0') + ':   <em style="color: red;">Fail</em> ' + eName + ' ' + ability.name + ' (' + result.failure + ')');
              }
            });
          }
        });
      }
    });
  });

  var preCurrent = $('<pre><code>');
  var preTest = $('<pre><code>');

  lines.forEach(function (line) {
    return preCurrent.append(line + '\n');
  });
  testData.forEach(function (line) {
    return preTest.append(line + '\n');
  });

  // do this and view page source...
  //let w = window.open('', 'Test Data');
  //w.document.clear();
  //w.document.write('<xmp>');
  //lines.forEach(line => w.document.writeln(line));
  //w.document.write('</xmp>');

  $(test).append(preTest);
  $(current).append(preCurrent);

  // check for errors
  var error = -1;
  for (var i = 0; i < lines.length; i++) {
    if (!lines[i].includes(testData[i])) {
      console.debug(lines[i]);
      console.debug(testData[i]);
      error = i + 1;
      break;
    }
  }

  if (error === -1) {
    $('.modal-header .errorMsg').append(' -- All Results Match Test Data');
  } else {
    $('.modal-header .errorMsg').append(' -- Rule Mis-match Line: ' + error);
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(24);
var LIBRARY = __webpack_require__(39);
var wksExt = __webpack_require__(131);
var defineProperty = __webpack_require__(8).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(69)('keys');
var uid = __webpack_require__(38);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(20)(Function.call, __webpack_require__(17).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var setPrototypeOf = __webpack_require__(93).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(27);
var defined = __webpack_require__(26);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),
/* 97 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};


/***/ }),
/* 98 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(27);
var defined = __webpack_require__(26);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(39);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(14);
var hide = __webpack_require__(13);
var has = __webpack_require__(12);
var Iterators = __webpack_require__(55);
var $iterCreate = __webpack_require__(101);
var setToStringTag = __webpack_require__(53);
var getPrototypeOf = __webpack_require__(18);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(42);
var descriptor = __webpack_require__(37);
var setToStringTag = __webpack_require__(53);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(13)(IteratorPrototype, __webpack_require__(5)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(73);
var defined = __webpack_require__(26);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(55);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(8);
var createDesc = __webpack_require__(37);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(61);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(55);
module.exports = __webpack_require__(24).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(285);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(10);
var toAbsoluteIndex = __webpack_require__(41);
var toLength = __webpack_require__(9);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(35);
var step = __webpack_require__(147);
var Iterators = __webpack_require__(55);
var toIObject = __webpack_require__(16);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(100)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(20);
var invoke = __webpack_require__(137);
var html = __webpack_require__(92);
var cel = __webpack_require__(88);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(21)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(110).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(21)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(11);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(7);
var LIBRARY = __webpack_require__(39);
var $typed = __webpack_require__(79);
var hide = __webpack_require__(13);
var redefineAll = __webpack_require__(47);
var fails = __webpack_require__(3);
var anInstance = __webpack_require__(45);
var toInteger = __webpack_require__(27);
var toLength = __webpack_require__(9);
var toIndex = __webpack_require__(156);
var gOPN = __webpack_require__(43).f;
var dP = __webpack_require__(8).f;
var arrayFill = __webpack_require__(108);
var setToStringTag = __webpack_require__(53);
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(399)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(117)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 116 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(400);
var $export = __webpack_require__(19);
var redefine = __webpack_require__(403);
var hide = __webpack_require__(48);
var has = __webpack_require__(64);
var Iterators = __webpack_require__(65);
var $iterCreate = __webpack_require__(404);
var setToStringTag = __webpack_require__(125);
var getPrototypeOf = __webpack_require__(410);
var ITERATOR = __webpack_require__(30)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(406);
var enumBugKeys = __webpack_require__(169);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(121);
var defined = __webpack_require__(84);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(122);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 122 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(168)('keys');
var uid = __webpack_require__(124);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 124 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(36).f;
var has = __webpack_require__(64);
var TAG = __webpack_require__(30)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(428), __esModule: true };

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Handlebars, $) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(189);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _trunc = __webpack_require__(185);

var _trunc2 = _interopRequireDefault(_trunc);

var _map = __webpack_require__(62);

var _map2 = _interopRequireDefault(_map);

exports.getStatisticsSummary = getStatisticsSummary;
exports.printStats = printStats;
exports.addAggregateStatistics = addAggregateStatistics;
exports.addMaxAggregateStatistics = addMaxAggregateStatistics;
exports.addSpellStatistics = addSpellStatistics;
exports.getSpellCastInfo = getSpellCastInfo;
exports.getSpellStatistics = getSpellStatistics;
exports.getSpellStatisticsForIndex = getSpellStatisticsForIndex;
exports.clear = clear;
exports.updateSpellStatistics = updateSpellStatistics;

var _damageUtils = __webpack_require__(87);

var dmgU = _interopRequireWildcard(_damageUtils);

var _dom = __webpack_require__(68);

var dom = _interopRequireWildcard(_dom);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATISTICS = { spells: new _map2.default(), aggr: new _map2.default(), _ids: new _map2.default(), _totals: new _map2.default() };
var STAT_CHANGE_TEMPLATE = Handlebars.compile($('#stat-change-template').html());
var STAT_SUB_TEMPLATE = Handlebars.compile($('#stat-sub-template').html());

function addNumberStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: utils.numberWithCommas(Math.round(value)) });
  }
}

function addDecimalStatDescription(data, title, value, force, fixed) {
  if (value || force) {
    data.push({ title: title, value: value.toFixed(fixed || 3) });
  }
}

function addPercentStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: utils.displayPercent(value) });
  }
}

function updateStatSection(sectionId, avgDPS, label, text, value, key) {
  var prev = STATISTICS._totals.get(key);
  var change = prev && avgDPS > 0 ? utils.getPercentText(prev, value) : "";
  var className = utils.getPercentClass(prev, value);
  change = className === "" ? "" : change;
  $(sectionId).html('');
  $(sectionId).append(STAT_CHANGE_TEMPLATE({ className: className, label: label, value: text, change: change }));
  STATISTICS._totals.set(key, value);
}

function getStatisticsSummary(spellStats) {
  var data = [];
  var spell = utils.getSpellData(spellStats.get('id'));

  addNumberStatDescription(data, "Chart ID", spellStats.get('chartIndex'), true);
  addNumberStatDescription(data, "Level", spell.level, true);
  data.push({ title: "Time Left(s)", value: spellStats.get('timeLeft') });
  addDecimalStatDescription(data, "Cast Time(s)", spellStats.get('adjCastTime') / 1000, true, 3);
  addDecimalStatDescription(data, "Cast Interval(s)", spellStats.get('castInterval'), false, 3);
  addDecimalStatDescription(data, "Recast Delay(s)", spellStats.get('castInterval') - spell.castTime / 1000);
  addNumberStatDescription(data, "Pet Count", spellStats.get('rsCounter'));
  //addNumberStatDescription(data, "Pet DPS", spellStats.get('rsDPS'));

  // Only print spellStats for spells that do damage and not WE/WF
  if (spellStats.get('avgBaseDmg') > 0) {
    addDecimalStatDescription(data, "AD Charges", spellStats.get('adChargesUsed'));
    addDecimalStatDescription(data, "FD Charges", spellStats.get('fdChargesUsed'));
    addDecimalStatDescription(data, "CI Charges", spellStats.get('ciChargesUsed'));
    addDecimalStatDescription(data, "ITC Charges", spellStats.get('itcChargesUsed'));
    addDecimalStatDescription(data, "DR Charges", spellStats.get('drChargesUsed'));
    addDecimalStatDescription(data, "AAura Charges", spellStats.get('aaChargesUsed'));
    addDecimalStatDescription(data, "ABallod Charges", spellStats.get('abChargesUsed'));
    addDecimalStatDescription(data, "Arcomancy Charges", spellStats.get('arcoChargesUsed'));
    addDecimalStatDescription(data, "FReave Charges", spellStats.get('fraChargesUsed'));
    addDecimalStatDescription(data, "Firebound Charges", spellStats.get('firebaChargesUsed'));
    addDecimalStatDescription(data, "Frostbound Charges", spellStats.get('frostbaChargesUsed'));
    addDecimalStatDescription(data, "FB Singe I", spellStats.get('fbsingerk1ChargesUsed'));
    addDecimalStatDescription(data, "FB Singe II", spellStats.get('fbsingerk2ChargesUsed'));
    addDecimalStatDescription(data, "FB Singe III", spellStats.get('fbsingerk3ChargesUsed'));
    addDecimalStatDescription(data, "MR Charges", spellStats.get('mraChargesUsed'));
    addDecimalStatDescription(data, "MBRN Charges", spellStats.get('mbrnChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable I", spellStats.get('syllfirerk1ChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable II", spellStats.get('syllfirerk2ChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable III", spellStats.get('syllfirerk3ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable I", spellStats.get('syllmagicrk1ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable II", spellStats.get('syllmagicrk2ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable IIII", spellStats.get('syllmagicrk3ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable I", spellStats.get('syllmasterrk1ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable II", spellStats.get('syllmasterrk2ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable III", spellStats.get('syllmasterrk3ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable I", spellStats.get('syllicerk1ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable II", spellStats.get('syllicerk2ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable III", spellStats.get('syllicerk3ChargesUsed'));
    addDecimalStatDescription(data, "Vortex Effects", spellStats.get('vfxChargesUsed'));
    addDecimalStatDescription(data, "Chroma Haze", spellStats.get('chChargesUsed'));
    addDecimalStatDescription(data, "Gift of Chroma", spellStats.get('gchChargesUsed'));
    addDecimalStatDescription(data, "Mana Charge", spellStats.get('mcChargesUsed'));
    addDecimalStatDescription(data, "Enc Synergy", spellStats.get('esynChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msyn1ChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msyn2ChargesUsed'));
    addDecimalStatDescription(data, "Nec Synergy", spellStats.get('nsynChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsyn1ChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsyn2ChargesUsed'));
    addDecimalStatDescription(data, "FlamesPwr Charges", spellStats.get('fpwrChargesUsed'));
    addDecimalStatDescription(data, "FlamesWeak Effect", spellStats.get('fweakChargesUsed'));
    addDecimalStatDescription(data, "ThricePwr Charges", spellStats.get('thpwrChargesUsed'));
    addDecimalStatDescription(data, "ThriceWeak Effect", spellStats.get('thweakChargesUsed'));

    addPercentStatDescription(data, "Crit Dmg Mult", spellStats.get('critDmgMult'), true);
    addPercentStatDescription(data, "Lucky Crit Dmg Mult", spellStats.get('luckyCritDmgMult'), true);
    addPercentStatDescription(data, "Crit Rate", spellStats.get('critRate'), true);
    addPercentStatDescription(data, "Lucky Crit Rate", spellStats.get('luckyCritRate'), true);
    addPercentStatDescription(data, "Twincast Rate", spellStats.get('twincastRate'), true);

    if (!['WS', 'WE'].find(function (x) {
      return x === spell.id;
    })) {
      addNumberStatDescription(data, "Spell Damage", spellStats.get('spellDmg'));
      addPercentStatDescription(data, "Effectiveness", spellStats.get('effectiveness'));
      addPercentStatDescription(data, "Before Crit Focus", spellStats.get('beforeCritFocus'));
      addNumberStatDescription(data, "Before Crit Add", spellStats.get('beforeCritAdd'));
      addPercentStatDescription(data, "Before DoT Crit Focus", spellStats.get('beforeDoTCritFocus'));
      addPercentStatDescription(data, "After Crit Focus", spellStats.get('afterCritFocus'));
      addNumberStatDescription(data, "After Crit Add", spellStats.get('afterCritAdd'));
      addPercentStatDescription(data, "SPA 461 Focus", spellStats.get('spa461Focus'));
      addPercentStatDescription(data, "After SPA 461 Focus", spellStats.get('afterSPA461Focus'));
      addNumberStatDescription(data, "After SPA 461 Add", spellStats.get('afterSPA461Add'));

      addNumberStatDescription(data, "Orig Base Dmg", spell.baseDmg);
      addNumberStatDescription(data, "Calc Base Dmg", spellStats.get('avgBaseDmg'));
      addNumberStatDescription(data, "Calc Crit Dmg", spellStats.get('avgCritDmg'));
      addNumberStatDescription(data, "Calc Lucky Crit Dmg", spellStats.get('avgLuckyCritDmg'));
      addNumberStatDescription(data, "Avg AE Hit1", spellStats.get('aeHit1'));
      addNumberStatDescription(data, "Avg AE Hit2", spellStats.get('aeHit2'));
      addNumberStatDescription(data, "Avg AE Hit3", spellStats.get('aeHit3'));
      addNumberStatDescription(data, "Avg AE Hit4", spellStats.get('aeHit4'));
      addNumberStatDescription(data, "Avg AE Hit5", spellStats.get('aeHit5'));
      addNumberStatDescription(data, "Avg AE Hit6", spellStats.get('aeHit6'));
      addNumberStatDescription(data, "Avg AE Hit7", spellStats.get('aeHit7'));
      addNumberStatDescription(data, "Avg AE Hit8", spellStats.get('aeHit8'));
      addNumberStatDescription(data, "Avg AE Hit9", spellStats.get('aeHit9'));
      addNumberStatDescription(data, "Avg AE Hit10", spellStats.get('aeHit10'));
      addNumberStatDescription(data, "Avg AE Hit11", spellStats.get('aeHit11'));
      addNumberStatDescription(data, "Avg AE Hit12", spellStats.get('aeHit12'));
    }

    addNumberStatDescription(data, "Avg Dmg", spellStats.get('avgDmg'));
    addNumberStatDescription(data, "Avg TC Dmg", spellStats.get('tcAvgDmg'));
    addNumberStatDescription(data, "Sub Total", spellStats.get('avgDmg') + spellStats.get('tcAvgDmg'));
  }

  addNumberStatDescription(data, "Avg 1 Pet Dmg", spellStats.get('est1PetDmg'));
  addNumberStatDescription(data, "Aug/Eqp Procs", spellStats.get('eqpAddDmg'));
  addNumberStatDescription(data, "Arcane Fusion", spellStats.get('afuAddDmg'));
  addNumberStatDescription(data, "ABallad Proc", spellStats.get('abAddDmg'));
  addNumberStatDescription(data, "Cryo Proc", spellStats.get('cryoAddDmg'));
  addNumberStatDescription(data, "Pyro Proc", spellStats.get('pyroAddDmg'));
  addNumberStatDescription(data, "DR Proc", spellStats.get('drAddDmg'));
  addNumberStatDescription(data, "FReave Proc", spellStats.get('fraAddDmg'));
  addNumberStatDescription(data, "MR Proc", spellStats.get('mraAddDmg'));
  addNumberStatDescription(data, "RestlessFocus", spellStats.get('rfAddDmg'));
  addNumberStatDescription(data, "Steel Vengeance", spellStats.get('steelvengAddDmg'));
  addNumberStatDescription(data, "Repudiate Destruction", spellStats.get('repudiatedestAddDmg'));

  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsyn1AddDmg'));
  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsyn2AddDmg'));

  addNumberStatDescription(data, "Est Braid Proc", spellStats.get('fuseProcDmg'));
  addNumberStatDescription(data, "Total Dmg", spellStats.get('totalDmg'));

  var dps = (0, _trunc2.default)((spellStats.get('totalDmg') || 0) / (spellStats.get('adjCastTime') + dom.getLockoutTime(spell)) * 1000);
  data.push({ title: "DPS", value: utils.numberWithCommas(dps) + "/s" });
  return data;
}

function printStats(output, state) {
  var timerange = state.castTimeLast - state.castTimeFirst;
  if (timerange < 1000) {
    timerange = 1000; // no less than 1 second
  }

  timerange = Math.ceil(timerange / 1000);

  var totalAvgDmg = getSpellCastInfo().get('totalAvgDmg') || 0;
  //let totalAvgPetDmg = getSpellCastInfo().get('totalAvgPetDmg') || 0;
  var totalDotDmg = getSpellCastInfo().get('totalDotDmg') || 0;
  var totalProcs = getSpellCastInfo().get('totalProcs') || 0;
  var avgDPS = (totalAvgDmg + totalDotDmg) / timerange;

  var maxHit = getSpellCastInfo().get('maxHit') || 0;
  var aggrSpellCount = getSpellCastInfo().get('spellCount') || 0;
  var aggrCritRate = getSpellCastInfo().get('critRate') || 0;
  var totalAvgTcRate = getSpellCastInfo().get('totalAvgTcRate') || 0;
  var totalCastCount = getSpellCastInfo().get('totalCastCount') || 0;
  var totalDetCastCount = getSpellCastInfo().get('detCastCount') || 0;

  // Spell Count
  updateStatSection('#spellCountStats', avgDPS, 'Spells', totalCastCount, totalCastCount, 'totalCastCount');

  // Cast Time
  updateStatSection('#castTimeStats', 0, 'Cast Time ', timerange + 's', timerange, 'timerange');

  // DPS
  updateStatSection('#dpsStats', avgDPS, 'DPS ', utils.numberWithCommas(avgDPS.toFixed(2)), avgDPS, 'avgDPS');

  // Max Hit
  updateStatSection('#maxHitStats', avgDPS, 'Max Cast', utils.numberWithCommas((0, _trunc2.default)(maxHit)), maxHit, 'maxHit');

  // Avg Hit
  var avgHit = totalDetCastCount > 0 ? totalAvgDmg / totalDetCastCount : 0;
  updateStatSection('#averageHitStats', avgDPS, 'Avg Cast', utils.numberWithCommas((0, _trunc2.default)(avgHit)), avgHit, 'avgHit');

  // Total Damage from Spell Casts
  updateStatSection('#castDamageStats', avgDPS, 'Cast Damage ', utils.numberWithCommas((0, _trunc2.default)(totalAvgDmg)), totalAvgDmg, 'totalAvgCastDmg');

  // Total Pet Damage
  //updateStatSection('#petDamageStats', avgDPS, 'Pet Damage ', utils.numberWithCommas(Math.trunc(totalAvgPetDmg)), totalAvgPetDmg, 'totalAvgPetDmg');

  // Total DoT Damage
  updateStatSection('#dotDamageStats', avgDPS, 'DoT Damage ', utils.numberWithCommas((0, _trunc2.default)(totalDotDmg)), totalDotDmg, 'totalDotDmg');

  // Total Damage
  var finalTotal = (0, _trunc2.default)(totalAvgDmg + totalDotDmg);
  updateStatSection('#totalDamageStats', avgDPS, 'Total Damage ', utils.numberWithCommas(finalTotal), finalTotal, 'totalAvgDmg');

  // Avg Crit Rate
  var avgCritRate = aggrSpellCount ? aggrCritRate / aggrSpellCount * 100 : 0;
  updateStatSection('#critRateStats', avgDPS, 'Crit Rate ', avgCritRate.toFixed(2) + '%', avgCritRate, 'avgCritRate');

  // Avg TC Rate
  var avgTcRate = totalDetCastCount > 0 && totalAvgTcRate ? totalAvgTcRate / totalDetCastCount * 100 : 0;
  updateStatSection('#tcRateStats', avgDPS, 'TC Rate ', avgTcRate.toFixed(2) + '%', avgTcRate, 'avgTcRate');

  // Avg Proc Rate
  var avgProcRate = totalProcs / timerange;
  updateStatSection('#procRateStats', avgDPS, 'PPS', avgProcRate.toFixed(4), avgProcRate, 'avgProcRate');

  getSpellCastInfo().get('castMap').forEach(function (v, k) {
    output.append(STAT_SUB_TEMPLATE({ label: utils.getSpellData(k).name, value: v }));
  });

  avgDPS > 0 ? $('.stats').addClass('stats-available') : $('.stats').removeClass('stats-available');
}

// Functions for working with spell statistics
function incrementStat(mapName, key) {
  var count = STATISTICS[mapName].get(key);
  STATISTICS[mapName].set(key, count ? count + 1 : 1);
}

function initSpellStatistics(index, name, value) {
  if (STATISTICS.spells.has(index)) {
    // keep track of spell counts per ID
    if (name === 'id' && value !== undefined) {
      incrementStat('_ids', value);
      incrementStat('aggr', 'totalCastCount');
    }

    return STATISTICS.spells.get(index);
  }

  var indexMap = new _map2.default();
  STATISTICS.spells.set(index, indexMap);
  return indexMap;
}

function addAggregateStatistics(name, value) {
  var count = STATISTICS.aggr.get(name) || 0;
  STATISTICS.aggr.set(name, count + value);
}

function addMaxAggregateStatistics(name, value) {
  var count = STATISTICS.aggr.get(name) || 0;
  if (value > count) {
    STATISTICS.aggr.set(name, value);
  }
}

function addSpellStatistics(state, name, value) {
  var indexMap = initSpellStatistics(state.chartIndex, name, value);
  indexMap.set(name, indexMap.has(name) ? indexMap.get(name) + value : value);
}

function getSpellCastInfo() {
  var info = new _map2.default([].concat((0, _toConsumableArray3.default)(STATISTICS.aggr)));
  var sortedList = [].concat((0, _toConsumableArray3.default)(STATISTICS._ids)).sort(function (a, b) {
    return a[1] < b[1];
  });
  info.set('castMap', new _map2.default(sortedList));
  return info;
}

function getSpellStatistics(state, key) {
  return STATISTICS.spells.get(state.chartIndex).get(key);
}

function getSpellStatisticsForIndex(index) {
  return STATISTICS.spells.get(index) || new _map2.default();
}

function clear() {
  STATISTICS.spells.clear();
  STATISTICS.aggr.clear();
  STATISTICS._ids.clear();
}

function updateSpellStatistics(state, name, value) {
  var indexMap = initSpellStatistics(state.chartIndex, name, value);
  if (!indexMap.has(name)) {
    indexMap.set(name, value);
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(83), __webpack_require__(6)))

/***/ }),
/* 129 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(3)(function () {
  return Object.defineProperty(__webpack_require__(88)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(12);
var toIObject = __webpack_require__(16);
var arrayIndexOf = __webpack_require__(70)(false);
var IE_PROTO = __webpack_require__(90)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var anObject = __webpack_require__(1);
var getKeys = __webpack_require__(40);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(16);
var gOPN = __webpack_require__(43).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(40);
var gOPS = __webpack_require__(71);
var pIE = __webpack_require__(60);
var toObject = __webpack_require__(10);
var IObject = __webpack_require__(59);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(11);
var isObject = __webpack_require__(4);
var invoke = __webpack_require__(137);
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};


/***/ }),
/* 137 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(54).trim;
var ws = __webpack_require__(94);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat;
var $trim = __webpack_require__(54).trim;

module.exports = 1 / $parseFloat(__webpack_require__(94) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(21);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),
/* 142 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(97);
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(11);
var toObject = __webpack_require__(10);
var IObject = __webpack_require__(59);
var toLength = __webpack_require__(9);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(10);
var toAbsoluteIndex = __webpack_require__(41);
var toLength = __webpack_require__(9);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(7) && /./g.flags != 'g') __webpack_require__(8).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(75)
});


/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(112);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(152);
var validate = __webpack_require__(56);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(78)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(8).f;
var create = __webpack_require__(42);
var redefineAll = __webpack_require__(47);
var ctx = __webpack_require__(20);
var anInstance = __webpack_require__(45);
var forOf = __webpack_require__(46);
var $iterDefine = __webpack_require__(100);
var step = __webpack_require__(147);
var setSpecies = __webpack_require__(44);
var DESCRIPTORS = __webpack_require__(7);
var fastKey = __webpack_require__(34).fastKey;
var validate = __webpack_require__(56);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(152);
var validate = __webpack_require__(56);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(78)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each = __webpack_require__(29)(0);
var redefine = __webpack_require__(14);
var meta = __webpack_require__(34);
var assign = __webpack_require__(135);
var weak = __webpack_require__(155);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var validate = __webpack_require__(56);
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(78)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(47);
var getWeak = __webpack_require__(34).getWeak;
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(45);
var forOf = __webpack_require__(46);
var createArrayMethod = __webpack_require__(29);
var $has = __webpack_require__(12);
var validate = __webpack_require__(56);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(27);
var toLength = __webpack_require__(9);
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(43);
var gOPS = __webpack_require__(71);
var anObject = __webpack_require__(1);
var Reflect = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = __webpack_require__(72);
var isObject = __webpack_require__(4);
var toLength = __webpack_require__(9);
var ctx = __webpack_require__(20);
var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(9);
var repeat = __webpack_require__(96);
var defined = __webpack_require__(26);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(40);
var toIObject = __webpack_require__(16);
var isEnum = __webpack_require__(60).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(61);
var from = __webpack_require__(162);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(46);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 163 */
/***/ (function(module, exports) {

// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};


/***/ }),
/* 164 */
/***/ (function(module, exports) {



/***/ }),
/* 165 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);
var document = __webpack_require__(33).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(63);
var dPs = __webpack_require__(405);
var enumBugKeys = __webpack_require__(169);
var IE_PROTO = __webpack_require__(123)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(166)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(409).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(33);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 169 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(411);
var global = __webpack_require__(33);
var hide = __webpack_require__(48);
var Iterators = __webpack_require__(65);
var TO_STRING_TAG = __webpack_require__(30)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 171 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(36).f;
var create = __webpack_require__(167);
var redefineAll = __webpack_require__(173);
var ctx = __webpack_require__(57);
var anInstance = __webpack_require__(174);
var forOf = __webpack_require__(86);
var $iterDefine = __webpack_require__(117);
var step = __webpack_require__(171);
var setSpecies = __webpack_require__(414);
var DESCRIPTORS = __webpack_require__(50);
var fastKey = __webpack_require__(179).fastKey;
var validate = __webpack_require__(126);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(48);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 174 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(63);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(65);
var ITERATOR = __webpack_require__(30)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(178);
var ITERATOR = __webpack_require__(30)('iterator');
var Iterators = __webpack_require__(65);
module.exports = __webpack_require__(23).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(122);
var TAG = __webpack_require__(30)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(124)('meta');
var isObject = __webpack_require__(49);
var has = __webpack_require__(64);
var setDesc = __webpack_require__(36).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(51)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(33);
var $export = __webpack_require__(19);
var meta = __webpack_require__(179);
var fails = __webpack_require__(51);
var hide = __webpack_require__(48);
var redefineAll = __webpack_require__(173);
var forOf = __webpack_require__(86);
var anInstance = __webpack_require__(174);
var isObject = __webpack_require__(49);
var setToStringTag = __webpack_require__(125);
var dP = __webpack_require__(36).f;
var each = __webpack_require__(415)(0);
var DESCRIPTORS = __webpack_require__(50);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(178);
var from = __webpack_require__(420);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(19);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(19);
var aFunction = __webpack_require__(165);
var ctx = __webpack_require__(57);
var forOf = __webpack_require__(86);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(431), __esModule: true };

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(440), __esModule: true };

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(442), __esModule: true };

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(447), __esModule: true };

/***/ }),
/* 188 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(451);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Handlebars, $, vis) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parseInt = __webpack_require__(187);

var _parseInt2 = _interopRequireDefault(_parseInt);

var _toConsumableArray2 = __webpack_require__(189);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = __webpack_require__(186);

var _set2 = _interopRequireDefault(_set);

exports.addSpellProcAbility = addSpellProcAbility;
exports.callUpdateSpellChart = callUpdateSpellChart;
exports.connectPopovers = connectPopovers;
exports.createAdpsItem = createAdpsItem;
exports.init = init;
exports.getTimelineItemTime = getTimelineItemTime;
exports.loadRates = loadRates;
exports.quiet = quiet;
exports.resume = resume;
exports.removeAdpsItem = removeAdpsItem;
exports.removePopovers = removePopovers;
exports.resetTimers = resetTimers;
exports.setTitle = setTitle;
exports.updateSpellChart = updateSpellChart;
exports.updateWindow = updateWindow;
exports.visTimelineListener = visTimelineListener;

var _settings = __webpack_require__(52);

var _abilities = __webpack_require__(67);

var abilities = _interopRequireWildcard(_abilities);

var _damage = __webpack_require__(456);

var damage = _interopRequireWildcard(_damage);

var _damageUtils = __webpack_require__(87);

var dmgU = _interopRequireWildcard(_damageUtils);

var _dom = __webpack_require__(68);

var dom = _interopRequireWildcard(_dom);

var _stats = __webpack_require__(128);

var stats = _interopRequireWildcard(_stats);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// html templates for spell icon popup and the icon themselves on the spell timeline
var SPELL_DETAILS_TEMPLATE = Handlebars.compile($('#spell-details-template').html());
var SPELL_ITEM_TEMPLATE = Handlebars.compile($('#spell-timeline-item-template').html());

// timelines start at the time the browser loads and then the date/time info is removed
var CURRENT_TIME = utils.getCurrentTime();

// create the graphs and data set objects
var CRITR_DATA = new vis.DataSet([]);
var CRITD_DATA = new vis.DataSet([]);
var CRITR_DOT_DATA = new vis.DataSet([]);
var CRITD_DOT_DATA = new vis.DataSet([]);
var DMG_DATA = new vis.DataSet([]);
var SPELLLINE_DATA = new vis.DataSet([]);
var TIMELINE_DATA = new vis.DataSet([]);
var GRAPH_CRITR = createGraph('graphcritr', CURRENT_TIME, dom.getDomForCritRGraph(), CRITR_DATA);
var GRAPH_CRITD = createGraph('graphcritd', CURRENT_TIME, dom.getDomForCritDGraph(), CRITD_DATA);
var GRAPH_DOT_CRITR = createGraph('graphcritr', CURRENT_TIME, dom.getDomForDoTCritRGraph(), CRITR_DOT_DATA);
var GRAPH_DOT_CRITD = createGraph('graphcritd', CURRENT_TIME, dom.getDomForDoTCritDGraph(), CRITD_DOT_DATA);
var GRAPH_DMG = createGraph('graphdmg', CURRENT_TIME, dom.getDomForDmgGraph(), DMG_DATA);
var SPELL_TIMELINE = createTimeline('spellline', CURRENT_TIME, dom.getDomForSpellline(), SPELLLINE_DATA);
var TIMELINE = createTimeline('timeline', CURRENT_TIME, dom.getDomForTimeline(), TIMELINE_DATA);

var BASE_CRIT_DATA = []; // crit info so it doesn't have to be re-calculated all the time
var BASE_DOT_CRIT_DATA = []; // crit info so it doesn't have to be re-calculated all the time
var UPDATING_CHART = -1; // used to throttle calls to update the chart data
var TIME_INCREMENT = 50;

// helper for creating a timeline
function createTimeline(id, time, dom, data, template) {
  var opts = utils.readChartOptions(id, time);
  if (template) opts.template = template;
  return new vis.Timeline(dom, data, opts);
}

// helper for creating a graph
function createGraph(id, time, dom, data) {
  var opts = utils.readChartOptions(id, time);
  return new vis.Graph2d(dom, data, opts);
}

function castSpell(state, spell, adjCastTime) {
  // update current state with spell
  state.chartIndex++;
  state.spell = spell;

  adjCastTime = adjCastTime || utils.getCastTime(state, spell);
  var neededTime = state.workingTime + adjCastTime;
  if (neededTime > state.endTime) return false; // Time EXCEEDED

  // advance dot damage until we hit end of cast time
  for (state.workingTime; state.workingTime <= neededTime; state.workingTime += TIME_INCREMENT) {
    getDoTDamage(state);
  } // INCREMENTS TIME

  // if twincast spell is no longer active
  utils.isAbilityActive(state, 'TC');

  // abilities that can be enabled and repeat every so often like Enc Synergy
  // cancel or reset counters based on timer, only need to check once per workingTime
  updateActiveAbilities(state, false);

  // initialize stats
  stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);
  stats.updateSpellStatistics(state, 'adjCastTime', adjCastTime);
  stats.updateSpellStatistics(state, 'id', spell.id);

  // set time of last cast and update statistics for interval
  if (state.lastCastMap[spell.timer]) {
    stats.updateSpellStatistics(state, 'castInterval', (state.workingTime - state.lastCastMap[spell.timer]) / 1000);
  }

  // save time of first case
  if (state.castTimeFirst === 0) {
    state.castTimeFirst = state.workingTime;
  }
  // last cast time
  state.castTimeLast = state.workingTime;

  state.lastCastMap[spell.timer] = state.workingTime;
  state.spellTimerMap[spell.timer] = state.workingTime;

  // update spell timeline
  var spellId = spell.id.length > 2 && isNaN(parseInt(spell.id[2])) ? spell.id : spell.id.substr(0, 2);
  var content = SPELL_ITEM_TEMPLATE({ title: spell.name, id: spellId, spellNumber: state.chartIndex });
  SPELLLINE_DATA.add({ id: state.chartIndex, content: content, start: state.workingTime, editable: false });

  // round to nearest second to check against current spell landing time
  state.timeEst = Math.round(state.workingTime / 1000) * 1000;

  // figure out current crit change/damage mod
  if (CRITR_DATA.get(state.timeEst)) {
    state.critRate = CRITR_DATA.get(state.timeEst).y / 100;
    state.critDmgMult = CRITD_DATA.get(state.timeEst).y / 100;
  } else {
    console.debug('out of range');
    return;
  }

  state.timeLeft = (state.endTime - state.workingTime) / 1000;
  stats.updateSpellStatistics(state, 'timeLeft', state.timeLeft);

  // only compute for spells that do damage
  var avgDmg = damage.execute(state);

  var plotDmg = 0;
  // update stats
  if (avgDmg > 0) {
    stats.addAggregateStatistics('totalAvgTcRate', stats.getSpellStatistics(state, 'twincastRate') || 0);
    stats.addAggregateStatistics('totalAvgDmg', avgDmg);
    stats.addAggregateStatistics('detCastCount', 1);
    stats.addMaxAggregateStatistics('maxHit', avgDmg);
    plotDmg += avgDmg;
  }

  // upgrade graph
  if (plotDmg > 0) {
    updateDmgGraph(state, plotDmg);
  }

  return true;
}

function getDoTDamage(state, end) {
  if (state.dotGenerator) {
    var dmg = state.dotGenerator.next(!!end).value;

    if (dmg > 0) {
      updateDmgGraph(state, dmg);
    }
  }
}

function initAbility(state, id, ability) {
  var active = false;

  if (ability.charges) {
    var keys = utils.getCounterKeys(id);

    if (ability.manuallyActivated) {
      // init manual ability (should move this at some point)
      if (state[keys.counter] === undefined) {
        state[keys.counter] = ability.charges;
      }

      active = utils.isAbilityActive(state, id);
    }

    // abilties that get repeated periodically
    else if (ability.repeatEvery && !ability.manuallyActivated) {
        var lastProcMap = state.lastProcMap;
        // get rate from UI if there is an override or use default refresh time
        var rate = dom.getAbilityRate(id) || ability.refreshTime;

        if (rate) {
          if (!lastProcMap[id] || lastProcMap[id] + rate < state.workingTime) {
            if (!lastProcMap[id]) {
              lastProcMap[id] = CURRENT_TIME;
              state[keys.expireTime] = CURRENT_TIME + ability.duration;
            } else {
              lastProcMap[id] += rate;
              state[keys.expireTime] = lastProcMap[id] + ability.duration;
            }

            state[keys.counter] = ability.charges;
          }

          active = utils.isAbilityActive(state, id);
        } else {
          active = false; // Ex like Arcomancy
        }
      }

      // abilities that only get used once
      else if (!ability.repeatEvery) {
          var item = TIMELINE_DATA.get(id);
          var time = getTime(item);

          if (withinTimeFrame(state.workingTime, getTime(item))) {
            active = true;

            // initialize for first use
            if (state[keys.counter] === undefined) {
              state[keys.counter] = dom.getAbilityCharges(id) || ability.charges;
            } else {
              if (state[keys.counter] === 0) {
                // this is the last one
                item.end = state.workingTime;
                item.content = utils.createLabel(ability, new Date(state.workingTime - time.start));
                item.title = item.content;
                silentUpdateTimeline(item);
                state[keys.counter] = -1;
                active = false;
              } else if (state[keys.counter] > 0) {
                if (time.end - time.start != ability.duration) {
                  item.end = time.start + ability.duration;
                  item.content = utils.createLabel(ability, new Date(ability.duration));
                  item.title = item.content;
                  silentUpdateTimeline(item);
                }
              }
            }
          }
        }
  } else {
    var _item = TIMELINE_DATA.get(id);

    if (_item) {
      var _time = getTime(_item);

      active = withinTimeFrame(state.workingTime, getTime(_item));
    } else {
      active = ability.repeatEvery >= -1;
    }
  }

  return active;
}

// Get list of active abilities by ID
function updateActiveAbilities(state, duringGCD) {
  var preConfigured = dom.getConfiguredAbilities();
  state.activeAbilities = new _set2.default(preConfigured.active);
  state.spellProcAbilities = new _set2.default(preConfigured.spellProc);
  state.manualAbilities = new _set2.default();
  state.enabledButInActive = new _set2.default();

  // get abilities the user has enabled to repeat from the
  // activated abilities options
  dom.getActiveRepeatingAbilities().forEach(function (id) {
    var ability = abilities.get(id);

    // dont process everything during GCD time
    if (!duringGCD || ability.manuallyActivated) {
      if (initAbility(state, id, ability)) {
        if (ability.manuallyActivated) {
          state.manualAbilities.add(id);
        } else {
          if (!abilities.getProcEffectForAbility(ability)) {
            state.activeAbilities.add(id);
          } else {
            state.spellProcAbilities.add(id);
          }
        }
      } else {
        state.enabledButInActive.add(id);
      }
    }
  });

  // add any on the timeline
  TIMELINE_DATA.forEach(function (item) {
    var ability = abilities.get(item.id);

    // make sure ability is active if it has charges
    if (initAbility(state, item.id, ability)) {
      // all of these included here
      state.activeAbilities.add(item.id);

      // some of these also proc spells
      if (abilities.getProcEffectForAbility(ability)) {
        state.spellProcAbilities.add(item.id);
      }
    }
  });

  // not casting spells
  if (!duringGCD) {
    // add spell procs that may result from spells being cast
    dmgU.SPELL_PROC_ABILITIES.filter(function (id) {
      return utils.isAbilityActive(state, id);
    }).forEach(function (id) {
      return addSpellProcAbility(state, id);
    });
  }

  // Misc checks, check if RS pets have completed
  var rsKeys = utils.getCounterKeys('RS');
  utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);
}

// RS has type 3 aug and AAs that reduce the recast so account for that here
function getModifiedSpellRecastTime(spell) {
  return utils.useCache('spell-recast-time' + spell.id, function () {
    var recastMod = spell.id === 'RS' ? (dom.getHastenedServantValue() + dom.getType3AugValue(spell)) * -1 : 0;
    return spell.recastTime + recastMod;
  });
}

// Returns the first ability from list that has able to be cast based on recast timers
function executeManualAbilities(state) {
  var idSet = state.manualAbilities;

  if (idSet && idSet.size > 0) {
    var spell = void 0;
    var ability = void 0;
    var abilityId = void 0;

    var ready = [].concat((0, _toConsumableArray3.default)(idSet)).find(function (id) {
      ability = abilities.get(id);
      abilityId = id;

      var effect = abilities.getProcEffectForAbility(ability);
      spell = utils.getSpellData(effect.proc);
      return (!state.gcdWaitTime || state.workingTime + spell.castTime < state.gcdWaitTime) && (!state.spellTimerMap[ability.timer] || state.spellTimerMap[ability.timer] + ability.refreshTime < state.workingTime);
    });

    if (ready) {
      castSpell(state, spell);
      state.spellTimerMap[ability.timer] = state.workingTime;

      if (ability.charges) {
        var keys = utils.getCounterKeys(abilityId);
        state[keys.counter]--;

        if (state[keys.counter] <= 0 && ability.refreshTrigger) {
          state.castQueue.push(ability.refreshTrigger);
        }
      }
    }
  }
}

// Adjust start time of a timeline item
function setTimelineItemStart(time, item, offset) {
  var newStartTime = time + offset;
  var newEndTime = newStartTime + (item.end - item.start);

  if (item.start != newStartTime) {
    item.start = newStartTime;
    item.end = newEndTime;
    silentUpdateTimeline(item);
  }
}

// Turn off events when updating the timeline programmatically
function silentUpdateTimeline(data) {
  TIMELINE_DATA.off('update', visTimelineListener);
  TIMELINE_DATA.update(data);
  TIMELINE_DATA.on('update', visTimelineListener);
}

// The start and end time of a vis.js timeline object is inconsistent depending
// on whether it's set somewhere hear or via drag/move events. This just gives
// back one representation using time in millis
function getTime(item) {
  var result = {};

  if (item) {
    var start = item.start.getTime ? item.start.getTime() : item.start;
    var end = item.end.getTime ? item.end.getTime() : item.end;
    result.start = start;
    result.end = end;
  }

  return result;
}

// Clears and redraws the crit graphs from the starting dataset
function updateCritGraphs() {
  CRITR_DATA.clear();
  CRITD_DATA.clear();
  updateDDCritGraphs(BASE_CRIT_DATA, CRITR_DATA, CRITD_DATA);

  if (_settings.globals.MODE === 'enc') {
    CRITR_DOT_DATA.clear();
    CRITD_DOT_DATA.clear();
    updateDDCritGraphs(BASE_DOT_CRIT_DATA, CRITR_DOT_DATA, CRITD_DOT_DATA);
  }
}

function updateDDCritGraphs(baseData, rateData, dmgData) {
  var critRPoints = [];
  var critDPoints = [];
  var prevRate = 0;
  var prevDmg = 0;
  var lastRateLabel = 0;
  var lastDmgLabel = 0;

  $(baseData).each(function (i, item) {
    var rp = { id: item.time, x: item.time, y: item.rate };
    var dp = { id: item.time, x: item.time, y: item.dmg };

    if (prevRate != item.rate || lastRateLabel % 10 === 0) {
      rp.label = { content: item.rate + '%', yOffset: 15 };
      lastRateLabel = 0;
    }

    lastRateLabel++;
    prevRate = item.rate;

    if (prevDmg != item.dmg || lastDmgLabel % 10 === 0) {
      dp.label = { content: '+' + item.dmg + '%', yOffset: 15 };
      lastDmgLabel = 0;
    }

    lastDmgLabel++;
    prevDmg = item.dmg;

    critRPoints.push(rp);
    critDPoints.push(dp);
  });

  // Update graph
  rateData.add(critRPoints);
  dmgData.add(critDPoints);
}

function updateCritGraphValue(data, time, value) {
  var item = data.get(time);
  if (item.y != value) {
    if (item.label) {
      var l = item.label.content;
      item.label.content = value + l.substring(l.indexOf('%'), l.length);
    }

    item.y = value;
    data.update(item);
  }
}

function updateDmgGraph(state, dmg) {
  if (dmg >= 0) {

    // in case were plotting multiple damage at some point
    var pointData = DMG_DATA.get(state.workingTime);
    if (pointData) {
      pointData.y += dmg;

      // update label if it exists
      if (pointData.label) {
        pointData.label.content = pointData.y;
      }

      DMG_DATA.update(pointData);
    } else {
      pointData = { id: state.workingTime, x: state.workingTime, y: dmg, yOffset: 0 };
      pointData.label = { content: pointData.y, yOffset: 15 };
      DMG_DATA.add(pointData);
    }
  }
}

function willCastDuring(state, time, spell, adjCastTime) {
  var lockout = false;
  var lockoutTime = dom.getLockoutTime(spell);
  lockoutTime += adjCastTime; // total time the spell will be busy
  var timeToCast = state.workingTime + lockoutTime;

  return timeToCast >= time.start && state.workingTime < time.end;
}

function withinTimeFrame(time, data) {
  return data && data.start <= time && data.end >= time;
}

function addSpellProcAbility(state, id, mod, initialize) {
  mod = mod === undefined ? 1 : mod;

  var ability = abilities.get(id);
  if (!ability) return;

  // init ability in addition to checking if active
  if (initialize) {
    var keys = utils.getCounterKeys(id);
    if (ability.charges) {
      // mod initially added for conjurer's synergy proc rate
      var charges = dom.getAbilityCharges(id);
      if (charges == undefined) {
        charges = ability.charges;
      }

      var update = mod * charges;

      if (!state[keys.counter]) {
        state[keys.counter] = update;
      } else if (state[keys.counter] < 1.0 && update < 1.0) {
        state[keys.counter] += update;
      } else if (state[keys.counter] < update) {
        state[keys.counter] = update;
      }
    }

    if (ability.duration) {
      state[keys.expireTime] = state.workingTime + ability.duration;
    }
  }

  if (utils.isAbilityActive(state, id)) {
    if (!abilities.getProcEffectForAbility(ability)) {
      state.activeAbilities.add(id);
    } else {
      state.spellProcAbilities.add(id);
    }
  }
}

function callUpdateSpellChart(rates) {
  if (UPDATING_CHART === -1) {
    UPDATING_CHART = setTimeout(function () {
      if (rates) {
        loadRates();
      }

      updateSpellChart();
      UPDATING_CHART = -1;
    }, 350);
  } else {
    clearTimeout(UPDATING_CHART);
    UPDATING_CHART = -1;
    callUpdateSpellChart(rates);
  }
}

function connectPopovers() {
  var items = $('#spellline div.vis-center div.vis-itemset div.vis-foreground a[data-toggle="popover"]');
  items.popover({ html: true });

  items.unbind('inserted.bs.popover');
  items.on('inserted.bs.popover', function (e) {
    var index = $(e.currentTarget).data('value');
    var statInfo = stats.getSpellStatisticsForIndex(index);
    var popover = $('#spellPopover' + index);
    popover.html('');
    popover.append(SPELL_DETAILS_TEMPLATE({ data: stats.getStatisticsSummary(statInfo) }));
  });
}

function createAdpsItem(id) {
  var ability = abilities.get(id);
  var adpsItem = { id: id, start: CURRENT_TIME, end: CURRENT_TIME + ability.duration };
  var label = utils.createLabel(ability, new Date(adpsItem.end - adpsItem.start));

  adpsItem.content = label;
  adpsItem.title = label;
  TIMELINE_DATA.add(adpsItem);

  return adpsItem;
}

function init() {
  // connect all the zoom/pan/range events together of the charts
  var chartList = [SPELL_TIMELINE, TIMELINE, GRAPH_CRITR, GRAPH_CRITD, GRAPH_DOT_CRITR, GRAPH_DOT_CRITD, GRAPH_DMG];
  $(chartList).each(function (index, chart) {
    if (chart) {
      chart.on('rangechanged', function (update) {
        updateWindow(chart, update, chartList);
      });
    }
  });

  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('update', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
}

function getTimelineItemTime(id) {
  return getTime(TIMELINE_DATA.get(id));
}

function loadRates() {
  var seconds = dom.getSpellTimeRangeValue();
  BASE_CRIT_DATA = [];

  // get rates for DDs
  getRates(seconds, BASE_CRIT_DATA, dmgU.getBaseCritRate(), dmgU.getBaseCritDmg(), abilities.SPA_CRIT_RATE_NUKE, abilities.SPA_CRIT_DMG_NUKE);

  if (_settings.globals.MODE === 'enc') {
    BASE_DOT_CRIT_DATA = [];
    // get rates for DoTs
    getRates(seconds, BASE_DOT_CRIT_DATA, dmgU.getBaseDoTCritRate(), dmgU.getBaseDoTCritDmg(), abilities.SPA_CRIT_RATE_DOT, abilities.SPA_CRIT_DMG_DOT);
  }
}

function getRates(seconds, baseData, baseRate, baseDmg, rateSPAs, dmgSPAs) {
  // add all the timeline items
  var ids = TIMELINE_DATA.getIds().filter(function (id) {
    var ability = abilities.get(id);
    return !ability.charges && (abilities.hasSPA(ability, rateSPAs) || abilities.hasSPA(ability, dmgSPAs));
  });

  var _loop = function _loop(i) {
    var time = CURRENT_TIME + i;
    var rate = baseRate;
    var dmg = baseDmg;

    var abilityList = [];
    ids.forEach(function (id) {
      var adpsItem = TIMELINE_DATA.get(id);
      if (withinTimeFrame(time, adpsItem)) {
        abilityList.push(id);
      }
    });

    dmgU.buildSPAData(abilityList).spaMap.forEach(function (value, key) {
      var spa = (0, _parseInt2.default)(key.substring(0, 3));

      if (rateSPAs.has(spa)) {
        rate += value.value;
      }
      if (dmgSPAs.has(spa)) {
        dmg += value.value;
      }
    });

    rate = dmgU.trunc(rate * 100);
    dmg = dmgU.trunc(dmg * 100);
    baseData.push({ time: time, rate: rate, dmg: dmg });
  };

  for (var i = 0; i <= seconds; i += 1000) {
    _loop(i);
  }
}

function quiet() {
  TIMELINE_DATA.off('add', visTimelineListener);
  TIMELINE_DATA.off('remove', visTimelineListener);
}

function resume() {
  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
  callUpdateSpellChart(true);
}

function removeAdpsItem(id) {
  TIMELINE_DATA.remove(id);
}

function removePopovers() {
  $('.popover').remove();
}

function resetTimers(state) {
  state.spells.forEach(function (id) {
    delete state.spellTimerMap[utils.getSpellData(id).timer];
  });
  state.gcdWaitTime = state.workingTime;
}

function setTitle(data, adpsOption, date) {
  var ability = abilities.get(adpsOption.id);
  var label = utils.createLabel(ability, date);
  var lineItem = data.get(adpsOption.id);
  if (lineItem.content != label) {
    lineItem.content = label;
    lineItem.title = label;
    data.update(lineItem);
  }
}

function updateSpellChart() {
  utils.clearCache();
  SPELLLINE_DATA.clear();
  DMG_DATA.clear();
  stats.clear();
  updateCritGraphs();
  removePopovers();

  var hasForcedRejuv = TIMELINE_DATA.get('FR');
  var sp = 0;
  var lockout = false;
  var preemptSpells = [];

  var state = {
    cache: {},
    castTimeFirst: 0,
    castTimeLast: 0,
    castQueue: [],
    chartIndex: -1,
    gcd: dom.getGCDValue() + 75, // PC lag? offset from test
    gcdWaitTime: 0,
    updatedCritRValues: [],
    updatedCritDValues: [],
    spellTimerMap: {},
    plotFreq: Math.round(dom.getSpellTimeRangeValue() / 100000) * 100,
    lastCastMap: {},
    lastProcMap: {},
    spells: dom.getSelectedSpells(),
    endTime: CURRENT_TIME + dom.getSpellTimeRangeValue(),
    workingTime: CURRENT_TIME
  };

  // Items that exist both as abilties on the spell timeline as well as ADPS chart. They need to be in sync.
  // Check that spell exists since it may not depending on Mage vs Wiz abilities
  dmgU.PREEMPT_SPELL_CASTS.filter(function (id) {
    return utils.getSpellData(id).id !== undefined;
  }).forEach(function (id) {
    var item = TIMELINE_DATA.get(id);

    if (item) {
      preemptSpells.push({ id: id, item: item, iTime: getTime(item), spell: utils.getSpellData(id), hasBeenCast: false });
    }
  });

  var checkPreempt = function checkPreempt(entry, current, spellReady) {
    // stop after first spell that's successful using 'update'
    if (entry.item && !entry.hasBeenCast) {
      // if we're about to cast a spell but it won't land until after this ability is supposed to be
      // cast then do nothing and wait
      var adjCastTime = utils.getCastTime(state, entry.spell);
      lockout = current && spellReady && willCastDuring(state, entry.iTime, current, adjCastTime);

      if (withinTimeFrame(state.workingTime + adjCastTime, entry.item)) {
        // Fix start point on timeline if its out of bounds
        var adpsStartTime = state.workingTime;

        castSpell(state, entry.spell, adjCastTime);
        setTimelineItemStart(adpsStartTime, entry.item, adjCastTime);
        entry.hasBeenCast = true;
        lockout = false;

        if (entry.spell.lockoutTime !== 0) {
          // some spells like Manaburn dont have one at all
          state.gcdWaitTime = state.workingTime + dom.getLockoutTime(entry.spell);
        }

        return true;
      }
    }

    return false;
  };

  while (state.workingTime <= state.endTime) {
    // Forced Rejuvination resets lockouts and end GCD
    if (hasForcedRejuv && withinTimeFrame(state.workingTime, getTime(hasForcedRejuv))) {
      hasForcedRejuv = false;
      resetTimers(state);
    }

    // Display/Cast alliance damage when timer expires
    switch (_settings.globals.MODE) {
      case 'wiz':case 'mag':
        if (utils.isAbilityExpired(state, 'FBC')) {
          castSpell(state, utils.getSpellData('FAR'));
          continue;
        }
        break;
      case 'enc':
        if (utils.isAbilityExpired(state, 'CA')) {
          castSpell(state, utils.getSpellData('CAF'));
          continue;
        }
        break;
    }

    // abilities that can be enabled and repeat every so often like Enc Synergy
    // cancel or reset counters based on timer, only need to check once per workingTime
    updateActiveAbilities(state, true);

    // workaround to get these on the timeline for AA or abilities like Firebound Orb
    preemptSpells.find(function (entry) {
      return checkPreempt(entry);
    });

    // Don't do any spell cast if we're during the GCD lockout phase
    if (state.gcdWaitTime <= state.workingTime) {
      // if any spells proc or automated spells are pending
      if (state.castQueue.length > 0) {
        var id = state.castQueue.shift();
        castSpell(state, utils.getSpellData(id));
      }

      // find a spell to cast

      var _loop2 = function _loop2() {
        var current = utils.getSpellData(state.spells[sp]);
        var recastTime = getModifiedSpellRecastTime(current);
        var spellReady = state.workingTime - ((state.spellTimerMap[current.timer] || 0) + recastTime) > 0;

        // check if these spells need to be cast soon
        if (preemptSpells.find(function (entry) {
          return checkPreempt(entry, current, spellReady);
        })) {
          return 'break';
        }

        if (!lockout && spellReady) {
          // if cast successful update gcd wait time
          if (castSpell(state, current)) {
            if (current.lockoutTime !== 0) {
              // some spells like Manaburn dont have one at all
              state.gcdWaitTime = state.workingTime + dom.getLockoutTime(state.spell);
            }
          }

          return 'break'; // break and try again at the updated workingTime
        }
      };

      for (sp = 0; sp < state.spells.length; sp++) {
        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
      }
    }

    // spell not available so handle other click/AA abilities
    if (state.spells.length === 0 || sp === state.spells.length || state.gcdWaitTime > state.workingTime) {
      // try to cast force nuke early to prevent conflicts later on
      // Ex FD can update crit dmg in the chart itself
      executeManualAbilities(state);

      // add dot damage
      getDoTDamage(state);
    }

    // do nothing if additional casts available otherwise increment time
    state.workingTime += TIME_INCREMENT;
  }

  // add left over dot damage
  state.workingTime = state.endTime;
  getDoTDamage(state, true);

  // update charts
  state.updatedCritRValues.forEach(function (rV) {
    updateCritGraphValue(CRITR_DATA, rV.time, rV.y);
  });
  state.updatedCritDValues.forEach(function (rV) {
    updateCritGraphValue(CRITD_DATA, rV.time, rV.y);
  });

  // connect up popover
  connectPopovers();

  // print spellStats window
  stats.printStats($('#spellCountStats'), state);
}

function updateWindow(caller, update, windowList) {
  // remove/reconnect any popover when changing window view
  removePopovers();
  connectPopovers();

  // sync up defaults to current view
  for (var w in windowList) {
    var chart = windowList[w];
    if (chart && caller != chart) {
      var _w = chart.getWindow();
      if (_w.start != update.start || _w.end != update.end) {
        chart.setWindow(update.start, update.end, { animation: false });
      }
    }
  }
}

function visTimelineListener(e, item) {
  var ability = abilities.get(item.items[0]);
  if (ability) {
    if (e === 'remove') {
      $('#adps-dropdown').multiselect('deselect', item.items[0], false);
    } else if (e === 'update') {
      var lineItem = TIMELINE_DATA.get(item.items[0]);
      var _time2 = new Date(lineItem.end - lineItem.start);
      setTitle(TIMELINE_DATA, lineItem, _time2);
    }

    var _loadRates = false;
    // only update rates when changing abilities that effect them
    if (!ability.charges && (abilities.hasSPA(ability, abilities.SPA_CRIT_RATE_NUKE) || abilities.hasSPA(ability, abilities.SPA_CRIT_DMG_NUKE))) {
      _loadRates = true;
    }

    if (e != 'update' || item.oldData[0].start != item.data[0].start || item.oldData[0].end != item.data[0].end) {
      callUpdateSpellChart(_loadRates);
    }
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(83), __webpack_require__(6), __webpack_require__(191)))

/***/ }),
/* 191 */,
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(193);
module.exports = __webpack_require__(395);


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(194);

__webpack_require__(391);

__webpack_require__(392);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(129)))

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(195);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(210);
__webpack_require__(211);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(220);
__webpack_require__(221);
__webpack_require__(222);
__webpack_require__(223);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(230);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(273);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(278);
__webpack_require__(279);
__webpack_require__(280);
__webpack_require__(281);
__webpack_require__(282);
__webpack_require__(283);
__webpack_require__(284);
__webpack_require__(286);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(289);
__webpack_require__(290);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(293);
__webpack_require__(294);
__webpack_require__(295);
__webpack_require__(296);
__webpack_require__(297);
__webpack_require__(298);
__webpack_require__(109);
__webpack_require__(299);
__webpack_require__(300);
__webpack_require__(148);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(303);
__webpack_require__(304);
__webpack_require__(305);
__webpack_require__(151);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(306);
__webpack_require__(307);
__webpack_require__(308);
__webpack_require__(309);
__webpack_require__(310);
__webpack_require__(311);
__webpack_require__(312);
__webpack_require__(313);
__webpack_require__(314);
__webpack_require__(315);
__webpack_require__(316);
__webpack_require__(317);
__webpack_require__(318);
__webpack_require__(319);
__webpack_require__(320);
__webpack_require__(321);
__webpack_require__(322);
__webpack_require__(323);
__webpack_require__(324);
__webpack_require__(325);
__webpack_require__(326);
__webpack_require__(327);
__webpack_require__(328);
__webpack_require__(329);
__webpack_require__(330);
__webpack_require__(331);
__webpack_require__(332);
__webpack_require__(333);
__webpack_require__(334);
__webpack_require__(335);
__webpack_require__(336);
__webpack_require__(337);
__webpack_require__(338);
__webpack_require__(339);
__webpack_require__(340);
__webpack_require__(341);
__webpack_require__(342);
__webpack_require__(343);
__webpack_require__(344);
__webpack_require__(345);
__webpack_require__(346);
__webpack_require__(347);
__webpack_require__(348);
__webpack_require__(349);
__webpack_require__(350);
__webpack_require__(351);
__webpack_require__(352);
__webpack_require__(353);
__webpack_require__(354);
__webpack_require__(355);
__webpack_require__(356);
__webpack_require__(357);
__webpack_require__(358);
__webpack_require__(359);
__webpack_require__(360);
__webpack_require__(361);
__webpack_require__(362);
__webpack_require__(363);
__webpack_require__(364);
__webpack_require__(365);
__webpack_require__(366);
__webpack_require__(367);
__webpack_require__(368);
__webpack_require__(369);
__webpack_require__(370);
__webpack_require__(371);
__webpack_require__(372);
__webpack_require__(373);
__webpack_require__(374);
__webpack_require__(375);
__webpack_require__(376);
__webpack_require__(377);
__webpack_require__(378);
__webpack_require__(379);
__webpack_require__(380);
__webpack_require__(381);
__webpack_require__(382);
__webpack_require__(383);
__webpack_require__(384);
__webpack_require__(385);
__webpack_require__(386);
__webpack_require__(387);
__webpack_require__(388);
__webpack_require__(389);
__webpack_require__(390);
module.exports = __webpack_require__(24);


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(2);
var has = __webpack_require__(12);
var DESCRIPTORS = __webpack_require__(7);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(14);
var META = __webpack_require__(34).KEY;
var $fails = __webpack_require__(3);
var shared = __webpack_require__(69);
var setToStringTag = __webpack_require__(53);
var uid = __webpack_require__(38);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(131);
var wksDefine = __webpack_require__(89);
var enumKeys = __webpack_require__(196);
var isArray = __webpack_require__(72);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var toIObject = __webpack_require__(16);
var toPrimitive = __webpack_require__(25);
var createDesc = __webpack_require__(37);
var _create = __webpack_require__(42);
var gOPNExt = __webpack_require__(134);
var $GOPD = __webpack_require__(17);
var $DP = __webpack_require__(8);
var $keys = __webpack_require__(40);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(43).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(60).f = $propertyIsEnumerable;
  __webpack_require__(71).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(39)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(40);
var gOPS = __webpack_require__(71);
var pIE = __webpack_require__(60);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(42) });


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperty: __webpack_require__(8).f });


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperties: __webpack_require__(133) });


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(16);
var $getOwnPropertyDescriptor = __webpack_require__(17).f;

__webpack_require__(28)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(10);
var $getPrototypeOf = __webpack_require__(18);

__webpack_require__(28)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(10);
var $keys = __webpack_require__(40);

__webpack_require__(28)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(28)('getOwnPropertyNames', function () {
  return __webpack_require__(134).f;
});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(34).onFreeze;

__webpack_require__(28)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(34).onFreeze;

__webpack_require__(28)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(34).onFreeze;

__webpack_require__(28)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(28)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(28)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(28)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(135) });


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(212) });


/***/ }),
/* 212 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(93).set });


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(61);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(14)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', { bind: __webpack_require__(136) });


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(7) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(4);
var getPrototypeOf = __webpack_require__(18);
var HAS_INSTANCE = __webpack_require__(5)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(8).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(138);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(139);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var has = __webpack_require__(12);
var cof = __webpack_require__(21);
var inheritIfRequired = __webpack_require__(95);
var toPrimitive = __webpack_require__(25);
var fails = __webpack_require__(3);
var gOPN = __webpack_require__(43).f;
var gOPD = __webpack_require__(17).f;
var dP = __webpack_require__(8).f;
var $trim = __webpack_require__(54).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(42)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(7) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(14)(global, NUMBER, $Number);
}


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toInteger = __webpack_require__(27);
var aNumberValue = __webpack_require__(140);
var repeat = __webpack_require__(96);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $fails = __webpack_require__(3);
var aNumberValue = __webpack_require__(140);
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(141) });


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(141);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(139);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(138);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);
var log1p = __webpack_require__(142);
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);
var sign = __webpack_require__(97);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);
var $expm1 = __webpack_require__(98);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { fround: __webpack_require__(143) });


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { log1p: __webpack_require__(142) });


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { sign: __webpack_require__(97) });


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(98);
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(98);
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(41);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(16);
var toLength = __webpack_require__(9);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(54)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(99)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(100)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $at = __webpack_require__(99)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(9);
var context = __webpack_require__(102);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(103)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(102);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(103)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(96)
});


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(9);
var context = __webpack_require__(102);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(103)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(15)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(15)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(15)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(15)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(15)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(15)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(15)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(15)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(15)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(15)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(15)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(15)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(15)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(25);

$export($export.P + $export.F * __webpack_require__(3)(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(274);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__(3);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(14)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(13)(proto, TO_PRIMITIVE, __webpack_require__(277));


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(25);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(72) });


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(20);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var call = __webpack_require__(144);
var isArrayIter = __webpack_require__(104);
var toLength = __webpack_require__(9);
var createProperty = __webpack_require__(105);
var getIterFn = __webpack_require__(106);

$export($export.S + $export.F * !__webpack_require__(74)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var createProperty = __webpack_require__(105);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export = __webpack_require__(0);
var toIObject = __webpack_require__(16);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(59) != Object || !__webpack_require__(22)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var html = __webpack_require__(92);
var cof = __webpack_require__(21);
var toAbsoluteIndex = __webpack_require__(41);
var toLength = __webpack_require__(9);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(11);
var toObject = __webpack_require__(10);
var fails = __webpack_require__(3);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(22)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(29)(0);
var STRICT = __webpack_require__(22)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(72);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $map = __webpack_require__(29)(1);

$export($export.P + $export.F * !__webpack_require__(22)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(29)(2);

$export($export.P + $export.F * !__webpack_require__(22)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $some = __webpack_require__(29)(3);

$export($export.P + $export.F * !__webpack_require__(22)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $every = __webpack_require__(29)(4);

$export($export.P + $export.F * !__webpack_require__(22)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(145);

$export($export.P + $export.F * !__webpack_require__(22)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(145);

$export($export.P + $export.F * !__webpack_require__(22)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(70)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(16);
var toInteger = __webpack_require__(27);
var toLength = __webpack_require__(9);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(22)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(146) });

__webpack_require__(35)('copyWithin');


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(108) });

__webpack_require__(35)('fill');


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(29)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(35)(KEY);


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(29)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(35)(KEY);


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(44)('Array');


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var inheritIfRequired = __webpack_require__(95);
var dP = __webpack_require__(8).f;
var gOPN = __webpack_require__(43).f;
var isRegExp = __webpack_require__(73);
var $flags = __webpack_require__(75);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(7) && (!CORRECT_NEW || __webpack_require__(3)(function () {
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(14)(global, 'RegExp', $RegExp);
}

__webpack_require__(44)('RegExp');


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(148);
var anObject = __webpack_require__(1);
var $flags = __webpack_require__(75);
var DESCRIPTORS = __webpack_require__(7);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(14)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(3)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(76)('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(76)('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(76)('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(76)('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__(73);
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(39);
var global = __webpack_require__(2);
var ctx = __webpack_require__(20);
var classof = __webpack_require__(61);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(11);
var anInstance = __webpack_require__(45);
var forOf = __webpack_require__(46);
var speciesConstructor = __webpack_require__(77);
var task = __webpack_require__(110).set;
var microtask = __webpack_require__(111)();
var newPromiseCapabilityModule = __webpack_require__(112);
var perform = __webpack_require__(149);
var promiseResolve = __webpack_require__(150);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(47)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(53)($Promise, PROMISE);
__webpack_require__(44)(PROMISE);
Wrapper = __webpack_require__(24)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(74)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(155);
var validate = __webpack_require__(56);
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
__webpack_require__(78)(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $typed = __webpack_require__(79);
var buffer = __webpack_require__(113);
var anObject = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(41);
var toLength = __webpack_require__(9);
var isObject = __webpack_require__(4);
var ArrayBuffer = __webpack_require__(2).ArrayBuffer;
var speciesConstructor = __webpack_require__(77);
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(44)(ARRAY_BUFFER);


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(79).ABV, {
  DataView: __webpack_require__(113).DataView
});


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(11);
var anObject = __webpack_require__(1);
var rApply = (__webpack_require__(2).Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);
var create = __webpack_require__(42);
var aFunction = __webpack_require__(11);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var bind = __webpack_require__(136);
var rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(8);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(25);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);
var gOPD = __webpack_require__(17).f;
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
__webpack_require__(101)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(17);
var getPrototypeOf = __webpack_require__(18);
var has = __webpack_require__(12);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(17);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);
var getProto = __webpack_require__(18);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', { ownKeys: __webpack_require__(157) });


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(8);
var gOPD = __webpack_require__(17);
var getPrototypeOf = __webpack_require__(18);
var has = __webpack_require__(12);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(37);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);
var setProto = __webpack_require__(93);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(0);
var $includes = __webpack_require__(70)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(35)('includes');


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(158);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(9);
var aFunction = __webpack_require__(11);
var arraySpeciesCreate = __webpack_require__(107);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(35)('flatMap');


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(158);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(9);
var toInteger = __webpack_require__(27);
var arraySpeciesCreate = __webpack_require__(107);

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

__webpack_require__(35)('flatten');


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0);
var $at = __webpack_require__(99)(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(159);
var userAgent = __webpack_require__(114);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(159);
var userAgent = __webpack_require__(114);

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(54)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(54)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export = __webpack_require__(0);
var defined = __webpack_require__(26);
var toLength = __webpack_require__(9);
var isRegExp = __webpack_require__(73);
var getFlags = __webpack_require__(75);
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

__webpack_require__(101)($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89)('asyncIterator');


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89)('observable');


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(157);
var toIObject = __webpack_require__(16);
var gOPD = __webpack_require__(17);
var createProperty = __webpack_require__(105);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(160)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(160)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var aFunction = __webpack_require__(11);
var $defineProperty = __webpack_require__(8);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(7) && $export($export.P + __webpack_require__(80), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var aFunction = __webpack_require__(11);
var $defineProperty = __webpack_require__(8);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(7) && $export($export.P + __webpack_require__(80), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(25);
var getPrototypeOf = __webpack_require__(18);
var getOwnPropertyDescriptor = __webpack_require__(17).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(80), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(25);
var getPrototypeOf = __webpack_require__(18);
var getOwnPropertyDescriptor = __webpack_require__(17).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(80), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(161)('Map') });


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(161)('Set') });


/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(81)('Map');


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(81)('Set');


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
__webpack_require__(81)('WeakMap');


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
__webpack_require__(81)('WeakSet');


/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(82)('Map');


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(82)('Set');


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
__webpack_require__(82)('WeakMap');


/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
__webpack_require__(82)('WeakSet');


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.G, { global: __webpack_require__(2) });


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', { global: __webpack_require__(2) });


/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0);
var cof = __webpack_require__(21);

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});


/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});


/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });


/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var scale = __webpack_require__(163);
var fround = __webpack_require__(143);

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});


/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});


/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});


/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });


/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});


/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { scale: __webpack_require__(163) });


/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

// http://jfbastien.github.io/papers/Math.signbit.html
var $export = __webpack_require__(0);

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(0);
var core = __webpack_require__(24);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(77);
var promiseResolve = __webpack_require__(150);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(0);
var newPromiseCapability = __webpack_require__(112);
var perform = __webpack_require__(149);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });


/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });


/***/ }),
/* 379 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(18);
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(153);
var from = __webpack_require__(162);
var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(18);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 383 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(18);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 384 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 385 */
/***/ (function(module, exports, __webpack_require__) {

var $metadata = __webpack_require__(32);
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(11);
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });


/***/ }),
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = __webpack_require__(0);
var microtask = __webpack_require__(111)();
var process = __webpack_require__(2).process;
var isNode = __webpack_require__(21)(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});


/***/ }),
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export = __webpack_require__(0);
var global = __webpack_require__(2);
var core = __webpack_require__(24);
var microtask = __webpack_require__(111)();
var OBSERVABLE = __webpack_require__(5)('observable');
var aFunction = __webpack_require__(11);
var anObject = __webpack_require__(1);
var anInstance = __webpack_require__(45);
var redefineAll = __webpack_require__(47);
var hide = __webpack_require__(13);
var forOf = __webpack_require__(46);
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

__webpack_require__(44)('Observable');


/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var userAgent = __webpack_require__(114);
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $task = __webpack_require__(110);
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});


/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(109);
var getKeys = __webpack_require__(40);
var redefine = __webpack_require__(14);
var global = __webpack_require__(2);
var hide = __webpack_require__(13);
var Iterators = __webpack_require__(55);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(129)))

/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(393);
module.exports = __webpack_require__(24).RegExp.escape;


/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0);
var $re = __webpack_require__(394)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });


/***/ }),
/* 394 */
/***/ (function(module, exports) {

module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};


/***/ }),
/* 395 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, Handlebars) {

var _stringify = __webpack_require__(396);

var _stringify2 = _interopRequireDefault(_stringify);

var _map = __webpack_require__(62);

var _map2 = _interopRequireDefault(_map);

__webpack_require__(423);

__webpack_require__(424);

__webpack_require__(425);

__webpack_require__(426);

var _spellValidation = __webpack_require__(427);

var _spellValidation2 = _interopRequireDefault(_spellValidation);

var _settings = __webpack_require__(52);

var _abilities = __webpack_require__(67);

var abilities = _interopRequireWildcard(_abilities);

var _dom = __webpack_require__(68);

var dom = _interopRequireWildcard(_dom);

var _damageUtils = __webpack_require__(87);

var dmgU = _interopRequireWildcard(_damageUtils);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

var _timeline = __webpack_require__(190);

var timeline = _interopRequireWildcard(_timeline);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Library References
function buildSpellList() {
  // cleanup old version
  $('#spellButtons div.spell').remove();

  // Creates the pell selection buttons
  var spellData = [];
  utils.readSpellList().forEach(function (item) {
    spellData.push({ value: item.id, desc: item.name });
  });

  var spellButtonTemplate = Handlebars.compile($("#spell-selection-button-template").html());
  utils.appendHtml($('#spellButtons'), spellButtonTemplate({ data: spellData }), 8);

  // Listen for spell selection changes to update button text and color and update spell chart
  $('#spellButtons div.spell').each(function (b1, group) {
    var button = $(group).find('button');
    $(group).find('li > a').click(function (e) {
      var selected = $(e.currentTarget);
      button.data('value', selected.data('value'));

      if (selected.data('value') === 'NONE') {
        button.find('span.desc').text("Choose Spell");
        button.removeClass('btn-default');
        button.addClass('btn-warning');
      } else {
        button.find('span.desc').text(selected.text());
        button.removeClass('btn-warning');
        button.addClass('btn-default');
      }

      timeline.callUpdateSpellChart();
    });
  });
}

// Set app version
// Import CSS
$('span.version').text(_settings.globals.VERSION);

// on click for changing between wiz mode and mage mode
var switchModeButton = $('div.mode-chooser button.switch-button');
$('div.mode-chooser li > a').click(function (e) {
  var selected = $(e.currentTarget);
  var mode = selected.attr('data-value');
  switchModeButton.find('span.desc').text(utils.CLASS_TO_NAME[mode]);
  utils.switchMode(mode);
});

// on click for changing spell rank
var switchRankButton = $('div.rank-chooser button.switch-button');
$('div.rank-chooser li > a').click(function (e) {
  var selected = $(e.currentTarget);
  var rank = selected.attr('data-value');
  switchRankButton.data('value', rank);
  switchRankButton.find('span.desc').text(selected.text());

  // save previous values
  var prevValues = [];
  $('#spellButtons div.spell button').each(function (i, b) {
    return prevValues.push($(b).data('value'));
  });

  // set rank and rebuild spell dropdowns
  utils.setRank(rank);
  buildSpellList();

  // reset values
  $('#spellButtons div.spell button').each(function (i, b) {
    if (prevValues[i] != 'NONE') {
      $(b).next().find('a[data-value="' + prevValues[i] + '"]').trigger('click');
    }
  });

  timeline.callUpdateSpellChart();
});

// try to find mode set in url then in cookie then default to wiz
var mode = utils.getUrlParameter('class') || document.cookie.split('=')[1];
mode = !mode || !_settings.globals.CLASSES[mode] ? 'wiz' : mode;

$('.' + _settings.globals.CLASSES[mode].css).removeClass(_settings.globals.CLASSES[mode].css);
document.title = _settings.globals.CLASSES[mode].title;
$('#innatCritRate').val(dmgU[_settings.globals.CLASSES[mode].critRate]);
$('#innatCritDmg').val(dmgU[_settings.globals.CLASSES[mode].critDmg]);
switchModeButton.find('span.desc').text(utils.CLASS_TO_NAME[mode]);
document.cookie = 'mode=' + mode + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
_settings.globals.MODE = mode;

// Creates the dropdown menu sections DPS AAs, Focus AAs, and Equipment
var settingsTemplate = Handlebars.compile($("#settings-dropdown-item-template").html());
$('#basicDmgFocusSection').after(settingsTemplate({ context: utils.readDmgFocusContext() }));
$('#spellFocusAASection').after(settingsTemplate({ context: utils.readSpellFocusContext() }));
$('#mainDPSAASection').after(settingsTemplate({ context: utils.readMainContext() }));

// Create Abilities In Use section
var rateTemplate = Handlebars.compile($('#additional-modifiers-synergy-template').html());
var sectionTemplate = Handlebars.compile($("#abilities-input-template").html());

var abilitiesSection = $('#abilitiesSection');
var aurasSection = $('#aurasSection');
var debuffsSection = $('#debuffsSection');
var synergySection = $('#synergySection');
var aList = [];
var dList = [];
var sList = [];
var gList = [];
var aInputRatesList = [];

abilities.getAbilityList(true).forEach(function (ability) {
  var item = { id: ability.id, aClass: utils.toUpper(ability.class || ''), name: ability.name };

  if (ability.debuff) {
    dList.push(item);
  } else if (ability.repeatEvery > -1) {
    sList.push(item);
  } else if (ability.refreshTime > 0 && !ability.manuallyActivated) {
    gList.push(item);
  } else {
    aList.push(item);
  }

  if (ability.repeatEvery > -1) {
    aInputRatesList.push(ability);
  }
});

abilitiesSection.append(sectionTemplate({ data: aList }));
abilitiesSection.find('input').click(function (e) {
  timeline.callUpdateSpellChart();
});
aurasSection.append(sectionTemplate({ data: gList }));
aurasSection.find('input').click(function (e) {
  timeline.callUpdateSpellChart();
});
debuffsSection.append(sectionTemplate({ data: dList }));
debuffsSection.find('input').click(function (e) {
  timeline.callUpdateSpellChart();
});
synergySection.append(sectionTemplate({ data: sList }));
synergySection.find('input').click(function (e) {
  timeline.callUpdateSpellChart();
});

aInputRatesList.forEach(function (ability) {
  $('#' + ability.id).after(rateTemplate({
    inputId: ability.id + 'Rate',
    tooltip: ability.tooltip,
    defaultTime: ability.repeatEvery / 1000
  }));

  $('#' + ability.id + 'Rate').change(function () {
    timeline.callUpdateSpellChart();
  });
});

var adpsOptions = [];
var classMap = new _map2.default();
abilities.getAbilityList(false).forEach(function (ability) {
  var aClass = _settings.globals.MODE !== ability.class ? utils.CLASS_TO_NAME[ability.class] || '' : '';
  if (!classMap.has(aClass)) {
    var list = [];
    classMap.set(aClass, list);
    adpsOptions.push({ group: aClass, adps: list });
  }

  classMap.get(aClass).push({ id: ability.id, name: ability.name });
});

var adpsButtonTemplate = Handlebars.compile($('#spell-adps-dropdown-template').html());
$('#spellButtons').append(adpsButtonTemplate({ title: 'Add ADPS', data: adpsOptions }));
$('#adps-dropdown').multiselect({
  buttonText: function buttonText() {
    return 'Select ADPS';
  },
  buttonClass: 'btn btn-primary btn-xs',
  onChange: function onChange(opt, checked, sel) {
    if (checked) {
      timeline.createAdpsItem($(opt).val());
    } else {
      timeline.removeAdpsItem($(opt).val());
    }
  },
  onDropdownHide: function onDropdownHide() {
    return timeline.resume();
  },
  onDropdownShow: function onDropdownShow() {
    return timeline.quiet();
  }
});

// build spell list
buildSpellList();

// Listen for changes to dropdown options that require updating the spell chart
// If certain items are updated then the crit rates are reloaded as well
$('li.dropdown').each(function (i1, dropdown) {
  var itemDesc = $(dropdown).find('a.dropdown-toggle');
  $(dropdown).find('ul.dropdown-menu li a').each(function (i2, item) {
    $(item).click(function (e) {
      var selected = $(e.currentTarget);
      itemDesc.find('span.desc').text(selected.text());
      itemDesc.data('value', selected.data('value'));

      if ($(dropdown).hasClass('aa-furymagic') || $(dropdown).hasClass('aa-destfury') || $(dropdown).hasClass('spell-pet-focus') || $(dropdown).hasClass('aa-don')) {}

      timeline.callUpdateSpellChart(true);
    });
  });
});

// Listener for menu button click to hide/show the dropdown menus
$('.menu-button').click(function (item) {
  var menu = $('.nav-side-menu');
  if (menu.is(':hidden')) {
    menu.show();
    $('div.container').removeClass('full');
    $('div.container').addClass('shared');
  } else {
    menu.hide();
    $('div.container').removeClass('shared');
    $('div.container').addClass('full');
  }
});

// Listen to configuration changes that need to update the spell chart
$('#configurationSection input').change(function () {
  timeline.callUpdateSpellChart();
});

// Listen to configuration changes that need to update the spell chart and update crit rates
$('#spellTimeRange, #customSettingsSection input').change(function () {
  timeline.callUpdateSpellChart(true);
});

// Sets listener on each collapsable dropdown menu to handle collapse/expand events
$('.custom-collapse').each(function (i, p) {
  $(p).click(function () {
    utils.collapseMenu(p);
  });
});

$('#myModal').on('shown.bs.modal', function () {
  $.get(_spellValidation2.default, function (data) {
    return dmgU.displaySpellInfo($('#myModal .modal-body'), data.split(/\r?\n/));
  });
});

$('#pageLink').on('click', function () {
  var inputs = '';
  $('input:visible').not(':input[type=checkbox]').each(function (i, el) {
    var id = $(el).attr('id');
    // dont save the custom adps settings
    if (id !== undefined && !$(el).hasClass('custom-values')) {
      inputs += id + '+' + $(el).val() + ',';
    }
  });

  var checkboxes = '';
  $('input[type=checkbox]').each(function (i, el) {
    var id = $(el).attr('id') || $(el).val();
    checkboxes += id + '+' + $(el).is(':checked') + ',';
  });

  var buttons = '';
  $('button:visible').each(function (i, el) {
    var id = $(el).attr('id');
    if (id !== undefined) {
      buttons += id + '+' + $(el).data('value') + ',';
    }
  });

  var options = '';
  $('a.dropdown-toggle').each(function (i, el) {
    var id = $(el).attr('id');
    if (id !== undefined) {
      options += id + '+' + $(el).data('value') + ',';
    }
  });

  var appUrl = utils.getAppURL() + '&settings=' + inputs + checkboxes + buttons + options;

  var notify = $.notify({
    message: '<strong>creating link</strong>',
    icon: 'glyphicon glyphicon-copy',
    target: '_blank'
  }, {
    type: 'info',
    delay: 0,
    offset: { x: 450, y: 10 },
    placement: { align: 'left' }
  });

  $.ajax({
    type: 'post',
    url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + 'AIzaSyAO8t0SjxrPe7DYmKKDJS3FkoziaZ7F1Fg',
    data: (0, _stringify2.default)({ 'longUrl': appUrl }),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    async: true,
    success: function success(data) {
      notify.update('message', '<strong>' + data.id + '</strong>');
      var icon = $('div.alert span.glyphicon-copy');
      icon.css('cursor', 'pointer');
      icon.click(function (e) {
        utils.copyToClipboard(data.id);
      });
    }
  });
});

// Set default collapse state
utils.collapseMenu($('#synergySection .custom-collapse'));
utils.collapseMenu($('#debuffsSection .custom-collapse'));
utils.collapseMenu($('#aurasSection .custom-collapse'));
utils.collapseMenu($('#abilitiesSection .custom-collapse'));
utils.collapseMenu($('#basicDmgFocusSection'));
utils.collapseMenu($('#spellFocusAASection'));
utils.collapseMenu($('#mainDPSAASection'));
utils.collapseMenu($('#customSettingsSection .custom-collapse'));
utils.collapseMenu($('#testSection .custom-collapse'));

// Init timeline stuff and load the chart
timeline.init();
timeline.loadRates();

// Check for application settings
var settings = utils.getUrlParameter('settings');
if (settings) {
  settings.split(',').forEach(function (s) {
    var values = s.split('+');
    if (values.length > 0 && values[0]) {
      var $el = $('#' + values[0]);
      if ($el.length > 0) {
        if ($el.is('a')) {
          $el.next().find('a[data-value="' + values[1] + '"]').trigger('click');
        } else if ($el.attr('type') === 'checkbox') {
          if (values[1] === 'true') {
            $el.trigger('click');
          }
        } else if ($el.attr('type') === 'button') {
          $el.next().find('a[data-value="' + values[1] + '"]').trigger('click');
        } else {
          $el.val(values[1]);
        }
      } else {
        var $checkbox = $('input[type=checkbox][value=' + values[0] + ']');
        if ($checkbox.length > 0) {
          if (values[1] === 'true') {
            $checkbox.trigger('click');
          }
        }
      }
    }
  });
}

timeline.updateSpellChart();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(83)))

/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(397), __esModule: true };

/***/ }),
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(23);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 398 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(164);
__webpack_require__(115);
__webpack_require__(170);
__webpack_require__(413);
__webpack_require__(419);
__webpack_require__(421);
__webpack_require__(422);
module.exports = __webpack_require__(23).Map;


/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(116);
var defined = __webpack_require__(84);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 400 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(50) && !__webpack_require__(51)(function () {
  return Object.defineProperty(__webpack_require__(166)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(49);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(48);


/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(167);
var descriptor = __webpack_require__(118);
var setToStringTag = __webpack_require__(125);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(48)(IteratorPrototype, __webpack_require__(30)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 405 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(36);
var anObject = __webpack_require__(63);
var getKeys = __webpack_require__(119);

module.exports = __webpack_require__(50) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 406 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(64);
var toIObject = __webpack_require__(120);
var arrayIndexOf = __webpack_require__(407)(false);
var IE_PROTO = __webpack_require__(123)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 407 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(120);
var toLength = __webpack_require__(85);
var toAbsoluteIndex = __webpack_require__(408);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 408 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(116);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 409 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(33).document;
module.exports = document && document.documentElement;


/***/ }),
/* 410 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(64);
var toObject = __webpack_require__(66);
var IE_PROTO = __webpack_require__(123)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 411 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(412);
var step = __webpack_require__(171);
var Iterators = __webpack_require__(65);
var toIObject = __webpack_require__(120);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(117)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 412 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 413 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(172);
var validate = __webpack_require__(126);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(180)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 414 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(33);
var core = __webpack_require__(23);
var dP = __webpack_require__(36);
var DESCRIPTORS = __webpack_require__(50);
var SPECIES = __webpack_require__(30)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 415 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(57);
var IObject = __webpack_require__(121);
var toObject = __webpack_require__(66);
var toLength = __webpack_require__(85);
var asc = __webpack_require__(416);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 416 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(417);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 417 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);
var isArray = __webpack_require__(418);
var SPECIES = __webpack_require__(30)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 418 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(122);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 419 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(19);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(181)('Map') });


/***/ }),
/* 420 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(86);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 421 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(182)('Map');


/***/ }),
/* 422 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(183)('Map');


/***/ }),
/* 423 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 424 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 425 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 426 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 427 */
/***/ (function(module, exports) {

module.exports = "../../data/spell-validation.txt";

/***/ }),
/* 428 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(429);
module.exports = __webpack_require__(23).Object.keys;


/***/ }),
/* 429 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(66);
var $keys = __webpack_require__(119);

__webpack_require__(430)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 430 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(19);
var core = __webpack_require__(23);
var fails = __webpack_require__(51);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 431 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(432);
module.exports = __webpack_require__(23).Object.assign;


/***/ }),
/* 432 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(19);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(433) });


/***/ }),
/* 433 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(119);
var gOPS = __webpack_require__(434);
var pIE = __webpack_require__(435);
var toObject = __webpack_require__(66);
var IObject = __webpack_require__(121);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(51)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 434 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 435 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 436 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPELL_DATA = undefined;

var _assign = __webpack_require__(184);

var _assign2 = _interopRequireDefault(_assign);

var _map = __webpack_require__(62);

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SMap(list) {
  var map = new _map2.default();
  list.forEach(function (item) {
    return map.set(item, true);
  });
  return map;
}

var SPELL_DATA = exports.SPELL_DATA = {
  AB: {
    baseDmg: 1773,
    castTime: 0,
    focusable: true,
    id: 'AB',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'New Arcane Ballad Effect III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'AB',
    type3Dmg: 0
  },
  ASVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'ASVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Arcane Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'ASVI',
    type3Dmg: 0
  },
  BFVI: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'BFVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Blaze of Fire VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BFVI',
    type3Dmg: 0
  },
  BOFVI: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: true,
    id: 'BOFVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVI',
    type3Dmg: 0
  },
  BOFVII: {
    base1: 100,
    baseDmg: 4400,
    castTime: 0,
    focusable: true,
    id: 'BOFVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVII',
    type3Dmg: 0
  },
  BOIVI: {
    base1: 100,
    baseDmg: 510,
    castTime: 0,
    focusable: true,
    id: 'BOVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Ice VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOVI',
    type3Dmg: 0
  },
  BOIX: {
    base1: 100,
    baseDmg: 1050,
    castTime: 0,
    focusable: true,
    id: 'BOIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Ice X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOIX',
    type3Dmg: 0
  },
  EBOFV: {
    base1: 100,
    baseDmg: 3600,
    castTime: 0,
    focusable: true,
    id: 'EBOFV',
    level: 255,
    limitResists: SMap(['FIRE', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'EBOFV',
    type3Dmg: 0
  },
  ESOMV: {
    base1: 100,
    baseDmg: 3600,
    castTime: 0,
    focusable: true,
    id: 'ESOMV',
    level: 255,
    limitResists: SMap(['MAGIC', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'ESOMV',
    type3Dmg: 0
  },
  EBOFVIII: {
    base1: 100,
    baseDmg: 4800,
    castTime: 0,
    focusable: true,
    id: 'EBOFVIII',
    level: 255,
    limitResists: SMap(['FIRE', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'EBOFVIII',
    type3Dmg: 0
  },
  ESOMVIII: {
    base1: 100,
    baseDmg: 4800,
    castTime: 0,
    focusable: true,
    id: 'ESOMVIII',
    level: 255,
    limitResists: SMap(['MAGIC', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'ESOMVIII',
    type3Dmg: 0
  },
  RF: {
    base1: 100,
    baseDmg: 12000,
    castTime: 0,
    focusable: false,
    id: 'RF',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Restless Focus Spell',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 24,
    target: 'SINGLE',
    timer: 'RF',
    type3Dmg: 0
  },
  DRS: {
    base1: 160,
    baseDmg: 24193,
    castTime: 0,
    focusable: true,
    id: 'DR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Dissident Reinforced Strike 6',
    origCastTime: 0,
    recastTime: 6000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'DR',
    type3Dmg: 0
  },
  FCVII: {
    base1: 100,
    baseDmg: 540,
    castTime: 0,
    focusable: true,
    id: 'FCVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Corruption VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'FCVII',
    type3Dmg: 0
  },
  FCX: {
    base1: 100,
    baseDmg: 945,
    castTime: 0,
    focusable: true,
    id: 'FCX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Corruption X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'FCX',
    type3Dmg: 0
  },
  FOMIX: {
    base1: 100,
    baseDmg: 900,
    castTime: 0,
    focusable: true,
    id: 'FOMIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic IX',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMIX',
    type3Dmg: 0
  },
  FOMVII: {
    base1: 100,
    baseDmg: 600,
    castTime: 0,
    focusable: true,
    id: 'FOMVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMVII',
    type3Dmg: 0
  },
  FOMXIII: {
    base1: 100,
    baseDmg: 1500,
    castTime: 0,
    focusable: true,
    id: 'FOMXIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic XIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMXIII',
    type3Dmg: 0
  },
  FOMXV: {
    base1: 100,
    baseDmg: 1800,
    castTime: 0,
    focusable: true,
    id: 'FOMXV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic XV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMXV',
    type3Dmg: 0
  },
  FSVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'FSVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Fiery Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'FSVI',
    type3Dmg: 0
  },
  FSVII: {
    base1: 100,
    baseDmg: 250,
    castTime: 0,
    focusable: true,
    id: 'FSVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Fiery Strike VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    spellDmgCap: 250,
    target: 'SINGLE',
    timer: 'FSVII',
    type3Dmg: 0
  },
  FZVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'FZVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Freezing Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'FZVI',
    type3Dmg: 0
  },
  FW: {
    baseDmg: 5624,
    castTime: 0,
    focusable: true,
    id: 'FW',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'New Frostreave Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'FW',
    type3Dmg: 0
  },
  HOMIII: {
    base1: 100,
    baseDmg: 7000,
    castTime: 0,
    focusable: true,
    id: 'HOMIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Hammer of Magic III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'HOMIII',
    type3Dmg: 0
  },
  HOMVII: {
    base1: 100,
    baseDmg: 11000,
    castTime: 0,
    focusable: true,
    id: 'HOMVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Hammer of Magic VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'HOMVII',
    type3Dmg: 0
  },
  BOFVIII: {
    base1: 100,
    baseDmg: 12000,
    castTime: 0,
    focusable: true,
    id: 'BOFVIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Blaze of Fire VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVIII',
    type3Dmg: 0
  },
  MR: {
    baseDmg: 6086,
    castTime: 0,
    focusable: true,
    id: 'MR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'New Mana Repetition Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRR',
    type3Dmg: 0
  },
  MRR: {
    baseDmg: 11160,
    castTime: 0,
    focusable: true,
    id: 'MRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'New Mana Re-Repetition Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRR',
    type3Dmg: 0
  },
  MRRR: {
    baseDmg: 11718,
    castTime: 0,
    focusable: true,
    id: 'MRRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'New Mana Re-Re-Repetition Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRRR',
    type3Dmg: 0
  },
  MRRRR: {
    baseDmg: 12304,
    castTime: 0,
    focusable: true,
    id: 'MRRRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'New Mana Re-Re-Re-Repetition Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRRRR',
    type3Dmg: 0
  },
  OS: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: false,
    id: 'OS',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Obulus Strike',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'OS',
    type3Dmg: 0
  },
  POP99: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'POP99',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Perfusion of Plague lvl 99',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 52,
    target: 'SINGLE',
    timer: 'POP99',
    type3Dmg: 0
  },
  SOCI: {
    base1: 100,
    baseDmg: 1800,
    castTime: 0,
    focusable: true,
    id: 'SOCI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCI',
    type3Dmg: 0
  },
  SOCII: {
    base1: 100,
    baseDmg: 2160,
    castTime: 0,
    focusable: true,
    id: 'SOCII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCII',
    type3Dmg: 0
  },
  SOCV: {
    base1: 100,
    baseDmg: 3240,
    castTime: 0,
    focusable: true,
    id: 'SOCV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCV',
    type3Dmg: 0
  },
  SOC47: {
    base1: 100,
    baseDmg: 4320,
    castTime: 0,
    focusable: true,
    id: 'SOC47',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption lvl 47',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOC47',
    type3Dmg: 0
  },
  SODIX: {
    base1: 100,
    baseDmg: 900,
    castTime: 0,
    focusable: true,
    id: 'SODIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Disease IV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SODIX',
    type3Dmg: 0
  },
  SOFV: {
    base1: 100,
    baseDmg: 420,
    castTime: 0,
    focusable: true,
    id: 'SOFV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFV',
    type3Dmg: 0
  },
  SOFXIII: {
    base1: 100,
    baseDmg: 1500,
    castTime: 0,
    focusable: true,
    id: 'SOFXIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames XIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFXIII',
    type3Dmg: 0
  },
  SOFXIV: {
    base1: 100,
    baseDmg: 1650,
    castTime: 0,
    focusable: true,
    id: 'SOFXIV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames XIV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFXIV',
    type3Dmg: 0
  },
  SOIV: {
    base1: 100,
    baseDmg: 9000,
    castTime: 0,
    focusable: true,
    id: 'SOIV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOIV',
    type3Dmg: 0
  },
  SOI99: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'SOI99',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 99',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI199',
    type3Dmg: 0
  },
  SOI109: {
    base1: 100,
    baseDmg: 11000,
    castTime: 0,
    focusable: true,
    id: 'SOI109',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 109',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI109',
    type3Dmg: 0
  },
  SOI129: {
    base1: 100,
    baseDmg: 13000,
    castTime: 0,
    focusable: true,
    id: 'SOI129',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 129',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI129',
    type3Dmg: 0
  },
  SOM51: {
    base1: 100,
    baseDmg: 5200,
    castTime: 0,
    focusable: true,
    id: 'SOM51',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic lvl 51',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOM51',
    type3Dmg: 0
  },
  SOM43: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: true,
    id: 'SOM43',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic lvl 43',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOM43',
    type3Dmg: 0
  },
  TC: {
    baseDmg: 0,
    beneficial: true,
    castTime: 0,
    focusable: false,
    id: 'TC',
    level: 85,
    lockoutTime: 1500,
    manaCost: 1,
    name: 'Twincast Rk. III',
    origCastTime: 0,
    recastTime: 300000,
    resist: 'NONE',
    skill: 4,
    target: 'SELF',
    timer: 'twincast',
    type3Dmg: 0
  },
  WSYN1: {
    baseDmg: 25000,
    castTime: 0,
    focusable: false,
    id: 'WSYN',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Evoker\'s Synergy Strike I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'WSYN'
  },
  WSYN2: {
    baseDmg: 30000,
    castTime: 0,
    focusable: false,
    id: 'WSYN',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Evoker\'s Synergy Strike II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'WSYN'
  }

  // Dark Shield of the Scholar procs Force of Magic XV so use that for default
  // settings
};SPELL_DATA.DS = (0, _assign2.default)({}, SPELL_DATA.FOMXV, {
  castTime: 100,
  id: 'DS',
  inventory: true,
  manaCost: 10,
  name: 'Dark Shield of the Scholar',
  origCastTime: 100,
  skill: 52,
  target: 'SINGLE',
  timer: 'recast-3'
});

/***/ }),
/* 437 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SPELL_DATA = exports.SPELL_DATA = {
  AFU1: {
    baseDmg: 73450,
    castTime: 0,
    fixedRate: 3,
    spa497: true,
    focusable: false,
    id: 'AFU1',
    level: 254,
    manaCost: 0,
    minCritRate: 1.0,
    name: 'Arcane Fusion I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
  AFU2: {
    baseDmg: 100000,
    castTime: 0,
    fixedRate: 3,
    spa497: true,
    focusable: false,
    id: 'AFU2',
    level: 254,
    manaCost: 0,
    minCritRate: 1.0,
    name: 'Arcane Fusion II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
  AFU3: {
    baseDmg: 150000,
    castTime: 0,
    fixedRate: 3,
    spa497: true,
    focusable: false,
    id: 'AFU3',
    level: 254,
    manaCost: 0,
    minCritRate: 1.0,
    name: 'Arcane Fusion III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
  AFU4: {
    baseDmg: 200000,
    castTime: 0,
    fixedRate: 3,
    spa497: true,
    focusable: false,
    id: 'AFU4',
    level: 254,
    manaCost: 0,
    minCritRate: 1.0,
    name: 'Arcane Fusion IV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
  SB: {
    baseDmg: 24617,
    castTime: 0,
    focusable: true,
    id: 'SB',
    level: 111,
    lockoutTime: 1500,
    manaCost: 2981,
    maxHits: 12,
    name: 'Scorching Beam Rk. III',
    origCastTime: 0,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'FrontalAE',
    timer: '2'
  },
  SBRk1: {
    baseDmg: 22329,
    name: 'Scorching Beam Rk. I'
  },
  SBRk2: {
    baseDmg: 23445,
    name: 'Scorching Beam Rk. II'
  },
  SBRk3: {
    baseDmg: 24617,
    name: 'Scorching Beam Rk. III'
  },
  CRYO: {
    baseDmg: 25000,
    castTime: 0,
    focusable: false,
    id: 'CRYO',
    level: 254,
    manaCost: 0,
    name: 'Cryomancy XXVII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'cryo'
  },
  PYRO: {
    baseDmg: 20400,
    castTime: 0,
    focusable: false,
    id: 'PYRO',
    level: 254,
    manaCost: 0,
    name: 'Pyromancy XXVII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'pyro'
  },
  CS: {
    baseDmg: 36211,
    castTime: 1500,
    focusable: true,
    id: 'CS',
    level: 113,
    lockoutTime: 1500,
    manaCost: 2518,
    name: 'Claw of Sontalak Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '11',
    type3DmgAug: 2326
  },
  CSRk1: {
    baseDmg: 32845,
    name: 'Claw of Sontalak Rk. I'
  },
  CSRk2: {
    baseDmg: 34487,
    name: 'Claw of Sontalak Rk. II'
  },
  CSRk3: {
    baseDmg: 36211,
    name: 'Claw of Sontalak Rk. III'
  },
  CI: {
    baseDmg: 7237,
    castTime: 600,
    focusable: true,
    id: 'CI',
    level: 99,
    lockoutTime: 1500,
    manaCost: 714,
    name: 'Chaos Incandescence Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'chaosinc',
    type3DmgAug: 673
  },
  CG: {
    baseDmg: 32567,
    castTime: 1500,
    focusable: true,
    id: 'CG',
    level: 115,
    lockoutTime: 1500,
    manaCost: 2265,
    name: 'Claw of Gozzrem Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '11',
    type3DmgAug: 2326
  },
  CGRk1: {
    baseDmg: 29539,
    name: 'Claw of Gozzrem Rk. I'
  },
  CGRk2: {
    baseDmg: 31016,
    name: 'Claw of Gozzrem Rk. II'
  },
  CGRk3: {
    baseDmg: 32567,
    name: 'Claw of Gozzrem Rk. III'
  },
  CB: {
    baseDmg: 12885,
    canTwincast: false,
    castTime: 0,
    focusable: true,
    id: 'CB',
    level: 111,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Chaos Scorch III',
    origCastTime: 0,
    recastTime: 4750,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'chaosscorch',
    type3DmgAug: 1219
  },
  CBRk1: {
    baseDmg: 11686,
    name: 'Chaos Scorch I'
  },
  CBRk2: {
    baseDmg: 12271,
    name: 'Chaos Scorch II'
  },
  CBRk3: {
    baseDmg: 12885,
    name: 'Chaos Scorch III'
  },
  CT: {
    baseDmg: 26396,
    castTime: 0,
    focusable: true,
    id: 'CT',
    level: 112,
    lockoutTime: 1500,
    manaCost: 4439,
    name: 'Cloudburst Stormbolt Rk. III',
    origCastTime: 0,
    recastTime: 3000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '2',
    type3DmgAug: 1886
  },
  CTRk1: {
    baseDmg: 23942,
    name: 'Cloudburst Stormbolt Rk. I'
  },
  CTRk2: {
    baseDmg: 25139,
    name: 'Cloudburst Stormbolt Rk. II'
  },
  CTRk3: {
    baseDmg: 26396,
    name: 'Cloudburst Stormbolt Rk. III'
  },
  DF: {
    baseDmg: 140801,
    canTwincast: false,
    castTime: 1980,
    focusable: true,
    id: 'DF',
    level: 250,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Dissident Fire 6',
    origCastTime: 3000,
    recastTime: 60000,
    recastTime2: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'dicho'
  },
  RI: {
    baseDmg: 50099,
    castTime: 1875,
    focusable: true,
    id: 'RI',
    level: 114,
    lockoutTime: 1500,
    manaCost: 8360,
    name: 'Restless Ice Comet Rk. III',
    origCastTime: 3750,
    recastTime: 5250,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'restlessicecomet',
    type3DmgAug: 3978
  },
  RIRk1: {
    baseDmg: 45441,
    name: 'Restless Ice Comet Rk. I'
  },
  RIRk2: {
    baseDmg: 47713,
    name: 'Restless Ice Comet Rk. II'
  },
  RIRk3: {
    baseDmg: 50099,
    name: 'Restless Ice Comet Rk. III'
  },
  EB: {
    baseDmg: 55705,
    castTime: 1875,
    focusable: true,
    id: 'EB',
    level: 115,
    lockoutTime: 1500,
    manaCost: 9294,
    name: 'Ethereal Brand Rk. III',
    origCastTime: 3750,
    recastTime: 5500,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'brand',
    type3DmgAug: 3978
  },
  EBRk1: {
    baseDmg: 50526,
    name: 'Ethereal Brand Rk. I'
  },
  EBRk2: {
    baseDmg: 53052,
    name: 'Ethereal Brand Rk. II'
  },
  EBRk3: {
    baseDmg: 55705,
    name: 'Ethereal Brand Rk. III'
  },
  ET: {
    baseDmg: 47133,
    castTime: 1875,
    focusable: true,
    id: 'ET',
    level: 113,
    lockoutTime: 1500,
    manaCost: 8975,
    name: 'Ethereal Blast Rk. III',
    origCastTime: 3750,
    recastTime: 5500,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'blast',
    type3DmgAug: 3978
  },
  ETRk1: {
    baseDmg: 42751,
    name: 'Ethereal Blast Rk. I'
  },
  ETRk2: {
    baseDmg: 44889,
    name: 'Ethereal Blast Rk. II'
  },
  ETRk3: {
    baseDmg: 47133,
    name: 'Ethereal Blast Rk. III'
  },
  EI: {
    baseDmg: 36353,
    castTime: 1875,
    focusable: true,
    id: 'EI',
    level: 109,
    lockoutTime: 1500,
    manaCost: 5573,
    name: 'Ethereal Icefloe Rk. III',
    origCastTime: 3750,
    recastTime: 5250,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'icefloe',
    type3DmgAug: 2887
  },
  ES: {
    baseDmg: 40421,
    castTime: 1875,
    focusable: true,
    id: 'ES',
    level: 110,
    lockoutTime: 1500,
    manaCost: 6196,
    name: 'Ethereal Skyfire Rk. III',
    origCastTime: 3750,
    recastTime: 5500,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'skyfire',
    type3DmgAug: 2887
  },
  FBC: {
    castTime: 1980,
    focusable: true,
    id: 'FBC',
    level: 107,
    lockoutTime: 1500,
    manaCost: 13791,
    name: 'Frostbound Covenant Rk. III',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'COLD',
    skill: 5,
    target: 'SINGLE',
    timer: '14'
  },
  FAR: {
    baseDmg: 3121559,
    castTime: 1980,
    focusable: false,
    id: 'FAR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 3121559,
    maxCritRate: 0,
    name: 'Frostbound Resolution III',
    origCastTime: 3000,
    recastTime: 0,
    resist: 'COLD',
    skill: 5,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'ff'
  },
  FB: {
    baseDmg: 22493,
    castTime: 0,
    focusable: true,
    id: 'FB',
    level: 114,
    lockoutTime: 1500,
    manaCost: 3557,
    name: 'Flashbrand Rk. III',
    origCastTime: 0,
    recastTime: 8250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '2',
    type3DmgAug: 1530
  },
  FBRk1: {
    baseDmg: 20402,
    name: 'Flashbrand Rk. I'
  },
  FBRk2: {
    baseDmg: 21422,
    name: 'Flashbrand Rk. II'
  },
  FBRk3: {
    baseDmg: 22493,
    name: 'Flashbrand Rk. III'
  },
  FF4: {
    aa: true,
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FF4',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame IV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF5: {
    aa: true,
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FF5',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame V',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF6: {
    aa: true,
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FF6',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame VI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF7: {
    aa: true,
    baseDmg: 17150,
    castTime: 500,
    focusable: false,
    id: 'FF7',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame VII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF8: {
    aa: true,
    baseDmg: 18400,
    castTime: 500,
    focusable: false,
    id: 'FF8',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame VIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF9: {
    aa: true,
    baseDmg: 19500,
    castTime: 500,
    focusable: false,
    id: 'FF9',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame IX',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF10: {
    aa: true,
    baseDmg: 21000,
    castTime: 500,
    focusable: false,
    id: 'FF10',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame X',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF11: {
    aa: true,
    baseDmg: 23000,
    castTime: 500,
    focusable: false,
    id: 'FF11',
    level: 254,
    lockoutTime: 0,
    manaCost: 1915,
    name: 'Force of Flame XI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF12: {
    aa: true,
    baseDmg: 25500,
    castTime: 500,
    focusable: false,
    id: 'FF12',
    level: 254,
    lockoutTime: 0,
    manaCost: 2125,
    name: 'Force of Flame XII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FI4: {
    aa: true,
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FI4',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice IV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI5: {
    aa: true,
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FI5',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice V',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI6: {
    aa: true,
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FI6',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice VI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI7: {
    aa: true,
    baseDmg: 17150,
    castTime: 500,
    focusable: false,
    id: 'FI7',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice VII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI8: {
    aa: true,
    baseDmg: 18400,
    castTime: 500,
    focusable: false,
    id: 'FI8',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice VIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI9: {
    aa: true,
    baseDmg: 19500,
    castTime: 500,
    focusable: false,
    id: 'FI9',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice IX',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI10: {
    aa: true,
    baseDmg: 21000,
    castTime: 500,
    focusable: false,
    id: 'FI10',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice X',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI11: {
    aa: true,
    baseDmg: 23000,
    castTime: 500,
    focusable: false,
    id: 'FI11',
    level: 254,
    lockoutTime: 0,
    manaCost: 1915,
    name: 'Force of Ice XI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI12: {
    aa: true,
    baseDmg: 25500,
    castTime: 500,
    focusable: false,
    id: 'FI12',
    level: 254,
    lockoutTime: 0,
    manaCost: 2125,
    name: 'Force of Ice XII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  EC: {
    castTime: 1500,
    focusable: true,
    id: 'EC',
    level: 115,
    lockoutTime: 1500,
    manaCost: 709,
    name: 'Ethereal Confluence',
    origCastTime: 3000,
    recastTime: 36000,
    skill: 24,
    target: 'SINGLE',
    timer: '12'
  },
  FW24: {
    aa: true,
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FW24',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW25: {
    aa: true,
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FW25',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW26: {
    aa: true,
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FW26',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW27: {
    aa: true,
    baseDmg: 17150,
    castTime: 500,
    focusable: false,
    id: 'FW27',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XIX',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW28: {
    aa: true,
    baseDmg: 18400,
    castTime: 500,
    focusable: false,
    id: 'FW28',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XX',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW29: {
    aa: true,
    baseDmg: 19500,
    castTime: 500,
    focusable: false,
    id: 'FW29',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XXI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW30: {
    aa: true,
    baseDmg: 21000,
    castTime: 500,
    focusable: false,
    id: 'FW30',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XXII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW31: {
    aa: true,
    baseDmg: 23000,
    castTime: 500,
    focusable: false,
    id: 'FW31',
    level: 254,
    lockoutTime: 0,
    manaCost: 1915,
    name: 'Force of Will XXIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW32: {
    aa: true,
    baseDmg: 25500,
    castTime: 500,
    focusable: false,
    id: 'FW32',
    level: 254,
    lockoutTime: 0,
    manaCost: 2125,
    name: 'Force of Will XXIV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  HC: {
    baseDmg: 19104,
    castTime: 1500,
    focusable: true,
    id: 'HC',
    level: 99,
    lockoutTime: 1500,
    manaCost: 1964,
    name: 'Hoarfrost Cascade Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'hoarcascade',
    type3DmgAug: 1345
  },
  RC: {
    baseDmg: 30976,
    canTwincast: false,
    castTime: 0,
    focusable: true,
    id: 'RC',
    level: 111,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Restless Ice Cascade III',
    origCastTime: 0,
    recastTime: 9000,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'riceflowcas',
    type3DmgAug: 2212
  },
  RCRk1: {
    baseDmg: 28096,
    name: 'Restless Ice Cascade I'
  },
  RCRk2: {
    baseDmg: 29501,
    name: 'Restless Ice Cascade II'
  },
  RCRk3: {
    baseDmg: 30976,
    name: 'Restless Ice Cascade III'
  },
  VD: {
    baseDmg: 19760,
    castTime: 1500,
    focusable: true,
    id: 'VD',
    level: 114,
    lockoutTime: 1500,
    manaCost: 2019,
    maxCritRate: 0.40,
    maxHits: 4,
    name: 'Volcanic Downpour Rk. III',
    origCastTime: 3000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetAE',
    timer: '6',
    type3DmgAug: 1328
  },
  VDRk1: {
    baseDmg: 17923,
    name: 'Volcanic Downpour Rk. I'
  },
  VDRk2: {
    baseDmg: 18819,
    name: 'Volcanic Downpour Rk. II'
  },
  VDRk3: {
    baseDmg: 19760,
    name: 'Volcanic Downpour Rk. III'
  },
  MBRN: {
    baseDmg: 2800000,
    castTime: 3000,
    focusable: false,
    id: 'MBRN',
    level: 254,
    lockoutTime: 0,
    manaCost: 70000,
    maxCritRate: 0,
    name: 'Mana Burn XVI',
    origCastTime: 3000,
    recastTime: 1800,
    recastTime2: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'MBRN'
  },
  PE: {
    baseDmg: 11272,
    castTime: 600,
    focusable: true,
    id: 'PE',
    level: 100,
    lockoutTime: 1500,
    manaCost: 50,
    name: 'Pure Wildether III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'pwildether',
    type3DmgAug: 794
  },
  PS: {
    baseDmg: 19193,
    canTwincast: false,
    castTime: 600,
    focusable: true,
    id: 'PS',
    level: 115,
    lockoutTime: 1500,
    manaCost: 50,
    name: 'Pure Wildscorch Caza Caza',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'pwildscorch',
    type3DmgAug: 1130
  },
  PSRk1: {
    baseDmg: 17409,
    name: 'Pure Wildscorch Caza Azia'
  },
  PSRk2: {
    baseDmg: 18279,
    name: 'Pure Wildscorch Caza Beza'
  },
  PSRk3: {
    baseDmg: 19193,
    name: 'Pure Wildscorch Caza Caza'
  },
  SC: {
    baseDmg: 20972,
    baseDmgUnMod: 20972,
    castTime: 1500,
    focusable: true,
    id: 'SC',
    level: 105,
    lockoutTime: 3000,
    manaCost: 2929,
    maxHits: 5,
    name: 'Self-Combustion Rk. III',
    origCastTime: 3000,
    recastTime: 15000,
    resist: 'FIRE',
    skill: 24,
    target: 'CasterPB',
    timer: '10'
  },
  FP: {
    baseDmg: 17464,
    castTime: 2000,
    focusable: true,
    id: 'FP',
    level: 114,
    lockoutTime: 1500,
    manaCost: 2239,
    maxHits: 4,
    name: 'Fiery Pillar Rk. III',
    origCastTime: 2500,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetAE',
    timer: '8',
    type3DmgAug: 1216
  },
  FPRk1: {
    name: 'Fiery Pillar Rk. I',
    baseDmg: 15840
  },
  FPRk2: {
    name: 'Fiery Pillar Rk. II',
    baseDmg: 16632
  },
  FPRk3: {
    name: 'Fiery Pillar Rk. III',
    baseDmg: 17464
  },
  SH: {
    baseDmg: 14184,
    baseDmgUnMod: 14184,
    castTime: 800,
    focusable: true,
    id: 'SH',
    level: 95,
    lockoutTime: 1500,
    manaCost: 2758,
    maxHits: 5,
    name: 'Splash of Phenocrysts Rk. III',
    origCastTime: 1000,
    recastTime: 35000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetRingAE',
    timer: 'splashphenoc'
  },
  SR: {
    baseDmg: 11696,
    baseDmgUnMod: 11696,
    castTime: 800,
    focusable: true,
    id: 'SR',
    level: 90,
    lockoutTime: 1500,
    manaCost: 2580,
    maxHits: 5,
    name: 'Splash of Rhyolite Rk. III',
    origCastTime: 1000,
    recastTime: 35000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetRingAE',
    timer: 'splashrhyolite'
  },
  SP: {
    baseDmg: 13991,
    baseDmgUnMod: 13991,
    castTime: 800,
    focusable: true,
    id: 'SP',
    level: 100,
    lockoutTime: 1500,
    manaCost: 2924,
    maxHits: 5,
    name: 'Splash of Pyroxene Rk. III',
    origCastTime: 1000,
    recastTime: 35000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetRingAE',
    timer: 'splashproxene'
  },
  SJ: {
    baseDmg: 19828,
    castTime: 800,
    focusable: true,
    id: 'SJ',
    level: 108,
    lockoutTime: 1500,
    manaCost: 1246,
    name: 'Stormjolt Vortex Rk. III',
    origCastTime: 1000,
    recastTime: 24000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'vortex'
  },
  TW: {
    baseDmg: 24343,
    castTime: 1750,
    focusable: true,
    id: 'TW',
    level: 110,
    lockoutTime: 1500,
    manaCost: 2455,
    name: 'Thricewoven Capacity Rk. III',
    origCastTime: 3500,
    recastTime: 5000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'thricecapacity',
    type3DmgAug: 1739
  },
  TWRk1: {
    baseDmg: 22080,
    name: 'Thricewoven Capacity Rk. I'
  },
  TWRk2: {
    baseDmg: 23184,
    name: 'Thricewoven Capacity Rk. II'
  },
  TWRk3: {
    baseDmg: 24343,
    name: 'Thricewoven Capacity Rk. III'
  },
  WE: {
    baseDmg: 0,
    castTime: 600,
    focusable: true,
    id: 'WE',
    level: 96,
    lockoutTime: 1500,
    manaCost: 583,
    name: 'Wildether Barrage Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'wildether'
  },
  WS: {
    baseDmg: 0,
    castTime: 600,
    focusable: true,
    id: 'WS',
    level: 111,
    lockoutTime: 1500,
    manaCost: 923,
    name: 'Wildscorch Strike Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'wildflash'
  },
  WSRk1: {
    name: 'Wildscorch Strike Rk. I'
  },
  WSRk2: {
    name: 'Wildscorch Strike Rk. II'
  },
  WSRk3: {
    name: 'Wildscorch Strike Rk. III'
  },
  LF: {
    baseDmg: 10627,
    castTime: 1600,
    focusable: true,
    id: 'LF',
    level: 112,
    lockoutTime: 1500,
    manaCost: 2453,
    maxHits: 20,
    name: 'Loop of Flame Rk. III',
    origCastTime: 2000,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'CasterPB',
    timer: '4'
  },
  LFRk1: {
    name: 'Loop of Flame Rk. I',
    baseDmg: 9639
  },
  LFRk2: {
    name: 'Loop of Flame Rk. II',
    baseDmg: 10121
  },
  LFRk3: {
    name: 'Loop of Flame Rk. III',
    baseDmg: 10627
  }
};

/***/ }),
/* 438 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SPELL_DATA = exports.SPELL_DATA = {
  BB: {
    baseDmg: 12917,
    castTime: 2000,
    focusable: true,
    id: 'BB',
    level: 109,
    lockoutTime: 1500,
    manaCost: 3438,
    maxHits: 20,
    name: 'Burning Blast Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'CasterPB',
    timer: '2'
  },
  BBRk1: {
    name: 'Burning Blast Rk. I',
    baseDmg: 11716
  },
  BBRk2: {
    name: 'Burning Blast Rk. II',
    baseDmg: 12302
  },
  BBRk3: {
    name: 'Burning Blast Rk. III',
    baseDmg: 12917
  },
  BJ: {
    baseDmg: 28769,
    castTime: 0,
    focusable: true,
    id: 'BJ',
    inventory: true,
    level: 102,
    lockoutTime: 1500,
    manaCost: 10,
    name: 'Blazing Jet III',
    origCastTime: 0,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'recast-5' // from clickie
  },
  BK: {
    baseDmg: 14335,
    castTime: 1500,
    focusable: true,
    id: 'BK',
    level: 113,
    lockoutTime: 1500,
    manaCost: 1687,
    maxHits: 12,
    name: 'New Beam of Knives Rk. III',
    origCastTime: 3000,
    recastTime: 1500,
    resist: 'MAGIC',
    skill: 14,
    target: 'FrontalAE',
    timer: 'beam-knives'
  },
  BKRk1: {
    name: 'New Beam of Knives Rk. I',
    baseDmg: 13002
  },
  BKRk2: {
    name: 'New Beam of Knives Rk. II',
    baseDmg: 13652
  },
  BKRk3: {
    name: 'New Beam of Knives Rk. III',
    baseDmg: 14335
  },
  BM: {
    baseDmg: 17107,
    castTime: 1500,
    focusable: true,
    id: 'BM',
    level: 112,
    lockoutTime: 1500,
    manaCost: 2015,
    maxHits: 12,
    name: 'New Beam of Molten Rhyolite Rk. III',
    origCastTime: 3000,
    recastTime: 1500,
    resist: 'FIRE',
    skill: 14,
    target: 'FrontalAE',
    timer: 'beam-molten'
  },
  BMRk1: {
    name: 'New Beam of Molten Rhyolite Rk. I',
    baseDmg: 15516
  },
  BMRk2: {
    name: 'New Beam of Molten Rhyolite Rk. II',
    baseDmg: 16292
  },
  BMRk3: {
    name: 'New Beam of Molten Rhyolite Rk. III',
    baseDmg: 17107
  },
  BS: {
    baseDmg: 25415,
    castTime: 1500,
    focusable: true,
    id: 'BS',
    level: 111,
    lockoutTime: 1500,
    manaCost: 2701,
    name: 'New Bolt of Skyfire Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'boltofsky',
    type3DmgAug: 1815
  },
  BSRk1: {
    name: 'New Bolt of Skyfire Rk. I',
    baseDmg: 23052
  },
  BSRk2: {
    name: 'New Bolt of Skyfire Rk. II',
    baseDmg: 24205
  },
  BSRk3: {
    name: 'New Bolt of Skyfire Rk. III',
    baseDmg: 25415
  },
  CI: {
    baseDmg: 31616,
    castTime: 1200,
    focusable: true,
    id: 'CI',
    level: 115,
    lockoutTime: 1500,
    manaCost: 3782,
    name: 'New Chaotic Inferno Rk. III',
    origCastTime: 1500,
    recastTime: 5250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '4',
    type3DmgAug: 2258
  },
  CIRk1: {
    name: 'New Chaotic Inferno Rk. I',
    baseDmg: 28676
  },
  CIRk2: {
    name: 'New Chaotic Inferno Rk. II',
    baseDmg: 30110
  },
  CIRk3: {
    name: 'New Chaotic Inferno Rk. III',
    baseDmg: 31616
  },
  DC: {
    baseDmg: 0,
    canTwincast: false,
    castTime: 400,
    focusable: true,
    id: 'DC',
    level: 250,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Dissident Companion 6',
    origCastTime: 500,
    recastTime: 60000,
    recastTime2: 6000,
    resist: 'NONE',
    skill: 4,
    target: 'SINGLE',
    timer: 'dicho'
  },
  RM: {
    baseDmg: 25183,
    castTime: 2000,
    focusable: true,
    id: 'RM',
    level: 113,
    lockoutTime: 1500,
    manaCost: 2845,
    maxCritRate: 0.40,
    maxHits: 4,
    name: 'New Rain of Molten Rhyolite Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetAE',
    timer: '3'
  },
  RMRk1: {
    name: 'New Rain of Molten Rhyolite Rk. I',
    baseDmg: 22842
  },
  RMRk2: {
    name: 'New Rain of Molten Rhyolite Rk. II',
    baseDmg: 23984
  },
  RMRk3: {
    name: 'New Rain of Molten Rhyolite Rk. III',
    baseDmg: 25183
  },
  FBC: {
    castTime: 1980,
    focusable: true,
    id: 'FBC',
    level: 110,
    lockoutTime: 1500,
    manaCost: 12214,
    name: 'Firebound Covenant Rk. III',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'FIRE',
    skill: 5,
    target: 'SINGLE',
    timer: '13'
  },
  FAR: {
    baseDmg: 2717455,
    castTime: 0,
    focusable: false,
    id: 'FAR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 2717455,
    maxCritRate: 0,
    name: 'Firebound Resolution III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 5,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'ff'
  },
  FC: {
    baseDmg: 16954,
    castTime: 1200,
    focusable: true,
    id: 'FC',
    level: 105,
    lockoutTime: 1500,
    manaCost: 1941,
    name: 'Fickle Conflagration Rk. III',
    origCastTime: 1500,
    recastTime: 5250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'fickleconflag',
    type3DmgAug: 1211
  },
  FE13: {
    aa: true,
    baseDmg: 17530,
    castTime: 500,
    focusable: false,
    id: 'FE13',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE14: {
    aa: true,
    baseDmg: 18800,
    castTime: 500,
    focusable: false,
    id: 'FE14',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XIV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE15: {
    aa: true,
    baseDmg: 20105,
    castTime: 500,
    focusable: false,
    id: 'FE15',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE16: {
    aa: true,
    baseDmg: 21450,
    castTime: 500,
    focusable: false,
    id: 'FE16',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE17: {
    aa: true,
    baseDmg: 23000,
    castTime: 500,
    focusable: false,
    id: 'FE17',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE18: {
    aa: true,
    baseDmg: 24375,
    castTime: 500,
    focusable: false,
    id: 'FE18',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  MB: {
    baseDmg: 18549,
    castTime: 1500,
    focusable: true,
    id: 'MB',
    level: 103,
    lockoutTime: 1500,
    manaCost: 1618,
    name: 'Meteoric Bolt Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'MAGIC',
    skill: 24,
    target: 'LOS',
    timer: 'meteorbolt',
    type3DmgAug: 0
  },
  RK: {
    baseDmg: 24573,
    castTime: 2000,
    focusable: true,
    id: 'RK',
    level: 114,
    lockoutTime: 1500,
    manaCost: 2737,
    maxCritRate: 0.40,
    maxHits: 4,
    name: 'New Rain of Knives Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'MAGIC',
    skill: 24,
    target: 'TargetAE',
    timer: '7',
    type3DmgAug: 1755
  },
  RKRk1: {
    name: 'New Rain of Knives Rk. I',
    baseDmg: 22289
  },
  RKRk2: {
    name: 'New Rain of Knives Rk. II',
    baseDmg: 23403
  },
  RKRk3: {
    name: 'New Rain of Knives Rk. III',
    baseDmg: 24573
  },
  RS: {
    baseDmg: 2,
    canTwincast: false,
    castTime: 800,
    focusable: true,
    id: 'RS',
    level: 115,
    lockoutTime: 1500,
    manaCost: 6050,
    name: 'New Reckless Servant Rk. III',
    origCastTime: 1000,
    recastTime: 19000,
    resist: 'NONE',
    skill: 14,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'recklessserv',
    type3Aug: 1000
  },
  RSRk1: {
    name: 'New Reckless Servant Rk. I'
  },
  RSRk2: {
    name: 'New Reckless Servant Rk. II'
  },
  RSRk3: {
    name: 'New Reckless Servant Rk. III'
  },
  RD: {
    baseDmg: 400000,
    castTime: 0,
    focusable: false,
    id: 'RD',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'New Repudiate Destruction',
    origCastTime: 0,
    recastTime: 0,
    resist: 'UNRESISTABLE',
    skill: 98,
    target: 'SINGLE',
    timer: 'repudiateDest',
    type3DmgAug: 0
  },
  RU: {
    baseDmg: 26645,
    castTime: 1200,
    focusable: true,
    id: 'RU',
    level: 113,
    lockoutTime: 1500,
    manaCost: 2050,
    name: 'New Repudiate the Unnatural Rk. III',
    origCastTime: 1500,
    recastTime: 5750,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'repudiateUnnatural',
    type3DmgAug: 1903
  },
  RURk1: {
    name: 'New Repudiate the Unnatural Rk. I',
    baseDmg: 24168
  },
  RURk2: {
    name: 'New Repudiate the Unnatural Rk. II',
    baseDmg: 25376
  },
  RURk3: {
    name: 'New Repudiate the Unnatural Rk. III',
    baseDmg: 26645
  },
  SFB: {
    baseDmg: 0,
    beneficial: true,
    castTime: 3500,
    focusable: true,
    id: 'SFB',
    level: 102,
    lockoutTime: 1500,
    manaCost: 9453,
    name: 'Summon Firebound Orb Rk. III',
    origCastTime: 7000,
    recastTime: 6000,
    resist: 'NONE',
    skill: 14,
    target: 'SELF',
    timer: 'summonfirebound'
  },
  SA: {
    baseDmg: 46358,
    castTime: 1750,
    focusable: true,
    id: 'SA',
    level: 115,
    lockoutTime: 1500,
    manaCost: 7358,
    name: 'New Spear of Molten Arcronite Rk. III',
    origCastTime: 3500,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'newspeararconite',
    type3DmgAug: 3470
  },
  SARk1: {
    name: 'New Spear of Molten Arcronite Rk. I',
    baseDmg: 44150
  },
  SARk2: {
    name: 'New Spear of Molten Arcronite Rk. II',
    baseDmg: 46358
  },
  SARk3: {
    name: 'New Spear of Molten Arcronite Rk. III',
    baseDmg: 48676
  },
  SB: {
    baseDmg: 29731,
    castTime: 1750,
    focusable: true,
    id: 'SB',
    level: 105,
    lockoutTime: 1500,
    manaCost: 4900,
    name: 'Spear of Molten Shieldstone Rk. III',
    origCastTime: 3500,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'spearmoltenshield',
    type3DmgAug: 2124
  },
  SS: {
    baseDmg: 36056,
    castTime: 1750,
    focusable: true,
    id: 'SS',
    level: 110,
    lockoutTime: 1500,
    manaCost: 5886,
    name: 'Spear of Molten Arcronite Rk. III',
    origCastTime: 3500,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'speararconite',
    type3DmgAug: 2575
  },
  SH: {
    baseDmg: 17547,
    castTime: 1625,
    focusable: true,
    id: 'SH',
    level: 107,
    lockoutTime: 1500,
    manaCost: 1610,
    name: 'New Shock of Arcronite Steel Rk. III',
    origCastTime: 3250,
    recastTime: 5250,
    resist: 'MAGIC',
    skill: 14,
    target: 'SINGLE',
    timer: 'shockofarc',
    type3DmgAug: 1253
  },
  SHRk1: {
    name: 'New Shock of Arcronite Steel Rk. I',
    baseDmg: 15915
  },
  SHRk2: {
    name: 'New Shock of Arcronite Steel Rk. II',
    baseDmg: 16711
  },
  SHRk3: {
    name: 'New Shock of Arcronite Steel Rk. III',
    baseDmg: 17547
  },
  SV10: {
    baseDmg: 40000,
    castTime: 0,
    focusable: true,
    id: 'SV10',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV11: {
    baseDmg: 50000,
    castTime: 0,
    focusable: true,
    id: 'SV11',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV12: {
    baseDmg: 60000,
    castTime: 0,
    focusable: true,
    id: 'SV12',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  VM: {
    baseDmg: 6032,
    baseDmg1: 6032,
    baseDmg2: 6032,
    baseDmg3: 12999,
    baseDmg4: 12999,
    baseDmg5: 12999,
    baseDmg6: 21916,
    baseDmg7: 21916,
    baseDmg8: 21916,
    baseDmg9: 21916,
    baseDmg10: 35874,
    baseDmg11: 35874,
    baseDmg12: 35874,
    baseDmg13: 35874,
    baseDmg14: 35874,
    baseDmg15: 56574,
    castTime: 600,
    focusable: true,
    id: 'VM',
    level: 112,
    lockoutTime: 1500,
    manaCost: 2681,
    name: 'New Volley of Many Rk. III',
    origCastTime: 750,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: '6',
    type3DmgAug: 341
  },
  VMRk1: {
    name: 'New Volley of Many Rk. I',
    baseDmg: 5471,
    baseDmg1: 5471,
    baseDmg2: 5471,
    baseDmg3: 11790,
    baseDmg4: 11790,
    baseDmg5: 11790,
    baseDmg6: 19878,
    baseDmg7: 19878,
    baseDmg8: 19878,
    baseDmg9: 19878,
    baseDmg10: 32539,
    baseDmg11: 32539,
    baseDmg12: 32539,
    baseDmg13: 32539,
    baseDmg14: 32539,
    baseDmg15: 51315
  },
  VMRk2: {
    name: 'New Volley of Many Rk. II',
    baseDmg: 5745,
    baseDmg1: 5745,
    baseDmg2: 5745,
    baseDmg3: 12380,
    baseDmg4: 12380,
    baseDmg5: 12380,
    baseDmg6: 20872,
    baseDmg7: 20872,
    baseDmg8: 20872,
    baseDmg9: 20872,
    baseDmg10: 34166,
    baseDmg11: 34166,
    baseDmg12: 34166,
    baseDmg13: 34166,
    baseDmg14: 34166,
    baseDmg15: 53881
  },
  VMRk3: {
    name: 'New Volley of Many Rk. III',
    baseDmg: 6032,
    baseDmg1: 6032,
    baseDmg2: 6032,
    baseDmg3: 12999,
    baseDmg4: 12999,
    baseDmg5: 12999,
    baseDmg6: 21916,
    baseDmg7: 21916,
    baseDmg8: 21916,
    baseDmg9: 21916,
    baseDmg10: 35874,
    baseDmg11: 35874,
    baseDmg12: 35874,
    baseDmg13: 35874,
    baseDmg14: 35874,
    baseDmg15: 56574
  }
};

/***/ }),
/* 439 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SPELL_DATA = exports.SPELL_DATA = {
  CA: {
    castTime: 1980,
    focusable: true,
    id: 'CA',
    level: 101,
    lockoutTime: 1500,
    manaCost: 14194,
    name: 'Chromatic Alliance Rk. III',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: '14'
  },
  CAF: {
    baseDmg: 2341541,
    castTime: 0,
    focusable: false,
    id: 'CAF',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 2696520,
    maxCritRate: 0,
    name: 'Chromatic Fulmination III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'caf'
  },
  CD: {
    baseDmg: 0,
    castTime: 1750,
    focusable: false,
    id: 'CD',
    level: 113,
    lockoutTime: 1500,
    manaCost: 1794,
    mez: true,
    name: 'New Chaotic Delusion Rk. III',
    origCastTime: 2500,
    recastTime: 1500,
    resist: 'MAGIC',
    skill: 14,
    target: 'SINGLE',
    timer: 'chaoticdelusion',
    type3Dmg: 0
  },
  CDRk1: {
    name: 'New Chaotic Delusion Rk. I'
  },
  CDRk2: {
    name: 'New Chaotic Delusion Rk. II'
  },
  CDRk3: {
    name: 'New Chaotic Delusion Rk. III'
  },
  CF: {
    baseDmg: 10086,
    castTime: 1200,
    focusable: true,
    id: 'CF',
    level: 111,
    lockoutTime: 1500,
    manaCost: 1328,
    name: 'New Chromatic Flicker Rk. III',
    origCastTime: 1500,
    recastTime: 6000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'chromaticflicker',
    type3DmgAug: 720
  },
  CFRk1: {
    name: 'New Chromatic Flicker Rk. I',
    baseDmg: 9149
  },
  CFRk2: {
    name: 'New Chromatic Flicker Rk. II',
    baseDmg: 9606
  },
  CFRk3: {
    name: 'New Chromatic Flicker Rk. III',
    baseDmg: 10086
  },
  CR: {
    baseDmg: 15693,
    castTime: 1500,
    focusable: true,
    id: 'CR',
    level: 112,
    lockoutTime: 1500,
    manaCost: 1712,
    name: 'Chromareave Rk. III',
    origCastTime: 3000,
    recastTime: 4500,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'chromareave',
    type3DmgAug: 1121
  },
  CRRk1: {
    name: 'Chromareave Rk. I',
    baseDmg: 14234
  },
  CRRk2: {
    name: 'Chromareave Rk. II',
    baseDmg: 14946
  },
  CRRk3: {
    name: 'Chromareave Rk. III',
    baseDmg: 15693
  },
  DR: {
    baseDmg: 0,
    beneficial: true,
    castTime: 1500,
    focusable: false,
    id: 'DR',
    level: 101,
    lockoutTime: 1500,
    manaCost: 10458,
    name: 'Dichotomic Reinforcement 6',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'NONE',
    skill: 4,
    target: 'GROUP',
    timer: '13',
    type3Dmg: 0
  },
  GT: {
    baseDmg: 17482,
    castTime: 1950,
    focusable: true,
    id: 'GT',
    level: 104,
    lockoutTime: 1500,
    manaCost: 2746,
    name: 'Gravity Twist Rk. III',
    origCastTime: 3900,
    recastTime: 6000,
    resist: 'MAGIC',
    skill: 5,
    target: 'AE',
    timer: 'gtwist',
    type3DmgAug: 0
  },
  MC: {
    baseDmg: 25271,
    castTime: 2000,
    focusable: true,
    id: 'MC',
    level: 105,
    lockoutTime: 1500,
    manaCost: 4112,
    name: 'Mindsunder Rk. III',
    origCastTime: 4000,
    recastTime: 9000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'mindsunder',
    type3DmgAug: 1804
  },
  MU: {
    baseDmg: 30647,
    castTime: 2000,
    focusable: true,
    id: 'MU',
    level: 110,
    lockoutTime: 1500,
    manaCost: 4930,
    name: 'Mindslash Rk. III',
    origCastTime: 4000,
    recastTime: 9000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'mindslash',
    type3DmgAug: 2189
  },
  MS: {
    baseDmg: 42235,
    castTime: 2000,
    focusable: true,
    id: 'MS',
    level: 115,
    lockoutTime: 1500,
    manaCost: 5928,
    name: 'New Mindslash Rk. III',
    origCastTime: 4000,
    recastTime: 9000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'newmindslash',
    type3DmgAug: 3017
  },
  MSRk1: {
    name: 'New Mindslash Rk. I',
    baseDmg: 38309
  },
  MSRk2: {
    name: 'New Mindslash Rk. II',
    baseDmg: 40224
  },
  MSRk3: {
    name: 'New Mindslash Rk. III',
    baseDmg: 42235
  },
  PA: {
    baseDmg: 18316,
    castTime: 1500,
    focusable: true,
    id: 'PA',
    level: 113,
    lockoutTime: 1500,
    manaCost: 1956,
    name: 'New Polyfluorescent Assault Rk. III',
    origCastTime: 3000,
    recastTime: 4500,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'polyflourescent',
    type3DmgAug: 1309
  },
  PARk1: {
    name: 'New Polyfluorescent Assault Rk. I',
    baseDmg: 16613
  },
  PARk2: {
    name: 'New Polyfluorescent Assault Rk. II',
    baseDmg: 17444
  },
  PARk3: {
    name: 'New Polyfluorescent Assault Rk. III',
    baseDmg: 18316
  },
  ST: {
    baseDmg: 34337,
    castTime: 1980,
    duration: 4800, // 8 ticks
    focusable: true,
    id: 'ST',
    level: 113,
    lockoutTime: 1500,
    manaCost: 12146,
    name: 'New Strangulate Rk. III',
    origCastTime: 3000,
    recastTime: 1500,
    resist: 'CHROMATIC',
    spa: 79,
    skill: 5,
    target: 'SINGLE',
    timer: 'drown',
    ticks: 8,
    type3DmgAug: 2360
  },
  STRk1: {
    baseDmg: 31145,
    name: 'New Strangulate Rk. I'
  },
  STRk2: {
    baseDmg: 32702,
    name: 'New Strangulate Rk. II'
  },
  STRk3: {
    baseDmg: 34337,
    name: 'New Strangulate Rk. III'
  }
};

/***/ }),
/* 440 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(441);
module.exports = __webpack_require__(23).Math.trunc;


/***/ }),
/* 441 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(19);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 442 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(164);
__webpack_require__(115);
__webpack_require__(170);
__webpack_require__(443);
__webpack_require__(444);
__webpack_require__(445);
__webpack_require__(446);
module.exports = __webpack_require__(23).Set;


/***/ }),
/* 443 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(172);
var validate = __webpack_require__(126);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(180)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 444 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(19);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(181)('Set') });


/***/ }),
/* 445 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(182)('Set');


/***/ }),
/* 446 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(183)('Set');


/***/ }),
/* 447 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(448);
module.exports = parseInt;


/***/ }),
/* 448 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(19);
var $parseInt = __webpack_require__(449);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 449 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(33).parseInt;
var $trim = __webpack_require__(450).trim;
var ws = __webpack_require__(188);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 450 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(19);
var defined = __webpack_require__(84);
var fails = __webpack_require__(51);
var spaces = __webpack_require__(188);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 451 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(452), __esModule: true };

/***/ }),
/* 452 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(115);
__webpack_require__(453);
module.exports = __webpack_require__(23).Array.from;


/***/ }),
/* 453 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(57);
var $export = __webpack_require__(19);
var toObject = __webpack_require__(66);
var call = __webpack_require__(175);
var isArrayIter = __webpack_require__(176);
var toLength = __webpack_require__(85);
var createProperty = __webpack_require__(454);
var getIterFn = __webpack_require__(177);

$export($export.S + $export.F * !__webpack_require__(455)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 454 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(36);
var createDesc = __webpack_require__(118);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 455 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(30)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 456 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = __webpack_require__(457);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = __webpack_require__(127);

var _keys2 = _interopRequireDefault(_keys);

exports.execute = execute;

var _settings = __webpack_require__(52);

var _abilities = __webpack_require__(67);

var abilities = _interopRequireWildcard(_abilities);

var _damageUtils = __webpack_require__(87);

var dmgU = _interopRequireWildcard(_damageUtils);

var _dom = __webpack_require__(68);

var dom = _interopRequireWildcard(_dom);

var _stats = __webpack_require__(128);

var stats = _interopRequireWildcard(_stats);

var _timeline = __webpack_require__(190);

var timeline = _interopRequireWildcard(_timeline);

var _utils = __webpack_require__(58);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(genSpellProc),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(genDamageOverTime);

function addAEWaves(state, mod, current) {
  stats.updateSpellStatistics(state, 'aeHit1', current);

  // Only support AE rain spells right now. Add two more waves but
  // without procs
  state.aeWave = true;

  var hits = dom.getAERainHitsValue();
  if (hits > state.spell.maxHits) {
    hits = state.spell.maxHits;
  }

  // for each additional wave
  for (var i = 1; i < hits; i++) {
    calcAvgDamage(state, mod, 'aeHit' + (i + 1));
  }

  state.aeWave = false;
}

function addSpellAndEqpProcs(state, mod) {
  var time = state.workingTime;

  // should look these up at some point
  dmgU.getSpellProcs(state.spellProcAbilities, state.spell).forEach(function (item) {
    // remove if execute failed to do anything
    if (!item.proc || !executeProc(state, item.proc, mod, item.id)) {
      state.spellProcAbilities.delete(item.id);
    }
  });

  // add eqp and aug procs
  dmgU.getEqpProcs(state.spell).forEach(function (id) {
    executeProc(state, id, mod, 'EQP');
  });
}

function applyPostSpellEffects(state, mod, dmgKey) {
  mod = mod === undefined ? 1 : mod;
  var spell = state.spell;

  // all implemented enc spells have a chance to proc gift of hazy thoughts
  if (_settings.globals.MODE === 'enc') {
    var hazy = dom.getGiftOfHazyValue();
    if (hazy > 0) {
      timeline.addSpellProcAbility(state, 'GCH', hazy, true);
    }
  }

  // keep track of a counter based on main spell cast + twincast
  // average DPS sometimes goes down when it shouldnt because some gains
  // are lost during a small twincast. Check mod > 50% ? worth testing anyway
  // Same as with Arcomancy. I think this matters less for damage procs.
  // MSYN and others dont have as big an issue because they always start on main spell cast
  // VFX procs another one when it twincasts, etc
  var cfickleSpells = 0;
  var clawSpells = 0;
  switch (spell.id) {
    case 'FC':case 'TW':
      state.cfickleSpells = mod + (state.cfickleSpells || 0);
      if (state.cfickleSpells > 0.50 && !state.inTwincast) {
        cfickleSpells = state.cfickleSpells;
        state.cfickleSpells = 0;
      }
      break;
    case 'CI':case 'CG':case 'CS':
      state.clawSpells = mod + (state.clawSpells || 0);
      if (state.clawSpells > 0.50) {
        clawSpells = state.clawSpells;
        state.clawSpells = 0;
      }
      break;
  }

  switch (spell.resist) {
    case 'COLD':
      if (dmgU.isCastDetSpell(spell)) {
        //state.coldSpells = mod + (state.coldSpells || 0);

        if (_settings.globals.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          executeProc(state, 'CRYO', mod * dmgU.MANCY_PROC_RATE, 'CRYO');
          //state.coldSpells = state.coldSpells - dmgU.MANCY_PROC_RATE;
        }
      }
      break;
    case 'FIRE':
      if (dmgU.isCastDetSpell(spell)) {
        //state.fireSpells = mod + (state.fireSpells || 0);

        if (_settings.globals.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          executeProc(state, 'PYRO', mod * dmgU.MANCY_PROC_RATE, 'PYRO');
          //state.fireSpells = state.fireSpells - dmgU.MANCY_PROC_RATE;
        }
      }
      break;
    case 'MAGIC':
      if (dmgU.isCastDetSpell(spell)) {
        //state.magicSpells = mod + (state.magicSpells || 0);

        if (_settings.globals.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          timeline.addSpellProcAbility(state, 'ARCO', mod * dmgU.MANCY_PROC_RATE, true);
          //state.magicSpells = 0;
        }
      }
      break;
  }

  // switch cases dont have their own scope?
  var synergy = 0;

  switch (spell.id) {
    case 'CA':
      if (dom.getAllianceFulminationValue() > 0) {
        state[utils.getCounterKeys('CA').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      }
      break;
    case 'CD':
      timeline.addSpellProcAbility(state, 'CDG', abilities.get('CDG').charges, true);
      break;
    // Claw of the Flameweaver/Oceanlord + Mage Chaotic Fire
    case 'CI':case 'CG':case 'CS':
      // generate proc effects
      state.cfSpellProcGenerator.next(clawSpells).value.forEach(function (id) {
        switch (id) {
          case 'REFRESH':
            timeline.resetTimers(state);
            break;
          case 'SYLLMAGIC':case 'SYLLICE':case 'SYLLFIRE':case 'SYLLMASTER':
            timeline.addSpellProcAbility(state, id + utils.getRank(), 1, true);
            break;
          default:
            timeline.addSpellProcAbility(state, id, 1, true);
        }
      });

      break;
    case 'FC':
      if (_settings.globals.MODE === 'mag') {
        state.fcSpellProcGenerator.next(cfickleSpells).value.forEach(function (id) {
          return timeline.addSpellProcAbility(state, id, 1, true);
        });
      }
      break;
    case 'TW':
      if (_settings.globals.MODE === 'wiz') {
        state.twSpellProcGenerator.next(cfickleSpells).value.forEach(function (id) {
          return timeline.addSpellProcAbility(state, id, 1, true);
        });
      }
      break;
    case 'MS':
      if (dom.getBeguilersSynergyValue() === 11) {
        timeline.addSpellProcAbility(state, 'ESYN2', 1, true);
      }
      break;
    case 'MU':
      synergy = dom.getBeguilersSynergyValue();
      if (synergy > 0 && synergy < 11) {
        timeline.addSpellProcAbility(state, 'ESYN1', synergy / 10, true);
      }
      break;
    case 'SH':case 'SR':
      if (_settings.globals.MODE === 'mag') {
        var steelVeng = dom.getSteelVengeanceValue();
        switch (steelVeng) {
          case 12:
            executeProc(state, 'SV12', mod * 0.30, 'steelveng');
            break;
          case 11:
            executeProc(state, 'SV11', mod * 0.25, 'steelveng');
            break;
          case 10:
            executeProc(state, 'SV10', mod * 0.25, 'steelveng');
            break;
        }
      }
      break;
    case 'SJ':
      timeline.addSpellProcAbility(state, 'VFX', 1, true);

      synergy = dom.getEvokersSynergyValue();
      if (synergy > 0 && synergy < 11) {
        timeline.addSpellProcAbility(state, 'WSYN1', synergy / 10, true);
      } else if (synergy === 11) {
        timeline.addSpellProcAbility(state, 'WSYN2', 1, true);
      }

      break;
    case 'RS':
      synergy = dom.getConjurersSynergyValue();
      if (synergy > 0 && synergy < 11) {
        timeline.addSpellProcAbility(state, 'MSYN1', synergy / 10, true);
      } else if (synergy === 11) {
        timeline.addSpellProcAbility(state, 'MSYN2', 1, true);
      }

      var keys = utils.getCounterKeys('RS');
      if (state[keys.timers] === undefined) {
        state[keys.timers] = [];
      }

      state[keys.counter] = 1 + (state[keys.counter] || 0);
      state[keys.timers].push(utils.createTimer(state.workingTime + dom.getRemorselessServantTTLValue(), function (value) {
        return value - 1;
      }));

      stats.updateSpellStatistics(state, 'rsDPS', dom.getRemorselessServantDPSValue() * state[keys.counter]);
      stats.updateSpellStatistics(state, keys.counter, state[keys.counter]);

      var petTime = dom.getRemorselessServantTTLValue() / 1000;
      petTime = petTime > state.timeLeft ? state.timeLeft : petTime;

      var est1PetDmg = dmgU.trunc(dom.getRemorselessServantDPSValue() * petTime);
      stats.addSpellStatistics(state, 'est1PetDmg', est1PetDmg);
      stats.addSpellStatistics(state, 'totalDmg', est1PetDmg);

      //state.dotGenerator = genDamageOverTime(state, dmgU.getRSDPS, 6000, 'totalAvgPetDmg');
      break;
    case 'RU':
      if (_settings.globals.MODE === 'mag') {
        // proc adds debuf that prevents another proc for 12 seconds (unless we're a twincast then increase proc chance)
        if (!state.lastRUProc || state.workingTime === state.lastRUProc || state.workingTime - state.lastRUProc >= 12000) {
          var rate = state.workingTime !== state.lastRUProc ? 0.12 : 0.1056; // 88% chance of not procing x 12%
          executeProc(state, 'RD', mod * rate, 'repudiatedest');
          state.lastRUProc = state.workingTime;
        }
      }
      break;
    case 'FBC':
      if (dom.getAllianceFulminationValue() > 0) {
        state[utils.getCounterKeys('FBC').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      }
      break;
    case 'FB':
      state.fbSpells = mod + (state.fbSpells || 0);

      if (_settings.globals.MODE === 'wiz' && state.fbSpells >= dmgU.FBSINGE_PROC_RATE) {
        timeline.addSpellProcAbility(state, 'FBSINGE' + utils.getRank(), 1, true);
        state.fbSpells = state.fbSpells - dmgU.FBSINGE_PROC_RATE;
      }

      break;
    case 'SFB':
      state[utils.getCounterKeys('FBO').counter] = abilities.get('FBO').charges;
      break;
    case 'EC':
      // Brand is really just Skyfire
      var origSpell = spell;
      state.spell = utils.getSpellData('EB');
      execute(state);
      state.spell = origSpell;

      // Only add one fuse proc since Fuse itself doesn't twincast (the way im implementing it)
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList('EC'), 'fuseProcDmg');
      break;
    case 'WS':case 'WE':
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList(spell.id), state.inTwincast ? 'tcAvgDmg' : dmgKey);
      break;
  }
}

function applyPreSpellChecks(state, mod) {
  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch (state.spell.id) {
    case 'CS':case 'CI':case 'CG':
      if (!state.cfSpellProcGenerator) {
        // Mage Chaotic Fire seems to twinproc its chaotic fire chance
        // so increase the counter by that amount
        var offset = _settings.globals.MODE === 'mag' ? dom.getTwinprocAAValue() : 0.0;
        state.cfSpellProcGenerator = genSpellProc(dmgU.CLAW_SPELL_PROC_RATES[_settings.globals.MODE][state.spell.id], offset);
      }
      break;
    case 'FC':
      if (_settings.globals.MODE === 'mag') {
        if (!state.fcSpellProcGenerator) {
          // AA modifies the proc chance
          var _offset = 0;
          switch (dom.getFlamesOfPowerValue()) {
            case 1:
              _offset = 0.27;break;
            case 2:
              _offset = 0.30;break;
            case 3:case 4:
              _offset = 0.34;break;
          }
          state.fcSpellProcGenerator = genSpellProc(dmgU.FC_SPELL_PROC_RATES, _offset);
        }
      }
      break;
    case 'SC':
      if (_settings.globals.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSCDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'SP':
      if (_settings.globals.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSPDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'SH':case 'SR':
      if (_settings.globals.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSHDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'TW':
      if (_settings.globals.MODE === 'wiz') {
        if (!state.twSpellProcGenerator) {
          state.twSpellProcGenerator = genSpellProc(dmgU.TW_SPELL_PROC_RATES);
        }
      }
      break;
    case 'VM':
      var baseDmg = state.spell['baseDmg' + dom.getVolleyOfManyCountValue()];
      state.spell.baseDmg = baseDmg || state.spell.baseDmg;
      break;
  }
}

// Using Beimeth's post as a starting point for a lot of this
// http://elitegamerslounge.com/home/eqwizards/viewtopic.php?f=22&t=26
function calcAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  // mod takes a percentage of results and counters if set
  mod = mod === undefined ? 1 : mod;

  // average damage
  var avgDmg = 0;

  // dots spread out modifiers over the default tick duration
  var dotMod = 1;
  if (state.spell.duration > 0) {
    dotMod = state.spell.ticks + 1;
  }

  // get SPA info
  var spaValues = dmgU.computeSPAs(state, mod, dotMod).spaValues;

  if (state.spell.baseDmg > 0) {
    // Get Crit Dmg Multiplyer -- maybe keep this first since FD/AD counters modified in crit rate
    var critDmgMult = dmgU.getBaseCritDmg() + spaValues.addCritDmg;

    // Get Crit Rate
    var critRate = dmgU.getBaseCritRate() + spaValues.addCritRate;
    // Check for spells with max crit rate
    critRate = state.spell.maxCritRate != undefined && critRate > state.spell.maxCritRate ? state.spell.maxCritRate : critRate;
    // Check for spells with min crit rate
    critRate = state.spell.minCritRate != undefined && state.spell.minCritRate > critRate ? state.spell.minCritRate : critRate;
    // Check if we've gone over 100%
    critRate = critRate > 1.0 ? 1.0 : critRate;

    // Get Spell Damage
    var spellDmg = calcSpellDamage(state);
    // Get Effectiveness
    var effectiveness = dmgU.round(getEffectiveness(state, spaValues) + dom.getAddEffectivenessValue());
    // Get Before Crit Focus
    var beforeCritFocus = dmgU.round(getBeforeCritFocus(state, spaValues) + dom.getAddBeforeCritFocusValue());
    // Get Before Crit Add -- type3 dmg is SPA 303, should move to computeSPA eventually --
    var beforeCritAdd = dmgU.trunc(dom.getType3DmdAugValue(state.spell) / dotMod) + spaValues.beforeCritAdd + dom.getAddBeforeCritAddValue();
    // Get Before DoT Crit Focus
    var beforeDoTCritFocus = dmgU.round(spaValues.beforeDoTCritFocus + dom.getAddBeforeDoTCritFocusValue());
    // Get After Crit Focus
    var afterCritFocus = dmgU.round((spaValues.afterCritFocus || 0) + dom.getAddAfterCritFocusValue()); // or 0 since non defined atm
    // Get After Crit Add
    var afterCritAdd = spaValues.afterCritAdd + dom.getAddAfterCritAddValue();
    // Get AfterCrit Add (SPA 484) (not modifiable)
    var afterSPA461Add = spaValues.afterSPA461Add + dom.getAddAfterSPA461AddValue();
    // Get AfterCrit Focus (not modifiable)
    var afterSPA461Focus = dmgU.round(spaValues.afterSPA461Focus + dom.getAddAfterSPA461FocusValue());
    // Get New SPA 461 Focus
    var spa461Focus = dmgU.round(spaValues.spa461Focus + dom.getAddSPA461FocusValue());
    // Get New semi-broken SPA 483 Focus
    var spa483Focus = spaValues.spa483Focus;

    // effective damage
    var effDmg = state.spell.baseDmg + dmgU.trunc(state.spell.baseDmg * effectiveness);
    // SPAs that are included in a crit
    var beforeCritDmg = effDmg + dmgU.trunc(effDmg * beforeCritFocus) + beforeCritAdd + spellDmg;
    // SPAs that are included when a dot crits (none implemented for wizard)
    var beforeDoTCritDmg = dmgU.trunc(effDmg * beforeDoTCritFocus);
    // damage to appended after crits have been calculated but before SPA 461
    var afterCritDmg = dmgU.trunc(effDmg * afterCritFocus) + afterCritAdd / dotMod;

    // luck
    var luckyRate = dom.getLuckValue() > 0 ? 0.45 : 0;
    luckyRate = dom.getLuckValue() >= 10 ? 0.50 : luckyRate; // From devs and parses its around 0.50 >= 10
    var luckyCritDmgMult = critDmgMult + (dom.getLuckValue() > 0 ? 0.075 + parseInt(dom.getLuckValue() / 10) * 0.05 : 0);

    var avgBaseDmg = beforeCritDmg + beforeDoTCritDmg + afterCritDmg;
    var avgCritDmg = avgBaseDmg + Math.round(beforeCritDmg * critDmgMult);
    var avgLuckyCritDmg = avgBaseDmg + Math.round(beforeCritDmg * luckyCritDmgMult);

    // damage to append after SPA 461
    // need to add 483 separate or damage is off by 1 plus its the messed up SPA so it's 
    // probably calculated on its own
    var afterSPA461Dmg = Math.round(effDmg * afterSPA461Focus) + afterSPA461Add + Math.round(effDmg * spa483Focus);

    // add SPA 461
    avgBaseDmg += dmgU.trunc(avgBaseDmg * spa461Focus) + afterSPA461Dmg;
    avgCritDmg += dmgU.trunc(avgCritDmg * spa461Focus) + afterSPA461Dmg;
    avgLuckyCritDmg += dmgU.trunc(avgLuckyCritDmg * spa461Focus) + afterSPA461Dmg;

    // adjust for luck
    avgCritDmg = (1 - luckyRate) * avgCritDmg + luckyRate * avgLuckyCritDmg;

    // find average damage overall before additional twincasts
    avgDmg = avgBaseDmg * (1.0 - critRate) + avgCritDmg * critRate;

    // apply mod
    avgDmg = dmgU.trunc(avgDmg * mod);

    // update stats for main damage spells
    if (dmgU.isCastDetSpellOrAbility(state.spell)) {
      // save total crit rate including from twincats and procs plus associated count
      stats.addAggregateStatistics('critRate', critRate * mod);
      stats.addAggregateStatistics('spellCount', mod);

      // update core stats in main spell cast
      stats.updateSpellStatistics(state, 'critRate', critRate);
      stats.updateSpellStatistics(state, 'luckyCritRate', critRate * luckyRate);
      stats.updateSpellStatistics(state, 'critDmgMult', critDmgMult);
      stats.updateSpellStatistics(state, 'luckyCritDmgMult', luckyCritDmgMult);
      stats.updateSpellStatistics(state, 'spellDmg', spellDmg);
      stats.updateSpellStatistics(state, 'effectiveness', effectiveness);
      stats.updateSpellStatistics(state, 'beforeCritFocus', beforeCritFocus);
      stats.updateSpellStatistics(state, 'beforeCritAdd', beforeCritAdd);
      stats.updateSpellStatistics(state, 'beforeDoTCritFocus', beforeDoTCritFocus);
      stats.updateSpellStatistics(state, 'afterCritFocus', afterCritFocus);
      stats.updateSpellStatistics(state, 'afterCritAdd', afterCritAdd);
      stats.updateSpellStatistics(state, 'spa461Focus', spa461Focus);
      stats.updateSpellStatistics(state, 'afterSPA461Focus', afterSPA461Focus + spa483Focus);
      stats.updateSpellStatistics(state, 'afterSPA461Add', afterSPA461Add);
      stats.updateSpellStatistics(state, 'avgBaseDmg', avgBaseDmg);
      stats.updateSpellStatistics(state, 'avgCritDmg', avgCritDmg);
      stats.updateSpellStatistics(state, 'avgLuckyCritDmg', avgLuckyCritDmg);

      if (!state.aeWave && critRate > 0) {
        // dont want Frostbound Fulmination showing up as 0
        // Update graph
        state.updatedCritRValues.push({ time: state.timeEst, y: Math.round(critRate * 100) });
        state.updatedCritDValues.push({ time: state.timeEst, y: Math.round(critDmgMult * 100) });
      }
    }

    // Handle AE waves if current spell is an AE
    if (['TargetAE', 'FrontalAE', 'CasterPB', 'TargetRingAE'].find(function (id) {
      return id === state.spell.target;
    }) && !state.aeWave) {
      addAEWaves(state, mod, avgDmg);
    }

    // update totals
    stats.addSpellStatistics(state, 'totalDmg', avgDmg);

    // save avg damage of main spell
    var avgDmgKey = state.inTwincast ? 'tcAvgDmg' : 'avgDmg';
    if (!dmgKey || state.aeWave) {
      stats.addSpellStatistics(state, avgDmgKey, avgDmg);
    }

    // dont count twincast damage in AE Hits
    if (dmgKey && !(state.aeWave && state.inTwincast)) {
      stats.addSpellStatistics(state, dmgKey, avgDmg);
    }

    // add spell procs last
    if (!state.aeWave) {
      addSpellAndEqpProcs(state, mod);
    }
  }

  return { avgDmg: avgDmg, spaValues: spaValues };
}

function calcAvgMRProcDamage(state, mod, dmgKey) {
  // Mana reciprocation has a chance to proc more procs
  calcAvgProcDamage(state, utils.getSpellData('MR'), mod, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRR'), mod * 0.1, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRR'), mod * 0.01, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRRR'), mod * 0.001, dmgKey);
}

function calcAvgProcDamage(state, proc, mod, dmgKey) {
  // proc damage is based on normal spell damage modified by proc rate and whether or not
  // we're in a twincast
  var procRate = dmgU.getProcRate(state.spell, proc) * mod;
  var prevSpell = state.spell;

  state.spell = proc;
  execute(state, procRate, dmgKey, true);
  state.spell = prevSpell;

  stats.addAggregateStatistics('totalProcs', procRate);
}

function calcCompoundSpellProcDamage(state, mod, spellList, dmgKey) {
  var origSpell = state.spell;
  var inTwincast = state.inTwincast;
  state.inTwincast = false;

  // spells like fuse and wildmagic require casting multiple spells and
  // averaging the results
  $(spellList).each(function (i, item) {
    state.spell = utils.getSpellData(item.id);

    // procs are their own un-twincasted spell but if they were triggered
    // from a twincast of the parent then record the damage there
    execute(state, item.chance * mod, dmgKey);
  });

  state.inTwincast = inTwincast;
  state.spell = origSpell;
}

function calcSpellDamage(state) {
  var spellDmg = 0;
  var spell = state.spell;

  if (_settings.globals.MAX_LEVEL - spell.level < 10) {
    // Mana Burn uses this because AA recast time should be separate from the spell data
    // dicho/fuse needs to use an alternative time since it's really 2 spell casts
    // that get applied differently depending on what we're looking for
    var recastTime = spell.recastTime2 !== undefined ? spell.recastTime2 : spell.recastTime;

    // fix for dicho being a combined proc/spell
    var totalCastTime = (spell.id === 'DF' ? 0 : spell.origCastTime) + (recastTime > spell.lockoutTime ? recastTime : spell.lockoutTime);

    var multiplier = dmgU.getMultiplier(totalCastTime);
    spellDmg = dmgU.trunc(dom.getSpellDamageValue() * multiplier);

    // The ranged augs seem to get stuck at 2x their damage
    if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
      spellDmg = spell.spellDmgCap;
    }
  }

  return spellDmg;
}

function executeProc(state, id, mod, statId) {
  var value = 0;
  var key = statId ? statId : id;
  var keys = utils.getCounterKeys(key);
  var proc = utils.getSpellData(id);
  var partUsed = 1;

  // update counters if it uses them
  var ability = abilities.get(statId);
  if (ability && ability.charges) {
    if (utils.isAbilityActive(state, key)) {
      var chargesPer = statId != 'DR' ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
      var charge = mod * chargesPer;
      partUsed = dmgU.processCounter(state, key, charge);
    } else {
      // inactive
      partUsed = 0;
    }
  }

  if (partUsed > 0 && !(proc.spa497 && state.inTwincast)) {
    // if charges were consumed for abilities that need them
    partUsed = partUsed * mod;
    id != 'MR' ? calcAvgProcDamage(state, proc, partUsed, keys.addDmg) : calcAvgMRProcDamage(state, partUsed, keys.addDmg);
  }

  return partUsed > 0;
}

function genSpellProc(rateInfo, offset) {
  var count, lastProcCounts, incr;
  return _regenerator2.default.wrap(function genSpellProc$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          offset = offset || 0;
          count = 1 + offset;
          lastProcCounts = [];


          if (rateInfo) {
            (0, _keys2.default)(rateInfo).forEach(function (key) {
              lastProcCounts.push({ id: key, count: rateInfo[key] });
            });
          }

        case 4:
          if (false) {
            _context.next = 11;
            break;
          }

          _context.next = 7;
          return lastProcCounts.filter(function (item) {
            if (count >= item.count) {
              item.count += rateInfo[item.id];
              return true;
            } else {
              return false;
            }
          }).map(function (item) {
            return item.id;
          });

        case 7:
          incr = _context.sent;


          count += incr + offset * incr;
          _context.next = 4;
          break;

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function genDamageOverTime(state, fDps, interval, statLabel) {
  var current, total, reportTime, end, time, value;
  return _regenerator2.default.wrap(function genDamageOverTime$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          current = state.workingTime;
          total = 0;
          reportTime = 0;
          end = false;

        case 4:
          if (false) {
            _context2.next = 16;
            break;
          }

          time = state.workingTime - current;

          current = state.workingTime;

          // accumulate results until interval (typically 1 tick) is reached
          total += fDps(state) * (time / 1000);

          value = 0;

          reportTime += time;

          if (reportTime >= interval || end) {
            // report if almost out of time
            value = total;
            total = 0;
            reportTime -= interval;

            if (statLabel) {
              stats.addAggregateStatistics(statLabel, value);
            }
          }

          _context2.next = 13;
          return dmgU.trunc(value);

        case 13:
          end = _context2.sent;
          _context2.next = 4;
          break;

        case 16:
          return _context2.abrupt('return', 0);

        case 17:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

function getBeforeCritFocus(state, spaValues) {
  var spell = state.spell;
  var beforeCritFocus = spaValues.beforeCritFocus;

  // Before Crit Focus AA (SPA 302) only for some spells
  if (['ET', 'SJ', 'CG', 'CS'].find(function (id) {
    return id === spell.id;
  })) {
    beforeCritFocus = beforeCritFocus + dom.getSpellFocusAAValue(spell.id);
  }

  return beforeCritFocus;
}

function getEffectiveness(state, spaValues) {
  var spell = state.spell;
  var effectiveness = spaValues.effectiveness;

  // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
  if (!['ET', 'SJ', 'CG', 'CS'].find(function (id) {
    return id === spell.id;
  })) {
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
}

function getTwincastRate(state, spaValues) {
  var rate = spaValues.twincast;

  if (dom.getAddTwincastValue() >= 0) {
    rate += dmgU.checkSingleEffectLimit(state.spell, 'TC') ? dom.getAddTwincastValue() : 0;
  }

  rate = rate > 1.0 ? 1.0 : rate;

  // prevent from procs from setting the stat for everything
  if (rate && dmgU.isCastDetSpellOrAbility(state.spell)) {
    stats.updateSpellStatistics(state, 'twincastRate', rate);
  }

  return rate;
}

function execute(state, mod, dmgKey, isProc) {
  // Default to full strength
  mod = mod === undefined ? 1 : mod;

  // add any pre spell cast checks
  applyPreSpellChecks(state, mod);
  // avg damage for one spell cast
  var result = calcAvgDamage(state, mod, dmgKey);
  // add any post spell procs/mods before we're ready to
  // twincast another spell
  applyPostSpellEffects(state, mod, dmgKey);

  // get twincast rate
  var twincastRate = getTwincastRate(state, result.spaValues);

  // now twincast the spell
  if (twincastRate > 0 && !state.aeWave) {
    state.inTwincast = true;

    // add any pre spell cast checks required
    var tcMod = mod * twincastRate;
    applyPreSpellChecks(state, tcMod);
    calcAvgDamage(state, tcMod, dmgKey);
    // handle post checks
    applyPostSpellEffects(state, tcMod, dmgKey);

    state.inTwincast = false;

    if (isProc) {
      // keep stats for proc twincast
      stats.addAggregateStatistics('totalProcs', tcMod);
    }
  }

  return stats.getSpellStatistics(state, 'totalDmg') || 0; // Alliance
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 457 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(458);


/***/ }),
/* 458 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(459);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 459 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ })
],[192]);