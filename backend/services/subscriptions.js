const subscriptionsByUserId = new Map();
const subscriptionsByEmail = new Map();
const paymentIntentsByReference = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function buildSubscriptionRecord({ userId, email, plan, status, provider, reference, amount, currency, project, source }) {
  const now = new Date().toISOString();
  return {
    userId: userId || '',
    email: normalizeEmail(email),
    plan,
    status,
    provider: provider || null,
    reference: reference || null,
    amount: typeof amount === 'number' ? amount : null,
    currency: currency || null,
    project: project || null,
    source: source || null,
    activatedAt: now,
    updatedAt: now,
  };
}

function storeSubscription(subscription) {
  if (subscription.userId) {
    subscriptionsByUserId.set(subscription.userId, subscription);
  }
  if (subscription.email) {
    subscriptionsByEmail.set(subscription.email, subscription);
  }
  return subscription;
}

export function resolveSubscriptionIdentity(userOrPayload = {}) {
  const userId = String(userOrPayload.id || userOrPayload.sub || '').trim();
  const email = normalizeEmail(userOrPayload.email);
  return { userId, email };
}

export function getSubscriptionForIdentity(userOrPayload = {}) {
  const { userId, email } = resolveSubscriptionIdentity(userOrPayload);
  return subscriptionsByUserId.get(userId) || subscriptionsByEmail.get(email) || null;
}

export function resolveEffectivePlan(userOrPayload = {}) {
  return getSubscriptionForIdentity(userOrPayload)?.plan || userOrPayload.plan || 'trial';
}

export function getSubscriptionSnapshot(userOrPayload = {}) {
  const subscription = getSubscriptionForIdentity(userOrPayload);
  if (!subscription) {
    return {
      plan: resolveEffectivePlan(userOrPayload),
      status: 'none',
      provider: null,
      reference: null,
      updatedAt: null,
    };
  }

  return {
    plan: subscription.plan,
    status: subscription.status,
    provider: subscription.provider,
    reference: subscription.reference,
    updatedAt: subscription.updatedAt,
  };
}

export function createPaymentIntent({ reference, userId, email, provider, amount, currency, project }) {
  const normalizedReference = String(reference || '').trim();
  if (!normalizedReference) {
    throw new Error('Payment reference is required');
  }

  const intent = {
    reference: normalizedReference,
    userId: String(userId || '').trim(),
    email: normalizeEmail(email),
    provider: String(provider || 'paystack').toLowerCase(),
    amount: typeof amount === 'number' ? amount : Number(amount || 0),
    currency: String(currency || 'USD').toUpperCase(),
    project: project || 'Architectural Project',
    status: 'pending',
    plan: 'pro',
    createdAt: new Date().toISOString(),
    completedAt: null,
    metadata: {},
  };

  paymentIntentsByReference.set(normalizedReference, intent);
  return intent;
}

export function getPaymentIntent(reference) {
  return paymentIntentsByReference.get(String(reference || '').trim()) || null;
}

export function markPaymentCompleted(reference, details = {}) {
  const normalizedReference = String(reference || '').trim();
  if (!normalizedReference) {
    throw new Error('Payment reference is required');
  }

  const intent = paymentIntentsByReference.get(normalizedReference) || createPaymentIntent({ reference: normalizedReference });
  intent.status = 'paid';
  intent.completedAt = new Date().toISOString();
  intent.metadata = {
    ...intent.metadata,
    ...details,
  };

  const subscription = storeSubscription(buildSubscriptionRecord({
    userId: intent.userId || details.userId,
    email: intent.email || details.email,
    plan: 'pro',
    status: 'active',
    provider: details.provider || intent.provider,
    reference: normalizedReference,
    amount: intent.amount,
    currency: intent.currency,
    project: intent.project,
    source: details.source || 'payment',
  }));

  return { intent, subscription };
}

export function clearSubscriptionForIdentity(userOrPayload = {}) {
  const { userId, email } = resolveSubscriptionIdentity(userOrPayload);
  if (userId) {
    subscriptionsByUserId.delete(userId);
  }
  if (email) {
    subscriptionsByEmail.delete(email);
  }
}

export function listPaymentIntents() {
  return Array.from(paymentIntentsByReference.values());
}