export const FSM_STATES = ['IDLE', 'EVALUATING', 'BLOCKED', 'PERMITTED', 'FERMATA_LOCK', 'CODA'];

export function nextStateFromRisk(risk, operatorLoad) {
  if (risk > 75 || operatorLoad > 90) return 'BLOCKED';
  if (risk < 10) return 'FERMATA_LOCK';
  if (risk < 25 && operatorLoad < 60) return 'PERMITTED';
  return 'EVALUATING';
}
