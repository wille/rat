/// <reference path="message.ts" />
/// <reference path="../build.parameters.ts" />

class BuildMessage extends Message {

    constructor(private params: BuildParameters) {
        super(Control.EventType.BUILD);
    }

    public build(): {} {
        return this.params;
    }
}