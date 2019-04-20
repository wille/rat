package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
)

const (
	// KeyLength AES key length in bytes
	KeyLength = 32

	// IvLength see aes.BlockSize
	IvLength = aes.BlockSize
)

func gen(len int) []byte {
	b := make([]byte, len)
	rand.Read(b)
	return b
}

// GenerateKey returns a random key
func GenerateKey() []byte {
	return gen(KeyLength)
}

// GenerateIv returns a random IV
func GenerateIv() []byte {
	return gen(IvLength)
}

// Encrypt data
func Encrypt(data, key, iv []byte) []byte {
	block, _ := aes.NewCipher(key)
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(data, data)
	return data
}

// Decrypt data
func Decrypt(data, key, iv []byte) []byte {
	block, _ := aes.NewCipher(key)
	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(data, data)
	return data
}
