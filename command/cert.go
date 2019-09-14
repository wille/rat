package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"math/big"
	"net"
	"os"
	"rat/command/log"
	"time"
)

// CertExists checks if a certificate has been generated and saved to disk
func CertExists() bool {
	_, err := os.Stat("cert.pem")

	if os.IsNotExist(err) {
		return false
	}

	_, err = os.Stat("private.key")

	return !os.IsNotExist(err)
}

// GenerateCertificate for the TLS
func GenerateCertificate(hosts ...string) error {
	// generate 1024 bit RSA (for speed)
	priv, err := rsa.GenerateKey(rand.Reader, 1024)

	if err != nil {
		return err
	}

	validFrom := 365 * 24 * time.Hour
	notBefore := time.Now()
	notAfter := notBefore.Add(validFrom)

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		return err
	}

	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject:      pkix.Name{},
		NotBefore:    notBefore,
		NotAfter:     notAfter,

		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	for _, h := range hosts {
		if ip := net.ParseIP(h); ip != nil {
			template.IPAddresses = append(template.IPAddresses, ip)
		} else {
			template.DNSNames = append(template.DNSNames, h)
		}
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &priv.PublicKey, priv)
	if err != nil {
		return err
	}

	certOut, err := os.Create("cert.pem")
	defer certOut.Close()
	if err != nil {
		log.Println("failed to open cert.pem for writing", err)
	}

	pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes})

	keyOut, err := os.OpenFile("private.key", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0600)
	defer keyOut.Close()
	if err != nil {
		return err
	}

	pem.Encode(keyOut, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(priv)})

	return nil
}
