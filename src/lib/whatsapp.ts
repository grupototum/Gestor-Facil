export const waLink = (phone: string, message?: string) => {
  const clean = phone.replace(/\D/g, "");
  const m = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${m}`;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
