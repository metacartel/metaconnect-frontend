/**
 * @desc debounce api request
 * @param  {Function}  request
 * @param  {Array}     params
 * @param  {Number}    timeout
 * @return {Promise}
 */
export const debounceRequest = (request, params, timeout) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () =>
        request(...params)
          .then(res => {
            resolve(res);
          })
          .catch(err => reject(err)),
      timeout
    )
  );

/**
 * @desc capitalize string
 * @param  {String} [string]
 * @return {String}
 */
export const capitalize = string =>
  string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * @desc ellipse text to max maxLength
 * @param  {String}  [text = '']
 * @param  {Number}  [maxLength = 9999]
 * @return {String}
 */
export const ellipseText = (text = "", maxLength = 9999) => {
  if (text.length <= maxLength) return text;
  const _maxLength = maxLength - 3;
  let ellipse = false;
  let currentLength = 0;
  const result =
    text
      .split(" ")
      .filter(word => {
        currentLength += word.length;
        if (ellipse || currentLength >= _maxLength) {
          ellipse = true;
          return false;
        } else {
          return true;
        }
      })
      .join(" ") + "...";
  return result;
};

/**
 * @desc ellipse public address
 * @param  {String}  [address = '']
 * @return {String}
 */
export const ellipseAddress = (address = "") =>
  `${address.slice(0, 10)}...${address.slice(-10)}`;

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
export const padLeft = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc sanitize hexadecimal string
 * @param  {String} address
 * @return {String}
 */
export const sanitizeHex = hex => {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") return "";
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
};

/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */
export const removeHexPrefix = hex => hex.toLowerCase().replace("0x", "");

/**
 * @desc get ethereum contract call data string
 * @param  {String} func
 * @param  {Array}  arrVals
 * @return {String}
 */
export const getDataString = (func, arrVals) => {
  let val = "";
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64);
  const data = func + val;
  return data;
};

/**
 * @desc format social media handles
 * @param  {String}  input
 * @return {String}
 */
export const formatHandle = input => {
  if (!input || !input.trim().length) return "";
  const handle = !!input ? "@" + input.replace(/[\s@]/gi, "") : "";
  return handle;
};

/**
 * @desc clean social media handles
 * @param  {String}  input
 * @return {String}
 */
export const cleanHandle = input => {
  const handle = input.replace(/@/gi, "");
  return handle;
};

/**
 * @desc parse url query string params
 * @param  {String}  queryString
 * @return {Object}
 */
export function parseQueryParams(queryString) {
  if (!queryString) return {};

  let parameters = {};

  let pairs = (queryString[0] === "?"
    ? queryString.substr(1)
    : queryString
  ).split("&");

  for (let i = 0; i < pairs.length; i++) {
    const key = pairs[i].match(/\w+(?==)/i)
      ? pairs[i].match(/\w+(?==)/i)[0]
      : null;
    const value = pairs[i].match(/=.+/i)
      ? pairs[i].match(/=.+/i)[0].substr(1)
      : "";
    if (key) {
      parameters[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }
  return parameters;
}

/**
 * @desc generate new meta connection
 * @param  {Object}  {name}
 * @return {Object}
 */
export function generateNewMetaConnection({ peer, name, socialMedia }) {
  if (!peer || typeof peer !== "string") {
    throw new Error("ERROR: MetaConnection peer is missing or invalid");
  }
  if (!name || typeof name !== "string") {
    throw new Error("ERROR: MetaConnection name is missing or invalid");
  }
  if (!socialMedia || typeof socialMedia !== "object") {
    throw new Error("ERROR: MetaConnection socialMedia is missing or invalid");
  }
  return {
    peer: peer,
    request: true,
    name: name,
    socialMedia: socialMedia
  };
}

/**
 * @desc handle meta connection uri
 * @param  {String}  {string}
 * @return {String|Null}
 */
export function handleMetaConnectionURI(string) {
  let result = null;
  const pathEnd = string.indexOf("?") !== -1 ? string.indexOf("?") : undefined;
  const queryString =
    typeof pathEnd !== "undefined" ? string.substring(pathEnd) : "";
  let queryParams = parseQueryParams(queryString);
  if (Object.keys(queryParams).length) {
    const peer = queryParams.id;
    const name = decodeURIComponent(queryParams.name);
    const socialMedia = JSON.parse(decodeURIComponent(queryParams.socialMedia));
    result = generateNewMetaConnection({ peer, name, socialMedia });
  }
  return result;
}
