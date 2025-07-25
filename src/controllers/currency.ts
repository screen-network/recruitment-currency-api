import { BaseController, BasePath, Policy, Get, Post, Ok, ServerError, NotFound, Body, BadRequestResponse } from '@spinajs/http';
import { Log, Logger } from '@spinajs/log';
import { token } from '../policies/token.js';
import { faker } from '@faker-js/faker';
import { Schema } from '@spinajs/validation';

function timeout() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}

@Schema({
  type: 'object',
  properties: {
    order: { type: 'string', enum: ['ASC', 'DESC'] },
    amount: { type: 'number', minimum: 1, maximum: 1000 },
  },
  required: ['amount'],
})
class PaymentDto {
  amount: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

@Schema({
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['buy', 'sell'] },
    currency: { type: 'string', maxLength: 32 },
    amount: { type: 'number', minimum: 1, maximum: 1000 },
    transactionId: { type: 'number', minimum: 1, maximum: 999999 },
  },
  required: ['type', 'currency', 'amount', 'transactionId'],
})
class TransactionDto {
  transationId: number;
  currency: string;
  type: string;
  amount: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

@BasePath('/')
@Policy(token)
export class CurrencyAPI extends BaseController {
  @Logger('spot')
  protected Log: Log;

  @Get('currencies')
  public async getCurrencies() {
    const makeResponse = () => {
      return Array.from({
        length: faker.number.int({
          min: 2,
          max: 10,
        }),
      }).map(() => {
        return {
          currency: `${faker.finance.currencyCode()}/PLN`,
          buy: faker.finance.amount({
            min: 1,
            max: 10,
          }),
          sell: faker.finance.amount({
            min: 1,
            max: 10,
          }),
        };
      });
    };

    const responses = [makeResponse(), makeResponse(), makeResponse(), makeResponse(), 500, 'TIMEOUT'];

    const rIndex = faker.number.int({
      min: 0,
      max: responses.length - 1,
    });

    const response = responses[rIndex];

    this.Log.info(`RESPONSE ${response}`);

    if (Array.isArray(response)) {
      return new Ok(response);
    }
    if (response === 500) {
      return new ServerError('Server error');
    }
    if (response === 'TIMEOUT') {
      await timeout();
      return new ServerError('TIMEOUT');
    }
  }

  @Post('pay')
  public async pay(@Body() payment: PaymentDto) {
    this.Log.info(`PAYMENT ${payment.amount}`);
    const responses = [
      {
        transactionId: faker.number.int({
          min: 1,
          max: 1000,
        }),
      },
      {
        transactionId: faker.number.int({
          min: 1,
          max: 1000,
        }),
      },
      {
        transactionId: faker.number.int({
          min: 1,
          max: 1000,
        }),
      },
      402,
      500,
      'TIMEOUT',
    ];

    const rIndex = faker.number.int({
      min: 0,
      max: responses.length - 1,
    });

    const response = responses[rIndex];

    this.Log.info(`RESPONSE ${response}`);
    if ((response as any).transactionId) {
      return new Ok(response as any);
    }
    if (response === 402) {
      return new BadRequestResponse('Payment failed');
    }
    if (response === 500) {
      return new ServerError('Server error');
    }
    if (response === 'TIMEOUT') {
      await timeout();
      return new ServerError('TIMEOUT');
    }
  }

  @Post('transaction')
  public async transaction(@Body() data: TransactionDto) {
    const responses = [200,200,200,200, 400, 500, 'TIMEOUT'];

    this.Log.info(`TRANSACTION ${JSON.stringify(data)}`);

    const rIndex = faker.number.int({
      min: 0,
      max: responses.length - 1,
    });

    const response = responses[rIndex];

    this.Log.info(`RESPONSE ${response}`);
    if (response === 200) {
      return new Ok();
    }
    if (response === 400) {
      return new NotFound('Transaction not found');
    }
    if (response === 500) {
      return new ServerError('Server error');
    }
    if (response === 'TIMEOUT') {
      await timeout();
      return new ServerError('TIMEOUT');
    }
  }
}
