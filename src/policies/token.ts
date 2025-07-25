import { BasePolicy, IController, IRoute, Request } from '@spinajs/http';
import { Forbidden } from '@spinajs/exceptions';
import { Log, Logger } from '@spinajs/log-common';

export class token extends BasePolicy {
  @Logger('Security')
  protected Log: Log;
  protected HEADER_TOKEN_FIELD = 'x-currency-token';

  public isEnabled(_action: IRoute, _instance: IController): boolean {
    return true;
  }

  public async execute(req: Request): Promise<void> {
    // if (this.isDev) {
    //   return;
    // }

    const token = (req as any).headers[this.HEADER_TOKEN_FIELD];
    if (!token) {
      this.Log.warn(`No token is set for restricted area, header field: ${this.HEADER_TOKEN_FIELD}, policy: legacy/v2/token, ip: ${req.storage.realIp}`);
      throw new Forbidden('access token is not set');
    }

    if (token !== 'dasdiubasiob1=231231238913y4-n432r2nby83rt29') {
      this.Log.warn(`Invalid access token received, token: ${token}, header field: ${this.HEADER_TOKEN_FIELD}, policy: legacy/v2/token, ip: ${req.storage.realIp}`);
      throw new Forbidden('invalid access token');
    }
  }
}
