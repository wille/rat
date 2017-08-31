package crypto

import (
	"bytes"
	"crypto/rand"
	"testing"
)

func TestCrypto(t *testing.T) {
	key := GenerateKey()
	iv := GenerateIv()

	plaintext := make([]byte, 1024)
	rand.Read(plaintext)

	ciphertext := Encrypt(plaintext, key, iv)

	decrypted := Decrypt(ciphertext, key, iv)

	if !bytes.Equal(plaintext, decrypted) {
		t.Error("plaintext does not match decrypted data")
	}
}
