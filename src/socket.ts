import { MiddlewareError } from "./errors";
import { HandlerFunction } from "./options";

export interface Action {
  name: string;
  handler: HandlerFunction;
}

export const defaultActions = {
  CONNECT: "$connect",
  DISCONNECT: "$disconnect",
  DEFAULT: "$default",
};

export const isDefaultAction = (name: string): boolean =>
  name !== defaultActions.CONNECT && name !== defaultActions.DISCONNECT;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const instanceOfAction = (middleware: any): middleware is Action =>
  "name" in middleware;

export class ApiSocket {
  private _actions: Action[] = [];
  private _middlewares: HandlerFunction[] = [];

  use(handler: HandlerFunction): ApiSocket {
    /* istanbul ignore else */
    if (typeof handler !== "function") throw new MiddlewareError();

    this._middlewares.push(handler);

    return this;
  }

  connect(handler: HandlerFunction): ApiSocket {
    this.addAction(defaultActions.CONNECT, handler);

    return this;
  }

  disconnect(handler: HandlerFunction): ApiSocket {
    this.addAction(defaultActions.DISCONNECT, handler);

    return this;
  }

  action(name: string, handler: HandlerFunction): ApiSocket {
    this.addAction(name, handler);

    return this;
  }

  actions(): Action[] {
    return this._actions;
  }

  middlewares(): HandlerFunction[] {
    return this._middlewares;
  }

  private addAction(name: string, handler: HandlerFunction): void {
    this._actions.push({ name, handler });
  }
}
