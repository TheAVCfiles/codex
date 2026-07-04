import {
  canAccess,
  type AccessFeature,
  type AuthorityState,
} from "./authority";

type Throttle = {
  execute: (action: () => void | Promise<void>) => void | Promise<void>;
};

export async function executeAction(
  feature: AccessFeature,
  action: () => void | Promise<void>,
  state: AuthorityState,
  throttle: Throttle,
  onBlocked?: () => void,
) {
  if (!canAccess(feature, state)) {
    onBlocked?.();
    return false;
  }

  await throttle.execute(action);
  return true;
}
