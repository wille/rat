import * as React from 'react';

export default abstract class TabbedView {

  public readonly id = Math.random();

  constructor(public title: string) {

  }

  public abstract render(): React.ReactNode;
}
