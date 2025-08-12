const SPECIAL_TOKENS = {
    " ": 1,
    "!": 2,
    "@": 3,
    "#": 4,
    "$": 5,
    "%": 6,
    "^": 7,
    "&": 8,
    "*": 9,
    "(": 10,
    ")": 11,
    "_": 12,
    "-": 13,
    "+": 14,
    "=": 15,
    "<": 16,
    ">": 17,
    "/": 18,
    ":": 19,
    ";": 20,
    ",": 21,
    ".": 22,
    "?": 23,
    "'": 24,
    "\"": 25,
    UNKNOWN: 50,
  };
 
  const reverseSpecialTokens = Object.fromEntries(
    Object.entries(SPECIAL_TOKENS).filter(([k]) => k.length === 1).map(([k, v]) => [v, k])
  );
  
  const predefinedVocab = {
    is: 300,
    are: 301,
    was: 302,
    were: 303,
    the: 304,
    a: 305,
    an: 306,
    i: 307,
    you: 308,
    he: 309,
    she: 310,
    it: 311,
    we: 312,
    they: 313,
    have: 314,
    has: 315,
    do: 316,
    did: 317,
    done: 318,
    be: 319,
    am: 320,
    been: 321,
    will: 322,
    would: 323,
    can: 324,
    could: 325,
    should: 326,
    must: 327,
    this: 328,
    that: 329,
    these: 330,
    those: 331,
    not: 332,
    no: 333,
    yes: 334,
    my: 335,
    your: 336,
    his: 337,
    her: 338,
    its: 339,
    our: 340,
    their: 341,
  };
 
  const CHARACTER_TOKEN_BASE = 400; 
  const POSITION_SPREAD = 100;
  const UPPERCASE_OFFSET = 50; 
  
  function encodeChar(char, position) {
    let base;
  
    if (char >= 'a' && char <= 'z') {
      base = char.charCodeAt(0) - 96;
    } else if (char >= 'A' && char <= 'Z') {
      base = (char.charCodeAt(0) - 64) + UPPERCASE_OFFSET;
    } else if (char >= '0' && char <= '9') {
      base = 27 + (char.charCodeAt(0) - 48);
    } else {
      return SPECIAL_TOKENS.UNKNOWN + position * POSITION_SPREAD;
    }
  
    return CHARACTER_TOKEN_BASE + position * POSITION_SPREAD + base;
  }
  
  function decodeChar(token) {
    const relative = token - CHARACTER_TOKEN_BASE;
    const position = Math.floor(relative / POSITION_SPREAD);
    const base = relative % POSITION_SPREAD;
  
    if (base >= 1 && base <= 26) {
      return { char: String.fromCharCode(base + 96), position };
    } else if (base >= 27 && base <= 36) {
      return { char: String.fromCharCode(base - 27 + 48), position };
    } else if (base >= (1 + UPPERCASE_OFFSET) && base <= (26 + UPPERCASE_OFFSET)) {
      const upperIndex = base - UPPERCASE_OFFSET;
      return { char: String.fromCharCode(upperIndex + 64), position };
    } else {
      return { char: '?', position };
    }
  }
  
  function encode(sentence) {
    const tokens = [];
    let position = 0;
    let i = 0;
  
    while (i < sentence.length) {
      const char = sentence[i];
  
      if (SPECIAL_TOKENS[char]) {
        tokens.push(SPECIAL_TOKENS[char]);
        i++;
        position++;
        continue;
      }
  
      let matched = false;
      for (const word of Object.keys(predefinedVocab).sort((a, b) => b.length - a.length)) {
        if (sentence.slice(i, i + word.length) === word) {
          tokens.push(predefinedVocab[word]);
          i += word.length;
          position++;
          matched = true;
          break;
        }
      }
  
      if (!matched) {
        const token = encodeChar(char, position);
        tokens.push(token);
        i++;
        position++;
      }
    }
  
    return tokens;
  }
  
  function decode(tokens) {
    let sentence = '';
  
    for (const token of tokens) {
      if (Object.values(SPECIAL_TOKENS).includes(token)) {
        sentence += reverseSpecialTokens[token] || '?';
      } else if (Object.values(predefinedVocab).includes(token)) {
        const word = Object.keys(predefinedVocab).find(w => predefinedVocab[w] === token);
        sentence += word;
      } else if (token >= CHARACTER_TOKEN_BASE) {
        const { char } = decodeChar(token);
        sentence += char;
      } else {
        sentence += '?';
      }
    }
  
    return sentence;
  }
  