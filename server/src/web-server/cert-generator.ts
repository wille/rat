const debug = require('debug')('server:http');

import * as forge from 'node-forge';
import * as os from 'os';

const generateCert = () => {
  const bits = 2048;

  debug(`generating rsa${bits} keypair`);
  const keys = forge.pki.rsa.generateKeyPair();

  debug('generating certificate');
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();

  const options = { attrs: {} };

  const attrs = [
    { name: 'commonName', value: 'hostname' },
    { name: 'countryName', value: 'US' },
    {
      name: 'stateOrProvinceName',
      value: 'Georgia',
    },
    { name: 'localityName', value: 'Atlanta' },
    { name: 'organizationName', value: 'None' },
    { shortName: 'OU', value: 'example' },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([
    { name: 'basicConstraints', cA: true },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true,
    },
    {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true,
    },
    { name: 'subjectKeyIdentifier' },
    {
      name: 'subjectAltName',
      altNames: [],
    },
  ]);

  cert.sign(keys.privateKey, null);
  debug('cert generated');

  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };
};

export default generateCert;
