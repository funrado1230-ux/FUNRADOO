export type StoredOtp = {
    otpHash: string;
    expiresAt: number;
    attempts: number;
};

export const otpStore = new Map<string, StoredOtp>();