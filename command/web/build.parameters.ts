type Base64Image = string;

interface Win32Manifest {
    version: string;
    icon: Base64Image;
}

interface BuildParameters {
    host: string;
    os: string;
    arch: string;
    delay: number;
    name: string;
    installPath: number;
    invalidCertificates: boolean;

    manifest?: Win32Manifest;
}