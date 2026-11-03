import React, { createContext, useContext, useState, useEffect } from 'react';

const LoyaltyContext = createContext();

const STORAGE_KEYS = {
  BALANCE: 'tiem_gau_loyalty_balance_v1',
  TRANSACTIONS: 'tiem_gau_loyalty_transactions_v1',
  STREAK: 'tiem_gau_loyalty_streak_v1',
  CHECKED_IN: 'tiem_gau_loyalty_checked_in_v1',
  CLAW_PLAYS: 'tiem_gau_loyalty_claw_plays_v1',
  VOUCHERS: 'tiem_gau_loyalty_vouchers_v1'
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'used',
    title: 'Trừ trực tiếp đơn hàng #HD-AUTUMN-8820',
    tag: 'Bé Gấu Chai Na Ca-Rô',
    date: '11:20 - 24/10/2026',
    subText: 'Đã áp dụng thành công',
    amount: -35000,
    balanceAfter: 48500
  },
  {
    id: 'tx-2',
    type: 'received',
    title: 'Hoàn 5% đơn hàng #HD-AUTUMN-8790',
    tag: 'Tích luỹ mua sắm',
    date: '09:15 - 22/10/2026',
    subText: 'Giao thành công',
    amount: 17000,
    balanceAfter: 83500
  },
  {
    id: 'tx-3',
    type: 'received',
    title: 'Đánh giá 5 sao kèm ảnh chụp bé Gấu Pumpkin',
    tag: 'Duyệt ảnh tự động',
    date: '12:50 - 20/10/2026',
    subText: 'Duyệt ảnh tự động',
    amount: 3000,
    balanceAfter: 66500
  },
  {
    id: 'tx-4',
    type: 'received',
    title: 'Điểm danh ấm áp ngày thứ 5',
    tag: 'Chuỗi 5/7 ngày',
    date: '08:00 - Hôm nay',
    subText: 'Hệ thống tự ghi nhận',
    amount: 200,
    balanceAfter: 63500
  },
  {
    id: 'tx-5',
    type: 'received',
    title: 'Gắp trúng Bé Gấu Mùa Thu may mắn',
    tag: 'Mini game Mùa Thu',
    date: '15:30 - 18/10/2026',
    subText: 'Thưởng trò chơi may mắn',
    amount: 2000,
    balanceAfter: 63300
  },
  {
    id: 'tx-6',
    type: 'used',
    title: 'Đổi Voucher Giảm Giá 20.000đ Giỏ Hàng',
    tag: 'Voucher Quà Tặng',
    date: '10:15 - 12/10/2026',
    subText: 'Mã áp dụng: VOUCHER-20K-GAU',
    amount: -20000,
    balanceAfter: 61300
  },
  {
    id: 'tx-7',
    type: 'received',
    title: 'Hoàn 5% đơn hàng #HD-AUTUMN-8120',
    tag: 'Tích luỹ mua sắm',
    date: '14:20 - 05/10/2026',
    subText: 'Giao thành công',
    amount: 25000,
    balanceAfter: 81300
  }
];

export function LoyaltyProvider({ children }) {
  // Balance: default matches mockup (48.500 Xu Gấu)
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return saved !== null ? parseInt(saved, 10) : 48500;
    } catch {
      return 48500;
    }
  });

  // Transactions list
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Daily Streak (e.g. Day 5/7)
  const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved !== null ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  // Checked in today flag
  const [hasCheckedInToday, setHasCheckedInToday] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CHECKED_IN) === 'true';
    } catch {
      return false;
    }
  });

  // Claw plays left today
  const [clawPlaysLeft, setClawPlaysLeft] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAW_PLAYS);
      return saved !== null ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // User redeemed vouchers
  const [myVouchers, setMyVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
    } catch (e) {
      console.error(e);
    }
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, streakDays.toString());
      localStorage.setItem(STORAGE_KEYS.CHECKED_IN, hasCheckedInToday.toString());
      localStorage.setItem(STORAGE_KEYS.CLAW_PLAYS, clawPlaysLeft.toString());
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(myVouchers));
    } catch (e) {
      console.error(e);
    }
  }, [streakDays, hasCheckedInToday, clawPlaysLeft, myVouchers]);

  // Method to check in daily
  const checkInDaily = () => {
    if (hasCheckedInToday) return { success: false, message: 'Bạn đã điểm danh hôm nay rồi nhé!' };
    
    const reward = 200;
    const newStreak = streakDays >= 7 ? 1 : streakDays + 1;
    const bonus = newStreak === 7 ? 1500 : 0;
    const totalAward = reward + bonus;
    const newBalance = balance + totalAward;

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'received',
      title: `Điểm danh ấm áp ngày thứ ${newStreak}${bonus > 0 ? ' (Thưởng mốc 7 ngày!)' : ''}`,
      tag: `Chuỗi ${newStreak}/7 ngày`,
      date: 'Vừa xong - Hôm nay',
      subText: 'Hệ thống tự ghi nhận',
      amount: totalAward,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setStreakDays(newStreak);
    setHasCheckedInToday(true);
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      reward: totalAward,
      streak: newStreak,
      message: bonus > 0 
        ? `Tuyệt vời! Bạn hoàn thành chuỗi 7 ngày và nhận được +${totalAward.toLocaleString('vi-VN')} Xu!`
        : `Điểm danh thành công! Bạn nhận được +${reward} Xu Gấu ấm áp!`
    };
  };

  // Method to play Claw Machine
  const playClawMachine = () => {
    if (clawPlaysLeft <= 0) {
      return { success: false, message: 'Hôm nay bạn đã hết lượt gắp gấu rồi, mai quay lại nhé!' };
    }

    const possibleRewards = [500, 1000, 1500, 2000, 3000, 5000];
    const wonAmount = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
    const newBalance = balance + wonAmount;

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'received',
      title: 'Gắp gấu Mùa Thu trúng thưởng',
      tag: 'Trò chơi vui nhộn',
      date: 'Vừa xong - Hôm nay',
      subText: '100% trúng thưởng ngẫu nhiên',
      amount: wonAmount,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setClawPlaysLeft(prev => Math.max(0, prev - 1));
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      amount: wonAmount,
      message: `Chúc mừng bạn! Càng gắp đã gắp trúng bé gấu mang theo +${wonAmount.toLocaleString('vi-VN')} Xu!`
    };
  };

  // Method to submit a review with photo
  const submitReviewReward = (productName = 'Bé Gấu Chai Na Ca-Rô') => {
    const reward = 3000;
    const newBalance = balance + reward;

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'received',
      title: `Đánh giá 5 sao kèm ảnh chụp ${productName}`,
      tag: 'Chia sẻ cảm nhận',
      date: 'Vừa xong - Hôm nay',
      subText: 'Duyệt ảnh tự động',
      amount: reward,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      reward,
      message: `Đánh giá kèm ảnh của bạn đã được duyệt! Bạn nhận ngay +${reward.toLocaleString('vi-VN')} Xu!`
    };
  };

  // Method to redeem voucher with coins
  const redeemVoucher = (voucher) => {
    if (balance < voucher.coinCost) {
      return {
        success: false,
        message: `Số dư xu không đủ! Bạn cần ${voucher.coinCost.toLocaleString('vi-VN')} Xu để đổi voucher này.`
      };
    }

    const newBalance = balance - voucher.coinCost;
    const code = `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newVoucherItem = {
      ...voucher,
      code,
      redeemedAt: new Date().toLocaleDateString('vi-VN')
    };

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'used',
      title: `Đổi voucher: ${voucher.name}`,
      tag: 'Voucher quà tặng',
      date: 'Vừa xong - Hôm nay',
      subText: `Mã code: ${code}`,
      amount: -voucher.coinCost,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setMyVouchers(prev => [newVoucherItem, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      code,
      voucher: newVoucherItem,
      message: `Đổi voucher thành công! Mã ưu đãi của bạn: ${code}`
    };
  };

  // Method to spend coins in order checkout
  const applyCoinsToOrder = (coinsToUse, orderCode = 'HD-ORDER') => {
    if (coinsToUse <= 0) return true;
    if (coinsToUse > balance) return false;

    const newBalance = balance - coinsToUse;
    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'used',
      title: `Trừ trực tiếp đơn hàng #${orderCode}`,
      tag: 'Áp dụng giảm tiền',
      date: 'Vừa xong',
      subText: 'Đã áp dụng thành công',
      amount: -coinsToUse,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Method to earn 5% coins from completed order
  const awardOrderCoins = (orderTotal, orderCode = 'HD-ORDER') => {
    const earned = Math.round(orderTotal * 0.05);
    if (earned <= 0) return;

    const newBalance = balance + earned;
    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'received',
      title: `Hoàn 5% đơn hàng #${orderCode}`,
      tag: 'Tích luỹ mua sắm',
      date: 'Vừa xong',
      subText: 'Giao dịch thành công',
      amount: earned,
      balanceAfter: newBalance
    };

    setBalance(newBalance);
    setTransactions(prev => [newTx, ...prev]);
    return earned;
  };

  return (
    <LoyaltyContext.Provider
      value={{
        balance,
        transactions,
        streakDays,
        hasCheckedInToday,
        clawPlaysLeft,
        myVouchers,
        checkInDaily,
        playClawMachine,
        submitReviewReward,
        redeemVoucher,
        applyCoinsToOrder,
        awardOrderCoins
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
}
