const BANK_PRIVATE_KEY =
  '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
  'Version: OpenPGP.js v4.10.4\n' +
  'Comment: https://openpgpjs.org\n' +
  '\n' +
  'xYYEXucvbRYJKwYBBAHaRw8BAQdAhluyWUyT/6WtxLpAKmOyAUsUWb6F3S9H\n' +
  'TJxIpxComTD+CQMIaNNkYuuSFk/gOa13n26q3nimJXR34BfaUzXvMES1RKqT\n' +
  'fxulM0oIXCoOAmFQvMzKXL1m0elKwSqU7K7Qv5SEYZ86mbZhdWusApDvGKD1\n' +
  'fM0eRGF0IDxOZ3V5ZW5UaGFuaERhdEBnbWFpbC5jb20+wngEEBYKACAFAl7n\n' +
  'L20GCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAKCRDvSgTa6mGJD7ojAP98\n' +
  'miG68qV6va4DaBfTFMCHlWHoa66RveJHt5rCBdNBhQD/Vp0YSwcUamqgAK6H\n' +
  'awFHlNuYJbPGNBDbQWWQTcoW6wnHiwRe5y9tEgorBgEEAZdVAQUBAQdAcKlK\n' +
  '/J7a2bNGlm1LIZHOIE2aUh0CfcxzxDELerEBbWIDAQgH/gkDCLZhbLtETVIc\n' +
  '4PPOphd2Q9LKERlt+7GV5f4ZOzyrsVAHWcAI2N9ClbPEQjxYCV5o42tlnvf9\n' +
  'Rs19Um0eJnDe3c1SvFGB1hrF9sOZk33Qxh/CYQQYFggACQUCXucvbQIbDAAK\n' +
  'CRDvSgTa6mGJD5uEAQDwkZyYcjJc23J79cV8lZ5HGgrUIVVU46abUahTqW7/\n' +
  'UAEAkbbHphDamAX0IkarKic0cWt6VzGkFTDnzEnfzwos8Qk=\n' +
  '=tQq3\n' +
  '-----END PGP PRIVATE KEY BLOCK-----';

const PASSPHRASE = '123456';

const BANK_PUBLIC_KEY =
  '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
  'Version: OpenPGP.js v4.10.4\n' +
  'Comment: https://openpgpjs.org\n' +
  '\n' +
  'xjMEXucvbRYJKwYBBAHaRw8BAQdAhluyWUyT/6WtxLpAKmOyAUsUWb6F3S9H\n' +
  'TJxIpxComTDNHkRhdCA8Tmd1eWVuVGhhbmhEYXRAZ21haWwuY29tPsJ4BBAW\n' +
  'CgAgBQJe5y9tBgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEACgkQ70oE2uph\n' +
  'iQ+6IwD/fJohuvKler2uA2gX0xTAh5Vh6Guukb3iR7eawgXTQYUA/1adGEsH\n' +
  'FGpqoACuh2sBR5TbmCWzxjQQ20FlkE3KFusJzjgEXucvbRIKKwYBBAGXVQEF\n' +
  'AQEHQHCpSvye2tmzRpZtSyGRziBNmlIdAn3Mc8QxC3qxAW1iAwEIB8JhBBgW\n' +
  'CAAJBQJe5y9tAhsMAAoJEO9KBNrqYYkPm4QBAPCRnJhyMlzbcnv1xXyVnkca\n' +
  'CtQhVVTjpptRqFOpbv9QAQCRtsemENqYBfQiRqsqJzRxa3pXMaQVMOfMSd/P\n' +
  'CizxCQ==\n' +
  '=TPYo\n' +
  '-----END PGP PUBLIC KEY BLOCK-----';

const RGP_PUBLICKEY =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTrlHb3adQstaRWJlqtsrIeFo5\n' +
  '7lSpE5FemvbIiBn0gGVMl+SveVm8Zj1JnpLfJngkfnsUgyJp1fLodhgtN581o7Ad\n' +
  'YGUQlx70kWw75WhSMbDAzH5qjpFNSlNNjC8rT5XyCE/YFJ6DuEloJgXoJvRnNXPx\n' +
  'PWj4IelLJ84ZfAWI5QIDAQAB\n' +
  '-----END PUBLIC KEY-----';

const PGP_PUBLIC_KEY =
  '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
  'Version: Keybase OpenPGP v1.0.0\n' +
  'Comment: https://keybase.io/crypto\n' +
  '\n' +
  'xm8EXsQE6RMFK4EEACIDAwSEdRC1RaljC5COiGtQQWuipoEDUbXNPPWdW7qzSIzG\n' +
  'BU79gp5SimoFEzx5g1d1w2oBTCQCWM151Yy1eg/c34ddtOlaMKqMI3TsjYrBFV2E\n' +
  '06gdv3YJxn1lYBB6MBSj/2vNHXRyaSAobm9uZSkgPHRyaTEyM0BnbWFpbC5jb20+\n' +
  'wo8EExMKABcFAl7EBOkCGy8DCwkHAxUKCAIeAQIXgAAKCRA+b9Fdja7cFSJ1AX9k\n' +
  'Cl2wTdYgx29qym1FvIIAeOQfsBK4yBfMWe+/xeyfHLc4j5qA0fv+ikNrSDdPoTYB\n' +
  'gKdoWMkg22ZG7M+Rzfcn5NTBGB4GuoZz2GviVq0oOD0hS5bD9mRuZdBZzb/U3Wkb\n' +
  'O85SBF7EBOkTCCqGSM49AwEHAgMEPGsZxtz/zqkO3k626qQBPdpWwHT/iyRb5NJ+\n' +
  'r3DpZpG4Xmu5G6M97bo8xvhwR5l6KC0wAkHC9wlO+IifD6SDmMLAJwQYEwoADwUC\n' +
  'XsQE6QUJDwmcAAIbLgBqCRA+b9Fdja7cFV8gBBkTCgAGBQJexATpAAoJELkvk8MR\n' +
  'q0hIbrgA/RWEe6tt2EU+KYCTHmcjoMegpwSprChlr4Rhb5Pb4mIdAP9SUusoE/My\n' +
  'lge6LzsJlxzcZbmq05VEY9f/7FXvot01JXnPAX4rXrUImAxSPRZP4mu67U43H89k\n' +
  '+nWttMBWpAUOV9Qbnd78I6l04bi6wXxFw9jLRIsBfRiWN8NW21Ra8xzgeM/FqRHW\n' +
  '1jJvnMRbQ5pgq89Z25U/eY9OZgFArIYzUb7/O7kn2c5SBF7EBOkTCCqGSM49AwEH\n' +
  'AgMEn4cryDH7kE4ClyYdwSeiyqveD7r6OjkWyXK+xsZxdX81r5sY+m0ibbxzU4m8\n' +
  '8BOURtrXbT31/L2CRh6o6LcZO8LAJwQYEwoADwUCXsQE6QUJDwmcAAIbLgBqCRA+\n' +
  'b9Fdja7cFV8gBBkTCgAGBQJexATpAAoJEG98f8D9blbPWr0A/0vwYd0jM8RX9Ehq\n' +
  'F959suxYayau+4IO0wu3WKTH16Y7AQD9/kUNHJwpaGHpycycrP/H5U+iRORY6BSl\n' +
  'nqUL6b+8Hb/JAYC70MN4ljVuMl5UXIAVkE+WHQtjHi8D/2dEwNiKLqkC54GftXEv\n' +
  'k4WDR0g0b2/vgdIBewaqb73Fqbdu/1MXLymZJLU7noi6JF7lsSAuRXvfk8CG+As6\n' +
  '0XX2OryoIeoibWal7w==\n' +
  '=wLGQ\n' +
  '-----END PGP PUBLIC KEY BLOCK-----';

module.exports = {
  BANK_PRIVATE_KEY,
  PASSPHRASE,
  BANK_PUBLIC_KEY,
  RGP_PUBLICKEY,
  PGP_PUBLIC_KEY,
};
