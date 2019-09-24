// @flow
import React from 'react';

import { SubscriptionScreen } from './SubscriptionScreen';
import { wrapWithSubscriptionScreenState } from './subscriptionScreenState';

import type { ComponentType } from 'react';

export const requireSubscription: <
  PassThroughProps: Object,
  C: ComponentType<PassThroughProps>
>(
  C
) => ComponentType<PassThroughProps> = WrappedComponent =>
  // $FlowFixMe
  wrapWithSubscriptionScreenState(props => (
    <>
      <WrappedComponent {...props} />
      <SubscriptionScreen isVisible={!props.isSubscribed} {...props} />
    </>
  ));