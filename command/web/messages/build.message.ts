/// <reference path="message.ts" />

type Base64Image = string;

interface Win32Manifest {
    version: string;
    icon: Base64Image;
}

interface BuildMessageParameters {
    host: string;
    os: string;
    arch: string;
    delay: number;
    name: string;
    installPath: number;
    invalidCertificates: boolean;

    manifest?: Win32Manifest;
}

class BuildMessage extends Message<BuildMessageParameters> {

    constructor(params: BuildMessageParameters) {
        super(Control.EventType.BUILD, params);
    }
}