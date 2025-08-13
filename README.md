### [Custom Tokenizer](https://custom-tokenizer-chaicode.vercel.app/)

A web app that encodes text into integer tokens and decodes token sequences back to text using a simple, custom scheme.

---

### Features
- **Encode text**: Converts input text into a comma‑separated list of integer tokens.
- **Decode tokens**: Converts a comma‑separated list of integers back to text.
---


### Usage notes
- **Encoding** expects plain text in the input field.
- **Decoding** expects integers separated by commas, e.g. `304, 1, 300`.
- Whitespace and punctuation have fixed token IDs (see `SPECIAL_TOKENS`).
- Common words (e.g., `the`, `is`, `you`) map to predefined IDs (see `predefinedVocab`).
- Letters and digits use positional character tokens, enabling simple reconstruction.
- Unknown or unsupported characters decode to `?`.
- **Case-sensitive**: `A` and `a` are different; vocabulary matches are exact-case. Uppercase letters use a distinct range.

---

### Project structure
```
  ├─ index.html   # UI markup and button handlers (Encode/Decode/Clear)
  ├─ script.js    # Tokenization/Detokenization logic (encode/decode)
  └─ styles.css   # Minimal dark theme styling
```

---

### Customizing
- Add or change punctuation tokens in `SPECIAL_TOKENS` (in `script.js`).
- Extend `predefinedVocab` with more words → IDs.
- Adjust `CHARACTER_TOKEN_BASE` / `POSITION_SPREAD` to change the character token space.

---


## 🧪 Example

**Input:**
cat is mat

**Encoded:**
```text
[403, 305, 620, 1, 300, 1, 1013, 305, 1220]
```

**Decoded:**
```text
cat is mat
```

✅ Match: Yes

---

## 🛠️ How It Works

### 1) Special tokens
Certain symbols and whitespace are assigned fixed token IDs and do not depend on position.

```js
const SPECIAL_TOKENS = {
  " ": 1,
  "!": 2,
  "@": 3,
  "#": 4,
  // ...
};
```

### 2) Predefined vocabulary
Frequent words are mapped to fixed IDs to avoid per‑character encoding.

```js
const predefinedVocab = {
  is: 300,
  the: 304,
  you: 308,
  // ...
};
```

### 3) Character‑level encoding
If no special token or predefined word matches, each character is encoded based on:
- Its type: lowercase (a–z) → 1–26
- Its position in the sentence (0‑indexed, position increments per token)

Formula:
```text
token = CHARACTER_TOKEN_BASE + (position * POSITION_SPREAD) + characterCode
```
Where `CHARACTER_TOKEN_BASE = 400`, `POSITION_SPREAD = 100`, and `UPPERCASE_OFFSET = 50`.

Examples:
- 'c' at position 0 → `400 + (0*100) + 3 = 403`
- 't' at position 2 → `400 + (2*100) + 20 = 620`
- 'C' at position 0 → `400 + (0*100) + (3 + 50) = 453`

### 4) Decoding
In order:
- If token is a special token → append symbol
- Else if token is a predefined word → append word
- Else if token ≥ `CHARACTER_TOKEN_BASE` → recover character from the formula
- Otherwise → append `?` (unknown)







