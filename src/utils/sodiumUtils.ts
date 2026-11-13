import sodium from "libsodium-wrappers-sumo";

await sodium.ready;

export const generateRSAKeys = () => {
  return sodium.crypto_box_keypair();
};

const key = sodium.crypto_generichash(
  sodium.crypto_secretbox_KEYBYTES,
  sodium.from_string(process.env.SECRET_LIBSODIUM!),
  null,
);

export const hashString = async (password: string) => {
  return sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  );
};

export const verifyPassword = (storedHash: string, password: string) => {
  if (storedHash.startsWith("$argon2")) {
    return sodium.crypto_pwhash_str_verify(storedHash, password);
  }
  return storedHash === sodium.to_hex(
    sodium.crypto_generichash(
      sodium.crypto_generichash_BYTES,
      sodium.from_string(password),
      sodium.from_string(process.env.SECRET_LIBSODIUM!),
    ),
  );
};

export const encrypt = (password: string) => {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  const encryptedPassword = sodium.crypto_secretbox_easy(
    sodium.from_string(password),
    nonce,
    key,
  );
  const combined = new Uint8Array(nonce.length + encryptedPassword.length);
  combined.set(nonce, 0);
  combined.set(encryptedPassword, nonce.length);
  return sodium.to_base64(combined);
};

export const decrypt = (encryptedPassword: string) => {
  const combined = sodium.from_base64(encryptedPassword);
  const nonce = combined.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const encryptedPass = combined.slice(sodium.crypto_secretbox_NONCEBYTES);
  const plainPass = sodium.crypto_secretbox_open_easy(
    encryptedPass,
    nonce,
    key,
  );
  return sodium.to_string(plainPass);
};
