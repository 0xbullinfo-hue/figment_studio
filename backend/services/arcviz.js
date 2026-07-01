import { config } from '../config.js';

const usageByUserId = new Map();

function getUsageRecord(userId) {
  const current = usageByUserId.get(userId);
  if (current) {
    return current;
  }

  const initial = { used: 0 };
  usageByUserId.set(userId, initial);
  return initial;
}

export function getArcvizQuota(plan, userId) {
  if (plan === 'pro') {
    return {
      plan,
      trialLimit: config.arcviz.trialRenderLimit,
      trialUsed: 0,
      trialRemaining: Infinity,
      allowed: true,
    };
  }

  const usage = getUsageRecord(userId);
  const trialLimit = config.arcviz.trialRenderLimit;
  const trialUsed = usage.used;
  const trialRemaining = Math.max(0, trialLimit - trialUsed);

  return {
    plan,
    trialLimit,
    trialUsed,
    trialRemaining,
    allowed: trialRemaining > 0,
  };
}

export function consumeArcvizRender(userId) {
  const usage = getUsageRecord(userId);
  usage.used += 1;
  return usage.used;
}

export function resetArcvizUsage(userId) {
  usageByUserId.delete(userId);
}