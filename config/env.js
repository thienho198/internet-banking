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

module.exports = {
  BANK_PRIVATE_KEY,
  PASSPHRASE,
  BANK_PUBLIC_KEY,
  RGP_PUBLICKEY,
};
