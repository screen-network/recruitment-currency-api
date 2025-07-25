import path from 'path';
import '@spinajs/log';
import { fsService } from '@spinajs/fs';
import { Controllers, HttpServer } from '@spinajs/http';
import { Bootstrapper, DI } from '@spinajs/di';
import { Configuration } from '@spinajs/configuration';

async function bootstrap() {
  DI.setESMModuleSupport();
  const bootstrappers = DI.resolve(Array.ofType(Bootstrapper));

  for (const b of bootstrappers) {
    await b.bootstrap();
  }

  await DI.resolve(Configuration, [
    {
      cfgCustomPaths: [path.join(process.cwd(), 'lib', 'config')],
    },
  ]);

  await DI.resolve(fsService);
  await DI.resolve(Controllers);

  const server = await DI.resolve(HttpServer);
  server.start();
}

bootstrap();
