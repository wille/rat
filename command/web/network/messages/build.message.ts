/// <reference path="outgoingMessage.ts" />

namespace Web.Network.Messages {

    export interface Win32Manifest {
        version: string;
        icon: Base64Image;
    }

    export interface BuildMessageParameters {
        host: string;
        os: string;
        arch: string;
        delay: number;
        name: string;
        installPath: number;
        invalidCertificates: boolean;

        manifest?: Win32Manifest;
    }

    export class BuildMessage extends OutgoingMessage<BuildMessageParameters> {

        constructor(params: BuildMessageParameters) {
            super(Web.Network.Header.Build, params);
        }
    }
}
