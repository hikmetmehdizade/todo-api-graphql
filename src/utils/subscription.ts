import { SubscriptionAction, SubscriptionPayloadType } from 'src/types';
import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export class GenerateSubscriptionPayload implements SubscriptionPayloadType {
  action: SubscriptionAction;
  payload: any;
  constructor(
    payload: SubscriptionPayloadType['payload'],
    action: SubscriptionPayloadType['action'],
  ) {
    this.action = action;
    this.payload = payload;
  }
}

import { registerEnumType } from '@nestjs/graphql';

registerEnumType(SubscriptionAction, {
  name: 'SubscriptionAction',
  description: undefined,
});

export function SubscriptionPayload<T>(
  classRef: Type<T>,
): Type<SubscriptionPayloadType<T>> {
  @ObjectType(`${classRef.name}Sub`)
  abstract class Payload implements SubscriptionPayloadType<T> {
    @Field(() => classRef)
    payload: T;

    @Field(() => SubscriptionAction)
    action: SubscriptionAction;
  }

  return Payload as Type<SubscriptionPayloadType<T>>;
}
