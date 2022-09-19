function checkFloat(value, prefix, check) {
  if (typeof(value) == 'string' && value ==='') {
    return prefix + ' 입력 필수'
  }

  let v;

  if (typeof(value) == 'string')
  {
    v = parseFloat(value);
    if(isNaN(v)) {
      return prefix + ' 값이 잘못됨'
    }
  }
  else
  {
    v = value;
  }

  let r = check(v);
  if(typeof(r) == 'string')
  {
    return r;
  }

  return true;
}

module.exports = checkFloat;