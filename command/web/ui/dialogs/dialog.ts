/// <reference path="../views/view.ts" />

namespace Web.UI.Dialogs {

    import AbstractView = Views.AbstractView;

    export abstract class Dialog extends AbstractView {

        public readonly dialogButtons: DialogButton[];

        constructor(url: string, title: string, ...dialogButtons: DialogButton[]) {
            super(url, title);

            this.dialogButtons = dialogButtons;
        }

        public abstract onEnter();
        public abstract onLeave();
    }

    export interface DialogButton {
        // Text of the button
        readonly text: string;

        // If dialog should close on click
        readonly close?: boolean;

        // Called when the button is clicked
        onClick: (parent: Dialog) => void;
    }

    export class CancelButton implements DialogButton {

        readonly text = "Cancel";
        readonly close = true;

        public onClick() {
            // Will close on click
        }
    }

    export function showDialog(dialog: Dialog) {
        let element = document.createElement("div");
        element.id = "dialog";

        $(element).load(dialog.template);

        let buttons = {};
        for (let button of dialog.dialogButtons) {
            buttons[button.text] = () => {
                button.onClick(dialog);

                if (button.close) {
                    dialog.onLeave();
                    $(element).dialog("close");
                }
            };
        }

        $(element).dialog({
            title: dialog.title,
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: buttons
        });

        dialog.onEnter();
    }
}