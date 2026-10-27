const STORAGE_KEY = "shoeShopVerifiedPurchasesV2";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const normalizeName = (name) =>
  String(name || "")
    .trim()
    .toLowerCase();

function readStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    return;
  }
}

function groupItems(selectedItems) {
  const items = new Map();

  for (const item of selectedItems) {
    const productId = Number(item.id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      continue;
    }

    if (items.has(productId)) {
      items.get(productId).quantity += quantity;
    } else {
      items.set(productId, {
        productId,
        name: String(item.name || `Sản phẩm #${productId}`),
        image: String(item.image || ""),
        price: Number(item.price) || 0,
        quantity,
      });
    }
  }

  return [...items.values()];
}

function hasSameProducts(purchasedItems, serverItems) {
  if (!Array.isArray(serverItems)) {
    return false;
  }

  const unmatched = [...purchasedItems];

  for (const item of serverItems) {
    const name = normalizeName(item.name);
    const id = Number(item.productId ?? item.id);

    const index = unmatched.findIndex((saved) => {
      if (name) {
        return name === normalizeName(saved.name);
      }

      return Number.isInteger(id) && id === saved.productId;
    });

    if (index < 0) {
      return false;
    }

    unmatched.splice(index, 1);
  }

  return unmatched.length === 0;
}

export function rememberPurchase(email, selectedItems, previousOrderIds = []) {
  const key = normalizeEmail(email);
  const items = groupItems(selectedItems);

  if (!key || items.length === 0) {
    return;
  }

  const db = readStorage();

  const account = db[key] || {
    confirmed: {},
    pending: [],
  };

  account.confirmed ||= {};
  account.pending ||= [];

  account.pending.push({
    items,
    knownIds: previousOrderIds.map(String),
    createdAt: Date.now(),
  });

  db[key] = account;

  writeStorage(db);
}

export function reconcilePurchases(email, ordersHistory) {
  const key = normalizeEmail(email);
  const db = readStorage();
  const account = db[key];

  if (!account || !Array.isArray(ordersHistory)) {
    return;
  }

  account.confirmed ||= {};
  account.pending ||= [];

  const takenIds = new Set(Object.keys(account.confirmed));

  const stillPending = [];

  for (const pending of account.pending) {
    if (Date.now() - pending.createdAt > 24 * 60 * 60 * 1000) {
      continue;
    }

    const matches = ordersHistory.filter((order) => {
      const id = String(order.id);

      return (
        !pending.knownIds.includes(id) &&
        !takenIds.has(id) &&
        hasSameProducts(pending.items, order.orderDetail)
      );
    });

    if (matches.length === 1) {
      const id = String(matches[0].id);

      account.confirmed[id] = {
        items: pending.items,
        createdAt: pending.createdAt,
      };

      takenIds.add(id);
    } else {
      stillPending.push(pending);
    }
  }

  account.pending = stillPending;

  writeStorage(db);
}

export function readOrderReceipt(email, orderId) {
  const account = readStorage()[normalizeEmail(email)];

  return account?.confirmed?.[String(orderId)] || null;
}

export function forgetOrderReceipt(email, orderId) {
  const key = normalizeEmail(email);
  const db = readStorage();

  if (db[key]?.confirmed) {
    delete db[key].confirmed[String(orderId)];
    writeStorage(db);
  }
}
